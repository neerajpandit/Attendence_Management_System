import mongoose from "mongoose";
import { Schema } from "mongoose";
const billSchema = new Schema(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
        },
        billNo: {
            type: String, // Unique invoice number (can auto-generate like INV-0001)
            unique: true,
        },
        client: {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String },
            address: {
                line1: { type: String },
                line2: { type: String },
                city: { type: String },
                state: { type: String },
                country: { type: String },
                pincode: { type: String },
            },
            gstin: { type: String }, // if applicable
            customFields: [
                {
                    fieldName: { type: String },
                    fieldValue: { type: String },
                },
            ],
        },

        items: [
            {
                description: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                unit: { type: String, default: "pcs" }, // kg, hours, service, etc.
                unitPrice: { type: Number, required: true },
                discount: {
                    type: {
                        method: {
                            type: String,
                            enum: ["flat", "percent"],
                            default: "flat",
                        },
                        value: { type: Number, default: 0 },
                    },
                    default: {},
                },
                tax: {
                    type: {
                        type: String,
                        enum: ["GST", "VAT", "None"],
                        default: "None",
                    },
                    rate: { type: Number, default: 0 },
                    amount: { type: Number, default: 0 },
                },

                total: { type: Number, required: true }, // qty * unitPrice - discount + tax
            },
        ],

        summary: {
            subtotal: { type: Number, required: true },
            discount: {
                method: {
                    type: String,
                    enum: ["flat", "percent"],
                    default: "flat",
                },
                value: { type: Number, default: 0 },
                amount: { type: Number, default: 0 }, // calculated discount
            },
            tax: {
                type: {
                    type: String,
                    enum: ["GST", "VAT", "None"],
                    default: "None",
                },
                rate: { type: Number, default: 0 },
                amount: { type: Number, default: 0 },
            },
            shippingCharges: { type: Number, default: 0 },
            otherCharges: [
                {
                    name: { type: String },
                    amount: { type: Number, default: 0 },
                },
            ],
            grandTotal: { type: Number, required: true },
            paidAmount: { type: Number, default: 0 },
            dueAmount: { type: Number, default: 0 },
            currency: { type: String, default: "INR" },
        },

        payment: {
            method: {
                type: String,
                enum: [
                    "cash",
                    "card",
                    "upi",
                    "bankTransfer",
                    "cheque",
                    "other",
                ],
                default: "cash",
            },
            status: {
                type: String,
                enum: ["unpaid", "partial", "paid", "refunded"],
                default: "unpaid",
            },
            transactionId: { type: String },
            paymentDate: { type: Date },
        },

        notes: { type: String },
        terms: { type: String },

        status: {
            type: String,
            enum: ["draft", "issued", "overdue", "cancelled"],
            default: "draft",
        },

        dueDate: { type: Date },
        issueDate: { type: Date, default: Date.now },

        attachments: [
            {
                fileName: { type: String },
                fileUrl: { type: String },
            },
        ],

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Bill = mongoose.model("Bill", billSchema);
