"use server"

import Store from "../models/store.models";
import { connectToDB } from "../mongoose";
import { currentUser } from "./current-user";


export async function currentStore() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }
        const storeId = user?.storeId

        await connectToDB();

        const store = await Store.findById(storeId);

        if (!store) {
            throw new Error('Store not found');
        };

        return JSON.parse(JSON.stringify(store));

    } catch (error) {
        console.log('Error fetching store:', error);
        throw error;
    }
}