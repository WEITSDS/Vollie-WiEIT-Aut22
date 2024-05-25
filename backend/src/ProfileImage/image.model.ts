import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IImage } from "./image.interface";

const ImageSchema: Schema = new Schema(
    {
        filePath: { type: String, required: true },
        fileId: { type: String, required: true },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IImage>("ProfileImage", ImageSchema);
