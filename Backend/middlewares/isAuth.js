import jwt from "jsonwebtoken";
import { getRedisClient } from "../config/redis.js";
import { User } from "../models/user.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(403).json({ message: "Please login - No token" });
    }

    let decodedData;
    try {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    const redisClient = await getRedisClient();

    const cacheUser = await redisClient.get(
      `user:${decodedData.id}`
    );

    if (cacheUser) {
      req.user = JSON.parse(cacheUser);
      return next();
    }

    const user = await User.findById(decodedData.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await redisClient.setEx(
      `user:${user._id}`,
      3600,
      JSON.stringify(user.toObject())
    );

    req.user = user;
    next();

  } catch (error) {
    console.error("isAuth error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
