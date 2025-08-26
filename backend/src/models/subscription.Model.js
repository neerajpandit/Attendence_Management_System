const subscriptionSchema = new Schema(
    {
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: true,
            unique: true,
        },
        plan: {
            type: String,
            enum: ["free", "basic", "premium"],
            default: "free",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "expired"],
            default: "active",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


export const Subscription = mongoose.model("Subscription", subscriptionSchema);
