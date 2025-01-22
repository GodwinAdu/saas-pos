
/**
 * BranchSchema defines the schema for a branch in the system.
 * 
 * Properties:
 * - storeId: Reference to the Store object.
 * - name: Name of the branch.
 * - location: Location of the branch.
 * - manager: Manager of the branch.
 * - phone: Contact phone number of the branch.
 * - email: Contact email of the branch.
 * - description: Description of the branch.
 * - capacitySettings: Settings related to the capacity of the branch.
 *   - employeeCapacity: Maximum number of employees.
 *   - inventoryCapacity: Maximum inventory capacity.
 * - invoiceSettings: Settings related to invoices.
 *   - invoicePrefix: Prefix for invoice numbers.
 *   - nextInvoiceNumber: Next invoice number to be used.
 *   - invoiceFooter: Footer text for invoices.
 *   - termsAndConditions: Terms and conditions for invoices.
 *   - showLogo: Whether to show the logo on invoices.
 *   - showBranchAddress: Whether to show the branch address on invoices.
 *   - enablePartialPayments: Whether partial payments are enabled.
 *   - invoiceTemplate: Template to be used for invoices.
 *   - customFields: Custom fields for invoices.
 *   - lastResetDate: Date when the invoice settings were last reset.
 * - operatingHours: Array of operating hours for each day.
 *   - day: Day of the week.
 *   - openingTime: Opening time of the branch.
 *   - closingTime: Closing time of the branch.
 * - paymentSettings: Settings related to payments.
 *   - paymentMethods: Array of payment methods.
 *     - name: Name of the payment method.
 *     - enabled: Whether the payment method is enabled.
 *     - processingFee: Processing fee for the payment method.
 *     - minimumAmount: Minimum amount for the payment method.
 *   - paymentProcessors: Array of payment processors.
 *     - name: Name of the payment processor.
 *     - apiKey: API key for the payment processor.
 *     - secretKey: Secret key for the payment processor.
 *     - enabled: Whether the payment processor is enabled.
 *   - defaultCurrency: Default currency for payments.
 *   - acceptedCurrencies: Array of accepted currencies.
 *   - minimumOrderAmount: Minimum order amount.
 *   - maximumOrderAmount: Maximum order amount.
 *   - partialPayments: Whether partial payments are allowed.
 *   - installmentPayments: Whether installment payments are allowed.
 *   - installmentOptions: Array of installment options.
 *     - months: Number of months for the installment.
 *     - interestRate: Interest rate for the installment.
 * - inventorySettings: Settings related to inventory.
 *   - maxStock: Maximum stock level.
 *   - stockType: Type of stock management (manual or automated).
 *   - pricingType: Type of pricing management (manual or automated).
 *   - pricingGroups: Pricing groups for wholesale and retail.
 * - saleSettings: Settings related to sales.
 *   - taxRates: Array of tax rates.
 *     - name: Name of the tax rate.
 *     - rate: Rate of the tax.
 *   - discounts: Array of discounts.
 *   - salesTargets: Sales targets for different periods.
 *     - monthly: Monthly sales target.
 *     - quarterly: Quarterly sales target.
 *     - yearly: Yearly sales target.
 *   - commissionStructure: Array of commission structures.
 *     - salesRange: Sales range for the commission.
 *       - min: Minimum sales amount.
 *       - max: Maximum sales amount.
 *     - commissionRate: Commission rate.
 *   - promotionalCampaigns: Array of promotional campaigns.
 *   - loyaltyProgram: Settings for the loyalty program.
 *     - enabled: Whether the loyalty program is enabled.
 *     - pointsPerSpend: Points earned per spend.
 *     - redemptionRate: Redemption rate for points.
 * - reportSettings: Settings related to reports.
 *   - enabledReports: Array of enabled reports.
 *   - reportTypes: Array of report types.
 *     - name: Name of the report type.
 *     - frequency: Frequency of the report.
 *     - recipients: Array of recipients for the report.
 *   - dataRetentionPeriod: Data retention period in years.
 *   - enableDataVisualization: Whether data visualization is enabled.
 *   - preferredChartTypes: Array of preferred chart types.
 *   - enableAlerts: Whether alerts are enabled.
 *   - alertThresholds: Array of alert thresholds.
 *     - metric: Metric for the alert.
 *     - condition: Condition for the alert.
 *     - value: Value for the alert.
 *   - exportFormats: Array of export formats.
 *   - enableScheduling: Whether scheduling is enabled.
 *   - scheduledReportTime: Scheduled time for the report.
 * - createdBy: Reference to the User object who created the branch.
 * - modifiedBy: Reference to the User object who last modified the branch.
 * - mod_flag: Modification flag.
 * - del_flag: Deletion flag.
 * - action_type: Type of action performed.
 * 
 * Options:
 * - timestamps: Automatically manage createdAt and updatedAt fields.
 * - versionKey: Disable the version key (__v).
 */

