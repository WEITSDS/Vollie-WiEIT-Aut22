import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const FeedbackSchema: Schema = new Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
        session: { type: String, required: false },
        experience: { type: String, required: false },
        learnings: { type: String, required: false },
        teacher: { type: String, required: false },
        studentEngagement: { type: String, required: false },
        teacherEngagement: { type: String, required: false },
        improvements: { type: String, required: false },
        styles: { type: String, required: false },
        rating: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
