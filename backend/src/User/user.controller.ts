import { NextFunction, Request, Response } from "express";
import User from "./user.model";
import Tag from "../Tag/tag.model";
import mongoose from "mongoose";
import { Logger } from "tslog";
import * as sessionManager from "../Common/middleware/sessionManagement";
import { handleError } from "../utility";
import { isIBasicUser, IUser, mapUserToUserSummary } from "./user.interface";
import bcrypt from "bcrypt";

const logger = new Logger({ name: "user.controller" });

/**
 * Get all users request
 * If a user is found, return the array of students and a response of 200
 * Else return a 500 error with the error message
 */
export const getAllUsers = (_req: Request, res: Response, _next: NextFunction) => {
    User.find()
        .populate("tags")
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

/**
 * Get a single user by their Student ID request
 * If a user is found, return the array of students and a response of 200
 * Else return a 500 error with the error message
 */
export const getUserById = (req: Request, res: Response, _next: NextFunction) => {
    User.findById(req.params.id)
        .populate("tags")
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
        const results = (await User.findOne({ email }).populate("tags")) || undefined;
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
export const createUser = (req: Request, res: Response) => {
    const userFields = req.body as unknown;
    if (!isIBasicUser(userFields)) {
        res.status(400).json({ message: "New user request body was not valid", success: false });
        return;
    }

    User.findOne({ email: userFields.email })
        .exec()
        .then((existingUser) => {
            if (existingUser != null) {
                logger.warn(existingUser);
                res.json({
                    message: "Email Already Exists",
                    status: false,
                });
            }

            const newUser = new User({
                email: userFields.email,
                password: userFields.password,
                firstName: userFields.firstName,
                lastName: userFields.lastName,
                lastLogin: 0,
            });

            newUser.id = new mongoose.Types.ObjectId();
            logger.info(newUser);
            newUser
                .save()
                .then((results) => {
                    return res.status(200).json({
                        message: "User register success",
                        data: mapUserToUserSummary(results),
                        success: true,
                    });
                })
                .catch((err: unknown) => {
                    handleError(logger, res, err, "User registration failed");
                });
        })
        .catch((err: unknown) => {
            handleError(logger, res, err, "User registration failed");
        });
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

        sessionManager.createSession(req, { email, isAdmin: foundUser?.isAdmin || false });
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

interface BatchUserTagBody {
    userId: string;
    tagIds: string[];
}

function isBatchUserTagBody(args: unknown): args is BatchUserTagBody {
    const partial = args as Partial<BatchUserTagBody>;
    return (
        typeof args === "object" &&
        typeof partial.userId === "string" &&
        partial.tagIds != null &&
        Array.isArray(partial.tagIds) &&
        (partial.tagIds.length === 0 || typeof partial.tagIds[0] === "string")
    );
}

export const batchChangeUserTag = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.session.user?.isAdmin) {
            res.status(404).send();
            return;
        }
        const reqInfo = req.body as unknown;
        if (!isBatchUserTagBody(reqInfo)) {
            res.status(400).json({ message: "Batch user tag change request body was not valid", success: false });
            return;
        }

        // Would need to get past middleware checks for loggedInUser to be null, but just in case
        const requestingUser = req.session.user;
        if (requestingUser == null) {
            res.status(401).json({ message: "Must be logged in to reset password", success: false });
            return;
        }

        const { tagIds, userId } = reqInfo;

        const tagObjIds = tagIds.map((tId) => new mongoose.Types.ObjectId(tId));

        const tags = await Tag.find({ _id: { $in: tagObjIds } });
        const user = await User.findById(userId).populate("tags");

        if (!(tags && user)) {
            res.status(404).json({
                message: `${[
                    user == null ? "User could not be found." : "",
                    tags == null ? "Tags could not be found." : "",
                ].join(" ")}`,
                success: false,
            });
            return;
        }
        const ogTags = user.tags.map((t) => t._id as string);
        const removedTags = ogTags.filter((o) => !tagIds.includes(o)).map((tId) => new mongoose.Types.ObjectId(tId));
        const addedTags = tagIds.filter((o) => !ogTags.includes(o)).map((tId) => new mongoose.Types.ObjectId(tId));

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        await user.update({ $set: { tags: tags.map((t) => t._id) } });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await Tag.updateMany({ _id: { $in: removedTags } }, { $pull: { users: user._id } });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await Tag.updateMany({ _id: { $in: addedTags } }, { $push: { users: user._id } });

        res.status(200).json({
            message: `Successfully updated tags for user`,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Batch change user tag failed");
    }
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

export const getOwnTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestingUser = req.session.user;
        if (requestingUser == null) {
            res.status(401).json({ message: "Must be logged in", success: false });
            return;
        }

        const user = await User.findOne({ email: requestingUser.email });
        if (!user) {
            res.status(404).json({ message: "Could not find user", success: false });
            return;
        }

        res.status(200).json({ message: "Got own tags", data: user.tags, success: true });
    } catch (err) {
        handleError(logger, res, err, "Get own tags failed");
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

        const user = await User.findOne({ email: requestingUser.email }).populate("tags").populate("qualifications");
        if (!user) {
            res.status(404).json({ message: "Could not find user", success: false });
            return;
        }
        res.status(200).json({ message: "Got own user", data: mapUserToUserSummary(user), success: true });
    } catch (err) {
        handleError(logger, res, err, "Get own user failed");
    }
};
