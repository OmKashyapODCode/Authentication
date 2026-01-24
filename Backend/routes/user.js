import express from "express";
import {
  adminController,
  forgotPassword,
  loginUser,
  logutUser,
  myProfile,
  refreshCSRF,
  refreshToken,
  registerUser,
  resetPassword,
  verifyOtp,
  verifyUser,
} from "../controllers/user.js";
import { authorizedAdmin, isAuth } from "../middlewares/isAuth.js";
import { verifyCSRFToken } from "../config/csrfMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", isAuth, myProfile);
router.post("/refresh", refreshToken);
router.post("/logout", isAuth, verifyCSRFToken, logutUser);
router.post("/refresh-csrf", isAuth, refreshCSRF);
router.get("/admin", isAuth, authorizedAdmin, adminController);

export default router;
