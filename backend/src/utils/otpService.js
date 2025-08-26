import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Otp,Student } from "../models/student.Model.js";
const { SMS_API_URL, SMS_USER, SMS_PASSWORD, SENDER_ID, TemplateID } = process.env;

// Generate OTP
// export const generateOtp = () => crypto.randomInt(100000, 999999).toString();


export const sendOTP = async (mobile,otp) => {
  if (!mobile) throw new Error("Mobile number is required");

  const formattedNumber = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
  if (!/^\+91\d{10}$/.test(formattedNumber)) {
    throw new Error("Invalid phone number format. Use +91 followed by 10 digits.");
  }
  const smsMessage = `Dear user, ${otp} is your OTP. Valid for 15 min only and do not share with anyone - INNOBLES`;

  const smsParams = new URLSearchParams({
    User: SMS_USER,
    passwd: SMS_PASSWORD,
    mobilenumber: formattedNumber,
    message: smsMessage,
    sid: SENDER_ID,
    mtype: "N",
    DR: "Y",
    tempid: TemplateID,
  });

  const response = await axios.post(SMS_API_URL, smsParams.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  console.log("asdfghjk",response);
  

  return {
    smsResponse: response.data,
  };
};




export const verifyOtpService = async ({ mobile, otp }) => {
  const otpDoc = await Otp.findOne({ mobile, isUsed: false }).select("+otp");

  if (!otpDoc) {
    throw new Error("Invalid or expired OTP");
  }
console.log(otpDoc);

  const isValid = await otpDoc.verifyOtp(otp);
  if (!isValid) {
    throw new Error("Incorrect OTP or too many attempts");
  }

  let user;
  if (otpDoc.purpose === "registration") {
    user = new Student({ mobile });
    await user.save();
  } else {
    user = await Student.findOne({ mobile, is_deleted: false });
    if (!user) {
      throw new Error("User not found");
    }
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id, mobile: user.mobile },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, mobile: user.mobile },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user,
    accessToken,
    refreshToken,
    purpose: otpDoc.purpose
  };
};
