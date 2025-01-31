"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user"
import { CurrentBranchId } from "../helpers/get-current-branch";
import Expense from "../models/expenses.models";
import { connectToDB } from "../mongoose";
import { generateReferenceNumber } from "../utils";
import Account from "../models/account.models";

export async function createExpenses(values: any, path: string) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthenticated user")

        const storeId = user.storeId
        const branchId = await CurrentBranchId();

        await connectToDB();

        const newExpense = new Expense({
            storeId,
            branchId,
            referenceNo: values.referenceNo ? values.referenceNo : generateReferenceNumber('EXP'),
            ...values,
            createdBy: user._id,
            action_type: "create",
        });

        // Update account balance
        const currentAccount = await Account.findById(values.account);
        if (!currentAccount) throw new Error('Account not found');

        currentAccount.balance -= values.totalAmount;
        currentAccount.expenses.push(newExpense._id);

        await Promise.all([
            currentAccount.save(),
            newExpense.save(),
        ]);

        revalidatePath(path);

    } catch (error) {
        console.error("Error in createExpenses:", error)
        throw error

    }
}


export async function fetchAllExpenses(startDate: Date, endDate: Date) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("Unauthenticated user")

        const storeId = user.storeId as string;

        const branchId = await CurrentBranchId();
        // Adjust end date to include the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        await connectToDB();

        const expenses = await Expense.find({
            storeId,
            branchId,
            createdAt: { $gte: startDate, $lte: adjustedEndDate },
        })
            .populate('createdBy', 'fullName')
            .sort({ expenseDate: -1 });

        return expenses ?
            JSON.parse(JSON.stringify(expenses)) : [];
    } catch (error) {
        console.error("Error fetching all expenses:", error)
        throw error
    }
}

export async function fetchExpensesAmountByRange(startDate: Date, endDate: Date) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("Unauthenticated user");

        const storeId = user.storeId as string;
        const branchId = await CurrentBranchId();

        // Adjust end date to include the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // Fetch total sum of stock adjustments within the date range
        const result = await Expense.aggregate([
            {
                $match: {
                    storeId,
                    branchId,
                    createdAt: { $gte: startDate, $lte: adjustedEndDate },
                },
            },
            {
                $group: {
                    _id: null, // Group everything together
                    paymentAmount: { $sum: "$paymentAmount" },
                },
            },
        ]);

        return result.length ? result[0].paymentAmount : 0; // Return sum or 0 if no records

    } catch (error) {
        console.error("Error fetching sales:", error);
        throw error;
    }
}