"use server"

import errorMap from "zod/locales/en.js";
import { currentUser } from "../helpers/current-user";
import Branch from "../models/branch.models";
import History from "../models/history.models";
import Store from "../models/store.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import { deleteDocument } from "./trash.actons";

export async function createBranch(values: any, storeId: string) {
    try {
        const user = await currentUser(); // Get the logged-in user
        await connectToDB(); // Ensure DB connection

        // Fetch store and the user creating the branch
        const [store, updateUser] = await Promise.all([
            Store.findById(storeId), // Fetch store data
            User.findById(user._id), // Fetch user data
        ]);


        if (!store) {
            throw new Error('Store not found');
        }

        if (store.branchIds.length >= store.numberOfBranches) {
            throw new Error('Store already has maximum number of branches');
        }

        // Fetch store owner
        const owner = await User.findById(store.createdBy);
        if (!owner) {
            throw new Error('Store owner not found');
        }

        // Create a new branch
        const newBranch = new Branch({
            storeId,
            name: values.name,
            createdBy: user._id,
            action_type: 'create',
        });

        store.branchIds.push(newBranch._id);

        // Update user and owner access locations
        const updates: Promise<any>[] = [];
        // Save the new branch
        updates.push(newBranch.save(), store.save());
        if (updateUser) {
            updateUser.accessLocation.push(newBranch._id);
            updates.push(updateUser.save());
        }

        // Only update owner if they are not the same as the current user
        if (updateUser?._id.toString() !== owner._id.toString()) {
            owner.accessLocation.push(newBranch._id);
            updates.push(owner.save());
        }



        await Promise.all(updates); // Save all updates concurrently

        // Log the action in History
        await History.create({
            storeId: storeId,
            actionType: 'BRANCH_CREATED',
            details: {
                branchId: newBranch._id,
                branchName: newBranch.name,
                createdBy: user._id,
            },
            message: `Branch "${newBranch.name}" was created successfully.`,
            performedBy: user._id, // The user creating the branch
            entityId: newBranch._id, // The created branch ID
            entityType: 'Branch', // The type of entity
        });

        // Return the new branch
        return JSON.parse(JSON.stringify(newBranch));
    } catch (error) {
        console.error('Error creating branch:', error);
        throw error;
    }
}

export async function fetchBranchById(id: string) {
    try {
        await connectToDB();

        const branch = await Branch.findById(id)

        if (!branch) {
            throw new Error("Branch not found")
        }
        return JSON.parse(JSON.stringify(branch))

    } catch (error) {
        console.log('Error fetching branch', error);
        throw error;
    }

}
export async function fetchBranchesForUser() {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error("User not found");
        }
        await connectToDB();

        // Fetch branches concurrently using Promise.all
        const branches = await Promise.all(
            user.accessLocation.map(async (location: string) => {
                const branch = await Branch.findById(location);

                if (!branch) {
                    console.warn(`Branch not found for location ID: ${location}`);
                    return null; // Return null for missing branches
                }

                return JSON.parse(JSON.stringify(branch));
            })
        );

        // Filter out any null values (missing branches)
        return branches.filter((branch) => branch !== null);

    } catch (error) {
        console.log('Error fetching branches for user in server', error);
        throw error;
    }
}


export async function fetchAllBranches() {
    try {
        const user = await currentUser();

        await connectToDB();

        const branches = await Branch.find({ storeId: user.storeId });

        if (branches.length === 0) {
            return []
        }

        return JSON.parse(JSON.stringify(branches))

    } catch (error) {
        console.log('Error fetching branches for user in server', error);
        throw error;
    }
}

export async function deleteBranch(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;

        const result = await deleteDocument({
            actionType: 'BRANCH_DELETED',
            documentId: id,
            collectionName: 'Branch',
            userId: user?._id,
            storeId,
            trashMessage: `Branch with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Branch with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Branch with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error("Error deleting branch:", error);
        throw new Error('Failed to delete the branch. Please try again.');
    }

}

export async function updateBranch(id: string, values: any) {
    try {
        const user = await currentUser();

        const updatedValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
            action_type: 'update',
        }

        await Branch.findByIdAndUpdate(id,
            { ...updatedValues },
            { new: true }
        );

        console.log('Updated Branch ')

    } catch (error) {
        console.log('Error updating branch ', error);
        throw error
    }
}


