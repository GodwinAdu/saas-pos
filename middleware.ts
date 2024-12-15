
import { NextResponse,NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);

const publicRoutes = ['/sign-in', '/sign-up', '/']; // Add other public routes here
const accessOnlyPos = ['/pos']; // Specific routes with limited access

// Function to verify JWT and extract payload
async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}

export async function middleware(request: NextRequest) {

    const { pathname} = request.nextUrl;
    const path = pathname.split('/')
    
   
    const token = request.cookies.get('token')?.value;
    const currentBranchId = path[3] ; // Get branchId from URL
    const cookieBranchId = request.cookies.get('branchId')?.value; // Get branchId from cookies

    // Sync branchId from URL to cookies if different
    if (currentBranchId && currentBranchId !== cookieBranchId) {
        const response = NextResponse.next();
        response.cookies.set('branchId', currentBranchId, {
            path: '/',
            secure: process.env.NODE_ENV === 'production', // Secure only in production
            sameSite: 'strict',
        });
        return response;
    }

    // Allow public routes without token
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Redirect to sign-in if no token
    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const payload = await verifyToken(token);

    // Redirect to sign-in if token is invalid or expired
    if (!payload || payload.exp! < Math.floor(Date.now() / 1000)) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Role-based authorization for specific routes
    const userRole = payload.role;
    if (accessOnlyPos.includes(pathname) && userRole !== 'posUser') {
        return NextResponse.redirect(new URL('/not-authorized', request.url)); // Create a 403 page if necessary
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/:storeId/dashboard/:branchId/:path*'
    ],
};
