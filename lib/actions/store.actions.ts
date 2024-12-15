"use server"

import { currentUser } from "../helpers/current-user"
import Store from "../models/store.models";
import { connectToDB } from "../mongoose";


export async function getStore() {
    try {
        const user = await currentUser();

        await connectToDB();

        const store = await Store.findById(user?.storeId);

        if (!store) {
            throw new Error("Store not found");
        }

        return JSON.parse(JSON.stringify(store));
    } catch (error) {
        console.log('Error fetching store', error);
        throw error;
    }
}

export async function fetchStoreById(storeId: string){
    try {
        await connectToDB();

        const store = await Store.findById(storeId);

        if (!store) {
            throw new Error("Store not found");
        }

        return JSON.parse(JSON.stringify(store));
        
    } catch (error) {
        console.log('Error fetching store', error);
        throw error;
    }
}

export async function updateStore(storeId: string, values:any) {
    try {
        const user = await currentUser();
        await connectToDB();

        const updatedValues ={
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
            action_type: 'update',
        }

        await Store.findByIdAndUpdate(
            storeId,
            { ...updatedValues},
            { new: true }
        );

        console.log('udated successfully' )
    } catch (error) {
        console.log('Error updating store trash preference', error);
        throw error;

    }
};



