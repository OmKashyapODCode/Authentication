import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createClient } from "redis";
import { EventEmitter } from "events";

import connectDb from "./config/db.js";
import userRoutes from "./routes/user.js";

/* ---------------- NODE WARNINGS FIX ---------------- */
EventEmitter.defaultMaxListeners = 20;

/* ---------------- PATH SETUP (ESM) ---------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- ENV (LOAD FIRST) ---------------- */
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/* ---------------- DATABASE ---------------- */
await connectDb();

/* ---------------- REDIS ---------------- */
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL is missing");
  process.exit(1);
}

export const redisClient = createClient({ url: redisUrl });

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

await redisClient.connect();
console.log("Redis connected");

/* ---------------- EXPRESS APP ---------------- */
const app = express();

/* ---------------- MIDDLEWARES ---------------- */
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:"https://authentication-odcode.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* ---------------- API ROUTES ---------------- */
app.use("/api/v1", userRoutes);

/* ---------------- FRONTEND (SPA) ---------------- */
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend/dist/index.html")
  );
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
