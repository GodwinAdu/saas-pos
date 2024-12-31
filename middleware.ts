import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.TOKEN_SECRET_KEY);

if (!SECRET_KEY) {
    throw new Error("Missing environment variable: TOKEN_SECRET_KEY");
}

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

    const { pathname } = request.nextUrl;
    const pathSegments = pathname.split('/');

    const token = request.cookies.get('token')?.value;
    const currentBranchId = pathSegments[3];
    const cookieBranchId = request.cookies.get('branchId')?.value;

    if (currentBranchId && currentBranchId !== cookieBranchId) {
        const response = NextResponse.next();
        response.cookies.set('branchId', currentBranchId, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return response;
    }

    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (!token) {
        console.warn('No token found, redirecting to /sign-in');
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload || payload?.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.warn('Invalid or expired token, redirecting to /sign-in');
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userRole = payload.role;
    if (accessOnlyPos.includes(pathname) && userRole !== 'posUser') {
        console.warn('Unauthorized role, redirecting to /not-authorized');
        return NextResponse.redirect(new URL('/not-authorized', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/:storeId/dashboard/:branchId/:path*',
    ],
};
