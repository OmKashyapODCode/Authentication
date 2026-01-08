import { createClient } from "redis";

let redisClient;
let connected = false;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 3000, // 3s timeout
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  if (!connected) {
    try {
      await redisClient.connect();
      connected = true;
    } catch (err) {
      console.error("Redis connect failed, continuing without Redis");
      return null; // IMPORTANT
    }
  }

  return redisClient;
};
