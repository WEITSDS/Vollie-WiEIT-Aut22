import mongoose from "mongoose";
import { Schema } from "mongoose";
import { INotification } from "./notifications.interface";

const NotificationSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        userFirstName: { type: String, required: true },
        type: { type: String, required: true },
        time: { type: String, required: true },
        action: { type: String, default: "Pending" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INotification>("Notification", NotificationSchema);
