import { model, models, Schema } from "mongoose";


const StockAdjustmentSchema = new Schema({
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
    referenceNo: {
        type: String,
    },
    adjustmentDate: {
        type: Date,
        default: Date.now,
    },
    adjustmentType: {
        type: String,
        enum: ['normal', 'abnormal', 'remove']
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        unit: {
            type: Schema.Types.ObjectId,
            ref: 'Unit',
        },
        quantity: {
            type: Number,
        },
        unitPrice: {
            type: Number,
        },
        totalQuantity: {
            type: Number,
        },
        subTotal: {
            type: Number,
        }
    }],
    totalAmount: {
        type: Number,
    },
    reason: {
        type: String,
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
}, {
    timestamps: true,
    versionKey: false,
});

const StockAdjustment = models.StockAdjustment || model('StockAdjustment', StockAdjustmentSchema);

export default StockAdjustment;