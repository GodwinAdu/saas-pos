"use server"

import { cookies } from "next/headers";

export async function CurrentPosBranchId() {
    try {
        const cookieStore = await cookies()

        const branchId = cookieStore.get('posBranchId')?.value;

        if (!branchId) {
            throw new Error('No POS branch id found in cookies')
        }

        console.log(branchId, "pos branchId");

        return branchId;

    } catch (error) {
        throw error;
    }
}
