"use server"

import { currentBranch } from "../helpers/current-branch";
import { currentUser } from "../helpers/current-user";
import History from "../models/history.models";
import Warrant from "../models/warrant.models";
import { connectToDB } from "../mongoose";
import { deleteDocument } from "./trash.actons";

interface CreateWarrantProps {
    name: string,
    warrant: string,
}
export async function createWarrant(values: CreateWarrantProps) {
    try {
        const { name, warrant } = values
        const user = await currentUser();
        const storeId = user.storeId;
        // Connect to MongoDB
        await connectToDB();

        // Create a new warrant document
        const newWarrant = new Warrant({
            name,
            warrant,
            storeId,
            createdBy: user._id,
            action_type: "create",
        });

        const newHistory = new History({
            storeId,
            actionType: `WARRANT_CREATED`, // Use a relevant action type
            details: {
                variationId: newWarrant._id,
                variationName: newWarrant.name,
                createdAt: new Date()
            },
            message: `A new variation named ${newWarrant.name} was created successfully`,
            performedBy: user._id, // User who performed the action
            entityId: newWarrant._id,  // The ID of the created variation
            entityType: 'Warrant', // The type of entity
        })

        // Save the new warrant to the database

        await Promise.all([
            newWarrant.save(),
            newHistory.save()
        ])

    } catch (error) {
        throw error;
    }

}


export async function fetchAllWarrants() {
    try {
        const user = await currentUser();

        const storeId = user.storeId as string;
        // Connect to MongoDB
        await connectToDB();

        // Fetch all warrants associated with the current store
        const warrants = await Warrant.find({ storeId }).populate('createdBy', 'fullName').exec();

        if (warrants.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(warrants));

    } catch (error) {
        console.error('Error fetching warrants:', error);
        throw error;
    }

}

export async function fetchWarrantById(warrantId: string) {
    try {
        // Connect to MongoDB
        await connectToDB();

        // Fetch all warrants associated with the current store
        const warrant = await Warrant.findById(warrantId).exec();

        if (!warrant) {
            throw new Error('Warrant not found');
        }

        return JSON.parse(JSON.stringify(warrant));

    } catch (error) {
        console.error('Error fetching warrant by ID:', error);
        throw error;
    }

}

export async function updateWarrant(warrantId: string) {
    try {
        const user = await currentUser();
        // Connect to MongoDB
        await connectToDB();

        // Fetch all warrants associated with the current store
        const warrant = await Warrant.findByIdAndUpdate(warrantId, { mod_flag: true, action_type: "update", modifiedBy: user._id }, { new: true }).exec();

        if (!warrant) {
            throw new Error('Warrant not found');
        }

        return JSON.parse(JSON.stringify(warrant));

    } catch (error) {
        console.error('Error updating warrant:', error);
        throw error;
    }

}

export async function deleteWarrant(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const result = await deleteDocument({
            actionType: "WARRANT_DELETED",
            documentId: id,
            collectionName: 'Warrant',
            userId: user?._id,
            storeId,
            trashMessage: `Warrant with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Warrant with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Warrant with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error("Error deleting warrant:", error);
        throw new Error('Failed to delete the warrant. Please try again.');
    }

}
