import { Model, model, models, Schema } from "mongoose";


const VariationSchema:Schema<IVariation> = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    branchIds: {
        type: [Schema.Types.ObjectId],
        ref: "Branch",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    variations: [{ type: String }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

type VariationModel = Model<IVariation>

const Variation:VariationModel = models.Variation || model<IVariation>('Variation', VariationSchema);

export default Variation;