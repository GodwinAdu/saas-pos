'use server';

import { cookies } from 'next/headers';

export async function logoutUser() {
    try {
        const cookieStore = await cookies(); // No need for await

        // List of cookies to clear
        const cookieNames = ['branchId', 'posBranchId', 'token'];

        cookieNames.forEach((cookieName) => {
            cookieStore.set(cookieName, '', {
                path: '/',
                expires: new Date(0) // Expire immediately
            });
        });

        console.log('User logged out and all cookies cleared successfully');
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Failed to log out');
    }
}

