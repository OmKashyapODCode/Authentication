import express from "express";
import { registerUser, verifyUser,loginUser } from "../controllers/user.js";

const router = express.Router();

router.post("/register" , registerUser);
router.post("/verify/:token",verifyUser)
router.post("/login" , loginUser);
export default router;