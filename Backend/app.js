import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";

const app = express();

const corsOptions = {
  origin: "https://odcodeauthentication.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// preflight must use SAME options
app.options("*", cors(corsOptions));

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
