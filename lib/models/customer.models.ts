import { model, models, Schema } from "mongoose";


const CustomerSchema = new Schema({
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

const Customer = models.Customer || model('Customer', CustomerSchema);

export default Customer;

