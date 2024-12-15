import { model, Schema, models } from 'mongoose';

const trashSchema = new Schema({
    storeId:{
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    originalCollection: { type: String, required: true },
    document: { type: Schema.Types.Mixed, required: true },
    message: { type: String },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: Date.now },
    autoDelete: { type: Boolean, default: false }, // Defaults will be set dynamically
},{
    timestamps: true,
    versionKey: false,
});

// TTL index applies only to documents where autoDelete is true
trashSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 2592000, partialFilterExpression: { autoDelete: true } });

const Trash = models.Trash || model('Trash', trashSchema);

export default Trash;