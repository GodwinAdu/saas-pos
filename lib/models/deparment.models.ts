import { model } from "mongoose";
import { models, Schema } from "mongoose";


const DepartmentSchema = new Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
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
    },
}, { timestamps: true });

const Department = models.Department || model('Department', DepartmentSchema);

export default Department;