"use server"

import { currentUser } from "../helpers/current-user";
import Account from "../models/account.models";
import { connectToDB } from "../mongoose";
import { CurrentBranchId } from "../helpers/get-current-branch";

type AccountProps = {
    name: string;
    balance: number;
    branchIds: string[];
    description?: string;
    active: boolean;
}
export async function createAccount(values: AccountProps) {
    try {
        const { name, balance, branchIds, description, active } = values;
        // Connect to MongoDB
        const user = await currentUser();
        if (!user || !user.storeId) {
            throw new Error("User or store ID is not available.");
        }

        await connectToDB();
        // Create new account document
        const account = new Account({
            name,
            balance,
            branchIds,
            description,
            active,
            createdBy: user._id,
            storeId: user.storeId as string,
        });

        // Save the document to the database
        await account.save();

    } catch (error) {
        throw new Error(`Error creating account: ${error}`);
    }

}

export async function fetchAllAccounts() {
    try {
        const user = await currentUser();
        const storeId = user.storeId;
        const branchId = await CurrentBranchId()

        await connectToDB();

        // Fetch all accounts for the current store
        const accounts = await Account.find({ storeId, branchIds: { $in: [branchId] } }).populate('createdBy', 'fullName');

        if (accounts.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(accounts));
    } catch (error) {
        throw new Error(`Error fetching accounts: ${error}`);
    }
}