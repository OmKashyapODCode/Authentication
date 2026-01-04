import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import { createClient } from "redis";
import cookieParser from 'cookie-parser';
import cors from "cors";

dotenv.config();
await connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Redis
const redisURL = process.env.REDIS_URL;
if (!redisURL) {
  console.log("missing redis url");
  process.exit(1);
}

export const redisClient = createClient({ url: redisURL });
await redisClient.connect();

// routes
import userRoutes from './routes/user.js';
app.use('/api/v1', userRoutes);

export default app;
