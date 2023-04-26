import mongoose from "mongoose";
import { Schema } from "mongoose";
import { INotification } from "./notifications.interface";

const NotificationSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        time: { type: Date, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
