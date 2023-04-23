import { Document, Types } from "mongoose";

export interface INotification extends Document {
    content: string;
    user: Types.ObjectId;
    time: Date;
}
