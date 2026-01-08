import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Authentication API is running" });
});

app.use("/api/v1", userRoutes);

export default app;
