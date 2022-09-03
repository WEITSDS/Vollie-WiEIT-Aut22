import { Document } from "mongoose";
import { IUser } from "../User/user.interface";

export interface IBasicTag {
    name: string;
    description: string;
}

export interface ITag extends Document, IBasicTag {
    users: IUser[];
}

export function isIBasicTag(args: unknown): args is IBasicTag {
    const partial = args as Partial<IBasicTag>;
    return typeof partial === "object" && typeof partial.name === "string" && typeof partial.description === "string";
}

interface TagSummary extends IBasicTag {
    _id: string;
    userCount: number;
}

export function convertTagToTagSummary(t: ITag): TagSummary {
    return { _id: (t._id as string) || "", name: t.name, description: t.description, userCount: t.users.length };
}
