import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import { connectRedis } from "../src/config/redis.js";

let initialized = false;

const init = async () => {
  if (!initialized) {
    await connectDB();
    await connectRedis();
    initialized = true;
  }
};

export default async function handler(req, res) {
  await init();
  return app(req, res);
}
