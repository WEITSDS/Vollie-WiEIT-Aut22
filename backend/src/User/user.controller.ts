import { NextFunction, Request, Response } from "express";
import User from "./user.model";

import mongoose from "mongoose";
import { Logger } from "tslog";
import * as sessionManager from "../Common/middleware/sessionManagement";
import { handleError } from "../utility";
import { isIBasicUser, IUser, IUserVolunteerType, mapUserToUserSummary } from "./user.interface";
import VolunteerType from "../VolunteerType/volunteerType.model";
import { sendVolunteerRequestEmail, sendVolunteerApprovalEmail } from "../mailer/mailer";
import bcrypt from "bcrypt";

const logger = new Logger({ name: "user.controller" });

/**
 * Get all users request
 * If a user is found, return the array of students and a response of 200
 * Else return a 500 error with the error message
 */
export const getAllUsers = (_req: Request, res: Response, _next: NextFunction) => {
    User.find()
        .exec()
        .then((results) => {
            return res.status(200).json({
                data: results.map(mapUserToUserSummary),
                success: true,
                message: "Retrieved all users",
            });
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "Get all users failed");
        });
};

export const getAllAdmins = () => {
    try {
        const admins = User.find({ isAdmin: true });
        return admins;
    } catch (err: unknown) {
        logger.error(err);
        return undefined;
    }
};

/**
 * Get a single user by their Student ID request
 * If a user is found, return the array of students and a response of 200
 * Else return a 500 error with the error message
 */
export const getUserById = (req: Request, res: Response, _next: NextFunction) => {
    User.findById(req.params.id)
        .exec()
        .then((foundUser) => {
            if (!foundUser) {
                res.status(404).json({
                    message: "Not found",
                    success: false,
                });
                return;
            }
            res.status(200).json({
                message: "Found a matching user",
                data: mapUserToUserSummary(foundUser),
                success: true,
            });
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "Find singular user failed");
        });
};

export const getUserByEmail = async (email: string): Promise<IUser | undefined> => {
    try {
        if (!email) return undefined;
        const results = (await User.findOne({ email })) || undefined;
        return results;
    } catch (err: unknown) {
        logger.error(err);
        return undefined;
    }
};

interface ResetPasswordBody {
    email: string;
    password: string;
}

function isResetPasswordBody(args: unknown): args is ResetPasswordBody {
    const partial = args as Partial<ResetPasswordBody>;
    return typeof args === "object" && typeof partial.password === "string" && typeof partial.email === "string";
}

export const setUserPassword = (req: Request, res: Response, _next: NextFunction) => {
    const newInfo = req.body as unknown;
    if (!isResetPasswordBody(newInfo)) {
        res.status(400).json({ message: "Password reset request body was not valid", success: false });
        return;
    }

    // Would need to get past middleware checks for loggedInUser to be null, but just in case
    const requestingUser = req.session.user;
    if (requestingUser == null) {
        res.status(401).json({ message: "Must be logged in to reset password", success: false });
        return;
    }

    // If the email that was sent and the logged in user's email doesn't match, AND the requesting user
    // isn't an admin, don't let em through
    if (newInfo.email !== requestingUser.email && !requestingUser.isAdmin) {
        res.status(403).json({ message: "Cannot set password for another user", success: false });
        return;
    }

    User.findOne({ email: newInfo.email })
        .exec()
        .then(async (result) => {
            try {
                const notFound = "User could not be found";
                if (!result) {
                    handleError(logger, res, notFound, notFound, 404);
                    return;
                }
                result.password = newInfo.password;
                await result.save();
                res.status(200).json({
                    message: "Reset password",
                    success: true,
                });
            } catch (err: unknown) {
                handleError(logger, res, err, "Set password failed");
            }
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "Set password failed");
        });
};

