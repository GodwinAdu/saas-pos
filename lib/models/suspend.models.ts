import { model, models, Schema } from "mongoose";


const SuspendSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
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
    date:{
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    reason: {
        type: String,
        required: true,
    },

},{
    timestamps: true,
    versionKey: false,
});

const Suspend = models.Suspend || model('Suspend',SuspendSchema);

export default Suspend;