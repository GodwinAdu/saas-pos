"use server"

import { currentUser } from "../helpers/current-user";
import Customer from "../models/customer.models";
import Product from "../models/product.models";
import Suspend from "../models/suspend.models";
import Unit from "../models/unit.models";
import { connectToDB } from "../mongoose";
import { model } from 'mongoose';

interface Props {
    branchId: string;
    products: {
        productId: string;
        unit: string;
        quantity: number;
        price: number;
    }[];
    description: string;
};


export async function createSuspend(data: Props) {
    try {
        const { branchId, products, description } = data;

        if (!branchId || !products || !description) throw new Error('All fields are required');

        const user = await currentUser();

        if (!user) throw new Error('Unauthenticated');

        const storeId = user.storeId;

        await connectToDB();

        const newSuspend = new Suspend({
            storeId,
            branchId,
            products,
            description,
            createdBy: user._id,
            action_type: 'suspend',
        });

        await newSuspend.save();

    } catch (error) {
        console.log('Error creating suspend', error);
        throw error;
    }
}

export async function fetchSuspends() {

}

export async function fetchSuspendById(id: string) {

}
export async function fetchSuspendForUser(branchId: string) {
    try {
        const user = await currentUser();
        if (!user) throw new Error('Unauthenticated');

        const storeId = user.storeId;
        await connectToDB();

        const suspendedProducts = await Suspend.find({ storeId, branchId, createdBy: user._id })
            .populate([
                { path: 'storeId', select: 'name location' },
                { path: 'branchId', select: 'name address' },
                { path: 'customerId', model: Customer, select: 'name contactInfo', options: { strictPopulate: false } },
                {
                    path: 'products.productId',
                    model: Product,
                    select: 'name price units manualPrice retailPrice wholesalePrice', // Select relevant fields
                    populate: [
                        {
                            path: 'unit', // Populating any unit references directly in Product
                            model: Unit,
                            select: 'name quantity',
                        },
                        {
                            path: 'manualPrice.unitId', // Populate unitId in manualPrice
                            model: Unit,
                            select: 'name quantity',
                        },
                        {
                            path: 'retailPrice.retailUnitId', // Populate retailUnitId in retailPrice
                            model: Unit,
                            select: 'name quantity',
                        },
                        {
                            path: 'wholesalePrice.wholesaleUnitId', // Populate wholesaleUnitId in wholesalePrice
                            model: Unit,
                            select: 'name quantity',
                        },
                    ],
                },
                {
                    path: 'products.unit',
                    model: Unit,
                    select: 'name quantity',
                    options: { strictPopulate: false },
                },
                { path: 'createdBy', select: 'name email' },
                { path: 'modifiedBy', select: 'name email', options: { strictPopulate: false } },
            ]);

        console.log('Populated Suspended Products:', suspendedProducts);

        if (suspendedProducts.length === 0) return [];

        return JSON.parse(JSON.stringify(suspendedProducts));
    } catch (error) {
        console.error('Error fetching suspended products:', error);
        throw error;
    }
}


export async function deleteSuspend() {

}

export async function updateSuspend() {

}