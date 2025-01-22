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
export async function fetchProductInfinity(page: number, limit: number = 20) {
    try {
        await connectToDB();

        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await Product.countDocuments();

        return {
            products: JSON.parse(JSON.stringify(products)),
            total
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0 }; // Return an empty array and zero total in case of error
    }
}


export async function fetchAllProductsForPos(page: number, limit: number = 50) {
    try {
        const user = await currentUser();
        const branchId = await CurrentPosBranchId();
        const storeId = user.storeId as string;

        await connectToDB();

        const products = await Product.find({ storeId, branchIds: { $in: [branchId] } })
            .skip((page - 1) * limit)
            .limit(limit)
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

            const total = await Product.countDocuments();
        if (products.length === 0) return [];

        return {
            products: JSON.parse(JSON.stringify(products)),
            total
        };

    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
}


export async function fetchAllProductById(productId: string) {
    try {
        const user = await currentUser();
        if(!user) throw new Error('Unauthenticated')


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

export async function quickSearchProduct(searchTerm: string) {
    try {
        await connectToDB();

        const regex = new RegExp(`^${searchTerm}`, 'i'); // Case-insensitive match from the beginning

        const product = await Product.findOne({
            $or: [
                { name: regex },
                { sku: regex },
                { barcode: regex }
            ]
        }) .populate([
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
;

        if (!product) {
            return []
        }

        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.log("Error fetching product by name, SKU, or barcode", error);
        throw error;
    }
}
