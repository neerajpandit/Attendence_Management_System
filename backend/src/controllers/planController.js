import { asyncHandler } from "../utils/asyncHandler.js";
import { Plan } from "../models/plan.Model.js";

export const createPlan = asyncHandler(async (req, res) => {
    const { name, durationDays, price, features } = req.body;

    // Validate input
    if (!name || !durationDays) {
        return res
            .status(400)
            .json({ message: "Name and durationDays are required" });
    }

    // Check for existing plan with the same name
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
        return res
            .status(400)
            .json({ message: "Plan with this name already exists" });
    }

    // Create new plan
    const newPlan = new Plan({
        name,
        durationDays,
        price: price || 0,
        features: features || [],
    });

    await newPlan.save();

    res.status(201).json({
        statusCode: 201,
        message: "Plan created successfully",
        plan: newPlan,
    });
});

export const getPlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find();
    if (plans.length === 0) {
        return res.status(404).json({ message: "No plans found" });
    }
    res.status(200).json({
        statusCode: 200,
        message: "All Plans Fetched Successfully",
        data:plans,
    });
});
export const getPlanById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findById(id);
    if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({ plan });
});
