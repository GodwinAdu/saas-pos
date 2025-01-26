"use server"

import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import RevenueSummary from "../models/revenue-summary.models";
import { connectToDB } from "../mongoose";


export const fetchCurrentMonthRevenue = async () => {
    try {
        const user = await currentUser();
        const storeId = user.storeId;
        const branchId = await CurrentBranchId();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        await connectToDB();

        const revenueSummary = await RevenueSummary.findOne({
            storeId,
            branchId,
            date: { $gte: startOfMonth, $lt: endOfMonth },
        });

        return revenueSummary
            ? revenueSummary.totalRevenue
            : 0; // Return 0 if no document is found
    } catch (error) {
        console.error("Error fetching current month revenue:", error);
        throw new Error("Failed to fetch current month revenue.");
    }
};


export const totalRevenues = async () => {
    try {
        const user = await currentUser();
        const storeId = user.storeId;
        const branchId = await CurrentBranchId()

        const revenues = await RevenueSummary.find({ storeId, branchId })

        revenues.reduce((acc, revenue) => {
            return acc + revenue.totalRevenue
        },0);

        return revenues ?
            revenues : 0

    } catch (error) {
        console.error("Error fetching total revenue:", error);
        throw error;
    }
}