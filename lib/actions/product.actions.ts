"use server"

import { currentUser } from "../helpers/current-user";
import Product from "../models/product.models";
import Unit from "../models/unit.models";
import { connectToDB } from "../mongoose";

import mongoose from "mongoose";

function isValidObjectId(id: string | null | undefined): boolean {
    return mongoose.Types.ObjectId.isValid(id as string);
}

function sanitizeProductInput(data: any) {
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
        const product = new Product(sanitizedData);
        await product.save();

    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}


export async function fetchAllProducts() {
    try {
        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        const products = await Product.find({})
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
