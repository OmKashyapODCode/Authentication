import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";

/**
 * Generate access + refresh token
 */
export const generateToken = async (id, res) => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign(
    { id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in Redis
  await redisClient.setEx(
    `refresh-token:${id}`,
    7 * 24 * 60 * 60,
    refreshToken
  );

  // Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 60 * 1000 // 1 minute
  });

  // Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return { accessToken, refreshToken };
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const storedToken = await redisClient.get(
      `refresh-token:${decode.id}`
    );

    if (storedToken === refreshToken) {
      return decode;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Generate new access token using refresh token
 */
export const generateAccessToken = (id, res) => {
  const accessToken = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 60 * 1000
  });
};

/**
 * Revoke refresh token
 */
export const revokedRefreshedToken = async (userId) => {
  await redisClient.del(`refresh-token:${userId}`);
};
