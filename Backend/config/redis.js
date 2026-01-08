import { createClient } from "redis";

let redisClient;
let connectingPromise;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  if (!redisClient.isOpen) {
    if (!connectingPromise) {
      connectingPromise = redisClient.connect();
    }
    await connectingPromise;
  }

  return redisClient;
};
