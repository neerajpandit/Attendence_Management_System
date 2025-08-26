import mongoose, { Schema } from "mongoose";

const SuperAdminProfileSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
    },
);

export const SuperAdminProfile = mongoose.model("SuperAdminProfile", SuperAdminProfileSchema);