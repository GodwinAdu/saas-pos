
// Define the IRole interface
interface IRole extends Document {
    _id: string;
    storeId: ObjectId;
    name: string;
    displayName: string;
    description?: string;
    manageAccess?: boolean;
    manageOnlyPos?: boolean;
    dashboard?: boolean;
    user?: boolean;
    product?: boolean;
    sales?: boolean;
    purchase?: boolean;
    stockTransfer?: boolean;
    stockAdjustment?: boolean;
    expenses?: boolean;
    paymentAccount?: boolean;
    report?: boolean;
    addRole?: boolean;
    manageRole?: boolean;
    viewRole?: boolean;
    editRole?: boolean;
    deleteRole?: boolean;
    addUser?: boolean;
    manageUser?: boolean;
    viewUser?: boolean;
    editUser?: boolean;
    deleteUser?: boolean;
    listProduct?: boolean;
    addProduct?: boolean;
    manageProduct?: boolean;
    viewProduct?: boolean;
    editProduct?: boolean;
    deleteProduct?: boolean;
    addUnit?: boolean;
    manageUnit?: boolean;
    viewUnit?: boolean;
    editUnit?: boolean;
    deleteUnit?: boolean;
    addBrand?: boolean;
    manageBrand?: boolean;
    viewBrand?: boolean;
    editBrand?: boolean;
    deleteBrand?: boolean;
    addCategory?: boolean;
    manageCategory?: boolean;
    viewCategory?: boolean;
    editCategory?: boolean;
    deleteCategory?: boolean;
    addPrintLabel?: boolean;
    managePrintLabel?: boolean;
    viewPrintLabel?: boolean;
    addVariation?: boolean;
    manageVariation?: boolean;
    viewVariation?: boolean;
    editVariation?: boolean;
    deleteVariation?: boolean;
    manageImportProduct?: boolean;
    addSellingGroupPrice?: boolean;
    manageSellingGroupPrice?: boolean;
    viewSellingGroupPrice?: boolean;
    editSellingGroupPrice?: boolean;
    deleteSellingGroupPrice?: boolean;
    addWarrant?: boolean;
    manageWarrant?: boolean;
    viewWarrant?: boolean;
    editWarrant?: boolean;
    deleteWarrant?: boolean;
    manageAllSales?: boolean;
    addSales?: boolean;
    manageSales?: boolean;
    viewSales?: boolean;
    editSales?: boolean;
    deleteSales?: boolean;
    addOrder?: boolean;
    manageOrder?: boolean;
    viewOrder?: boolean;
    editOrder?: boolean;
    deleteOrder?: boolean;
    listOrder?: boolean;
    listSellReturn?: boolean;
    importSales?: boolean;
    listPurchase?: boolean;
    addPurchase?: boolean;
    managePurchase?: boolean;
    viewPurchase?: boolean;
    editPurchase?: boolean;
    deletePurchase?: boolean;
    listPurchaseReturn?: boolean;
    importPurchase?: boolean;
    listStockTransfer?: boolean;
    addStockTransfer?: boolean;
    manageStockTransfer?: boolean;
    viewStockTransfer?: boolean;
    editStockTransfer?: boolean;
    deleteStockTransfer?: boolean;
    listStockAdjustment?: boolean;
    addStockAdjustment?: boolean;
    manageStockAdjustment?: boolean;
    viewStockAdjustment?: boolean;
    editStockAdjustment?: boolean;
    deleteStockAdjustment?: boolean;
    addExpensesCategory?: boolean;
    manageExpensesCategory?: boolean;
    viewExpensesCategory?: boolean;
    editExpensesCategory?: boolean;
    deleteExpensesCategory?: boolean;
    addExpenses?: boolean;
    manageExpenses?: boolean;
    viewExpenses?: boolean;
    editExpenses?: boolean;
    deleteExpenses?: boolean;
    listExpenses?: boolean;
    addListAccount?: boolean;
    manageListAccount?: boolean;
    viewListAccount?: boolean;
    editListAccount?: boolean;
    deleteListAccount?: boolean;
    balanceSheet?: boolean;
    trialBalance?: boolean;
    cashFlow?: boolean;
    paymentAccountReport?: boolean;
    profitLostReport?: boolean;
    itemsReport?: boolean;
    registerReport?: boolean;
    expensesReport?: boolean;
    productSellReport?: boolean;
    productPurchaseReport?: boolean;
    sellReturnReport?: boolean;
    purchaseReturnReport?: boolean;
    stockTransferReport?: boolean;
    stockAdjustmentReport?: boolean;
    salesReport?: boolean;
    purchaseReport?: boolean;
    trendingProductReport?: boolean;
    stockExpiryReport?: boolean;
    stockReport?: boolean;
    taxReport?: boolean;
    saleRepresentativeReport?: boolean;
    customerSupplierReport?: boolean;
    createdBy?: Schema.Types.ObjectId;
    mod_flag?: boolean;
    delete_flag?: boolean;
    modifyBy?: Schema.Types.ObjectId;
    deletedBy?: Schema.Types.ObjectId;
    action_type?: string;
}
interface IUnit extends Document {
    _id: string;
    storeId: ObjectId;
    branchIds: ObjectId[];
    name: string;
    quantity: number;
    active: boolean;
    createdBy: ObjectId;
    modifiedBy: ObjectId;
    mod_flag: boolean;
    del_flag: boolean;
    deletedBy: ObjectId;
    action_type: string;
    createdAt: Date;
    updatedAt: Date;

}

