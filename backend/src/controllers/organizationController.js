import { Business } from "../models/business.Model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userAuth } from "../models/userAuth.Model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addBusiness = asyncHandler(async (req, res, next) => {
  try {
    const { name, businessId } = req.body;
    if (!name || !businessId) {
      return res.status(400).json({
        success: false,
        message: "Name and Business ID are required",
      });
    }
    const existingBusiness = await Business.findOne({ _id: businessId, isDeleted: false });
    if (!existingBusiness) {
      return res.status(404).json({
        status: false,
        message:"Business Already Deleted or Not Found",
      });
    }
    const newOrganization = await Business.create({
      name,
      adminId: req.user._id, // Assuming req.user is populated with the authenticated user's info
      businessId,
    });
    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: newOrganization,
    });
  } catch (error) {
    next(error);
  }
});

export const updateBusiness = asyncHandler(async (req, res, next) => {
    try {
        const { businessId } = req.params; // ID from route param
        const updateData = req.body;

        if (!businessId) {
            return res.status(400).json({
                success: false,
                message: "Business ID is required",
            });
        }

        const business = await Business.findOne({
            _id: businessId,
            isDeleted: false,
        });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found or already deleted",
            });
        }

        // 🔒 Optional: prevent overwriting critical fields directly
        const restrictedFields = [
            "_id",
            "adminId",
            "isDeleted",
            "createdAt",
            "updatedAt",
        ];
        restrictedFields.forEach((field) => delete updateData[field]);

        const updatedBusiness = await Business.findByIdAndUpdate(
            businessId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Business updated successfully",
            data: updatedBusiness,
        });
    } catch (error) {
        next(error);
    }
});

export const getStaffList = asyncHandler(async (req, res, next) => {
    try {
        let { pageNo = 1, pageSize = 10 } = req.query;

        pageNo = parseInt(pageNo);
        pageSize = parseInt(pageSize);

        if (pageNo < 1 || pageSize < 1) {
            throw new ApiError(
                400,
                "Invalid pagination values (pageNo and pageSize must be greater than 0)"
            );
        }

        const filter = { role: "2" };

        const totalStaff = await userAuth.countDocuments(filter);
        if (totalStaff === 0) {
            throw new ApiError(404, "No Staff found");
        }

        const userList = await userAuth
            .find(filter)
            .populate("profileId", "name")
            .populate("businessId", "name")
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 }); // latest first

        return ApiResponse(res, 200, "Staff fetched successfully", {
            data: userList,
            total: totalStaff,
            currentPage: pageNo,
            pageSize,
            totalPages: Math.ceil(totalStaff / pageSize),
        });
    } catch (error) {
        next(error);
    }
});