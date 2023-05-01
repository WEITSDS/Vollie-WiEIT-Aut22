//import { Request, Response } from "express";
import { Logger } from "tslog";
//import  {handleError} from "../utility";
//import {INotification, isINotification } from "./notifications.interface";
import Notification from "./notifications.model";
//import User from "../User/user.model";
//import mongoose, { Types } from "mongoose";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
//import { IUser } from "../User/user.interface";

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

        //await user.update({$push: { notifications: notif._id as string } });
        //await Promise.all([notif.save(), user.save()]);
        logger.debug(`Created notification successfully for ${userFirstName}`);
        return;
    } catch (err) {
        logger.error(err);
    }
}
