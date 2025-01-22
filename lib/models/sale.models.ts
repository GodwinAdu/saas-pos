
import { models, Schema, model } from "mongoose";


const SaleSchema = new Schema({
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
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    payTerms: {
        type: String,
    },
    saleDate: {
        type: Date,
        default: Date.now,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        default: null
    },
    invoiceNo: {
        type: String,
    },
    discountAmount: {
        type: Number,
    },
    taxAmount: {
        type: Number,
    },
    sellNote: {
        type: String,
    },
    shippingDetails: {
        type: String,
    },
    shippingAddress: {
        type: String,
    },
    shippingCharges: {
        type: Number,
    },
    shippingStatus: {
        type: String,
    },
    deliveryTo: {
    },
    paymentAmount: {
        type: Number,
        default: 0
    },
    paymentDate: {
        type: Date,
        default: Date.now(),
    },
    paymentMethod: {
        type: String,
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
        subTotal: {
            type: Number,
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
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


const Sale = models.Sale || model('Sale', SaleSchema);

export default Sale;