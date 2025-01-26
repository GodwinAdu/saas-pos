"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import Product from "../models/product.models";
import StockAdjustment from "../models/stock-adjustment.models";
import { connectToDB } from "../mongoose";
import { generateReferenceNumber } from "../utils";
import Unit from "../models/unit.models";
import User from "../models/user.models";

export async function createStockAdjustment(values: any, path: string) {
    try {
        const user = await currentUser();

        if (!user) throw new Error('Unauthenticated user');

        const storeId = user.storeId;
        const branchId = await CurrentBranchId();

        await connectToDB();

        // Batch update product stock
        const productIds = values.products.map((product: { productId: string }) => product.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== productIds.length) {
            throw new Error('Some products were not found');
        }

        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        for (const { productId, quantity } of values.products) {
            const product = productMap.get(productId);

            if (!product) throw new Error(`Product with ID ${productId} not found`);

            switch (values.adjustmentType) {
                case 'abnormal':
                    if (product.stock === undefined) {
                        throw new Error(`Stock for product with ID ${productId} is undefined`);
                    }
                    product.stock -= quantity;
                    break;
                case 'normal':
                    product.stock += quantity;
                    break;
                default:
                    product.stock = 0;
                    product.active = false;
                    product.selling = false;
                    break;
            }
        }

        // Save all updated products in a single operation
        await Promise.all(products.map(product => product.save()));

        const newAdjustment = new StockAdjustment({
            ...values,
            referenceNo: values.referenceNo ? values.referenceNo : generateReferenceNumber('INV'),
            storeId,
            branchId,
            createdBy: user._id,
            action_type: 'create',
        });

        await newAdjustment.save();
        revalidatePath(path);

    } catch (error) {
        console.error('Error in createStockAdjustment:', error);
        throw error;
    }
}


export async function fetchAdjustmentByDate(startDate: Date, endDate: Date) {
    try {
        const user = await currentUser();

        if (!user) throw new Error("Unauthenticated user");

        const storeId = user.storeId as string;
        const branchId = await CurrentBranchId();

        // Adjust end date to include the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        const adjustments = await StockAdjustment.find({
            storeId,
            branchId,
            createdAt: { $gte: startDate, $lte: adjustedEndDate },
        })
            .populate([
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

        return adjustments.length > 0 ? JSON.parse(JSON.stringify(adjustments)) : [];
    } catch (error) {
        console.error("Error fetching sales:", error);
        throw error;
    }
}