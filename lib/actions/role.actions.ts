"use server"

import { revalidatePath } from "next/cache";
import Role from "../models/role.models";
import { connectToDB } from "../mongoose";
import { currentUser } from "../helpers/current-user";
import { deleteDocument } from "./trash.actons";


interface CreateRoleProps {
    name: string,
    displayName: string,
    description: string,
    manageAccess: boolean,
    manageOnlyPos: boolean,
    dashboard: boolean,
    user: boolean,
    product: boolean,
    sales: boolean,
    purchase: boolean,
    stockTransfer: boolean,
    stockAdjustment: boolean,
    expenses: boolean,
    paymentAccount: boolean,
    report: boolean,
    addRole: boolean,
    manageRole: boolean,
    viewRole: boolean,
    editRole: boolean,
    deleteRole: boolean,
    addUser: boolean,
    manageUser: boolean,
    viewUser: boolean,
    editUser: boolean,
    deleteUser: boolean,
    listProduct: boolean,
    addProduct: boolean,
    manageProduct: boolean,
    viewProduct: boolean,
    editProduct: boolean,
    deleteProduct: boolean,
    addUnit: boolean,
    manageUnit: boolean,
    viewUnit: boolean,
    editUnit: boolean,
    deleteUnit: boolean,
    addBrand: boolean,
    manageBrand: boolean,
    viewBrand: boolean,
    editBrand: boolean,
    deleteBrand: boolean,
    addCategory: boolean,
    manageCategory: boolean,
    viewCategory: boolean,
    editCategory: boolean,
    deleteCategory: boolean,
    addPrintLabel: boolean,
    managePrintLabel: boolean,
    viewPrintLabel: boolean,
    addVariation: boolean,
    manageVariation: boolean,
    viewVariation: boolean,
    editVariation: boolean,
    deleteVariation: boolean,
    manageImportProduct: boolean,
    addSellingGroupPrice: boolean,
    manageSellingGroupPrice: boolean,
    viewSellingGroupPrice: boolean,
    editSellingGroupPrice: boolean,
    deleteSellingGroupPrice: boolean,
    addWarrant: boolean,
    manageWarrant: boolean,
    viewWarrant: boolean,
    editWarrant: boolean,
    deleteWarrant: boolean,
    manageAllSales: boolean,
    addSales: boolean,
    manageSales: boolean,
    viewSales: boolean,
    editSales: boolean,
    deleteSales: boolean,
    addOrder: boolean,
    manageOrder: boolean,
    viewOrder: boolean,
    editOrder: boolean,
    deleteOrder: boolean,
    listOrder: boolean,
    listSellReturn: boolean,
    importSales: boolean,
    listPurchase: boolean,
    addPurchase: boolean,
    managePurchase: boolean,
    viewPurchase: boolean,
    editPurchase: boolean,
    deletePurchase: boolean,
    listPurchaseReturn: boolean,
    importPurchase: boolean,
    listStockTransfer: boolean,
    addStockTransfer: boolean,
    manageStockTransfer: boolean,
    viewStockTransfer: boolean,
    editStockTransfer: boolean,
    deleteStockTransfer: boolean,
    listStockAdjustment: boolean,
    addStockAdjustment: boolean,
    manageStockAdjustment: boolean,
    viewStockAdjustment: boolean,
    editStockAdjustment: boolean,
    deleteStockAdjustment: boolean,
    addExpensesCategory: boolean,
    manageExpensesCategory: boolean,
    viewExpensesCategory: boolean,
    editExpensesCategory: boolean,
    deleteExpensesCategory: boolean,
    addExpenses: boolean,
    manageExpenses: boolean,
    viewExpenses: boolean,
    editExpenses: boolean,
    deleteExpenses: boolean,
    listExpenses: boolean,
    addListAccount: boolean,
    manageListAccount: boolean,
    viewListAccount: boolean,
    editListAccount: boolean,
    deleteListAccount: boolean,
    balanceSheet: boolean,
    trialBalance: boolean,
    cashFlow: boolean,
    paymentAccountReport: boolean,
    profitLostReport: boolean,
    itemsReport: boolean,
    registerReport: boolean,
    expensesReport: boolean,
    productSellReport: boolean,
    productPurchaseReport: boolean,
    sellReturnReport: boolean,
    purchaseReturnReport: boolean,
    stockTransferReport: boolean,
    stockAdjustmentReport: boolean,
    salesReport: boolean,
    purchaseReport: boolean,
    trendingProductReport: boolean,
    stockExpiryReport: boolean,
    stockReport: boolean,
    taxReport: boolean,
    saleRepresentativeReport: boolean,
    customerSupplierReport: boolean,
}
export async function createRole(values: CreateRoleProps, path: string) {
    const {
        name,
        displayName,
        description,
        ...permissions
    } = values;

    try {
        const user = await currentUser();
        const storeId = user.storeId
        await connectToDB();
        // Check if any existing role matches the provided name, display name, or description
        const existingRole = await Role.findOne({
            $or: [
                { name },
                { displayName },
                { description }
            ]
        });

        // If an existing role is found, throw an error
        if (existingRole) {
            throw new Error('Role with the same name, display name, or description already exists');
        }

        const role = new Role({
            name,
            displayName,
            description,
            storeId,
            createdBy: user?._id,
            action_type: "create",
            ...permissions
        });

        await role.save();

        revalidatePath(path)

    } catch (error: any) {
        throw error;
    }
}


