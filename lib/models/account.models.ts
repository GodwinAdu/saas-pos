import { model, models, Schema } from "mongoose";


const AccountSchema = new Schema({
    storeId:{
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    branchId: [{
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    }],
    accountName: {
        type: String,
        required: true,
        trim: true,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,  // Assuming balance should not be negative
    },
    deposits: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Sale',
        }
    ],
    expenses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Expense',
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
    }
}, {
    timestamps: true 
});

const Account = models.Account || model("Account", AccountSchema);

export default Account;