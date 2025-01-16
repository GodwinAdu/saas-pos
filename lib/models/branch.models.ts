

import { Model, model, models, Schema } from "mongoose";

const BranchSchema: Schema<IBranch> = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String
  },
  contact: {
    type: String,
  },
  promotions: [
    {
      promoCode: { type: String, default: null },
      discountRate: { type: Number, default: null }, // Percentage discount
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
  ],
  branchSettings: {
    allowCustomReceipts: { type: Boolean, default: false },
    receiptTemplate: {
      type: String, // e.g., a template string or identifier for custom receipt designs
      default: ''
    },
    operatingHours: [
      {
        day: { type: String, default: null }, // e.g., "Monday"
        openingTime: { type: String, default: null },
        closingTime: { type: String, default: null },
      },
    ],
  },
  stockType: {
    type: String,
    enum: ["manual", "automated"],
    default: "manual",
  },
  pricingType: {
    type: String,
    enum: ["manual", "automated"],
    default: "manual",
  },
  pricingGroups: {
    wholesale: {
      type: Boolean, default: false,
    },
    retail: {
      type: Boolean, default: true,
    },
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
  }
}, {
  timestamps: true,
  versionKey: false,
});

// Define the model type
type BranchModel = Model<IBranch>;
const Branch: BranchModel = models.Branch || model<IBranch>("Branch", BranchSchema);

export default Branch