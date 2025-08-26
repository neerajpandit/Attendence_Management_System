import mongoose, { Schema } from "mongoose";

const businessSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
            trim: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
            unique: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
export const Business = mongoose.model("Business", businessSchema);