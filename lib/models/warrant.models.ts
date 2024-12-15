import { Model, model, models, Schema } from "mongoose";


const WarrantSchema: Schema<IWarrant> = new Schema({
    name: {
        type: String,
        required: true,
    },
    warrant: {
        type: String,
        required: true,
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store"
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
    },

}, {
    timestamps: true,
    versionKey: false,
});

type WarrantModel = Model<IWarrant>

const Warrant: WarrantModel = models.Warrant || model<IWarrant>('Warrant', WarrantSchema);

export default Warrant;