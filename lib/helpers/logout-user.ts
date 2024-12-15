'use server';

import { cookies } from 'next/headers';

export async function logoutUser() {
    try {
        const cookieStore = await cookies();

        cookieStore.set('token', '', {
            path: '/',
            maxAge: -1, // Expire immediately to log out the user
        });

        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error during logout:', error);
        throw new Error('Failed to log out');
    }
}
