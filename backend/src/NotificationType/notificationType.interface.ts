import { Document } from "mongoose";

export interface INotificationType extends Document {
    type: string;
}
