"use server"

import { currentUser } from "../helpers/current-user";
import History from "../models/history.models";
import { connectToDB } from "../mongoose";


export async function fetchAllHistories(lastId: string | null, limit:number) {
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        // Explicitly type `query` to allow dynamic properties
        const query: { storeId: any; _id?: { $lt: string } } = { storeId };
        console.log("Query object before adding lastId:", query);

        if (lastId) {
            query._id = { $lt: lastId }; // Fetch only documents with `_id` less than `lastId`
        }

        const histories = await History.find(query)
            .populate("performedBy", "fullName")
            .sort({ _id: -1 }) // Sort by descending `_id`
            .limit(limit)
            .exec();

        return JSON.parse(JSON.stringify(histories));
    } catch (error) {
        console.error("Error fetching histories:", error);
        throw error;
    }
}




export async function deleteHistory(id: string){
    try {
        // Ensure the database connection
        await connectToDB();

        // Attempt to find and delete the document
        const deletedHistory = await History.findByIdAndDelete(id);

        // Check if the document existed
        if (!deletedHistory) {
            console.warn(`No history found with ID ${id}`);
            throw new Error(`History with ID ${id} does not exist`);
        }

        console.log(`History with ID ${id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting history:", error);
        throw new Error(`Failed to delete history with ID ${id}: ${error}`);
    }
}