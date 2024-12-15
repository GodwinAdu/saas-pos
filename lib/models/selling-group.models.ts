import { model, Model, models, Schema } from "mongoose";


const SellingGroupSchema:Schema<ISellingGroup> = new Schema({
    name:{
        type: String,
        required: true,
    },
    storeId:{
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    active:{
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
},{
    timestamps: true,
    versionKey: false,
});

type SellingGroupModel = Model<ISellingGroup>

const SellingGroup: SellingGroupModel = models.SellingGroup || model<ISellingGroup>("SellingGroup", SellingGroupSchema);

export default SellingGroup;