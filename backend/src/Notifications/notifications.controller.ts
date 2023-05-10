import { Request, Response } from "express";
import { Logger } from "tslog";
//import { handleError } from "../utility";
//import {INotification, isINotification } from "./notifications.interface";
import Notification from "./notifications.model";
import User from "../User/user.model";
//import mongoose, { Types } from "mongoose";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
//import { IUser } from "../User/user.interface";

const logger = new Logger({ name: "notification.controller" });

export const createNotification = async (
    userEmail: string,
    content: string,
    userFirstName: string,
    ccEmails: string | string[]
): Promise<void> => {
    try {
        const user = await getUserByEmail(userEmail);
        if (!user) {
            logger.debug(`User not found for '${userEmail}'for notification ${userFirstName}`);
            return;
        }

        const adminLists = [];
        for (let i = 0; i < ccEmails.length; i++) {
            const adminId = await getUserByEmail(ccEmails[i]);
            if (!adminId) {
                logger.debug(`User not found for '${userEmail}'for notification ${userFirstName}`);
                return;
            }
            adminLists.push(adminId);
        }

        const notif = new Notification({
            content: content,
            user: user._id,
            admins: adminLists,
            time: new Date(),
        });
        notif.id = new mongoose.Types.ObjectId();
        await user.update({ $push: { notifications: notif._id as string } });

        for (let i = 0; i < adminLists.length; i++) {
            await adminLists[i].update({ $push: { notifications: notif._id as string } });
            await Promise.all([adminLists[i].save()]);
        }

        await Promise.all([notif.save(), user.save()]);
        logger.debug(`Created notification successfully for ${userFirstName}`);
        return;
    } catch (err) {
        logger.error(err);
    }
};

/*
export const getNotifications= async (req: Request, res: Response) => {
    await getNotificationsForUser(getUserByEmail(req.session.user?.email || ""), res);
};

const getNotificationsForUser = async (userPromise: Promise<IUser | undefined | null>, res: Response) => {
    try {
        const currentUser = await userPromise;
        if (!currentUser) {
            res.status(404).json({message: "Could not find user", success: false});
            return;
        }
        // find all the notifications and populate the notification type nested doc instead of sending back an id
        const notifications= await Notification.find({ _id: { $in: currentUser.notifications } }).populate(
            "qualificationType"
        );

        res.status(200).json({
            message: "Got notifications for current user successfully",
            data: notifications,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occured");
    }
};*/

export const getNotifications = async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        const { _id: userID } = req.session.user || {};

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        const userNotifcations = await Notification.find({ "users.user": userID }).sort({
            startAt: 1,
        });

        res.status(200).json({
            message: "success",
            data: userNotifcations,
            success: true,
        });
        return;
    } catch (error) {
        console.log("Get user notifications error", error);
        res.status(500).json({
            message: "Get user notifications error",
            error,
            success: false,
        });
        return;
    }
};