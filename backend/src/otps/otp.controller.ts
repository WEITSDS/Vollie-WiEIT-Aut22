import { NextFunction, Request, Response } from "express";
import * as sessionManager from "../Common/middleware/sessionManagement";
import { checkIfOTPValidAndRemove } from "./otpManager";
import { getUserByEmail } from "../User/user.controller";
import { Logger } from "tslog";
import { handleError } from "../utility";
import { sendOTPEmail } from "../mailer/mailer";
import { isOTPQuery } from "./otp.model";

interface OTPRequestBody {
    email: string;
}

function isOTPRequestBody(args: unknown): args is OTPRequestBody {
    const body = args as Partial<OTPRequestBody>;
    return typeof body === "object" && typeof body.email === "string";
}

const logger = new Logger({ name: "otp.controller" });

export function triggerOTPEmail(req: Request, res: Response, _next: NextFunction) {
    const reqBody = req.body as unknown;
    if (!isOTPRequestBody(reqBody)) {
        res.status(400).json({ success: true, message: "OTP request body was not valid" });
        return;
    }

    getUserByEmail(reqBody.email)
        .then((user) => {
            // Unlikely scenario so treat as an error
            if (!user) {
                handleError(
                    logger,
                    res,
                    `Could not find user '${reqBody.email}' to send OTP to`,
                    "An unexpected error occured",
                    404
                );
                return;
            }
            void sendOTPEmail(user.firstName, user.email);
            res.status(200).json({ success: true, message: "Sent OTP email" });
        })
        .catch((err) => {
            handleError(logger, res, err, "An unexpected error occured");
        });
}

export function verifyOTPForUser(req: Request, res: Response, _next: NextFunction) {
    const otpBody = req.body as unknown;
    if (!isOTPQuery(otpBody)) {
        res.status(400).json({ success: false, message: "OTP verification request body was not valid" });
        return;
    }

    const isValid = checkIfOTPValidAndRemove(otpBody);

    if (!isValid) {
        // if we reached here, something didn't go right - either OTP expired, or
        // user used the wrong code
        res.status(400).json({ success: false, message: "OTP was not valid" });
        return;
    }

    getUserByEmail(otpBody.email)
        .then(async (user) => {
            try {
                // Unlikely scenario so treat as an error
                if (!user) {
                    handleError(logger, res, "Null user despite a valid OTP", "An unexpected error occured");
                    return;
                }

                // The user could be trying to reset their password here (and won't be logged in),
                // so log them in now :)
                if (!req.session.user) {
                    sessionManager.createSession(req, { email: user.email, isAdmin: user.isAdmin });
                }

                // If they aren't already verified, do that now
                if (!user.verified) {
                    user.verified = true;
                    await user.save();
                }

                res.status(200).json({ success: true, message: "OTP successfully verified" });
            } catch (err) {
                handleError(logger, res, err, "An unexpected error occured");
            }
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "An unexpected error occured");
        });
}
