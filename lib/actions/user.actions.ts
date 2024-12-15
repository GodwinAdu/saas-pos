"use server"

import { revalidatePath } from "next/cache";
import { currentUser } from "../helpers/current-user";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import { generateUniqueUsername } from "../helpers/generators/generate-username";
import { hash } from "bcryptjs";
import { CurrentBranchId } from "../helpers/get-current-branch";
import { deleteDocument } from "./trash.actons";
import History from "../models/history.models";


interface CreateUserProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    dob: Date;
    gender: string;
    emergencyContact: string;
    password: string;
    role: string;
    isActive: boolean;
    jobTitle: string | undefined;
    departmentId: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    startDate: Date,
    cardDetails: {
        idCardNumber: string;
        idCardType: string;
    } | undefined;
    accountDetails: {
        accountName: string;
        accountNumber: string;
        accountType: string;
        commissionRate: number;
        salesTarget: number;
        monthlyPaymentAmount: number;
    };
    workSchedule: string[];
    accessLocation: string[];
    availableAllSchedule: boolean;
}

export async function createUser(values: CreateUserProps, path: string) {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            dob,
            gender,
            emergencyContact,
            password,
            role,
            isActive,
            jobTitle,
            departmentId,
            address,
            startDate,
            cardDetails,
            accountDetails,
            workSchedule,
            accessLocation,
            availableAllSchedule,
        } = values;

        const user = await currentUser();
        const storeId = user.storeId;

        await connectToDB();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("Email already exists");
        }
        const hashedPassword = await hash(password, 10);

        const newUser = new User({
            username: generateUniqueUsername(fullName),
            fullName,
            email,
            phoneNumber,
            dob,
            gender,
            emergencyContact,
            password: hashedPassword,
            role,
            isActive,
            jobTitle,
            departmentId,
            address,
            startDate,
            cardDetails,
            accountDetails,
            workSchedule,
            accessLocation,
            availableAllSchedule,
            storeId,
            createdBy: user._id,
            action_type: "create",
        });

        await newUser.save();
        await History.create({
            storeId: newUser.storeId,
            actionType: `USER_CREATED`, // Use a relevant action type
            details: {
                itemId: newUser._id,
                itemName: newUser.fullName,
                deletedAt: new Date(),
            },
            message: `A user named ${newUser.fullName} was created successfully`,
            performedBy: newUser._id, // User who performed the action
            entityId: newUser._id,  // The ID of the deleted unit
            entityType: `User`,  // The type of the entity
        });

        revalidatePath(path)

    } catch (error) {
        console.log("Error creating user", error);
        throw error;
    }
}

export async function fetchUser(id: string) {
    try {

        await connectToDB();

        const user = await User.findById(id);

        if (!user) {
            throw new Error("User not found");
        }


        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log("Error fetching user", error);
        throw error;
    }

}


export async function fetchAllUsers() {
    try {
        const user = await currentUser();
        const branchId = await CurrentBranchId();

        const storeId = user.storeId as string;

        await connectToDB();

        const users = await User.find({ storeId, accessLocation: branchId }).populate("createdBy", "fullName");

        if (!users || users.length === 0) {
            return []
        };

        return JSON.parse(JSON.stringify(users));

    } catch (error) {
        console.log('Error fetching all users', error);
        throw error
    }
}


export async function deleteUser(id: string) {
    try {
        const user = await currentUser();
        const storeId = user.storeId as string;
        const result = await deleteDocument({
            actionType:"USER_DELETED",
            documentId: id,
            collectionName: 'User',
            userId: user?._id,
            storeId,
            trashMessage: `User with ID ${id} deleted by ${user.fullName}`,
            historyMessage: `User with ID ${id} deleted by ${user.fullName}`
        });

        console.log(`User with ID ${id} deleted by user ${user._id}`);
        return JSON.parse(JSON.stringify(result));
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error('Failed to delete the user. Please try again.');
    }

}