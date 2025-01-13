'use server'
import { cookies } from "next/headers";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import { compare, hash } from "bcryptjs"
import jwt from 'jsonwebtoken';
import Role from "../models/role.models";
import Store from "../models/store.models";
import { generateUniqueUsername } from "./generators/generate-username";
import Department from "../models/deparment.models";
import { Types } from "mongoose";
import History from "../models/history.models";
import { getNextMonthDate } from "../utils";
import { LoginFormSchema, stepOneSchema, stepTwoSchema } from '../validators/sign-up-schema';

interface Props {
    email: string;
    password: string;
}


export async function logInUser(values: Props) {
    try {
        const cookieStore = await cookies();
        const { email, password } = values;

        if (!email || !password) throw new Error('Missing fields for login');

        const validateFields = LoginFormSchema.safeParse({
            email,
            password
        });

        if (!validateFields.success) {
            throw new Error('Invalid data for login');
        }

        await connectToDB();

        const user = await User.findOne({ email })

        if (!user) throw new Error('User not found');

        const tokenData = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) throw new Error('Invalid password');

        await History.create({
            storeId: user.storeId,
            actionType: `USER_LOGIN`, // Use a relevant action type
            details: {
                itemId: user._id,
                deletedAt: new Date(),
            },
            message: `${user.fullName} was logged in successfully`,
            performedBy: user._id, // User who performed the action
            entityId: user._id,  // The ID of the deleted unit
            entityType: `User`,  // The type of the entity
        });



        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY!, { expiresIn: '1d' });

        cookieStore.set("token", token,
            {
                httpOnly: true,
                path: '/'
            }
        );
        return JSON.parse(JSON.stringify(user));

    } catch (error) {
        console.log('Error logging in user', error);
        throw error;
    }
}

interface SignUpProps {
    fullName: string;
    email: string;
    password: string;
    storeName: string;
    storeEmail: string;
    numberOfBranches: string;
}

// Role permissions configuration (could be moved to a separate config file)
const defaultRolePermissions = {
    name: "Administrator",
    displayName: "admin",
    description: `The administrator`,
    manageAccess: true,
    manageOnlyPos: true,
    dashboard: true,
    user: true,
    product: true,
    sales: true,
    purchase: true,
    stockTransfer: true,
    stockAdjustment: true,
    expenses: true,
    paymentAccount: true,
    report: true,
    addRole: true,
    manageRole: true,
    viewRole: true,
    editRole: true,
    deleteRole: true,
    addUser: true,
    manageUser: true,
    viewUser: true,
    editUser: true,
    deleteUser: true,
    listProduct: true,
    addProduct: true,
    manageProduct: true,
    viewProduct: true,
    editProduct: true,
    deleteProduct: true,
    addUnit: true,
    manageUnit: true,
    viewUnit: true,
    editUnit: true,
    deleteUnit: true,
    addBrand: true,
    manageBrand: true,
    viewBrand: true,
    editBrand: true,
    deleteBrand: true,
    addCategory: true,
    manageCategory: true,
    viewCategory: true,
    editCategory: true,
    deleteCategory: true,
    addPrintLabel: true,
    managePrintLabel: true,
    viewPrintLabel: true,
    addVariation: true,
    manageVariation: true,
    viewVariation: true,
    editVariation: true,
    deleteVariation: true,
    manageImportProduct: true,
    addSellingGroupPrice: true,
    manageSellingGroupPrice: true,
    viewSellingGroupPrice: true,
    editSellingGroupPrice: true,
    deleteSellingGroupPrice: true,
    addWarrant: true,
    manageWarrant: true,
    viewWarrant: true,
    editWarrant: true,
    deleteWarrant: true,
    manageAllSales: true,
    addSales: true,
    manageSales: true,
    viewSales: true,
    editSales: true,
    deleteSales: true,
    addOrder: true,
    manageOrder: true,
    viewOrder: true,
    editOrder: true,
    deleteOrder: true,
    listOrder: true,
    listSellReturn: true,
    importSales: true,
    listPurchase: true,
    addPurchase: true,
    managePurchase: true,
    viewPurchase: true,
    editPurchase: true,
    deletePurchase: true,
    listPurchaseReturn: true,
    importPurchase: true,
    listStockTransfer: true,
    addStockTransfer: true,
    manageStockTransfer: true,
    viewStockTransfer: true,
    editStockTransfer: true,
    deleteStockTransfer: true,
    listStockAdjustment: true,
    addStockAdjustment: true,
    manageStockAdjustment: true,
    viewStockAdjustment: true,
    editStockAdjustment: true,
    deleteStockAdjustment: true,
    addExpensesCategory: true,
    manageExpensesCategory: true,
    viewExpensesCategory: true,
    editExpensesCategory: true,
    deleteExpensesCategory: true,
    addExpenses: true,
    manageExpenses: true,
    viewExpenses: true,
    editExpenses: true,
    deleteExpenses: true,
    listExpenses: true,
    addListAccount: true,
    manageListAccount: true,
    viewListAccount: true,
    editListAccount: true,
    deleteListAccount: true,
    balanceSheet: true,
    trialBalance: true,
    cashFlow: true,
    paymentAccountReport: true,
    profitLostReport: true,
    itemsReport: true,
    registerReport: true,
    expensesReport: true,
    productSellReport: true,
    productPurchaseReport: true,
    sellReturnReport: true,
    purchaseReturnReport: true,
    stockTransferReport: true,
    stockAdjustmentReport: true,
    salesReport: true,
    purchaseReport: true,
    trendingProductReport: true,
    stockExpiryReport: true,
    stockReport: true,
    taxReport: true,
    saleRepresentativeReport: true,
    customerSupplierReport: true,
};


