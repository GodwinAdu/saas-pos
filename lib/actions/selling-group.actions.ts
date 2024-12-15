"use server"

import { currentUser } from "../helpers/current-user";
import { connectToDB } from "../mongoose";
import SellingGroup from '../models/selling-group.models';
import History from "../models/history.models";
import { deleteDocument } from "./trash.actons";

interface SellingGroupProps {
    name: string;
    active: boolean;
}
export async function createSellingGroup(values: SellingGroupProps) {
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        const { name, active } = values;
        await connectToDB();

        const existingSellingGroup = await SellingGroup.findOne({
            name,
            storeId,
        });

        if (existingSellingGroup) {
            throw new Error("Selling group with the same name already exists");
        }


        const sellingGroup = new SellingGroup({
            storeId,
            name,
            active,
            createdBy: user._id,
            action_type: "create",
        });

        const newHistory = new History({
            storeId,
            actionType: `SELLING_GROUP_CREATED`,
            details: {
                sellingGroupId: sellingGroup._id,
                sellingGroupName: sellingGroup.name,
                createdAt: new Date()
            },
            message: `A new selling group named ${sellingGroup.name} was created successfully`,
            performedBy: user._id,
            entityId: sellingGroup._id,
            entityType: 'SellingGroup',
        });

        await Promise.all([
            sellingGroup.save(),
            newHistory.save(),
        ]);

    } catch (error) {
        console.error("Error creating selling group:", error);
        throw error;
    }
};


export async function fetchAllSellingGroups(){
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        const sellingGroups = await SellingGroup.find({
            storeId,
            active: true,
        }).populate('createdBy','fullName');

        
        if(sellingGroups.length === 0)  return [];

        return JSON.parse(JSON.stringify(sellingGroups));
        
    } catch (error) {
       console.log("Error fetching all selling groups:", error);
       throw error;
    }
}


export async function fetchSellingGroupById(id:string){
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        const sellingGroup = await SellingGroup.findById(id).populate({
            path:'createdBy',
            select: 'name'
        }).exec();

        if(!sellingGroup) throw new Error("Selling group not found");

        return JSON.parse(JSON.stringify(sellingGroup));
        
    } catch (error) {
       console.log("Error fetching selling group by id:", error);
       throw error;
    }
};


export async function updateSellingGroup(id:string, values:SellingGroupProps){
    try {
        const user = await currentUser();
       
        const newValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
            action_type: "update",
        }

        await connectToDB();

        const sellingGroup = await SellingGroup.findByIdAndUpdate(
            id,
            { $set: newValues },
            { new: true }
        ).exec();

        if(!sellingGroup) throw new Error("Selling group not found");

        return JSON.parse(JSON.stringify(sellingGroup));
        
    } catch (error) {
        console.log("Error updating selling group by id:", error);
        throw error;
    }
}


export async function deleteSellingGroup(id:string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const result = await deleteDocument({
            actionType:'SELLING_GROUP_DELETED',
            documentId: id,
            collectionName: 'SellingGroup',
            userId: user?._id,
            storeId,
            trashMessage: `Selling Group with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Selling Group with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Selling Group with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
        
    } catch (error) {
        console.log('error deleting selling group by id:', error);
        throw error;
    }
    
}