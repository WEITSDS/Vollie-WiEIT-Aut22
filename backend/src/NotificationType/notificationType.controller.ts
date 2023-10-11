import NotificationType from "./notificationType.model";
import { Request, Response } from "express";

export const createNotificationType = async (req: Request, res: Response) => {
    const { type } = req.body;
    try {
        const newType = new NotificationType({ type });
        await newType.save();
        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ message: "Error creating notification type", error });
    }
};

export const getAllNotificationTypes = async (_: Request, res: Response) => {
    try {
        const types = await NotificationType.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notification types", error });
    }
};

export const updateNotificationType = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedType = await NotificationType.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedType);
    } catch (error) {
        res.status(500).json({ message: "Error updating notification type", error });
    }
};

export const deleteNotificationType = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await NotificationType.findByIdAndRemove(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification type", error });
    }
};