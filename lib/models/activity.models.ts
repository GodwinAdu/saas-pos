import { model, Schema } from "mongoose";


const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    additionalData: { type: Map, of: Schema.Types.Mixed }, // Optional for extra details
});

const Activity = model('Activity', activitySchema);

export default Activity;
