import { Model, model, models, Schema } from "mongoose";


const AccountSchema: Schema<IAccount> = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    branchIds: [{
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    }],
    name: {
        type: String,
        required: true,
        trim: true,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,  // Assuming balance should not be negative
    },
    sales: [
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
    active:{type:Boolean,default:false},
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
    timestamps: true,
    versionKey: false,
});
type AccountModel = Model<IAccount>

const Account: AccountModel = models.Account || model<IAccount>("Account", AccountSchema);

export default Account;