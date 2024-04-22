import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const FeedbackSchema: Schema = new Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
        experience: { type: String, required: false },
        learnings: { type: String, required: false },
        teacher: { type: String, required: false },
        studentEngagement: { type: String, required: false },
        teacherEngagement: { type: String, required: false },
        improvements: { type: String, required: false },
        improvementMethods: { type: String, required: false }, // for sprouts
        styles: { type: String, required: false },
        content: { type: String, required: false }, // for lead sprouts
        teamDynamics: { type: String, required: false }, // for lead sprouts
        additionalComments: { type: String, required: false }, // for sprouts
        rating: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
