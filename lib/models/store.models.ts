import { Model, model, models, Schema, Document } from "mongoose";

interface IStore extends Document {
    name: string;
    avatar?: string;
    owner: Schema.Types.ObjectId;
    storeEmail: string;
    storePhone?: string;
    storeAddress?: string;
    numberOfBranches?: number;
    autoDeleteTrash?: boolean;
    twilo?: {
        accountSid?: string;
        authToken?: string;
        phone?: string;
    };
    gmailKeys?: {
        username?: string;
        secretKey?: string;
    };
    reporting?: {
        enabledReports?: string[];
        schedule?: {
            reportType?: string;
            frequency?: string;
            lastGenerated?: Date;
        }[];
    };
    notifications?: {
        lowStockAlert?: boolean;
        overdueSubscriptionAlert?: boolean;
        emailNotifications?: boolean;
    };
    subscriptionPlan?: {
        period?: {
            name?: string;
            value?: number;
        };
        subscriptionExpiry?: Date;
        paymentStatus?: string;
    };
    paymentSettings?: {
        paymentMethods?: {
            name?: string;
            enabled?: boolean;
            processingFee?: number;
            minimumAmount?: number;
        }[];
        paymentProcessors?: {
            name?: string;
            apiKey?: string;
            secretKey?: string;
            enabled?: boolean;
        }[];
        defaultCurrency?: string;
        acceptedCurrencies?: string[];
        minimumOrderAmount?: number;
        maximumOrderAmount?: number;
        partialPayments?: boolean;
        installmentPayments?: boolean;
        installmentOptions?: {
            months?: number;
            interestRate?: number;
        }[];
    };
    branchIds?: Schema.Types.ObjectId[];
    createdBy?: Schema.Types.ObjectId;
    modifiedBy?: Schema.Types.ObjectId;
    mod_flag?: boolean;
    del_flag?: boolean;
    action_type?: string;
}

const StoreSchema: Schema<IStore> = new Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    owner: {
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
    twilo: {
        accountSid: {
            type: String,
            default: null,
        },
        authToken: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
        }
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
    paymentSettings: {
        paymentMethods: [
            {
                name: {
                    type: String,
                    default: "Cash",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
            {
                name: {
                    type: String,
                    default: "Card",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
            {
                name: {
                    type: String,
                    default: "Gift Card",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
            {
                name: {
                    type: String,
                    default: "Paystack OR",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
            {
                name: {
                    type: String,
                    default: "Paystack Link",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
            {
                name: {
                    type: String,
                    default: "MoMo",
                },
                enabled: {
                    type: Boolean,
                    default: true,
                },
                processingFee: {
                    type: Number,
                    default: 0,
                },
                minimumAmount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        paymentProcessors: [
            {
                name: {
                    type: String,
                    default: "Paystack"
                },
                apiKey: {
                    type: String,
                    default: "",
                },
                secretKey: {
                    type: String,
                    default: "",
                },
                enabled: {
                    type: Boolean,
                    default: false,
                },
            },

        ],
        defaultCurrency: {
            type: String,
            default: "GHS",
        },
        acceptedCurrencies: {
            type: [String],
            default: ["GHS"],
        },
        minimumOrderAmount: {
            type: Number,
            default: 0,
        },
        maximumOrderAmount: {
            type: Number,
            default: 10000,
        },
        partialPayments: {
            type: Boolean,
            default: false,
        },
        installmentPayments: {
            type: Boolean,
            default: false,
        },
        installmentOptions: [
            {
                months: {
                    type: Number,
                },
                interestRate: {
                    type: Number,
                },
            },
        ],
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