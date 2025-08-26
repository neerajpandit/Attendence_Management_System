// controllers/subscriptionController.js
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.Model.js";
import { Plan } from "../models/plan.Model.js";
import { Business } from "../models/business.Model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// ------------------ USER: Choose a plan ------------------
export const choosePlan = asyncHandler(async (req, res) => {
    const { businessId, planId, startDate } = req.body;

    if (!businessId || !planId || !startDate) {
        throw new ApiError(
            400,
            "businessId, planId, and startDate are required"
        );
    }

    const business = await Business.findById(businessId);
    if (!business) throw new ApiError(404, "Business not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    // Calculate endDate from plan duration (e.g., days)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (plan.durationDays || 30));

    const subscription = await Subscription.create({
        businessId,
        planId,
        price: plan.price,
        status: "active",
        startDate,
        endDate,
    });

    res.status(201).json(
        new ApiResponse(201, subscription, "Plan chosen successfully")
    );
});

// ------------------ ADMIN: Assign/Update a plan ------------------
export const assignPlan = asyncHandler(async (req, res) => {
    const { businessId, planId } = req.body;

    if (!businessId || !planId) {
        throw new ApiError(400, "businessId and planId are required");
    }

    const business = await Business.findById(businessId);
    if (!business) throw new ApiError(404, "Business not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new ApiError(404, "Plan not found");

    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + (plan.durationDays || 30));

    let subscription = await Subscription.findOne({ businessId });

    if (subscription) {
        // Update existing subscription
        subscription.planId = planId;
        subscription.price = plan.price;
        subscription.status = "active";
        subscription.startDate = now;
        subscription.endDate = endDate;
        await subscription.save();
    } else {
        // Create new subscription
        subscription = await Subscription.create({
            businessId,
            planId,
            price: plan.price,
            status: "active",
            startDate: now,
            endDate,
        });
    }

    res.status(200).json(
        new ApiResponse(200, subscription, "Plan assigned successfully")
    );
});

// ------------------ Get Subscriptions ------------------
export const getSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ isDeleted: false })
        .populate("businessId", "name email")
        .populate("planId", "name price durationDays");

    res.status(200).json(
        new ApiResponse(
            200,
            subscriptions,
            "Subscriptions fetched successfully"
        )
    );
});
