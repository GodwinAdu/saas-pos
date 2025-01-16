import { Model, model, models, Schema } from "mongoose";
import { ICustomer } from "../types";


const CustomerSchema: Schema<ICustomer> = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dob: { type: String },
    active: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
}, {
    timestamps: true,
    versionKey: false,
});
type CustomerModel = Model<ICustomer>

const Customer: CustomerModel = models.Customer || model<ICustomer>('Customer', CustomerSchema);

export default Customer;