import { Model, model, models, Schema, UpdateQuery } from "mongoose";

export interface InvoiceSettings {
  invoicePrefix: string;
  nextInvoiceNumber: number;
  invoiceFooter: string;
  termsAndConditions: string;
  currencies: string[];
  defaultCurrency: string;
  showLogo: boolean;
  showBranchAddress: boolean;
  enablePartialPayments: boolean;
  invoiceTemplate: string;
  numberingSequence: string;
  enableAutomaticReminders: boolean;
  reminderDays: number[];
  customFields: Record<string, any>[];
  discountRules: Record<string, any>[];
  taxRules: Record<string, any>[];
  deleteAllInvoices: boolean;
  resetInvoiceNumbering: boolean;
  lastResetDate?: Date;
}

export interface PaymentMethod {
  name: string;
  enabled: boolean;
  processingFee: number;
  minimumAmount: number;
}

export interface PaymentProcessor {
  name: string;
  apiKey: string;
  secretKey: string;
  enabled: boolean;
}

export interface PaymentSettings {
  paymentMethods: PaymentMethod[];
  paymentProcessors: PaymentProcessor[];
  defaultCurrency: string;
  acceptedCurrencies: string[];
  minimumOrderAmount: number;
  maximumOrderAmount: number;
}

export interface SaleSettings {
  taxRates: { name: string; rate: number }[];
  discounts: Record<string, any>[];
  salesTargets: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  commissionStructure: {
    salesRange: { min: number; max: number };
    commissionRate: number;
  }[];
  promotionalCampaigns: Record<string, any>[];
  loyaltyProgram: {
    enabled: boolean;
    pointsPerSpend: number;
    redemptionRate: number;
  };
}

export interface IBranch extends Document {
  _id: string;
  storeId: Schema.Types.ObjectId;
  name: string;
  location?: string| undefined;
  manager?: string| undefined
  phone?: string| undefined;
  email?: string| undefined;
  capacity?: number;
  invoiceSettings: InvoiceSettings;
  operatingHours: {
    day: string | null;
    openingTime: string | null;
    closingTime: string | null;
  }[];
  paymentSettings: PaymentSettings;
  inventorySettings: {
    stockType: "manual" | "automated";
    pricingType: "manual" | "automated";
    pricingGroups: {
      wholesale: boolean;
      retail: boolean;
    };
  };
  saleSettings: SaleSettings;
  createdBy: Schema.Types.ObjectId | null;
  modifiedBy: Schema.Types.ObjectId | null;
  mod_flag: boolean;
  del_flag: boolean;
  action_type?: string;
  createdAt: Date;
  updatedAt: Date;
}



