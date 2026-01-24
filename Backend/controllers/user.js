import { loginSchema, registerSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import tryCatch from "../middlewares/tryCatch.js";
import sanitize from "mongo-sanitize";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateToken,
  revokeRefershToken,
  verifyRefreshToken,
} from "../config/generateToken.js";
import { generateCSRFToken } from "../config/csrfMiddleware.js";


/* ================= REGISTER ================= */

export const registerUser = tryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitezedBody);

  if (!validation.success) {
    const zodError = validation.error;

    let firstErrorMessage = "Validation failed";
    let allErrors = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));

      firstErrorMessage = allErrors[0]?.message || "Validation Error";
    }
    return res.status(400).json({
      message: firstErrorMessage,
      error: allErrors,
    });
  }

  const { name, email, password } = validation.data;

  const role =
    sanitezedBody.role === "admin" &&
    process.env.ALLOW_ADMIN_REGISTER === "true"
      ? "admin"
      : "user";

  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;

  const datatoStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
    role,
  });

  await redisClient.set(verifyKey, datatoStore, { EX: 300 });

  const subject = "verify your email for Account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification like has been sent. it will expire in 5 minutes",
  });
});

/* ================= VERIFY EMAIL ================= */

export const verifyUser = tryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required.",
    });
  }

  const verifyKey = `verify:${token}`;
  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification Link is expired.",
    });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || "user",
  });

  res.status(201).json({
    message: "Email verified successfully! your account has been created",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

/* ================= LOGIN ================= */

export const loginUser = tryCatch(async (req, res) => {
  const sanitezedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitezedBody);

  if (!validation.success) {
    return res.status(400).json({ message: "Validation failed" });
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invailid credentials" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 });

  const subject = "Otp for verification";
  const html = getOtpHtml({ email, otp });

  await sendMail({ email, subject, html });

  res.json({
    message:
      "If your email is vaid, an otp has been sent. it will be valid for 5 min",
  });
});

/* ================= VERIFY OTP ================= */

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);

  if (!storedOtpString || JSON.parse(storedOtpString) !== otp) {
    return res.status(400).json({ message: "Invalid Otp" });
  }

  await redisClient.del(otpKey);

  const user = await User.findOne({ email });
  const tokenData = await generateToken(user._id, res);

  res.status(200).json({
    message: `Welcome ${user.name}`,
    user,
    sessionInfo: {
      sessionId: tokenData.sessionId,
      loginTime: new Date().toISOString(),
      csrfToken: tokenData.csrfToken,
    },
  });
});

/* ================= FORGOT PASSWORD ================= */

export const forgotPassword = tryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "If email exists, reset link has been sent",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetLink = `https://authentication-odcode.onrender.com/reset-password/${resetToken}`;

  await sendMail({
    email,
    subject: "Reset Password",
    html: `<a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({ message: "Reset link sent" });
});

/* ================= RESET PASSWORD ================= */

export const resetPassword = tryCatch(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});

/* ================= PROFILE ================= */

export const myProfile = tryCatch(async (req, res) => {
  res.json({ user: req.user });
});

/* ================= REFRESH TOKEN ================= */

export const refreshToken = tryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    return res.status(401).json({
      message: "Session Expired. Please login",
    });
  }

  generateAccessToken(decode.id, decode.sessionId, res);

  res.status(200).json({ message: "token refreshed" });
});

/* ================= LOGOUT ================= */

export const logutUser = tryCatch(async (req, res) => {
  await revokeRefershToken(req.user._id);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  res.json({ message: "Logged out successfully" });
});

/* ================= CSRF ================= */

export const refreshCSRF = tryCatch(async (req, res) => {
  const newCSRFToken = await generateCSRFToken(req.user._id, res);

  res.json({
    message: "CSRF token refreshed successfully",
    csrfToken: newCSRFToken,
  });
});

/* ================= ADMIN ================= */

export const adminController = tryCatch(async (req, res) => {
  res.json({ message: "Hello admin" });
});