export async function signUpUser(values: SignUpProps) {
    try {
        const { fullName, email, password, storeName, storeEmail, numberOfBranches } = values;

        // Basic validation for required fields
        if (!fullName || !email || !password || !storeName || !numberOfBranches) {
            throw new Error("Missing required fields for sign-up.");
        }
        const validateBusinessFields = stepOneSchema.safeParse({
            storeName,
            storeEmail,
            numberOfBranches,
        });

        const validateUserFields = stepTwoSchema.safeParse({
            fullName,
            email,
            password,
        });

        if (!validateBusinessFields.success || !validateUserFields.success) {
            throw new Error("Invalid data for sign-up.");
        }

        await connectToDB(); // Ensure DB connection

        // Check for existing user
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            throw new Error("Email is already in use.");
        }

        const username = generateUniqueUsername(fullName);
        const hashedPassword = await hash(password, 10);

        // Pre-generate ObjectIDs
        const storeId = new Types.ObjectId();
        const departmentId = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const roleId = new Types.ObjectId();

        // Create documents
        const newUser = new User({
            _id: userId,
            storeId,
            departmentId,
            username,
            fullName,
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            availableAllSchedule: true,
            action_type: "create",
        });

        const newStore = new Store({
            _id: storeId,
            name: storeName,
            storeEmail,
            numberOfBranches: Number(numberOfBranches),
            subscribed: true,
            subscriptionPlan: {
                subscriptionExpiry: getNextMonthDate(new Date()),
            },
            createdBy: userId,
        });

        const newDepartment = new Department({
            _id: departmentId,
            name: "Administration",
            description: "Administration Department",
            storeId,
            members: [userId],
            createdBy: userId,
            action_type: "create",
        });

        const newRole = new Role({
            _id: roleId,
            storeId,
            ...defaultRolePermissions,
            createdBy: userId,
            action_type: "create",
        });

        // Save all entities in parallel
        await Promise.all([
            newUser.save(),
            newStore.save(),
            newDepartment.save(),
            newRole.save(),
        ]);

        // Record history
        await History.create({
            storeId: storeId,
            actionType: `USER_CREATED`,
            details: {
                itemId: userId,
                createdAt: new Date(),
            },
            message: `${fullName} signed up successfully.`,
            performedBy: userId,
            entityId: userId,
            entityType: `User`,
        });

        return JSON.parse(JSON.stringify(newUser)); // Return created user info
    } catch (error) {
        console.error("Error signing up user:", error);
        throw new Error("Failed to sign up user.");
    }
}