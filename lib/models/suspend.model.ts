import { Schema, model, models } from "mongoose";

const SuspendSchema = new Schema({
  products: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    unit: {
      type: String,
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
  description:{type: String},
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

const Suspend = models.Suspend || model("Suspend", SuspendSchema);

export default Suspend;
