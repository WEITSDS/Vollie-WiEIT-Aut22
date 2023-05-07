import { Document, Types } from "mongoose";

export interface INotification extends Document {
    content: string;
    user: Types.ObjectId; //userID
    time: Date;
    admins: Array<Types.ObjectId>; //adminID
}

/*export function isINotification(args: unknown): args is INotification {
    const p = args as Partial<INotification>;
    return (
        typeof p === "object" &&
        typeof p.content === "string" &&
        typeof p.user === "string" &&
        typeof p.time === "string"
    );
}*/
