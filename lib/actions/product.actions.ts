"use server"

import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import { CurrentPosBranchId } from "../helpers/get-current-branchId-pos";
import Product from "../models/product.models";
import Unit from "../models/unit.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";

import mongoose from "mongoose";

function isValidObjectId(id: string | null | undefined): boolean {
    return mongoose.Types.ObjectId.isValid(id as string);
}

interface ProductData {
    retailPrice?: {
        retailUnitId?: string | null;
    };
    wholesalePrice?: {
        wholesaleUnitId?: string | null;
    };
}

function sanitizeProductInput(data: ProductData) {
    if (data.retailPrice?.retailUnitId === "") {
        data.retailPrice.retailUnitId = null;
    }
    if (data.wholesalePrice?.wholesaleUnitId === "") {
        data.wholesalePrice.wholesaleUnitId = null;
    }
    return data;
}

export async function createProduct(productData: any) {
    try {
        const user = await currentUser();
        if (!user) throw new Error('Unauthenticated user')

        const storeId = user.storeId as string;

        await connectToDB();
        // Sanitize input
        const sanitizedData = sanitizeProductInput(productData);

        // Validate ObjectId fields
        if (
            sanitizedData.retailPrice?.retailUnitId &&
            !isValidObjectId(sanitizedData.retailPrice.retailUnitId)
        ) {
            throw new Error("Invalid retailUnitId");
        }
        if (
            sanitizedData.wholesalePrice?.wholesaleUnitId &&
            !isValidObjectId(sanitizedData.wholesalePrice.wholesaleUnitId)
        ) {
            throw new Error("Invalid wholesaleUnitId");
        }

        // Save product to database
        const product = new Product({
            ...sanitizedData,
            storeId,
            createdBy: user._id,
            action_type: "create",

        });
        await product.save();

    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}


export async function fetchAllProducts() {
    try {
        const user = await currentUser();
        const branchId = await CurrentBranchId();
        const storeId = user.storeId as string;

        await connectToDB();

        const products = await Product.find({ storeId, branchIds: { $in: [branchId] } })
            .populate([
                {
                    path: 'unit',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'vendorPrice.unitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'manualPrice.unitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'retailPrice.retailUnitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'wholesalePrice.wholesaleUnitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'createdBy',
                    model: User,
                    select: 'fullName',
                }
            ])
            .exec();

        if (products.length === 0) return [];

        return JSON.parse(JSON.stringify(products))

    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
}

export async function fetchAllProductsForPos() {
    try {
        const user = await currentUser();
        const branchId = await CurrentPosBranchId();
        const storeId = user.storeId as string;

        await connectToDB();

        const products = await Product.find({ storeId, branchIds: { $in: [branchId] } })
            .populate([
                {
                    path: 'unit',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'vendorPrice.unitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'manualPrice.unitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'retailPrice.retailUnitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
                {
                    path: 'wholesalePrice.wholesaleUnitId',
                    model: Unit,
                    options: { strictPopulate: false },
                },
            ])
            .exec();


        console.log(products, "server")
        if (products.length === 0) return [];

        return JSON.parse(JSON.stringify(products))

    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
}


export async function fetchAllProductById(productId: string) {
    try {
        const user = await currentUser();


        await connectToDB();

        const product = await Product.findById(productId)
        if (!product) {
            return {};
        };

        return JSON.parse(JSON.stringify(product));

    } catch (error) {
        throw error

    }
}