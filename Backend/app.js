import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";

const app = express();

const allowedOrigin = "https://odcodeauthentication.netlify.app";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // VERY IMPORTANT: short-circuit OPTIONS
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Authentication API is running",
    status: "ok",
  });
});

app.use("/api/v1", userRoutes);

export default app;