interface IBrand extends Document {
    _id: string;
    storeId: ObjectId;
    branchIds: [ObjectId];
    name: string;
    active: boolean;
    createdBy: ObjectId;
    modifiedBy: ObjectId;
    mod_flag: boolean;
    del_flag: boolean;
    deletedBy: ObjectId;
    action_type: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ICategory extends Document {
    _id: string;
    storeId: ObjectId;
    branchIds: ObjectId[];
    name: string;
    active: boolean;
    createdBy: ObjectId;
    modifiedBy: ObjectId;
    mod_flag: boolean;
    del_flag: boolean;
    deletedBy: ObjectId;
    action_type: string;
    createdAt: Date;
    updatedAt: Date;
}
interface IExpensesCategory extends Document {
    _id: string;
    storeId: ObjectId;
    branchIds: ObjectId[];
    name: string;
    active: boolean;
    createdBy: ObjectId;
    modifiedBy: ObjectId;
    mod_flag: boolean;
    del_flag: boolean;
    deletedBy: ObjectId;
    action_type: string;
    createdAt: Date;
    updatedAt: Date;
}



interface IBranch extends Document {
    _id: string;
    storeId: ObjectId; // Reference to the Store model
    name: string;      // Name of the branch
    promotions: {
        promoCode: string;
        discountRate: number;
        startDate: Date;
        endDate: Date;
    };
    branchSettings: {
        allowCustomReceipts: boolean;
        receiptTemplate: string;
        operatingHours: {
            day: string;
            openingTime: string;
            closingTime: string;
        }[];
    };
    stockType: "manual" | "automated";
    pricingType: "manual" | "automated";
    pricingGroups: {
        wholesale: boolean;
        retail: boolean;
    };
    createdBy?: ObjectId | null; // Reference to the User model who created the branch
    modifiedBy?: ObjectId | null; // Reference to the User model who modified the branch
    mod_flag?: boolean; // Modification flag (default: false)
    del_flag?: boolean; // Deletion flag (default: false)
    action_type?: string; // Type of action performed (e.g., "created", "updated")
    createdAt?: Date; // Timestamp for creation (added automatically)
    updatedAt?: Date; // Timestamp for the last update (added automatically)
}


interface IStore extends Document {
    _id: string;
    name: string;      // Name of the branch
    avatar: string; //
    numberOfBranches: number;
    storeEmail: string; // Email
    storePhone: string; // Phone number
    storeAddress: string; // Address
    numberOfBranches: number;
    autoDeleteTrash: boolean;
    paymentKeys: {
        paystackPublicKey?: string;
        paystackSecretKey?: string;
    };
    gmailKeys: {
        username: string | null;
        secretKey: string | null;
    }
    notifications: {
        lowStockAlert: boolean;
        overdueSubscriptionAlert: boolean;
        emailNotifications: boolean;
    },
    reporting: {
        enabledReports: string[]
        schedule: {
            reportType: string;
            frequency: string;
            lastGenerated: Date;
        }[];
    };
    subscriptionPlan: {
        period: {
            name: string;
            value: number;
        };
        subscriptionExpiry: Date
        paymentStatus: string;
    };
    branchIds: ObjectId[];
    createdBy?: ObjectId | null; // Reference to the User model who created the branch
    modifiedBy?: ObjectId | null; // Reference to the User model who modified the branch
    mod_flag?: boolean; // Modification flag (default: false)
    del_flag?: boolean; // Deletion flag (default: false)
    action_type?: string; // Type of action performed (e.g., "created", "updated")
    createdAt?: Date; // Timestamp for creation (added automatically)
    updatedAt?: Date; // Timestamp for the last update (added automatically)
}

interface WorkSchedule extends Document {
    day: "Monday" | "Tuesday" | " Wednesday " | "Thursday" | "Friday" | "Saturday" | "Sunday";
    startTime: string;
    endTime: string;
}

interface IUser extends Document {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    emergencyNumber: string;
    password: string;
    dob: Date;
    role: string;
    avatarUrl?: string | null;
    isActive: boolean;
    availableAllSchedule: boolean;
    jobTitle: string;
    address?: {
        street?: string | null;
        city?: string | null;
        state?: string | null;
        country?: string | null;
        postalCode?: string | null;
    };
    workSchedule: WorkSchedule[];
    cardDetails: {
        idCardType: "ID Card" | "Passport" | "Driving License";
        idCardNumber: string;
    }
    accountDetails: {
        accountName: string;
        accountNumber: string;
        accountType: string;
        commissionRate: number;
        salesTarget: number;
    }
    startDate: Date;
    isVerified: boolean;
    isBanned: boolean;
    isFreezed: boolean;
    storeId: ObjectId;
    departmentId: ObjectId;
    accessLocation: ObjectId[];
    createdBy?: ObjectId | null; // ID of the user who created this account
    modifiedBy?: ObjectId | null; // Reference to the User model who modified the branch
    mod_flag?: boolean; // Modification flag (default: false)
    del_flag?: boolean; // Deletion flag (default: false)
    action_type?: string; // Type of action performed (e.g., "created", "updated")
    lastLogin?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IWarrant extends Document {
    _id: string;
    name: string;
    warrant: string;
    storeId: ObjectId; // Reference to the Store model
    createdBy?: ObjectId | null; // Reference to the User model who created the branch
    modifiedBy?: ObjectId | null; // Reference to the User model who modified the branch
    mod_flag?: boolean; // Modification flag (default: false)
    del_flag?: boolean; // Deletion flag (default: false)
    action_type?: string; // Type of action performed (e.g., "created", "updated")
    createdAt?: Date; // Timestamp for creation (added automatically)
    updatedAt?: Date; // Timestamp for the last update (added automatically)
}

interface IVariation extends Document {
    _id: string;
    name: string;
    storeId: ObjectId; // Reference to the Store model
    branchIds: ObjectId[];
    variations: string[];
    createdBy?: ObjectId | null; // Reference to the User model who created the branch
    modifiedBy?: ObjectId | null; // Reference to the User model who modified the branch
    mod_flag?: boolean; // Modification flag (default: false)
    del_flag?: boolean; // Deletion flag (default: false)
    action_type?: string; // Type of action performed (e.g., "created", "updated")
    createdAt?: Date; // Timestamp for creation (added automatically)
    updatedAt?: Date; // Timestamp for the last update (added automatically)
}

interface ISellingGroup extends Document {
    name: string;
    storeId: ObjectId;
    active: boolean;
    createdBy: ObjectId; //
    modifiedBy: string | null;
    mod_flag: boolean;
    del_flag: boolean;
    action_type: string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

interface SeasonalPricing {
    startDate?: Date;
    endDate?: Date;
    price?: number;
}

interface CustomerPricing {
    customerId: string;
    price: number;
}

interface VendorPrice {
    unitId?: Types.ObjectId;
    productPrice?: number;
    productQuantity?: number;
}

interface ManualPrice {
    tax?: number;
    unitId?: Types.ObjectId;
    price?: number;
}

interface RetailPrice {
    retailUnitId?: Types.ObjectId;
    retailMarkupPercentage?: number;
    retailSellingPrice?: number;
    retailMargin?: number;
    retailUnitQuantity?: number;
    retailUnitCost?: number;
}

interface WholesalePrice {
    wholesaleUnitId?: Types.ObjectId;
    wholesaleMarkupPercentage?: number;
    wholesaleMargin?: number;
    wholesaleUnitQuantity?: number;
    wholesaleUnitCost?: number;
    wholesaleSellingPrice?: number;
}

interface IProduct extends Document {
    name: string;
    brandId?: Types.ObjectId;
    categoryId?: Types.ObjectId;
    expiryDate?: Date;
    barcode: string;
    sku: string;
    description?: string;
    tags?: string[];
    color?: string[];
    size?: string[];
    unit?: Types.ObjectId[];
    seasonalPricing?: SeasonalPricing;
    customerPricing?: CustomerPricing[];
    vendorPrice?: VendorPrice;
    manualPrice?: ManualPrice[];
    retailPrice?: RetailPrice;
    wholesalePrice?: WholesalePrice;
    images?: string[];
    stockCalculationMethod?: string;
    stock?: number;
    alertQuantity?: number;
    salesCount?: number;
    monthlySales?: Map<string, number>;
    active?: boolean;
    selling?: boolean;
    createdBy?: Types.ObjectId;
    modifiedBy?: Types.ObjectId;
    mod_flag?: boolean;
    del_flag?: boolean;
    action_type?: string;
    supplierId?: Types.ObjectId;
    warehouseId?: Types.ObjectId;
    lastRestocked?: Date;
    lastModifiedAction?: string;
    lastModifiedBy?: Types.ObjectId;
    lastModifiedDate?: Date;
}


interface ITrash extends Document {
    storeId: Types.ObjectId;
    originalCollection: string;
    document: any;
    message?: string;
    deletedBy?: Types.ObjectId;
    deletedAt?: Date;
    autoDelete?: boolean;
}

// suspend types
interface Product {
    productId: Types.ObjectId;
    unit?: string;
    quantity: number;
    price: number;
}

interface ISuspend extends Document {
    storeId: Types.ObjectId;
    branchId: Types.ObjectId;
    customerId: Types.ObjectId;
    products: Product[];
    description?: string;
    date: Date;
    createdBy?: Types.ObjectId;
    modifiedBy?: Types.ObjectId;
    mod_flag?: boolean;
    del_flag?: boolean;
    action_type?: string;
}




type BranchIdParams = Promise<{ branchId: string }>
type StoreIdParams = Promise<{ storeId: string }>