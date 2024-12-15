import { z } from "zod";

// Define the Role schema using Zod
export const CreateRoleSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    displayName: z.string().min(1, { message: "Display Name is required" }),
    description: z.string().optional(),
  
    // Main Access Controls
    manageAccess: z.boolean().default(false),
    manageOnlyPos: z.boolean().default(false),
    dashboard: z.boolean().default(false),
    user: z.boolean().default(false),
    product: z.boolean().default(false),
    sales: z.boolean().default(false),
    purchase: z.boolean().default(false),
    stockTransfer: z.boolean().default(false),
    stockAdjustment: z.boolean().default(false),
    expenses: z.boolean().default(false),
    paymentAccount: z.boolean().default(false),
    report: z.boolean().default(false),
  
    // Role Management
    addRole: z.boolean().default(false),
    manageRole: z.boolean().default(false),
    viewRole: z.boolean().default(false),
    editRole: z.boolean().default(false),
    deleteRole: z.boolean().default(false),
  
    // User Management
    addUser: z.boolean().default(false),
    manageUser: z.boolean().default(false),
    viewUser: z.boolean().default(false),
    editUser: z.boolean().default(false),
    deleteUser: z.boolean().default(false),
  
    // Product Management
    listProduct: z.boolean().default(false),
    addProduct: z.boolean().default(false),
    manageProduct: z.boolean().default(false),
    viewProduct: z.boolean().default(false),
    editProduct: z.boolean().default(false),
    deleteProduct: z.boolean().default(false),
  
    // Unit Management
    addUnit: z.boolean().default(false),
    manageUnit: z.boolean().default(false),
    viewUnit: z.boolean().default(false),
    editUnit: z.boolean().default(false),
    deleteUnit: z.boolean().default(false),
  
    // Brand Management
    addBrand: z.boolean().default(false),
    manageBrand: z.boolean().default(false),
    viewBrand: z.boolean().default(false),
    editBrand: z.boolean().default(false),
    deleteBrand: z.boolean().default(false),
  
    // Category Management
    addCategory: z.boolean().default(false),
    manageCategory: z.boolean().default(false),
    viewCategory: z.boolean().default(false),
    editCategory: z.boolean().default(false),
    deleteCategory: z.boolean().default(false),
  
    // Print Label Management
    addPrintLabel: z.boolean().default(false),
    managePrintLabel: z.boolean().default(false),
    viewPrintLabel: z.boolean().default(false),
  
    // Variation Management
    addVariation: z.boolean().default(false),
    manageVariation: z.boolean().default(false),
    viewVariation: z.boolean().default(false),
    editVariation: z.boolean().default(false),
    deleteVariation: z.boolean().default(false),
  
    // Product Import
    manageImportProduct: z.boolean().default(false),
  
    // Selling Group Price Management
    addSellingGroupPrice: z.boolean().default(false),
    manageSellingGroupPrice: z.boolean().default(false),
    viewSellingGroupPrice: z.boolean().default(false),
    editSellingGroupPrice: z.boolean().default(false),
    deleteSellingGroupPrice: z.boolean().default(false),
  
    // Warrant Management
    addWarrant: z.boolean().default(false),
    manageWarrant: z.boolean().default(false),
    viewWarrant: z.boolean().default(false),
    editWarrant: z.boolean().default(false),
    deleteWarrant: z.boolean().default(false),
  
    // Sales Management
    manageAllSales: z.boolean().default(false),
    addSales: z.boolean().default(false),
    manageSales: z.boolean().default(false),
    viewSales: z.boolean().default(false),
    editSales: z.boolean().default(false),
    deleteSales: z.boolean().default(false),
  
    // Order Management
    addOrder: z.boolean().default(false),
    manageOrder: z.boolean().default(false),
    viewOrder: z.boolean().default(false),
    editOrder: z.boolean().default(false),
    deleteOrder: z.boolean().default(false),
    listOrder: z.boolean().default(false),
  
    // Sales Related
    listSellReturn: z.boolean().default(false),
    importSales: z.boolean().default(false),
  
    // Purchase Management
    listPurchase: z.boolean().default(false),
    addPurchase: z.boolean().default(false),
    managePurchase: z.boolean().default(false),
    viewPurchase: z.boolean().default(false),
    editPurchase: z.boolean().default(false),
    deletePurchase: z.boolean().default(false),
    listPurchaseReturn: z.boolean().default(false),
    importPurchase: z.boolean().default(false),
  
    // Stock Transfer Management
    listStockTransfer: z.boolean().default(false),
    addStockTransfer: z.boolean().default(false),
    manageStockTransfer: z.boolean().default(false),
    viewStockTransfer: z.boolean().default(false),
    editStockTransfer: z.boolean().default(false),
    deleteStockTransfer: z.boolean().default(false),
  
    // Stock Adjustment Management
    listStockAdjustment: z.boolean().default(false),
    addStockAdjustment: z.boolean().default(false),
    manageStockAdjustment: z.boolean().default(false),
    viewStockAdjustment: z.boolean().default(false),
    editStockAdjustment: z.boolean().default(false),
    deleteStockAdjustment: z.boolean().default(false),
  
    // Expenses Category Management
    addExpensesCategory: z.boolean().default(false),
    manageExpensesCategory: z.boolean().default(false),
    viewExpensesCategory: z.boolean().default(false),
    editExpensesCategory: z.boolean().default(false),
    deleteExpensesCategory: z.boolean().default(false),
  
    // Expenses Management
    addExpenses: z.boolean().default(false),
    manageExpenses: z.boolean().default(false),
    viewExpenses: z.boolean().default(false),
    editExpenses: z.boolean().default(false),
    deleteExpenses: z.boolean().default(false),
    listExpenses: z.boolean().default(false),
  
    // List Account Management
    addListAccount: z.boolean().default(false),
    manageListAccount: z.boolean().default(false),
    viewListAccount: z.boolean().default(false),
    editListAccount: z.boolean().default(false),
    deleteListAccount: z.boolean().default(false),
  
    // Reports Access
    balanceSheet: z.boolean().default(false),
    trialBalance: z.boolean().default(false),
    cashFlow: z.boolean().default(false),
    paymentAccountReport: z.boolean().default(false),
    profitLostReport: z.boolean().default(false),
    itemsReport: z.boolean().default(false),
    registerReport: z.boolean().default(false),
    expensesReport: z.boolean().default(false),
    productSellReport: z.boolean().default(false),
    productPurchaseReport: z.boolean().default(false),
    sellReturnReport: z.boolean().default(false),
    purchaseReturnReport: z.boolean().default(false),
    stockTransferReport: z.boolean().default(false),
    stockAdjustmentReport: z.boolean().default(false),
    salesReport: z.boolean().default(false),
    purchaseReport: z.boolean().default(false),
    trendingProductReport: z.boolean().default(false),
    stockExpiryReport: z.boolean().default(false),
    stockReport: z.boolean().default(false),
    taxReport: z.boolean().default(false),
    saleRepresentativeReport: z.boolean().default(false),
    customerSupplierReport: z.boolean().default(false),
  
  });
  