import mongoose from "mongoose";
import { Schema } from "mongoose";
import { INotificationType } from "./notificationType.interface";

const NotificationTypeSchema:Schema = new Schema(
    {
        type: {
            type: String,
            required: true,
            unique: true,
            trim: true 
        },
    },
    
        {
        timestamps: true
        }  
    
    
);

export default mongoose.model<INotificationType>("NotificationType", NotificationTypeSchema);