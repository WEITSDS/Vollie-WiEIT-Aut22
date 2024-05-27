import { Document, Types } from "mongoose";

export function isIBasicImage(args: unknown): args is IBasicImage {
    const p = args as Partial<IBasicImage>;
    return (
        typeof p === "object" &&
        typeof p.filePath === "string" &&
        typeof p.fileId === "string" &&
        typeof p.user === "string"
    );
}

export interface IBasicImage {
    filePath: string;
    fileId: string;
    user: Types.ObjectId;
}

export interface IImage extends Document, IBasicImage {}

export interface ImageSummary {
    _id: string;
    filePath: string;
}
