"use server"

import { cookies } from "next/headers";

export async function CurrentBranchId() {
    try {
        const cookieStore =  cookies()
        const branchId = await cookieStore.get('branchId')?.value;
        console.log(branchId,"branchId");

        return branchId;

    } catch (error) {
        console.error('Error fetching branch:', error);
        throw error;
    }
}
