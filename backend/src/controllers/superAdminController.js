import { userAuth } from "../models/userAuth.Model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getOrganizationList = asyncHandler(async (req, res, next) => {
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

        const filter = { role: "1" };

        const totalOrganizations = await userAuth.countDocuments(filter);
        if (totalOrganizations === 0) {
            throw new ApiError(404, "No organizations found");
        }

        const userList = await userAuth
            .find(filter)
            .populate("profileId", "name")
            .populate("businessId", "name")
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 }); // latest first

        return ApiResponse(res, 200, "Organizations fetched successfully", {
            data: userList,
            total: totalOrganizations,
            currentPage: pageNo,
            pageSize,
            totalPages: Math.ceil(totalOrganizations / pageSize),
        });
    } catch (error) {
        next(error);
    }
});