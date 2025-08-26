import { asyncHandler } from "../utils/asyncHandler.js";
import {userAuth} from "../models/userAuth.Model.js";
import { SuperAdminProfile } from "../models/superAdmin.Model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { logActivity} from "../utils/logger.js";
import { Profile } from "../models/userProfile.Model.js";
import { Business } from "../models/business.Model.js";
// import { log } from "winston";


export const registerUser = asyncHandler(async(req, res)=>{
    const { email, password, role, phoneNo, fullName, businessId } = req.body;
    // console.log(req.ip);

    console.log(req.body);

    if (!email || !password || !role) {
        res.status(400).json({
            success: false,
            message: "Please provide all required fields",
        });
    }
    // Validate businessId for staff
    if (role === "2" && !businessId) {
        return res.status(400).json({
            success: false,
            message: "businessId is required for staff registration",
        });
    }

    const existingUser = await userAuth.findOne({ email, isDeleted: false });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    const user = await userAuth.create({
        email,
        password,
        role,
        businessId: role === "2" ? businessId : null,
        phoneNo: phoneNo || null,
    });

    if (!user) {
        res.status(400).json({
            success: false,
            message: "User registration failed",
        });
        return;
    }

    // Create Profile record
    const profile = await Profile.create({
        userId: user._id,
        name: fullName,
        email,
        phoneNo: phoneNo || null,
        isDeleted: false,
    });

    if (!profile) {
        // Rollback user creation if profile creation fails
        await userAuth.deleteOne({ _id: user._id });
        return res.status(400).json({
            success: false,
            message: "Profile creation failed",
        });
    }

    if(role === "1") {
        // Create business for Admin role
        const business = await Business.create({
            ownerId: user._id,
            isDeleted: false,
            name: `Business of ${fullName || "User"}`, // Assuming business name is same as user's full name
        });
        if (!business) {
            // Rollback profile and user creation if business creation fails
            await Profile.deleteOne({ _id: profile._id });
            await userAuth.deleteOne({ _id: user._id });
            return res.status(400).json({
                success: false,
                message:"Business Creation Failed",
            });
        }
        user.businessId = business._id;
    }

    // Link profileId to userAuth
    user.profileId = profile._id;
    user.businessId = role === "2" ? businessId : user.businessId;
    await user.save();

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
});


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: "Please provide email and password",
        });
        logActivity(req, res, 'UserController', 'loginUser', {
            message: 'Missing email or password',
            email
        });
        return;
    }

    const user = await userAuth.findOne({ email }).select("+password");
    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        logActivity(req, res, 'UserController', 'loginUser', {
            message: 'User not found',
            email
        });
        return;
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        logActivity(req, res, 'UserController', 'loginUser', {
            message: 'Incorrect password',
            email
        });
        return;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    const profileData = await Profile.findById(user.profileId).select("name profilePicture");
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    await user.save();
    
console.log("user", user);

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            statusCode:200,
            message: "User logged in successfully",
            data: {
                userId: user._id,
                role: user.role,
                email: user.email,
                name: profileData.name,
                profilePicture: profileData.profilePicture,
                accessToken,
                refreshToken,
                profileId: user.profileId,
                businessId: user.businessId,
            },
        });

        // payment_log(userId,profileData)

    // Log successful login
    logActivity(req, res, 'UserController', 'loginUser', user._id,{
        message: 'User logged in successfully',
        userId: user._id,
        role: user.role
    });
});


//logout User
export const logoutUser = asyncHandler(async (req, res) => {
    await userAuth.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});



export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await userAuth.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userAuth.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { emailOrPhone,newPassword } = req.body;
  const user = await userAuth.findOne({
    $or: [{ email: emailOrPhone }, { phoneNo: emailOrPhone }]
  });
  // const isCorrect = await user.isPasswordCorrect(oldPassword)

  if (!user) {
    throw new ApiError(400, "Invalid Email write valid code");
  }

  user.password = newPassword;

//   user.otp = null;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

//current user
export const currentUser = asyncHandler(async (req, res) => {
  const user = await userAuth.findById(req.user._id).select("-password -refreshToken");
    console.log("user",user);
    let profileData = null;

    if (user.role === "0") {
        // Fetch SuperAdmin profile
        profileData = await SuperAdminProfile.findOne({ userId: user._id })//.select("name");
    } else if (user.role === "1") {
        // Fetch Entity profile
        // profileData = await entityProfile.findOne({ user_id: user._id })//.select("name");
    } else if (user.role === "2") {
        // Fetch Institute profile
        // profileData = await instituteProfile.findOne({ user_id: user._id })//.select("name");
    }
    console.log("profileData",profileData);
    
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});