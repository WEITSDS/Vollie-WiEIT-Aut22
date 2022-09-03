import express from "express";
import { triggerOTPEmail, verifyOTPForUser } from "./otp.controller";

/** Adds OTP-related endpoints */
const otpRouter = express.Router();
otpRouter.post(`/verify`, verifyOTPForUser);
otpRouter.post(`/send`, triggerOTPEmail);

export = otpRouter;
