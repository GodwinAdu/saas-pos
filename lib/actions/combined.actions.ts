"use server"

import { Types } from "mongoose";
import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import Expense from "../models/expenses.models";
import StockAdjustment from "../models/stock-adjustment.models";
import { connectToDB } from "../mongoose";
import Sale from "../models/sale.models";

export async function fetchProfitLossDataByRange(startDate: Date, endDate: Date) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthenticated user");

        const storeId = user.storeId as string;
        if (!storeId) throw new Error("Store ID is missing");

        const branchId = await CurrentBranchId();
        if (!branchId) throw new Error("Branch ID is missing");

        await connectToDB();

        // Adjust end date to include the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // Run all aggregations in parallel for better performance
        const [expenseResult, adjustmentResult, salesResult] = await Promise.all([
            Expense.aggregate([
                { $match: { storeId, branchId, createdAt: { $gte: startDate, $lte: adjustedEndDate } } },
                { $group: { _id: null, paymentAmount: { $sum: "$paymentAmount" } } },
            ]),
            StockAdjustment.aggregate([
                { $match: { storeId, branchId, createdAt: { $gte: startDate, $lte: adjustedEndDate } } },
                { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
            ]),
            Sale.aggregate([
                { $match: { storeId: new Types.ObjectId(storeId), branchId: new Types.ObjectId(branchId), shippingStatus: "Delivered", saleDate: { $gte: startDate, $lte: adjustedEndDate } } },
                { $group: { _id: null, costPrice: { $sum: "$costPrice" }, totalAmount: { $sum: "$totalAmount" } } },
                {
                    $project: {
                        _id: 0,
                        costPrice: 1,
                        totalAmount: 1,
                        profitOrLoss: { $subtract: ["$totalAmount", "$costPrice"] },
                        percentage: {
                            $cond: { if: { $eq: ["$costPrice", 0] }, then: 0, else: { $multiply: [{ $divide: [{ $subtract: ["$totalAmount", "$costPrice"] }, "$costPrice"] }, 100] } }
                        }
                    }
                }
            ])
        ]);

        // Extract values or set default to 0
        const totalExpenses = expenseResult.length ? expenseResult[0].paymentAmount : 0;
        const totalAdjustments = adjustmentResult.length ? adjustmentResult[0].totalAmount : 0;
        const salesData = salesResult.length ? salesResult[0] : null;

        // Calculate Net Profit
        const profitOrLoss = salesData?.profitOrLoss || 0;
        const netProfit = profitOrLoss - totalExpenses - totalAdjustments;

        return {
            totalSales: salesData?.totalAmount || 0,
            totalExpenses,
            totalAdjustments,
            netProfit,
            sales: salesData ? {
                costPrice: salesData.costPrice,
                totalAmount: salesData.totalAmount,
                profitOrLoss,
                percentage: salesData.percentage.toFixed(2),
                status: netProfit >= 0 ? "Profit" : "Loss"
            } : { message: "No sales data available." }
        };

    } catch (error) {
        console.error("Error fetching financial data:", error);
        throw new Error("Failed to fetch financial data");
    }
}



export async function getSalesRepresentation(startDate: Date, endDate: Date) {
    try {
        // Authenticate user
        const user = await currentUser();
        if (!user) throw new Error("Unauthenticated user");

        const storeId = user.storeId as string;
        if (!storeId) throw new Error("Store ID is missing");

        const branchId = await CurrentBranchId();
        if (!branchId) throw new Error("Branch ID is missing");

        await connectToDB();

        // Adjust end date to include full day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // Convert IDs to ObjectId for performance
        const storeObjId = new Types.ObjectId(storeId);
        const branchObjId = new Types.ObjectId(branchId);

        // Fetch sales & expenses in parallel
        const [salesData, expensesData, monthlySales] = await Promise.all([
            // Get total canceled and delivered sales
            Sale.aggregate([
                {
                    $match: {
                        storeId: storeObjId,
                        branchId: branchObjId,
                        shippingStatus: { $in: ["Cancelled", "Delivered"] },
                        saleDate: { $gte: startDate, $lte: adjustedEndDate },
                    },
                },
                {
                    $group: {
                        _id: "$shippingStatus",
                        totalAmount: { $sum: "$totalAmount" },
                    },
                },
            ]),
            // Get total expenses
            Expense.aggregate([
                {
                    $match: {
                        storeId: storeObjId,
                        branchId: branchObjId,
                        createdAt: { $gte: startDate, $lte: adjustedEndDate },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalExpenses: { $sum: "$paymentAmount" },
                    },
                },
            ]),
            // Get total sales per month
            Sale.aggregate([
                {
                    $match: {
                        storeId: storeObjId,
                        branchId: branchObjId,
                        saleDate: { $gte: startDate, $lte: adjustedEndDate },
                    },
                },
                {
                    $group: {
                        _id: { month: { $month: "$saleDate" } },
                        totalSales: { $sum: "$totalAmount" },
                    },
                },
                { $sort: { "_id.month": 1 } },
            ]),
        ]);

        // Process sales data
        let totalCanceled = 0;
        let totalDelivered = 0;
        for (const sale of salesData) {
            if (sale._id === "Cancelled") totalCanceled = sale.totalAmount;
            if (sale._id === "Delivered") totalDelivered = sale.totalAmount;
        }

        // Process expenses data
        const totalExpenses = expensesData.length > 0 ? expensesData[0].totalExpenses : 0;

        // Generate monthly sales data for the chart
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesChartData = new Array(12).fill(0); // Default to 0 for all months

        for (const month of monthlySales) {
            salesChartData[month._id.month - 1] = month.totalSales; // Month index is 0-based
        }

        const salesDataFormatted = {
            labels: monthNames,
            datasets: [
                {
                    label: "Sales",
                    data: salesChartData,
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                },
            ],
        };
        console.log(salesDataFormatted.datasets)

        return { totalCanceled, totalDelivered, totalExpenses, salesData: salesDataFormatted };
    } catch (error) {
        console.error("Error fetching sales data:", error);
        throw new Error("Failed to fetch sales data");
    }
}