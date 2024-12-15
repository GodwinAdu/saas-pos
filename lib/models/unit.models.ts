import { Schema, models, model, Model } from "mongoose";


const UnitSchema: Schema<IUnit> = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "store",
        required: true
    },
    branchIds: {
        type: [Schema.Types.ObjectId],
        ref: "branch",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: false,
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

type UnitModel = Model<IUnit>

const Unit: UnitModel = models.Unit || model<IUnit>("Unit", UnitSchema);

export default Unit;