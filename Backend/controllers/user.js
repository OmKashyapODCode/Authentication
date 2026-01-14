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

export const registerUser = tryCatch(async (req, res) => {
    
  console.log("register start")

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
  console.log("register mid : 1")
  const { name, email, password } = validation.data;
 console.log("register mid : 2")
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
 console.log("register mid : 3")
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }
 console.log("register mid : 4")
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
  });
 console.log("register mid : 5")
  await redisClient.set(verifyKey, datatoStore, { EX: 300 });
 console.log("register mid : 6")
  const subject = "verify your email for Account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });
 console.log("register mid : 7")
  await sendMail({ email, subject, html });
 console.log("register mid : 8")
  await redisClient.set(rateLimitKey, "true", { EX: 60 });
 console.log("register mid : 9")
  res.json({
    message:
      "If your email is valid, a verification like has been sent. it will expire in 5 minutes",
  });
});

export const verifyUser = tryCatch(async (req, res) => {
   console.log("verify start")
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is required.",
    });
  }

  const verifyKey = `verify:${token}`;
 console.log("verify mid : 1")
  const userDataJson = await redisClient.get(verifyKey);
 console.log("verify mid : 2")

  if (!userDataJson) {
    return res.status(400).json({
      message: "Verification Link is expired.",
    });
  }
 console.log("verify mid : 3")

  await redisClient.del(verifyKey);
 console.log("verify mid : 4")

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
  });
 console.log("verify end")

  res.status(201).json({
    message: "Email verified successfully! your account has been created",
    user: { _id: newUser._id, name: newUser.name, email: newUser.email },
  });
});

export const loginUser = tryCatch(async (req, res) => {
   console.log("login start")

  const sanitezedBody = sanitize(req.body);

  const validation = loginSchema.safeParse(sanitezedBody);

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
   console.log("login mid : 1")

  const { email, password } = validation.data;
   console.log("login mid : 2")

  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
   console.log("login mid : 3")

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many requests, try again later",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invailid credentials",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(400).json({
      message: "Invailid credentials",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
   console.log("login mid : 4")

  const otpKey = `otp:${email}`;
   console.log("login mid : 5")

  await redisClient.set(otpKey, JSON.stringify(otp), {
    EX: 300,
  });
   console.log("login mid : 6")

  const subject = "Otp for verification";

  const html = getOtpHtml({ email, otp });
  console.log(html)
  console.log(email);
  
   console.log("login mid : 7")

  await sendMail({ email, subject, html });
     console.log("login mid : 8")

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });
   console.log("login end")

  res.json({
    message:
      "If your email is vaid, an otp has been sent. it will be valid for 5 min",
  });
});

export const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide all details",
    });
  }

  const otpKey = `otp:${email}`;

  const storedOtpString = await redisClient.get(otpKey);

  if (!storedOtpString) {
    return res.status(400).json({
      message: "otp expired",
    });
  }

  const storedOtp = JSON.parse(storedOtpString);

  if (storedOtp !== otp) {
    return res.status(400).json({
      message: "Invalid Otp",
    });
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });

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

export const myProfile = tryCatch(async (req, res) => {
  const user = req.user;

  const sessionId = req.sessionId;

  const sessionData = await redisClient.get(`session:${sessionId}`);

  let sessionInfo = null;

  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    sessionInfo = {
      sessionId,
      loginTime: parsedSession.createdAt,
      lastActivity: parsedSession.lastActivity,
    };
  }

  res.json({ user, sessionInfo });
});

export const refreshToken = tryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const decode = await verifyRefreshToken(refreshToken);

  if (!decode) {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("csrfToken");

    return res.status(401).json({
      message: "Session Expired. Please login",
    });
  }

  generateAccessToken(decode.id, decode.sessionId, res);

  res.status(200).json({
    message: "token refreshed",
  });
});

export const logutUser = tryCatch(async (req, res) => {
  const userId = req.user._id;

  await revokeRefershToken(userId);

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");

  await redisClient.del(`user:${userId}`);

  res.json({
    message: "Logged out successfully",
  });
});

export const refreshCSRF = tryCatch(async (req, res) => {
  const userId = req.user._id;

  const newCSRFToken = await generateCSRFToken(userId, res);

  res.json({
    message: "CSRF token refreshed successfully",
    csrfToken: newCSRFToken,
  });
});

export const adminController = tryCatch(async (req, res) => {
  res.json({
    message: "Hello admin",
  });
});
