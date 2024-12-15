
import { Schema, models, model,Model } from "mongoose";


const BrandSchema:Schema<IBrand> = new Schema({
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
});

type BrandModel = Model<IBrand>

const Brand:BrandModel = models.Brand || model<IBrand>("Brand", BrandSchema);

export default Brand;