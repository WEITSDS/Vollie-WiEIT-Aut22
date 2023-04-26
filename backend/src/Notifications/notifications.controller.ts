import { Request, Response } from "express";
import { Logger } from "tslog";
import  {handleError} from "../utility";
import {INotification, isINotification } from "./notifications.interface";
import Notification from "./notifications.model";
import User from "../User/user.model";
import mongoose, { Types } from "mongoose";
import { getUserByEmail } from "../User/user.controller";
import { IUser } from "../User/user.interface";

const logger = new Logger({ name: "notification.controller" });

export const createNotification = async (req: Request, res: Response) => {
    const newNotification = req.body as INotification;
    if (!isINotification(newNotification)) {
        res.status(400).json({ message: "New notification request body not in expected format", success: false });
        return;
    }

    try {
        const user = await (newNotification.user && req.session.user?.isAdmin
            ? User.findById(newNotification.user)
            : getUserByEmail(req.session.user?.email || ""));
        if(!user) {
            res.status(404).json({ message: "User not found", success: false });
            return;
        }

        const notif = new Notification({
            content: newNotification.content,
            user: user._id,
            time: newNotification.time,
        });

        notif.id = new mongoose.Types.ObjectId();

        //await user.update({$push: { notifications: notif._id as string } });
        //await Promise.all([notif.save(), user.save()]);

        res.status(200).json({ message: "Created notification successfully", success: true});
    } catch (err) {
        handleError(logger, res, err, "An unexpected error occureed while creating notification.");
    }
}
