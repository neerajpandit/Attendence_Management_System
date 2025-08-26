import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true, // Changed to true for Google Auth
            sparse: true,
            lowercase: true, // Corrected typo: "lowecase" to "lowercase"
            trim: true,
        },
        phoneNo: {
            type: String,
            trim: true,
        },
        profileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: "Business",
            required: function () {
                return this.role === "2"; // Required for staff
            },
        },
        role: {
            type: String,
            enum: ["0", "1", "2"], // Changed to string array to match type
            default: "2",
            required: true,
        },
        password: {
            type: String,
            required: false, // Made optional for Google Auth users
        },
        googleId: {
            type: String, // Google account ID
        },
        googleAccessToken: {
            type: String, // Google OAuth access token (renamed to avoid confusion)
        },
        googleRefreshToken: {
            type: String, // Google OAuth refresh token (renamed to avoid confusion)
        },
        refreshToken: {
            type: String, // JWT refresh token for app
        },
        refreshTokenExpiresAt: {
            type: Date, // JWT refresh token expiry
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

// Pre-save hooks
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      email: this.email,
      phoneNo: this.phoneNo,
      profileId: this.profileId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


export const userAuth = mongoose.model("userAuth", userSchema);
