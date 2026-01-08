import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

let isRedisConnected = false;

export const connectRedis = async () => {
  if (isRedisConnected) return;

  try {
    await redisClient.connect();
    isRedisConnected = true;
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed", err.message);
    throw err;
  }
};
