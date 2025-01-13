"use server"

import { revalidatePath } from "next/cache";
import Brand from "../models/brand.models";
import { connectToDB } from "../mongoose";
import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import { deleteDocument } from "./trash.actons";




interface BrandProps {
    name: string;
    branchIds: string[];
    active: boolean;
}
export async function createBrand(values: BrandProps) {
    try {
        const { name, active, branchIds } = values;

        // Retrieve the current user
        const user = await currentUser();
        if (!user || !user.storeId) {
            throw new Error("User or store ID is not available.");
        }

        const storeId = user.storeId;

        // Connect to the database
        await connectToDB();

        // Check if the brand already exists in the store with the given name
        const existingBrand = await Brand.findOne({
            name,
            storeId,
            branchIds: { $all: branchIds }, // Match if all branchIds exist (array match)
        });

        if (existingBrand) {
            throw new Error("Brand with the same name and branches already exists.");
        }

        // Create a new brand document
        const brand = new Brand({
            name,
            storeId,
            branchIds,
            active,
            createdBy: user._id,
            action_type: "create",
        });

        // Save the brand
        await brand.save();

    } catch (error) {
        console.error("Error creating brand:", error);
        throw error;
    }
}


export async function fetchAllBrands() {
    try {
        const user = await currentUser();
        const branchId = await CurrentBranchId();

        const storeId = user.storeId as string;

        await connectToDB();

        const brands = await Brand.find({ storeId, branchIds: { $in: [branchId] }, active: true }).populate("createdBy", "fullName");

        if (brands.length === 0) {
            return []
        };

        return JSON.parse(JSON.stringify(brands));

    } catch (error) {
        console.log("Error fetching all brand ", error)
        throw error
    }
}

export async function fetchBrandWithBranchId() {
    try {
        const user = await currentUser();

        const branchId = await CurrentBranchId();
        const storeId = user.storeId as string

        await connectToDB();

        const brands = await Brand.find({ storeId, branchIds: { $in: [branchId] }, active: true }).populate("createdBy", "fullName");

        if (brands.length === 0) {
            return []
        };

        return JSON.parse(JSON.stringify(brands));

    } catch (error) {
        console.log("Error fetching all brand ", error);
        throw error
    }
}


export async function fetchBrandById(id: string) {
    try {
        await connectToDB();
        const brand = await Brand.findById(id).populate("createdBy", "username");

        if (!brand) {
            throw new Error("Brand not found")
        }

        return JSON.parse(JSON.stringify(brand));

    } catch (error) {
        console.log("Error fetching brand by id ", error)
        throw error
    }
}


export async function updateBrand(id: string, values: Partial<BrandProps>, path: string) {
    try {
        await connectToDB();
        const user = await currentUser()
        // Add modifiedBy and mod_flag to the values object
        const updateValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
        };

        const brand = await Brand.findByIdAndUpdate(id, updateValues, { new: true })

        if (!brand) {
            throw new Error("Brand not found")
        }

        // const history = new History({
        //     action: `Update Brand ${values.name}`,
        //     user: user._id,
        //     details: '',
        // });
        // await history.save();

        revalidatePath(path)
        return JSON.parse(JSON.stringify(brand));

    } catch (error) {
        console.log("Error updating brand ", error)
        throw error
    }
}


export async function deleteBrand(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const result = await deleteDocument({
            actionType: 'BRAND_DELETED',
            documentId: id,
            collectionName: 'Brand',
            userId: user?._id,
            storeId,
            trashMessage: `Brand with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `Brand with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`Brand with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error("Error deleting Brand:", error);
        throw new Error('Failed to delete the Brand. Please try again.');
    }

}