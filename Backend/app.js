import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && origin.endsWith(".netlify.app")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Authentication API is running" });
});

app.use("/api/v1", userRoutes);

export default app;
