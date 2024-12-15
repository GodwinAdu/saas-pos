"use server"

import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import Unit from "../models/unit.models";
import { connectToDB } from "../mongoose";
import { deleteDocument } from "./trash.actons";
import { Model } from 'mongoose';
import { Select } from '@/components/ui/select';
import { Types } from "mongoose";
import mongoose from "mongoose";

interface CreateUnitProps {
    name: string;
    quantity: number;
    active: boolean;
    branchIds: string[];
}

export async function createUnit(values: CreateUnitProps) {
    try {
        const { name, quantity, active, branchIds } = values

        if (!name || !quantity || !active || !branchIds) {
            throw new Error("All fields are required");
        }

        const user = await currentUser();

        const userId = user._id as string;

        const storeId = user.storeId as string;

        await connectToDB();

        const newUnit = new Unit({
            storeId: new Types.ObjectId(storeId),
            branchIds,
            name,
            quantity,
            active,
            createdBy: new Types.ObjectId(userId),
            action_type: "create",
        });

        await newUnit.save();

    } catch (error) {
        console.log("Error creating unit", error);
        throw error;
    }
}



export async function fetchAllUnits() {
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        const units = await Unit.find({
            storeId,
            active: true, // Only fetch active units
        }).populate("createdBy", "fullName");


        if (units.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(units));

    } catch (error) {
        console.log("Error fetching all units", error);
        throw error;
    }
}

export async function fetchAllUnitsByBranchId() {
    try {
        const user = await currentUser();
        const storeId = user.storeId; // Ensure this is available and valid
        const branchId = await CurrentBranchId(); // Ensure this returns a valid branch ID

        if (!storeId || !branchId) {
            throw new Error("Store ID or Branch ID is missing.");
        }

        await connectToDB();

        const units = await Unit.find({
            storeId, // Convert storeId to ObjectId
            branchIds: { $in: [branchId] }, // Match branchId in the array
            active: true // Only fetch active units
        }).populate("createdBy", "fullName");

        console.log(units,'server')

        if (units.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(units));
    } catch (error) {
        console.error("Error fetching units by branchId:", error);
        throw error;
    }
}

export async function deleteUnit(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const result = await deleteDocument({
            actionType:'UNIT_DELETED',
            documentId: id,
            collectionName: 'Unit',
            userId: user?._id,
            storeId,
            trashMessage: `Unit with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Unit with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Unit with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error("Error deleting unit:", error);
        throw new Error('Failed to delete the unit. Please try again.');
    }
}
