"use server"

import { currentUser } from "../helpers/current-user";
import History from "../models/history.models";
import Variation from "../models/variation.models";
import { connectToDB } from "../mongoose";
import { CurrentBranchId } from "../helpers/get-current-branch";
import { deleteDocument } from "./trash.actons";


interface CreateVariationProps {
    name: string;
    variations: string[];
    branchIds: string[];
}
export async function createVariation(values: CreateVariationProps) {
    try {
        const { name, variations, branchIds } = values

        // Retrieve the current user
        const user = await currentUser();
        if (!user || !user.storeId) {
            throw new Error("User or store ID is not available.");
        }

        const storeId = user.storeId

        // Connect to MongoDB
        await connectToDB();

        // Create a new variation document
        const newVariation = new Variation({
            storeId,
            name,
            variations,
            branchIds,
            createdBy: user._id,
            action_type: "create",
        });

        const newHistory = new History({
            storeId,
            actionType: `VARIATION_CREATED`, // Use a relevant action type
            details: {
                variationId: newVariation._id,
                variationName: newVariation.name,
                createdAt: new Date()
            },
            message: `A new variation named ${newVariation.name} was created successfully`,
            performedBy: user._id, // User who performed the action
            entityId: newVariation._id,  // The ID of the created variation
            entityType: 'Variation', // The type of entity
        })

        // Save the new variation to the database
        await Promise.all([
            newVariation.save(),
            newHistory.save(),
        ]);

    } catch (error) {
        console.error('Error creating variation:', error);
        throw error;
    }

};


export async function fetchAllVariations() {
    try {
        const user = await currentUser();
        const branchId = await CurrentBranchId()

        const storeId = user.storeId;

        await connectToDB();

        const variations = await Variation.find({ storeId, branchIds: { $in: branchId } }).populate('createdBy', 'fullName').exec();

        if (variations.length === 0) return [];

        return JSON.parse(JSON.stringify(variations));

    } catch (error) {
        console.error('Error fetching all variants:', error);
        throw error;
    }
};


export async function fetchAllVariationsByBranchId() {
    try {
        const user = await currentUser();
        const branchId = await CurrentBranchId()

        const storeId = user.storeId;

        await connectToDB();

        const variations = await Variation.find({
            storeId,
            branchIds: { $in: [branchId] },
        }).populate('createdBy', 'fullName').exec();

        if (variations.length === 0) return [];

        return JSON.parse(JSON.stringify(variations));

    } catch (error) {
        console.error('Error fetching all variants by branchId:', error);
        throw error;
    }
};


export async function fetchVariationById(variationId: string) {
    try {
        await connectToDB();

        const variation = await Variation.findById(variationId).populate('createdBy', 'fullName').exec();

        if (!variation) throw new Error('Variation not found');

        return JSON.parse(JSON.stringify(variation));

    } catch (error) {
        console.error('Error fetching variation by ID:', error);
        throw error;
    }
};


export async function updateVariation(id: string, values: CreateVariationProps) {
    try {


    } catch (error) {
        console.error('Error updating variation by ID:', error);
        throw error;
    }
}


export async function deleteVariation(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId;
        const result = await deleteDocument({
            actionType: 'VARIATION_DELETED',
            documentId: id,
            collectionName: 'Variation',
            userId: user?._id,
            storeId,
            trashMessage: `Variation with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Variation with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Variation with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error('Error deleting variation:', error);
        throw error;
    }
}