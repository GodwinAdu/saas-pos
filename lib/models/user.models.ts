
import { Model, model, models, Schema } from "mongoose";

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

const AddressSchema = new Schema<Address>({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String },
});
const WorkScheduleSchema = new Schema<WorkSchedule>({
    day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    startTime: { type: String }, // Example: "09:00"
    endTime: { type: String},   // Example: "17:00"
});



const UserSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
            default: null
        },
        emergencyNumber: {
            type: String,
            default: null,
        },
        dob: {
            type: Date,
            default: null
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String, // Optional profile image URL
            default: null,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        availableAllSchedule:{
            type: Boolean,
            default: false,
        },
        address: { type: AddressSchema },
        isVerified: {
            type: Boolean,
            default: false,
        },
        jobTitle: {
            type: String,
            default: null,
        },
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        workSchedule: { type: [WorkScheduleSchema], default: [] }, // Array of schedule entries
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        accessLocation: [{
            type: Schema.Types.ObjectId,
            ref: "Branch",
            default: null,
        }],
        cardDetails: {
            idCardType: {
                type: String,
                default: null,
            },
            idCardNumber: {
                type: String,
                default: null,
            },

        },
        accountDetails: {
            accountName: {
                type: String,
                default: null,
            },
            accountNumber: {
                type: String,
                default: null,
            },
            accountType: {
                type: String,
                default: null,
            }
        },
        startDate: {
            type: Date,
            default: null,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        isFreezed: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        modifiedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        mod_flag: {
            type: Boolean,
            default: false,
        },
        del_flag: {
            type: Boolean,
            default: false,
        },
        action_type: {
            type: String,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
type userModel = Model<IUser>;

const User: userModel = models.User || model<IUser>("User", UserSchema);

export default User;
