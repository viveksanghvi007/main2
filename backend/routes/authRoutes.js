import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    verifyEmail, 
    requestLoginOTP, 
    loginWithOTP, 
    resendOTP 
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { 
    validateRegistration, 
    validateLogin, 
    validateOTP, 
    validatePasswordReset,
    handleValidationErrors 
} from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Auth Routes with validation
router.post("/register", validateRegistration, handleValidationErrors, registerUser);
router.post("/login", validateLogin, handleValidationErrors, loginUser);
router.post("/verify-email", validateOTP, handleValidationErrors, verifyEmail);
router.post("/request-login-otp", validatePasswordReset, handleValidationErrors, requestLoginOTP);
router.post("/login-with-otp", validateOTP, handleValidationErrors, loginWithOTP);
router.post("/resend-otp", validatePasswordReset, handleValidationErrors, resendOTP);
router.get("/profile", authenticateToken, getUserProfile);

export default router;
