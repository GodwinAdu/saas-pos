"use server"

import Branch from "../models/branch.models";
import { connectToDB } from "../mongoose";

export async function currentBranch(id: string) {
    try {
        await connectToDB();

        const branch = await Branch.findById(id)
        if (!branch) {
            throw new Error("Branch not found")
        }

        return JSON.parse(JSON.stringify(branch));

    } catch (error) {
        console.log('error getting current branch from server', error);
        throw error;
    }
}