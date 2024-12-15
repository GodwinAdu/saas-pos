"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user";
import Category from "../models/category.models";
import { connectToDB } from "../mongoose";

import Product from "../models/product.models";
import { CurrentBranchId } from "../helpers/get-current-branch";
import { deleteDocument } from "./trash.actons";



interface CategoryProps {
    name: string;
    branchIds: string[];
    active?: boolean;
}

export async function createCategory(values: CategoryProps) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;

        const { name, active, branchIds } = values;
        await connectToDB();

        const existingCategory = await Category.findOne({
            name,
            storeId,
            branchIds: { $all: branchIds },
        });

        if (existingCategory) {
            throw new Error("Category already exists in the store");
        }

        const category = new Category({
            storeId,
            branchIds,
            name,
            active,
            createdBy: user?._id,
            action_type: "create",
        });
        // const history = new History({
        //     action:`Update Category ${values.name}`,
        //     user: user._id,
        //     // details: await getUserDetails(),
        // });

        await Promise.all([
            category.save(),
            // history.save(),
        ])
            ;
    } catch (error) {
        console.log("Error creating category ", error)
        throw error
    }
}


export async function fetchAllCategories() {
    try {
        const user = await currentUser();

        const storeId = user.storeId as string;

        await connectToDB();

        const categories = await Category.find({
            storeId,
            active: true,
        }).populate("createdBy", "fullName");

        if (categories.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.log("Error fetching categories ", error)
        throw error
    }
}
export async function fetchAllCategoriesWithBranchId(){
    try {
        const user = await currentUser();

        const branchId = await CurrentBranchId();
        const storeId = user.storeId as string;

        await connectToDB();

        const categories = await Category.find({
            storeId,
            branchIds: { $in: [branchId] },
            active: true,
        }).populate("createdBy", "fullName");

        if (categories.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.log("Error fetching categories ", error)
        throw error
    }
}


export async function fetchCategoryById(id: string) {
    try {
        await connectToDB();
        const category = await Category.findById(id).populate("createdBy", "fullName");
        if (!category) {
            throw new Error("Category not found")
        }
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error fetching category ", error)
        throw error
    }
}


export async function updateCategory(id: string, values: Partial<CategoryProps>, path: string) {
    try {
        await connectToDB();
        const user = await currentUser()
        // Add modifiedBy and mod_flag to the values object
        const updateValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
        };

        const category = await Category.findByIdAndUpdate(id, updateValues, { new: true })
        if (!category) {
            throw new Error("Category not found")
        }
        // const history = new History({
        //     action: `Update Category ${values.name}`,
        //     user: user._id,
        //     details: await getUserDetails(),
        // });

        // await history.save()

        revalidatePath(path)
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error updating category ", error)
        throw error
    }
}



export async function deleteCategory(id:string) {
    try {
        const user = await currentUser();
            const storeId = user.storeId as string;
            const result = await deleteDocument({
                actionType:'CATEGORY_DELETED',
                documentId:id,
                collectionName:'Category',
                userId: user?._id,
                storeId,
                trashMessage: `Category with ID ${id} deleted by ${user.fullName}`,
                historyMessage: `Category with ID ${id} deleted by ${user.fullName}`
            });
        
            console.log(`Category with ID ${id} deleted by user ${user._id}`);
            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            console.error("Error deleting category:", error);
            throw new Error('Failed to delete the category. Please try again.');
        }
    
}