import jwt from "jsonwebtoken";
import { getRedisClient } from "./redis.js";

export const generateToken = async (id, res) => {
  const redisClient = await getRedisClient();

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

  await redisClient.setEx(
    `refresh-token:${id}`,
    7 * 24 * 60 * 60,
    refreshToken
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const redisClient = await getRedisClient();

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const storedToken = await redisClient.get(
      `refresh-token:${decoded.id}`
    );

    if (storedToken !== refreshToken) return null;

    return decoded;
  } catch {
    return null;
  }
};

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
    maxAge: 60 * 1000,
  });
};

export const revokedRefreshedToken = async (userId) => {
  const redisClient = await getRedisClient();
  await redisClient.del(`refresh-token:${userId}`);
};
