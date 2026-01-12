import express from "express";
import { registerUser, verifyUser,loginUser, verifyOtp, myProfile, refreshAccessToken, logoutUser } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register" , registerUser);
router.post("/verify/:token",verifyUser);
router.post("/login" , loginUser);
router.post("/verify" , verifyOtp);
router.get("/me",isAuth,myProfile);
router.post("/refresh",refreshAccessToken);
router.post("/logout",isAuth,logoutUser)

export default router;