import express from "express";
import verifyOtp from "./controllers/verifyOtp.controller.js";
import sendOtp from "./controllers/sendOtp.controller.js";

const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.get("/send-otp", sendOtp);

export default router;
