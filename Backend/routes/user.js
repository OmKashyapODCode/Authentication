import express from "express";
import { registerUser, verifyUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register" , registerUser);
router.post("/verify/:token",verifyUser)

export default router;