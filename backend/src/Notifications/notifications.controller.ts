import { Request, Response } from "express";
import { Logger } from "tslog";
import Notification from "./notifications.model";
import User from "../User/user.model";
import mongoose from "mongoose";
import { getUserByEmail } from "../User/user.controller";
//import Shift from "../Shift/shift.model";

const logger = new Logger({ name: "notification.controller" });

export const createNotification = async (
    userEmail: string,
    content: string,
    userFirstName: string,
    ccEmails: string | string[],
    type: string,
    typeId?: string,
    userVolType?: string
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

        const date = new Date();

        const notif = new Notification({
            content: content,
            user: user._id,
            admins: adminLists,
            userFirstName: userFirstName,
            type: type,
            time: date.toLocaleString(),
            typeId: typeId,
            userVolType: userVolType,
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

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { _id: userID } = req.session.user || {};

        const userObj = await User.findOne({ _id: userID });
        if (!userObj) {
            res.status(403).json({ message: "Could not find user object", success: false });
            return;
        }

        const respNotifications = [];
        for (let idx = 0; idx < userObj.notifications.length; idx++) {
            const notificationID = userObj.notifications[idx];
            respNotifications.unshift(await Notification.findOne({ _id: notificationID }));
        }

        res.status(200).json({
            message: "success",
            data: respNotifications,
            success: true,
        });
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

export const updateNotificationStatus = async (req: Request, res: Response) => {
    const { action, notificationId } = req.body as { action: string; notificationId: string };

    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { action: action },
            { new: true }
        );

        if (updatedNotification === null) {
            res.status(404).json({ message: "Notification not found", success: false });
            return;
        }
        //const validTypes = ["SPROUT", "Gender Equity"];
        console.log("PRINTING WHAT TYPE IS: " + updatedNotification.type);
        if (updatedNotification.typeId && (action === "Approved" || action === "Declined")) {
            if (updatedNotification.type === "Approve Shift") {
                console.log("CHECK IF ITS working with what" + updatedNotification.user.toString());
                console.log("CHEKCKLING IF ITS WOKRING" + updatedNotification.userVolType.toString());

                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                await User.findOneAndUpdate(
                    { _id: updatedNotification.user, "shifts.shift": updatedNotification.typeId },
                    { $set: { "shifts.$.approved": action === "Approved" } }
                );
            } else if (updatedNotification.type === "SPROUT" || updatedNotification.type === "Gender Equity") {
                console.log("CHEKCKLING IF ITS WOKRING" + updatedNotification.userVolType.toString());
                // If VolunteerType also uses typeId and similar schema as Shift, use a similar approach
                const updatedUser = await User.findOneAndUpdate(
                    { _id: updatedNotification.userVolType, "volunteerTypes.type": updatedNotification.typeId },
                    { $set: { "volunteerTypes.$.approved": action === "Approved" } },
                    { new: true }
                );
                console.log(updatedUser);
            }
        }

        res.status(200).json({ message: "Notification status updated", success: true, data: updatedNotification });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
