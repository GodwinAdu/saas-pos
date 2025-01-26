
import { models, Schema, model, UpdateQuery } from "mongoose";
import RevenueSummary from "./revenue-summary.models";


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
        totalQuantity:{
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
SaleSchema.post("save", async function (doc) {
    try {
        const { storeId, branchId, totalAmount, saleDate } = doc;
        // Get the first day of the month
        const startOfMonth = new Date(saleDate.getFullYear(), saleDate.getMonth(), 1);

        await RevenueSummary.updateOne(
            { storeId, branchId, date: startOfMonth },
            { $inc: { totalRevenue: totalAmount } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Error updating revenue summary:", error);
    }
});

SaleSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        try {
            const originalAmount = doc.totalAmount || 0;
            const update = this.getUpdate() as UpdateQuery<typeof doc>;
            const updatedAmount = update.totalAmount || 0;
            const difference = updatedAmount - originalAmount;

            const { storeId, branchId, saleDate } = doc;
            const startOfMonth = new Date(saleDate.getFullYear(), saleDate.getMonth(), 1);

            if (difference !== 0) {
                await RevenueSummary.updateOne(
                    { storeId, branchId, date: startOfMonth },
                    { $inc: { totalRevenue: difference } }
                );
            }
        } catch (error) {
            console.error("Error updating revenue summary on edit:", error);
        }
    }
});


SaleSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        try {
            const { storeId, branchId, totalAmount, saleDate } = doc;
            if (!storeId || !branchId || !saleDate) {
                console.error("Missing fields in deleted sale document.");
                return;
            }

            const startOfMonth = new Date(saleDate.getFullYear(), saleDate.getMonth(), 1);

            await RevenueSummary.updateOne(
                { storeId, branchId, date: startOfMonth },
                { $inc: { totalRevenue: - totalAmount } }
            );
        } catch (error) {
            console.error("Error updating revenue summary on delete:", error);
        }
    }
});




const Sale = models.Sale || model('Sale', SaleSchema);

export default Sale;