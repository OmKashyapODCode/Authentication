import { loginSchema, registerSchema } from "../config/zod.js";
import { getRedisClient } from "../config/redis.js";
import TryCatch from "../middlewares/tryCatch.js";
import sanitize from "mongo-sanitize";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateToken,
  revokedRefreshedToken,
  verifyRefreshToken,
} from "../config/generateToken.js";

/* ================= REGISTER ================= */

export const registerUser = TryCatch(async (req, res) => {
  const redisClient = await getRedisClient();

  const sanitizedBody = sanitize(req.body);
  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const zodError = validation.error;
    const allErrors = zodError.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));

    return res.status(400).json({
      success: false,
      message: allErrors[0].message,
      errors: allErrors,
    });
  }

  const { name, email, password } = validation.data;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, please try again later",
    });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({
      message: "User already exists with this email",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  await redisClient.set(
    `verify:${verifyToken}`,
    JSON.stringify({ name, email, password: hashPassword }),
    { EX: 300 }
  );

//   await sendMail({
//     email,
//     subject: "Verify your email",
//     html: getVerifyEmailHtml({ email, token: verifyToken }),
//   });

  await redisClient.set(rateLimitKey, "true", { EX: 300 });

  res.json({
    message:
      "User registered successfully. Please verify your email within 5 minutes.",
  });
});

/* ================= VERIFY EMAIL ================= */

export const verifyUser = TryCatch(async (req, res) => {
  const redisClient = await getRedisClient();
  const { token } = req.params;

  const userDataJson = await redisClient.get(`verify:${token}`);
  if (!userDataJson) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  await redisClient.del(`verify:${token}`);
  const userData = JSON.parse(userDataJson);

  if (await User.findOne({ email: userData.email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  await User.create(userData);

  res.status(201).json({
    message: "Email verified successfully. Account created.",
  });
});

/* ================= LOGIN ================= */

export const loginUser = TryCatch(async (req, res) => {
  const redisClient = await getRedisClient();

  const sanitizedBody = sanitize(req.body);
  const validation = loginSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }

  const { email, password } = validation.data;
  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, please try again later",
    });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.set(
    `otp:${email}`,
    JSON.stringify({ otp }),
    { EX: 300 }
  );

  await sendMail({
    email,
    subject: "Your login OTP",
    html: getOtpHtml({ email, otp }),
  });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message: "OTP sent to your email",
  });
});

/* ================= VERIFY OTP ================= */

export const verifyOtp = TryCatch(async (req, res) => {
  const redisClient = await getRedisClient();
  const { email, otp } = req.body;

  const otpDataJson = await redisClient.get(`otp:${email}`);
  if (!otpDataJson) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const otpData = JSON.parse(otpDataJson);
  if (otpData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redisClient.del(`otp:${email}`);
  const user = await User.findOne({ email });

  await generateToken(user._id, res);

  res.json({
    message: `Welcome ${user.name}`,
    user,
  });
});

/* ================= PROFILE ================= */

export const myProfile = TryCatch(async (req, res) => {
  res.json({ user: req.user });
});

/* ================= REFRESH TOKEN ================= */

export const refreshAccessToken = TryCatch(async (req, res) => {
  const { refreshToken } = req.cookies;

  const decode = await verifyRefreshToken(refreshToken);
  if (!decode) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  generateAccessToken(decode.id, res);

  res.json({ message: "Access token refreshed" });
});

/* ================= LOGOUT ================= */

export const logoutUser = TryCatch(async (req, res) => {
  const redisClient = await getRedisClient();
  const userId = req.user._id;

  await revokedRefreshedToken(userId);
  await redisClient.del(`user:${userId}`);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
});