const BranchSchema = new Schema({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  manager: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  capacitySettings: {
    employeeCapacity: {
      type: Number,
      default: 50,
    },
    inventoryCapacity: {
      type: Number,
      default: 1000,
    },

  },
  invoiceSettings: {
    invoicePrefix: {
      type: String,
      default: "INV-",
    },
    nextInvoiceNumber: {
      type: Number,
      default: 10001,
    },
    invoiceFooter: {
      type: String,
      default: "Thank you for your business!",
    },
    termsAndConditions: {
      type: String,
      default: "Payment is due within 30 days.",
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    showBranchAddress: {
      type: Boolean,
      default: true,
    },
    invoiceTemplate: {
      type: String,
      default: "standard",
    },
    lastResetDate: {
      type: Date,
    }
  },
  operatingHours: [
    {
      day: { type: String, default: null }, // e.g., "Monday"
      openingTime: { type: String, default: null },
      closingTime: { type: String, default: null },
    },
  ],
  inventorySettings: {
    maxStock: {
      type: Number,
    },
    stockType: {
      type: String,
      enum: ["manual", "automated"],
      default: "manual",
    },
    pricingType: {
      type: String,
      enum: ["manual", "automated"],
      default: "manual",
    },
    pricingGroups: {
      wholesale: {
        type: Boolean, default: false,
      },
      retail: {
        type: Boolean, default: true,
      },
    },
  },
  saleSettings: {
    taxRates: [
      {
        name: {
          type: String,
        },
        rate: {
          type: Number,
          default: 0,
        },
      }],
    discounts: {
      type: [Object],
      default: [],
    },
    salesTargets: {
      monthly: {
        type: Number,
        default: 50000,
      },
      quarterly: {
        type: Number,
        default: 150000,
      },
      yearly: {
        type: Number,
        default: 600000,
      },
    },
    commissionStructure: [
      {
        salesRange: {
          min: {
            type: Number,
            default: 0,
          }, max: {
            type: Number,
            default: 0,
          }
        },
        commissionRate: {
          type: Number,
          default: 0,
        },
      },
    ],
    promotionalCampaigns: {
      type: [Object],
      default: [],
    },
    loyaltyProgram: {
      enabled: {
        type: Boolean,
        default: false,
      },
      pointsPerSpend: {
        type: Number,
        default: 1,
      },
      redemptionRate: {
        type: Number,
        default: 0.01,
      },
    },
  },
  reportSettings: {
    enabledReports: {
      type: [String],
    },
    reportTypes: {
      type: [{
        name: { type: String, },
        frequency: { type: String, },
        recipients: { type: [String] }
      }],
    },
    dataRetentionPeriod: {
      type: Number,
      default: 1,
    },
    enableDataVisualization: {
      type: Boolean,
      default: true,
    },
    preferredChartTypes: {
      type: [String],
      default: ["bar"],
    },
    enableAlerts: {
      type: Boolean,
      default: false,
    },
    alertThresholds: [{
      metric: { type: String, },
      condition: { type: String, },
      value: { type: Number },
    }],
    exportFormats: {
      type: [String],
      default: ["pdf", "csv", "xlsx"],
    },
    enableScheduling: {
      type: Boolean,
      default: false,
    },
    scheduledReportTime: {
      type: String,
    },
  },
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

// Middleware to reset nextInvoiceNumber daily
BranchSchema.pre("save", async function (next) {
  const branch = this as unknown as IBranch;

  const today = new Date().toISOString().split("T")[0]; // Get today's date as YYYY-MM-DD
  const lastReset = branch.invoiceSettings.lastResetDate
    ? branch.invoiceSettings.lastResetDate.toISOString().split("T")[0]
    : null;

  // Reset if the dates are different or lastResetDate is null
  if (lastReset !== today) {
    branch.invoiceSettings.nextInvoiceNumber = 10001; // Reset to 10001
    branch.invoiceSettings.lastResetDate = new Date(); // Update the last reset date
  }

  next(); // Proceed with saving
});

// Key Points
// Field Explanation:

// nextInvoiceNumber: Resets to 10001 daily.
// lastResetDate: Tracks the last reset date to ensure the reset happens only once per day.
// Middleware Behavior:

// Pre-save Middleware: Resets the value when saving or updating via .save().
// Pre-update Middleware: Handles cases when findOneAndUpdate or similar methods are used.
// Date Comparison:

// The lastResetDate is compared with the current date. If they are different,
//  the nextInvoiceNumber is reset to 10001, and the lastResetDate is updated.

BranchSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const docToUpdate = await this.model.findOne(this.getQuery()).exec();

  if (docToUpdate) {
    const today = new Date().toISOString().split("T")[0];
    const lastReset = docToUpdate.invoiceSettings.lastResetDate
      ? docToUpdate.invoiceSettings.lastResetDate.toISOString().split("T")[0]
      : null;

    if (lastReset !== today) {
      // Reset nextInvoiceNumber and lastResetDate
      if (update && typeof update === 'object') {
        (update as UpdateQuery<IBranch>)["invoiceSettings.nextInvoiceNumber"] = 10001;
      }
      if (update && typeof update === 'object') {
        (update as UpdateQuery<IBranch>)["invoiceSettings.lastResetDate"] = new Date();
      }
      if (update) {
        this.setUpdate(update);
      }
    }
  }

  next(); // Proceed with the update
});



// Define the model type
type BranchModel = Model<IBranch>;
const Branch: BranchModel = models.Branch || model<IBranch>("Branch", BranchSchema);

export default Branch
