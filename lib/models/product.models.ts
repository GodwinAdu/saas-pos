import { Model, Schema, model, models } from "mongoose";


const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, "Name must be at least 2 characters."],
    },
    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    expiryDate: { type: Date },
    barcode: { type: String, required: true },
    sku: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    color: [{ type: String }],
    size: [{ type: String }],
    unit: [{
      type: Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    }],
    seasonalPricing: {
      startDate: { type: Date },
      endDate: { type: Date },
      price: { type: Number },
    },
    customerPricing: [
      {
        customerId: { type: String },
        price: { type: Number },
      },
    ],
    vendorPrice: {
      unitId: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        default: null,
      },
      productPrice: {
        type: Number,
      },
      productQuantity: {
        type: Number,
      }
    },
    manualPrice: [{
      tax: {
        type: Number,
        min: 0,
        default: 0,
      },
      unitId: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        default: null,
      },
      price: {
        type: Number,
        min: 0,
        default: 0,
      },
    }],
    retailPrice: {
      retailUnitId: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        default: null
      },
      retailMarkupPercentage: {
        type: Number,
        min: 0,
        default: 0,
      },
      retailSellingPrice: {
        type: Number,
        min: 0,
        default: 0,
      },
      retailMargin: {
        type: Number,
        min: 0,
        default: 0,
      },
      retailUnitQuantity: {
        type: Number,
        min: 0,
        default: 0,
      },
      retailUnitCost: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    wholesalePrice: {
      wholesaleUnitId: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        default: null
      },
      wholesaleMarkupPercentage: {
        type: Number,
        min: 0,
        default: 0
      },
      wholesaleMargin: {
        type: Number,
        min: 0,
        default: 0
      },
      wholesaleUnitQuantity: {
        type: Number,
        min: 0,
        default: 0
      },
      wholesaleUnitCost: {
        type: Number,
        min: 0,
        default: 0
      },
      wholesaleSellingPrice: {
        type: Number,
        min: 0,
        default: 0
      },
    },
    images: [{ type: String }],
    stockCalculationMethod: {
      type: String,
    },
    stock: { type: Number, default: 0, min: 0 },
    alertQuantity: { type: Number },
    salesCount: { type: Number, default: 0 },
    monthlySales: { type: Map, of: Number, default: {} },
    active: { type: Boolean, default: true },
    selling: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
    action_type: { type: String },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier" },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    lastRestocked: { type: Date },
    lastModifiedAction: { type: String, default: "Created" },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    lastModifiedDate: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
type ProductModel = Model<IProduct>

const Product: ProductModel = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;

