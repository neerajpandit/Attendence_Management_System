import { Router } from "express";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { userAuth } from "../models/userAuth.Model.js";
import sendEmail from "../utils/emailService.js"; // Assuming you have an email service to send emails
import { Profile } from "../models/userProfile.Model.js";

// Initialize OAuth2 Client
const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Google Login URL
export const googleLogin = (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            scope: [
                "openid",
                "email",
                "profile",
                "https://www.googleapis.com/auth/gmail.send",
            ],
            access_type: "offline",
            prompt: "consent",
        });
        console.log("Google Login URL:", url);
        
        res.redirect(url);
    } catch (err) {
        console.error("Error generating Google login URL:", err);
        res.status(500).json({
            message: "Failed to initiate Google login",
            error: err.message,
        });
    }
};

export const googleAuth = async (req, res) => {
    const { role, businessId, businessName } = req.query; // Allow role and businessId/businessName in Google Auth URL
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ],
        state: JSON.stringify({ role, businessId, businessName }), // Pass params in state
    });
    res.redirect(authUrl);
};

export const googleCallback = async (req, res) => {
    const { code, state } = req.query;
    const {
        role = "2",
        businessId,
        businessName,
    } = state ? JSON.parse(state) : {};

    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch user info
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        const { id: googleId, email, name } = data;

        // Find or create user
        let user = await userAuth.findOne({ email, isDeleted: false });
        let randomPassword;

        if (!user) {
            // Validate businessId for staff
            if (role === "2" && !businessId) {
                throw new Error(
                    "businessId is required for staff registration"
                );
            }

            randomPassword = password;
            user = new userAuth({
                email,
                password: randomPassword,
                googleId,
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
                role,
                businessId: role === "2" ? businessId : null,
                isDeleted: false,
            });
            await user.save();

            // Create Profile
            const profile = new Profile({
                userId: user._id,
                name: name || email.split("@")[0],
                email,
                profilePicture: data?.picture,
                isDeleted: false,
            });
            await profile.save();

            // Link profileId to userAuth
            user.profileId = profile._id;
            await user.save();

            // Send password via Nodemailer
            if (!user.email) {
                throw new Error("User email not found");
            }
            await sendEmail({
                to: user.email,
                subject: "Your Leave Management System Password",
                html: `<p>Welcome, <strong>${profile.name}</strong>! Your account has been created.</p>
               <p>Use this password to log in with your email: <strong>${randomPassword}</strong></p>
               <p>${subscriptionMessage}</p>
               <p>Keep this password secure and do not share it.</p>`,
            });
        } else {
            // Update Google tokens
            user.googleId = googleId;
            user.googleAccessToken = tokens.access_token;
            user.googleRefreshToken = tokens.refresh_token;

            // Check if profile exists, create if not
            let profile = await Profile.findOne({
                userId: user._id,
                isDeleted: false,
            });
            if (!profile) {
                profile = new Profile({
                    userId: user._id,
                    name: name || email.split("@")[0],
                    email,
                    profilePicture: data?.picture,
                    isDeleted: false,
                });
                await profile.save();
                user.profileId = profile._id;
            }
            await user.save();
        }

        // Generate JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        await user.save();

        // Redirect to frontend
        res.redirect(`http://localhost:5173/login?token=${accessToken}`);
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({
            message: "Google authentication failed",
            error: err.message,
        });
    }
};
// Google Callback
export const googleCallback1 = async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Fetch user info
        const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
        console.log("dataOuth", oauth2);
        
        const { data } = await oauth2.userinfo.get();
        console.log("User data from Google:", data);
        
        const { id: googleId, email, name } = data;

        // Find or create user
        let user = await userAuth.findOne({ email, isDeleted: false });
        if (!user) {
            // Generate random password
            const randomPassword = Math.random().toString(36).slice(-8);
            user = new userAuth({
                name: name || email.split("@")[0],
                email,
                password: randomPassword,
                googleId,
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token,
                role: "2",
            });
            console.log("Creating new user:", user);

            await user.save();
            // Create Profile
            const profile = new Profile({
                userId: user._id,
                name: name || email.split("@")[0],
                profilePicture: data?.picture, // Set default or empty
                isDeleted: false,
            });
            await profile.save();
                user.profileId = profile._id;
                await user.save();

            if (!user.email) {
                throw new Error("User email not found");
            }
            // Send password via Nodemailer
            await sendEmail({
                to: "neeraj.pandey@innobles.com",
                subject: "Your Leave Management System Password",
                html: `<p>Welcome, <strong>${user.name}</strong>! Your account has been created.</p>
               <p>Use this password to log in with your email: <strong>${randomPassword}</strong></p>
               <p>Keep this password secure and do not share it.</p>`,
            });
        } else {
            // Update Google tokens
            user.googleId = googleId;
            user.googleAccessToken = tokens.access_token;
            user.googleRefreshToken = tokens.refresh_token;
            await user.save();
        }

        // Generate JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.refreshTokenExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        await user.save();

        // Redirect to frontend
        res.redirect(`http://localhost:5173/login?token=${accessToken}`);
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({
            message: "Google authentication failed",
            error: err.message,
        });
    }
};
