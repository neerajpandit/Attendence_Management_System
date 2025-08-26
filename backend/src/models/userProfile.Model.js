import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: false,
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            postalCode: { type: String, trim: true },
            country: { type: String, trim: true },
        },
        phoneNo: {
            type: String,
            trim: true,
            required: false,
        },
        designation: {
            type: String,
            trim: true,
            required: false,
        },
        department: {
            type: String,
            trim: true,
            required: false,
        },
        joiningDate: {
            type: Date,
            required: false,
        },
        emergencyContact: {
            name: { type: String, trim: true },
            phone: { type: String, trim: true },
            relationship: { type: String, trim: true },
        },
        managerId: {
            type: Schema.Types.ObjectId,
            ref: "userAuth",
            required: false,
        },
        profilePicture: {
            type: String,
            trim: true,
            required: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Profile = mongoose.model("Profile", profileSchema);
