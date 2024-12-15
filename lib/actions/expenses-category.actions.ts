"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user";
import { CurrentBranchId } from "../helpers/get-current-branch";
import ExpensesCategory from "../models/expenses-category.models";
import History from "../models/history.models";
import { connectToDB } from "../mongoose";
import { deleteDocument } from "./trash.actons";



interface CategoryProps {
    name: string;
    branchIds: string[];
    active?: boolean;
}

export async function createExpensesCategory(values: CategoryProps) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;

        const { name, active, branchIds } = values;
        await connectToDB();

        const existingCategory = await ExpensesCategory.findOne({
            name,
            storeId,
            branchIds: { $all: branchIds },
        });

        if (existingCategory) {
            throw new Error("Category already exists in the store");
        }

        const category = new ExpensesCategory({
            storeId,
            branchIds,
            name,
            active,
            createdBy: user?._id,
            action_type: "create",
        });
        const newHistory = new History({
            storeId,
            actionType: `EXPENSES_CATEGORY_CREATED`,
            details: {
                expensesCategoryId: category._id,
                expensesCategoryName: category.name,
                createdAt: new Date()
            },
            message: `A new expenses category named ${values.name} was created successfully`,
            performedBy: user._id,
            entityId: category._id,
            entityType: 'ExpensesCategory', // The type of entity
        })
        await Promise.all([
            category.save(),
            newHistory.save(),
        ])
            ;
    } catch (error) {
        console.log("Error creating category ", error)
        throw error
    }
}


export async function fetchAllExpensesCategories() {
    try {
        const user = await currentUser();

        const storeId = user.storeId as string;

        await connectToDB();

        const categories = await ExpensesCategory.find({
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
export async function fetchAllExpensesCategoriesWithBranchId(){
    try {
        const user = await currentUser();

        const branchId = await CurrentBranchId();
        const storeId = user.storeId as string;

        await connectToDB();

        const categories = await ExpensesCategory.find({
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


export async function fetchExpensesCategoryById(id: string) {
    try {
        await connectToDB();
        const category = await ExpensesCategory.findById(id).populate("createdBy", "fullName");
        if (!category) {
            throw new Error("Category not found")
        }
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error fetching category ", error)
        throw error
    }
}


export async function updateExpensesCategory(id: string, values: Partial<CategoryProps>, path: string) {
    try {
        await connectToDB();
        const user = await currentUser()
        // Add modifiedBy and mod_flag to the values object
        const updateValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
        };

        const category = await ExpensesCategory.findByIdAndUpdate(id, updateValues, { new: true })
        if (!category) {
            throw new Error("Category not found")
        }
      
        revalidatePath(path)
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error updating category ", error)
        throw error
    }
}



export async function deleteExpensesCategory(id:string) {
    try {
        const user = await currentUser();
            const storeId = user.storeId as string;
            const result = await deleteDocument({
                actionType:'EXPENSES_CATEGORY_DELETED',
                documentId:id,
                collectionName:'ExpensesCategory',
                userId: user?._id,
                storeId,
                trashMessage: `Expenses Category with ID ${id} deleted by ${user.fullName}`,
                historyMessage: `Expenses Category with ID ${id} deleted by ${user.fullName}`
            });
        
            console.log(`Expenses Category with ID ${id} deleted by user ${user._id}`);
            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            console.error("Error deleting expenses category:", error);
            throw new Error('Failed to delete the expenses category. Please try again.');
        }
    
}