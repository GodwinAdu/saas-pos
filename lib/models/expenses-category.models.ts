import { Model, model, models,  Schema } from "mongoose";

const ExpensesCategorySchema:Schema<IExpensesCategory> = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    branchIds:{
        type: [Schema.Types.ObjectId],
        ref: "Branch",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
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

type ExpensesCategoryModel = Model<IExpensesCategory>

const ExpensesCategory:ExpensesCategoryModel = models.ExpensesCategory || model<IExpensesCategory>("ExpensesCategory", ExpensesCategorySchema);

export default ExpensesCategory; 
