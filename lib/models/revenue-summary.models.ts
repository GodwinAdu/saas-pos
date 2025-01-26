import { Schema, model, models } from "mongoose";

const RevenueSummarySchema = new Schema(
    {
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
        date: {
            type: Date,
            required: true,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false }
);

const RevenueSummary = models.RevenueSummary || model("RevenueSummary", RevenueSummarySchema);

export default RevenueSummary;
