import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ITag } from "./tag.interface";

const TagSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITag>("Tag", TagSchema);
