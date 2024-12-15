"use server"

import { currentUser } from "../helpers/current-user";
import Department from "../models/deparment.models";
import { connectToDB } from "../mongoose";
import { deleteDocument } from "./trash.actons";

interface CreateDepartmentProps {
    name: string,
    active: boolean
}
export async function createDepartment(values: CreateDepartmentProps) {
    try {
        const { name, active } = values
        const user = await currentUser();
        const storeId = user.storeId as string;
        // Connect to MongoDB
        await connectToDB();

        // Create a new department document
        const department = new Department({
            name,
            active,
            storeId,
            createdBy: user._id,
            action_type: "create",
        });

        // Save the department document to the database
        await department.save();

    } catch (error) {
        console.log("Error creating department", error);
        throw error;
    }
}


export async function fetchAllDepartments() {
    try {
        const user = await currentUser();
        // Connect to MongoDB
        await connectToDB();

        // Fetch all department documents
        const departments = await Department.find({ storeId: user.storeId }).populate("createdBy", "fullName");

        if (departments.length === 0) {
            return []
        }

        // Return the fetched department documents
        return JSON.parse(JSON.stringify(departments));

    } catch (error) {
        console.log("Error fetching departments", error);
        throw error;
    }
}


export async function deleteDepartment(id:string) {
    try {
        const user = await currentUser();
            const storeId = user.storeId as string;
            const result = await deleteDocument({
                actionType:'DEPARTMENT_DELETED',
                documentId:id,
                collectionName:'Department',
                userId: user?._id,
                storeId,
                trashMessage: `Department with ID ${id} deleted by ${user.fullName}`,
                historyMessage: `Department with ID ${id} deleted by ${user.fullName}`
            });
        
            console.log(`Department with ID ${id} deleted by user ${user._id}`);
            return JSON.parse(JSON.stringify(result));
        } catch (error) {
            console.error("Error deleting department:", error);
            throw new Error('Failed to delete the department. Please try again.');
        }
    
}