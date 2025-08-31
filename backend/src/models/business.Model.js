import mongoose from "mongoose";
const { Schema } = mongoose;

const businessSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ["shop", "school", "construction", "service", "other"],
            default: "other",
        },
        logo: {
            type: String, // path/URL of business logo
        },
        billTemplate: {
            header: { type: String, default: "" },
            footer: { type: String, default: "" },
            colorTheme: { type: String, default: "#000000" },
            includeGST: { type: Boolean, default: false },
            customFields: [
                {
                    fieldName: { type: String }, // e.g., "PAN No.", "GSTIN", "Branch Code"
                    fieldValue: { type: String },
                },
            ],
        },
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            pincode: { type: String },
        },
        contact: {
            phone: { type: String },
            email: { type: String },
            website: { type: String },
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Business = mongoose.model("Business", businessSchema);
