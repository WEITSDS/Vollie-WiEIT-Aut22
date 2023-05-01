import { Request, Response } from "express";
import { Logger } from "tslog";
import  {handleError} from "../utility";
//import {INotification, isINotification } from "./notifications.interface";
import Notification from "./notifications.model";
import User from "../User/user.model";
//import mongoose, { Types } from "mongoose";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
import { IUser } from "../User/user.interface";

const logger = new Logger({ name: "notification.controller" });

export const createNotification = async (userEmail: string, content: string, userFirstName: string): Promise<void> => {
    try {
        const user = await (getUserByEmail(userEmail));
        if(!user) {
            logger.debug(`User not found for '${userEmail}'for notification ${userFirstName}`);
            return;
        }

        const notif = new Notification({
            content: content,
            user: user._id,
            time: new Date(),
        });
        notif.id = new mongoose.Types.ObjectId();
        await user.update({$push: { notifications: notif._id as string } });
        await Promise.all([notif.save(), user.save()]);
        logger.debug(`Created notification successfully for ${userFirstName}`);
        return;
    } catch (err) {
        logger.error(err);
    }
}

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
};

export const deleteQualificationById = async (req: Request, res: Response) => {
    try {
        const notif = await Notification.findById(req.params.id).populate("notifications");
        
        if(!notif) {
            res.status(404).json({
                message: "Could not find matching notification",
                success: false,
            });
            return;
        }

        console.log(notif);

        const pullIDResponse = await User.updateOne(
            {_id: notif.user.toString() },
            /// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            { $pull: { notifications: notif.id } }
        );
        console.log(pullIDResponse);
        await notif.remove();

        res.status(200).json({
            message: "Deleted notification",
            data: null,
            success: true,
        });
    } catch (err) {
        handleError(logger, res, err, "Delete notification failed");
    }
};