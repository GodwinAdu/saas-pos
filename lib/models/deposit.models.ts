import { model, models, Schema } from "mongoose";
import RevenueSummary from "./revenue-summary.models";

const DepositSchema = new Schema(
  {
    totalAmount: { type: Number, required: true },
    depositDate: { type: Date, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    referenceNo: { type: String },
    depositFor: {
      type: String,
    },
    depositNote: {
      type: String,
    },
    paymentDate: {
      type: Date,
      default: Date.now(),
    },
    paymentMethod: {
      type: String,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
    action_type: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DepositSchema.post("save", async function (doc) {
  try {
    const { storeId, branchId, totalAmount, paymentDate } = doc;
    // Get the first day of the month
    const startOfMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);

    await RevenueSummary.updateOne(
      { storeId, branchId, date: startOfMonth },
      { $inc: { totalRevenue: totalAmount } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Error updating revenue summary:", error);
  }
});


DepositSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      const { storeId, branchId, totalAmount, paymentDate } = doc;
      if (!storeId || !branchId || !paymentDate) {
        console.error("Missing fields in deleted sale document.");
        return;
      }

      const startOfMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 1);

      await RevenueSummary.updateOne(
        { storeId, branchId, date: startOfMonth },
        { $inc: { totalRevenue: - totalAmount } }
      );
    } catch (error) {
      console.error("Error updating revenue summary on delete:", error);
    }
  }
});

const Deposit = models.Deposit || model("Deposit", DepositSchema);

export default Deposit;