export async function fetchRoleById(id: string) {
    try {
        await connectToDB();

        const role = await Role.findById(id);
        
        if (!role) {
            throw new Error('No Role found')
        }


        return JSON.parse(JSON.stringify(role))

    } catch (error: any) {
        console.error("Error fetching role by id:", error);
        throw error;
    }
}

export async function getAllRoles() {
    try {
        const user = await currentUser();

        await connectToDB();
        const roles = await Role.find({ storeId: user.storeId });

        if (!roles || roles.length === 0) {
            console.log("Roles don't exist");
            return []
        }

        return JSON.parse(JSON.stringify(roles))

    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
}
export async function getRolesName() {
    try {

        const user = await currentUser();

        await connectToDB();

        const roles = await Role.find({}, { displayName: 1, _id: 1 });


        if (!roles || roles.length === 0) {
            console.log("Roles name don't exist");
            return null; // or throw an error if you want to handle it differently
        }

        return JSON.parse(JSON.stringify(roles))

    } catch (error) {
        console.error("Error fetching roles name:", error);
        throw error;
    }
}


export async function updateRole(roleId: string, values: Partial<CreateRoleProps>, path: string) {
    await connectToDB();

    try {
        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { $set: values },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            console.log("Role not found");
            return null;
        }

        console.log("Update successful");

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedRole));
    } catch (error) {
        console.error("Error updating role:", error);
        throw error;
    }
}
export async function fetchRole(value: string) {
    try {
        await connectToDB();

        const role = await Role.findOne({ displayName: value });

        if (!role) {
            throw new Error("Role not found");
        }

        return JSON.parse(JSON.stringify(role));

    } catch (error) {
        console.log('Error fetching role', error);
        throw error;
    }

}



export async function deleteRole(id:string) {
    try {
        const user = await currentUser();
            const storeId = user.storeId as string;
            const result = await deleteDocument({
                actionType:'ROLE_DELETED',
                documentId:id,
                collectionName:'Role',
                userId: user?._id,
                storeId,
                trashMessage: `Role with ID ${id} deleted by ${user.fullName}`,
                historyMessage: `Role with ID ${id} deleted by ${user.fullName}`
            });
        
            console.log(`Role with ID ${id} deleted by user ${user._id}`);
            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            console.error("Error deleting role:", error);
            throw new Error('Failed to delete the role. Please try again.');
        }
    
}