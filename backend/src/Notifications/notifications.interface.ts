import { Document, Types } from "mongoose";
import { IUser } from "../User/user.interface";

export interface INotification extends Document {
    content: string;
    user: Types.ObjectId; //userID
    userFirstName: string;
    type: string;
    time: string;
    admins: Array<Types.ObjectId>; //adminID
    userdata: IUser | null;
}
