import { Model, Schema, model, models } from "mongoose";


const SuspendSchema: Schema<ISuspend> = new Schema({
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
      required: true,
    },
    price: {
      type: Number,
      required: true
    }
  }],
  description: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
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
}, { timestamps: true });

type SuspendModel = Model<ISuspend>;

const Suspend: SuspendModel = models.Suspend || model<ISuspend>("Suspend", SuspendSchema);

export default Suspend;