/**
 * Regiter a user
 * If a user has an existing account then throw an error to state that
 * Else send a request to the backend to sign them up
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userFields = req.body as IUser;
        if (!isIBasicUser(userFields)) {
            res.status(400).json({ message: "New user request body was not valid", success: false });
            return;
        }
        const existingUser = await User.findOne({ email: userFields.email });

        if (existingUser) {
            logger.warn(existingUser);
            res.status(400).json({
                message: "User of that email already exists",
                success: false,
                data: null,
            });
            return;
        }

        // Set the volunteer types (also set approved status if that type requires admin approval or not)
        const newVolunteerTypes = [] as Array<IUserVolunteerType>;
        if (userFields?.volunteerTypes && userFields?.volunteerTypes instanceof Array) {
            for (let index = 0; index < userFields?.volunteerTypes.length; index++) {
                const vType = userFields?.volunteerTypes[index];
                if (!vType.type) continue;
                const targetVolType = await VolunteerType.findById(vType.type);
                if (targetVolType) {
                    newVolunteerTypes.push({
                        type: new mongoose.Types.ObjectId(targetVolType._id.toString()),
                        approved: !targetVolType?.requiresApproval, // if no appoval required, set approved to true
                    });
                }
            }
        }

        const newUser = new User({
            email: userFields.email,
            password: userFields.password,
            firstName: userFields.firstName,
            lastName: userFields.lastName,
            lastLogin: 0,
            volunteerTypes: newVolunteerTypes,
        });

        console.log(newUser);

        newUser.id = new mongoose.Types.ObjectId();
        const createdUser = await newUser.save();
        res.status(200).json({
            message: "User register success",
            data: mapUserToUserSummary(createdUser),
            success: true,
        });
        return;
    } catch (err) {
        handleError(logger, res, err, "User registration failed");
        return;
    }
};

interface LoginDetails {
    email: string;
    password: string;
}

function isLoginBody(args: unknown): args is LoginDetails {
    const p = args as Partial<LoginDetails>;
    return typeof p === "object" && typeof p.email === "string" && typeof p.password === "string";
}

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const loginDetails = req.body as unknown;
        if (!isLoginBody(loginDetails)) {
            res.status(400).json({ message: "Login request body was not valid", success: false });
            return;
        }

        const { email, password } = loginDetails;

        // Look for the user in the db and if found, check password matches immediately
        const foundUser = await User.findOne({ email });
        if (!(foundUser && bcrypt.compareSync(password, foundUser.password))) {
            res.status(400).json({
                message: "Login failed, email and password combination was incorrect",
                success: false,
            });
            return;
        }

        foundUser.lastLogin = Date.now();
        await foundUser.save();

        sessionManager.createSession(req, { _id: foundUser?._id, email, isAdmin: foundUser?.isAdmin || false });
        res.status(200).json({ message: "Logged in successfully", success: true });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occurred");
    }
};

export const isSignedIn = async (req: Request, res: Response): Promise<void> => {
    const requestingUser = req.session.user ? await User.findOne({ email: req.session.user.email }) : undefined;
    if (requestingUser == null) {
        res.status(401).json({ message: "Not signed in", success: false });
        return;
    }

    res.status(200).json({
        message: "Signed in",
        success: true,
        data: { isAdmin: requestingUser.isAdmin },
    });
};
interface SetAdminBody {
    userId: string;
    makeAdmin: boolean;
}

function isSetAdminBody(args: unknown): args is SetAdminBody {
    const partial = args as Partial<SetAdminBody>;
    return typeof args === "object" && typeof partial.userId === "string" && typeof partial.makeAdmin === "boolean";
}

export const setUserIsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.session.user?.isAdmin) {
            res.status(404).send();
            return;
        }
        const reqInfo = req.body as unknown;
        const requestingUser = req.session.user;
        if (!isSetAdminBody(reqInfo)) {
            res.status(400).json({
                message: "Change user administrator flag request body was not valid",
                success: false,
            });
            return;
        } else if (requestingUser == null) {
            res.status(401).json({ message: "Not logged in", success: false });
            return;
        }

        const { userId, makeAdmin } = reqInfo;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "User could not be found.",
                success: false,
            });
            return;
        } else if (requestingUser.email === user.email) {
            // Dont let users accidentally remove themselves as admin...
            res.status(400).json({ message: "Cannot change own administrator flag", success: false });
            return;
        }

        user.isAdmin = makeAdmin;
        await user.save();

        res.status(200).json({
            message: `Successfully ${makeAdmin ? "added" : "removed"} administrator flag for user`,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Change user administrator flag failed");
    }
};

// User.find({ email: req.body.email }).exec(function (err, users) {
//         if (!users.length) {
//             return res.status(400).json({
//                 loginStatus: false,
//             });
//         } else {
//             user = users[0];
//             bcrypt.compare(req.body.password, user.password, function (err, response) {
//                 // Checking the hash stored in the database with the entered value
//                 // if (err) throw err; //Built in error handler
//                 if (response && user.email == req.body.email) {
//                     // Check if the email is the same as the one stored in the database
//                     req.session.userid = user.email; // Sets the session to the user and assigns a cookie
//                     req.session.id_number = user.id_number;
//                     //console.log(req.session); // logging the session for development purposes
//                     res.json({ loginStatus: true }); // responding with whether the user was able to login or not
//                 } else {
//                     res.json({ loginStatus: false }); // responding with whether the user was able to login or not
//                 }
//             });
//         }
//     });
// };

export const getOwnUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestingUser = req.session.user;
        if (requestingUser == null) {
            res.status(401).json({ message: "Must be logged in", success: false });
            return;
        }

        const user = await User.findOne({ email: requestingUser.email }).populate("qualifications");
        if (!user) {
            res.status(404).json({ message: "Could not find user", success: false });
            return;
        }
        res.status(200).json({ message: "Got own user", data: mapUserToUserSummary(user), success: true });
    } catch (err) {
        handleError(logger, res, err, "Get own user failed");
    }
};

export const setCompleteShift = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(404).json({ message: "Requesting user doesn't exist", success: false });
            return;
        }

        //Cbeck to see if user is admin so they can mark other users as complete
        // This should be adjusted to check if the user is a supervising volunteer not admin
        // Will likely have to make DB adjustments for this to identify if user is supervisor
        const isAdmin = userObj?.isAdmin || false;
        let targettedUserId = userObj._id;
        if (isAdmin) {
            targettedUserId = req.params.userid;
        }
        if (!isAdmin && targettedUserId.toString() !== req.params.userid) {
            res.status(401).json({ message: "Unauthorised, admin privileges are required", success: false });
            return;
        }

        const completionStatus = req.params.completionstatus === "complete";

        //Add some checking to ensure the time is past that of the shift so it cant be completed before?
        const completeShiftResult = await User.findOneAndUpdate(
            { _id: targettedUserId, "shifts.shift": req.params.shiftid },
            { $set: { "shifts.$.completed": completionStatus } }
        );

        if (completeShiftResult) {
            res.status(200).json({
                message: "User set completion success",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "User or user shift not found",
                success: true,
            });
            return;
        }
    } catch (err) {
        handleError(logger, res, err, "Complete user shift failed");
    }
};

// Sets the approval status of a particular volunteer type inside the user obj. Checks to make sure that type exists and that user has that vol type.
export const setApprovalVolunteerTypeForUser = async (req: Request, res: Response) => {
    try {
        // Get user obj to check if admin
        const userObj = await User.findOne({ _id: req.session.user?._id });

        if (!userObj || !userObj?.isAdmin) {
            handleError(logger, res, null, "Unauthorized", 401);
            return;
        }

        // Ensure this user has this qualification in the first place (redundant check but ensures that consumers of API provide a corresponding qualID and userID)
        const volunteerType = await VolunteerType.findById(req.params.volunteerTypeID);
        if (!req.params.volunteerTypeID || !volunteerType) {
            handleError(logger, res, null, "Volunteer Type not found.", 404);
            return;
        }

        const targetUser = await User.findOne({ _id: req.params.userid });
        if (!req.params.userid || !targetUser) {
            handleError(logger, res, null, "User not found.", 404);
            return;
        }

        const userHasVolType = targetUser.volunteerTypes.some(
            (vType) => vType.type.toString() === volunteerType._id.toString()
        );
        if (!userHasVolType) {
            handleError(logger, res, null, "User does not have this volunteer type.", 404);
            return;
        }

        const targetVolTypeInUserIdx = targetUser.volunteerTypes.findIndex(
            (volType) => volType.type.toString() === volunteerType._id.toString()
        );
        targetUser.volunteerTypes[targetVolTypeInUserIdx].approved = req.params.status === "approve";

        const saveResult = await targetUser.save();

        res.status(200).json({
            message: "Successfully approved volunteer type for user",
            data: saveResult,
            success: true,
        });

        if (req.params.status === "approve") {
            void sendVolunteerApprovalEmail(
                targetUser.email,
                targetUser.firstName,
                targetUser.lastName,
                volunteerType.name
            );
        }
    } catch (err) {
        handleError(logger, res, err, "Update qualification failed");
    }
};

export const assignVolunteerType = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(404).json({ message: "Requesting user doesn't exist", success: false });
            return;
        }

        const sessionUserId = userObj._id;
        if (sessionUserId != req.params.userid && !userObj.isAdmin) {
            res.status(401).json({
                message: "Unauthorised, you can only assign volunteer types to yourself unless you are an admin",
                success: false,
            });
            return;
        }

        const targetVolType = await VolunteerType.findById(req.params.volunteertypeid);
        const assignVolTypeResult = await User.findOneAndUpdate(
            { _id: req.params.userid },
            {
                $addToSet: {
                    volunteerTypes: { type: req.params.volunteertypeid, approved: !targetVolType?.requiresApproval },
                },
            }
        );

        if (assignVolTypeResult && targetVolType) {
            res.status(200).json({
                message: "User assigned to volunteer type",
                success: true,
            });
            const admins = await getAllAdmins();
            const adminEmails: Array<string> = [""];
            if (admins) {
                for (let i = 0; i < admins.length; i++) {
                    adminEmails[i] = admins[i].email;
                }
            }
            void sendVolunteerRequestEmail(
                adminEmails,
                sessionUserId,
                userObj.firstName,
                userObj.lastName,
                targetVolType.name
            );
            return;
        } else {
            res.status(404).json({
                message: "User not found",
                success: true,
            });
            return;
        }
    } catch (err) {
        handleError(logger, res, err, "Volunteer type assignment to user failed");
    }
};

export const removeVolunteerType = async (req: Request, res: Response) => {
    try {
        const userObj = await User.findOne({ _id: req.session.user?._id });
        if (!userObj) {
            res.status(404).json({ message: "Requesting user doesn't exist", success: false });
            return;
        }

        const sessionUserId = userObj._id;
        if (sessionUserId != req.params.userid && !userObj.isAdmin) {
            res.status(401).json({
                message: "Unauthorised, you can only remove volunteer types from yourself unless you are an admin",
                success: false,
            });
            return;
        }

        const removeVolTypeResult = await User.updateOne(
            { _id: req.params.userid },
            {
                $pull: {
                    volunteerTypes: { type: req.params.volunteertypeid },
                },
            }
        );

        if (removeVolTypeResult) {
            res.status(200).json({
                message: "Volunteer type removed from user",
                success: true,
            });
            return;
        } else {
            res.status(404).json({
                message: "User not found",
                success: true,
            });
            return;
        }
    } catch (err) {
        handleError(logger, res, err, "Volunteer type removal from user failed");
    }
};
