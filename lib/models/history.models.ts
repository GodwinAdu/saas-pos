import { model, models, Schema } from "mongoose";


// Define an enum for action types
const actionTypes = [
  // Sales and Transactions
  'SALE_CREATED',
  'SALE_UPDATED',
  'SALE_DELETED',
  'SALE_RETURNED',
  'SALE_VOIDED',
  'SALE_DISCOUNT_APPLIED',
  'SALE_TAX_APPLIED',
  
  'PAYMENT_RECEIVED',
  'REFUND_ISSUED',

  // Inventory Management
  'PRODUCT_CREATED',
  'PRODUCT_UPDATED',
  'PRODUCT_DELETED',
  'PRODUCT_RESTORED',

  'CATEGORY_CREATED',
  'CATEGORY_UPDATED',
  'CATEGORY_DELETED',
  'CATEGORY_RESTORED',

  'VARIATION_CREATED',
  'VARIATION_UPDATED',
  'VARIATION_DELETED',
  'VARIATION_RESTORED',

  'WARRANT_CREATED',
  'WARRANT_UPDATED',
  'WARRANT_DELETED',
  'WARRANT_RESTORED',

  'STOCK_CREATED',
  'STOCK_REMOVED',
  'STOCK_TRANSFERRED',
  'STOCK_UPDATED',
  'STOCK_RESTORED',

  'UNIT_CREATED',
  'UNIT_UPDATED',
  'UNIT_DELETED',
  "UNIT_RESTORED",

  'BRANCH_CREATED',
  'BRANCH_UPDATED',
  'BRANCH_DELETED',
  'BRANCH_RESTORED',

  'BRAND_CREATED',
  'BRAND_UPDATED',
  'BRAND_DELETED',
  'BRAND_RESTORED',
  'SELLING_GROUP_CREATED',
  'SELLING_GROUP_UPDATED',
  'SELLING_GROUP_DELETED',
  'SELLING_GROUP_RESTORED',

  'SUPPLIER_CREATED',
  'SUPPLIER_UPDATED',
  'SUPPLIER_DELETED',
  'SUPPLIER_RESTORED',

  'CUSTOMER_GROUP_CREATED',
  'CUSTOMER_GROUP_UPDATED',
  'CUSTOMER_GROUP_DELETED',
  'CUSTOMER_GROUP_RESTORED',

  'STOCK_ADJUSTMENT_CREATED',
  'STOCK_ADJUSTMENT_UPDATED',
  'STOCK_ADJUSTMENT_DELETED',
  'STOCK_ADJUSTMENT_RESTORED',
  
  'STOCK_MOVEMENT_CREATED',
  'STOCK_MOVEMENT_UPDATED',
  'STOCK_MOVEMENT_DELETED',
  'STOCK_MOVEMENT_RESTORED',
  

  // Customer Management
  'CUSTOMER_CREATED',
  'CUSTOMER_UPDATED',
  'CUSTOMER_DELETED',
  'CUSTOMER_RESTORED',
  'LOYALTY_POINTS_UPDATED',

  // User and Role Management
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DELETED',
  'USER_LOGIN',
  'USER_LOGOUT',
  
  'USER_RESTORED',
  'ROLE_CREATED',
  'ROLE_UPDATED',
  'ROLE_DELETED',


  // Expense Management
  'EXPENSES_CREATED',
  'EXPENSES_UPDATED',
  'EXPENSES_DELETED',
  'EXPENSES_RESTORED',

  'EXPENSES_CATEGORY_CREATED',
  'EXPENSES_CATEGORY_UPDATED',
  'EXPENSES_CATEGORY_DELETED',
  'EXPENSES_CATEGORY_RESTORED',

  // Reports and Analytics
  'REPORT_GENERATED',
  'REPORT_DOWNLOADED',
  'DASHBOARD_VIEWED',

  // System Settings
  'SETTINGS_UPDATED',
  'TAX_UPDATED',
  'DISCOUNT_CREATED',
  'DISCOUNT_UPDATED',
  'DISCOUNT_DELETED',

  // Supplier and Purchase Management
  'SUPPLIER_CREATED',
  'SUPPLIER_UPDATED',
  'SUPPLIER_DELETED',
  'PURCHASE_ORDER_CREATED',
  'PURCHASE_ORDER_UPDATED',
  'PURCHASE_ORDER_DELETED',

  // POS Terminal Operations
  'POS_OPENED',
  'POS_CLOSED',
  'CASH_CREATED',
  'CASH_REMOVED',
  'END_OF_DAY',

  // Security and Audits
  'PASSWORD_CHANGED',
  'PASSWORD_RESET_REQUESTED',
  'LOGIN_FAILED',
  'SESSION_TERMINATED',

  // Notifications and Alerts
  'LOW_STOCK_ALERT',
  'OUT_OF_STOCK_ALERT',
  'CUSTOMER_ALERT_SENT',

  // Marketing and Promotions
  'PROMOTION_CREATED',
  'PROMOTION_UPDATED',
  'PROMOTION_DELETED',

  // Miscellaneous
  'DATA_IMPORTED',
  'DATA_EXPORTED',
  'SYSTEM_ERROR_LOGGED',
];

const historySchema = new Schema(
  {
    storeId:{
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    actionType: {
      type: String,
      enum: actionTypes,
      required: true,
    },
    details: {
      type: Schema.Types.Mixed, // For dynamic details (e.g., JSON object)
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who performed the action
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: false, // ID of the affected entity (e.g., product, sale, user)
    },
    message: {
      type: String, // Optional message about the action
    },
    entityType: {
      type: String,
      required: false, // Type of entity affected (e.g., 'Product', 'Sale', 'User')
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

const History = models.History || model('History', historySchema);

export default History;
