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


export async function createSale(values, path: string) {
    try {
        const user = await currentUser();

        if (!user) throw new Error('Unauthenticated user');

        const storeId = user.storeId as string;

        const branchId = await CurrentBranchId();

        const newSale = new Sale({
            ...values,
            storeId,
            branchId,
            createdBy: user._id,
            action_type: 'create'
        });

        await newSale.save();
        revalidatePath(path)
    } catch (error) {
        throw error
    }
};



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


// export async function fetchAllSales() {
//     try {
//         const user = await currentUser();
//         if (!user) throw new Error('User not authenticated');
//         const storeId = user.storeId as string;
//         const branchId = await CurrentBranchId()
//         const sales = await Sale.find({})
//             .populate('storeId') // Populate Store reference
//             .populate('branchId') // Populate Branch reference
//             .populate('customerId') // Populate Customer reference, even if null
//             .populate('account') // Populate Account reference, even if null
//             .populate({
//                 path: 'products.productId', // Populate productId in products array
//                 options: { strictPopulate: false }, // Ensure no errors for missing references
//             })
//             .populate({
//                 path: 'products.unit', // Populate unit in products array
//                 options: { strictPopulate: false },
//             })
//             .populate('createdBy') // Populate createdBy reference
//             .populate('modifiedBy'); // Populate modifiedBy reference, even if null

//         console.log('Fetched and populated sales:', sales);
//         return sales;
//     } catch (error) {
//         console.error('Error fetching sales:', error);
//         throw error; // You can choose to handle this differently if needed
//     }
// }
