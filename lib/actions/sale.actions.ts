"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user"
import { CurrentBranchId } from "../helpers/get-current-branch";
import Account from "../models/account.models";
import Customer from "../models/customer.models";
import Product from "../models/product.models";
import Sale from "../models/sale.models";
import Unit from "../models/unit.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import { Types } from "mongoose";


export async function createSale(values: any, path: string) {
    try {
        const user = await currentUser();

        if (!user) throw new Error('Unauthenticated user');

        const storeId = user.storeId;
        const branchId = await CurrentBranchId();

        // Batch update product stock
        const productIds = values.products.map((product: { productId: string }) => product.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        for (const { productId, totalQuantity } of values.products) {
            const product = productMap.get(productId);

            if (!product) throw new Error(`Product with ID ${productId} not found`);
            if (product.stock !== undefined) {
                product.stock -= totalQuantity;
                if (product.stock < 0) throw new Error(`Insufficient stock for product ID ${productId}`);
            }
        }

        // Save all updated products in a single operation
        await Promise.all(products.map(product => product.save()));

        // Create the new sale
        const newSale = new Sale({
            ...values,
            storeId,
            branchId,
            createdBy: user._id,
            action_type: 'create',
        });

        // Update account balance
        const currentAccount = await Account.findById(values.account);
        if (!currentAccount) throw new Error('Account not found');

        currentAccount.balance += values.totalAmount;
        currentAccount.sales.push(newSale._id);
        await currentAccount.save();

        await newSale.save();

        // Revalidate the path
        revalidatePath(path);
    } catch (error) {
        console.error('Error in createSale:', error);
        throw error;
    }
}

export async function fetchSalesByDate(startDate: Date, endDate: Date) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("Unauthenticated user");

        const storeId = user.storeId as string;
        const branchId = await CurrentBranchId();

        // Adjust end date to include the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        const sales = await Sale.find({
            storeId,
            branchId,
            createdAt: { $gte: startDate, $lte: adjustedEndDate },
        })
            .populate([
                {
                    path: 'customerId',
                    model: Customer,
                    select: 'name',
                    options: { strictPopulate: false }, // Ensure no errors for missing references
                },
                {
                    path: 'account',
                    model: Account,
                },
                {
                    path: 'products.productId',
                    model: Product,
                    options: { strictPopulate: false }, // Ensure no errors for missing references
                },
                {
                    path: 'products.unit',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'createdBy',
                    model: User,
                    select: 'fullName',
                }
            ])
            .sort({ createdAt: -1 })
            .exec();

        return sales.length > 0 ? JSON.parse(JSON.stringify(sales)) : [];
    } catch (error) {
        console.error("Error fetching sales:", error);
        throw error;
    }
}


export const getTodaySales = async () => {
    const user = await currentUser();
    const storeId = user.storeId as string;
    const branchId = await CurrentBranchId();
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

    const result = await Sale.aggregate([
        {
            $match: {
                storeId,
                branchId,
                date: { $gte: startOfDay, $lte: endOfDay },
            },
        },
        {
            // Calculate total revenue and total quantity sold
            $group: {
                _id: null, // No grouping by field, just calculate overall totals
                totalRevenue: { $sum: "$total" },
                totalQuantity: { $sum: "$quantity" },
            },
        },
        {
            // Format the output
            $project: {
                _id: 0,
                totalRevenue: 1,
                totalQuantity: 1,
            },
        },
    ]);

    return result[0] || { totalRevenue: 0, totalQuantity: 0 }; // Return 0 if no sales today
};



export const getTopProductsOfCurrentMonth = async () => {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const branchId = await CurrentBranchId();



        await connectToDB();

        const now = new Date(); // Current date
        const year = now.getFullYear(); // Current year
        const month = now.getMonth(); // Current month (0-indexed)

        const result = await Sale.aggregate([
            {
                // Match sales within the current month, store, and branch
                $match: {
                    storeId: new Types.ObjectId(storeId),
                    branchId: new Types.ObjectId(branchId),
                    saleDate: {
                        $gte: new Date(year, month, 1), // First day of the month
                        $lt: new Date(year, month + 1, 1), // First day of the next month
                    },
                },
            },
            {
                // Unwind the products array to process each product individually
                $unwind: "$products",
            },
            {
                // Group by productId and calculate total quantity sold and total revenue
                $group: {
                    _id: "$products.productId",
                    totalQuantity: { $sum: "$products.totalQuantity" },
                    totalRevenue: { $sum: "$products.subTotal" },
                },
            },
            {
                // Sort by total quantity sold in descending order
                $sort: { totalQuantity: -1 },
            },
            {
                // Optionally limit to top 5 products
                $limit: 5,
            },
            {
                // Lookup product details from the Product collection
                $lookup: {
                    from: "products", // Name of the Product collection
                    localField: "_id", // Match the productId
                    foreignField: "_id", // Reference the _id field in Product
                    as: "productDetails",
                },
            },
            {
                // Unwind the productDetails array to extract product info
                $unwind: "$productDetails",
            },
            {
                // Format the output
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: "$productDetails.name", // Assuming "name" field exists in Product
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]);

        return JSON.parse(JSON.stringify(result));


    } catch (error) {
        console.log('Failed to get top products of current month', error);
        throw error;
    }
};
