import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // e.g., "Free Trial", "Basic", "Premium"
    },
    durationDays: {
        type: Number,
        required: true, // 14, 30, etc.
    },
    price: {
        type: Number,
        default: 0, // 0 for free trial
    },
    features: [
        {
            type: String,
        },
    ],
});

export const Plan = mongoose.model("Plan", planSchema);
