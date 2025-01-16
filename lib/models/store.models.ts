import { Model, model, models, Schema } from "mongoose";

const StoreSchema: Schema<IStore> = new Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    ownwer:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    storeEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    storePhone: {
        type: String,
        default: null,
    },
    storeAddress: {
        type: String,
        default: null,
    },
    numberOfBranches: {
        type: Number,
        default: 0,
    },
    autoDeleteTrash: { type: Boolean, default: true }, // User's global trash preference
    paymentKeys: {
        paystackPublicKey: {
            type: String,
            default: null,
        },
        paystackSecretKey: {
            type: String,
            default: null,
        },
    },
    gmailKeys: {
        username: {
            type: String,
            default: null,
        },
        secretKey: {
            type: String,
            default: null,
        }
    },
    reporting: {
        enabledReports: [
            {
                type: String, // e.g., "Sales", "Inventory", "Customer Activity"
                default: ''
            },
        ],
        schedule: [
            {
                reportType: { type: String, default: '' }, // e.g., "Weekly Sales"
                frequency: { type: String, default: '' }, // e.g., "Weekly", "Monthly"
                lastGenerated: { type: Date, default: null },
            },
        ],
    },
    notifications: {
        lowStockAlert: { type: Boolean, default: false },
        overdueSubscriptionAlert: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: false },
    },
    subscriptionPlan: {
        period: {
            name: {
                type: String,
                default: 'Monthly',
            },
            value: {
                type: Number,
                default: 1
            }
        },
        subscriptionExpiry: {
            type: Date,
        },
        paymentStatus: {
            type: String, // e.g., "Paid", "Pending", "Overdue"
            default: 'Free Tier'
        },
    },
    branchIds: [{
        type: Schema.Types.ObjectId,
        ref: "Branch",
        default: null,
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
    }
}, {
    timestamps: true,
    versionKey: false,
});

type StoreModel = Model<IStore>;

const Store: StoreModel = models.Store || model<IStore>("Store", StoreSchema);

export default Store