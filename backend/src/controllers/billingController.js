import mongoose from "mongoose";
import { Bill } from "../models/bill.Model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// 🔹 Generate auto-increment bill number (like INV-0001)
const generateBillNo = async () => {
    const lastBill = await Bill.findOne({}, {}, { sort: { createdAt: -1 } });
    if (!lastBill || !lastBill.billNo) return "INV-0001";

    const lastNumber = parseInt(lastBill.billNo.replace("INV-", "")) || 0;
    const newNumber = (lastNumber + 1).toString().padStart(4, "0");
    return `INV-${newNumber}`;
};

// 🔹 Create Bill
export const createBill = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized: User ID missing",
            });
        }
        const businessId = req.user.businessId;
        if (!businessId) {
            return res.status(400).json({
                success: false,
                message: "Business ID are required",
            });
        }
        const {
            client,
            items,
            summary,
            payment,
            notes,
            terms,
            status,
            dueDate,
            attachments,
        } = req.body;

        const billNo = await generateBillNo();

        const newBill = await Bill.create({
            businessId,
            createdBy: userId,
            billNo,
            client,
            items,
            summary,
            payment,
            notes,
            terms,
            status,
            dueDate,
            attachments,
        });

        return res
            .status(201)
            .json({success: true, message: "Bill created successfully", data: newBill });
    } catch (error) {
        console.log("Error creating bill:", error);
        
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create bill",
        });
    }
});

// 🔹 Get All Bills (with filters, pagination)
export const getAllBills = asyncHandler(async (req, res) => {
    try {
        const businessId = req.user.businessId;
        if (!businessId) {
            return res.status(400).json({ 
                success: false,
                message: "Business ID is required" 
            });
        }
        const { page = 1, limit = 10, status, clientName } = req.query;

        const filter = { businessId };
        if (status) filter.status = status;
        if (clientName) filter["client.name"] = new RegExp(clientName, "i");

        const bills = await Bill.find(filter)
            .populate("businessId createdBy")

            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Bill.countDocuments(filter);

        return ApiResponse(res,
                    200,
                    { bills, total },
                    "Bills fetched successfully"
                
            );
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to fetch bills");
    }
});

// // 🔹 Get Single Bill
export const getBillById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid bill ID");
        }

        const bill = await Bill.findById(id).populate("businessId createdBy");

        if (!bill) {
            throw new ApiError(404, "Bill not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, bill, "Bill fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to fetch bill");
    }
});

// 🔹 Update Bill
export const updateBill = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid bill ID");
        }

        const updatedBill = await Bill.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBill) {
            throw new ApiError(404, "Bill not found");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedBill, "Bill updated successfully")
            );
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to update bill");
    }
});

// 🔹 Delete Bill (Soft Delete)
export const deleteBill = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid bill ID");
        }

        const bill = await Bill.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!bill) {
            throw new ApiError(404, "Bill not found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, bill, "Bill deleted successfully"));
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to delete bill");
    }
});
