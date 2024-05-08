import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const FeedbackSchema: Schema = new Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        shift: { type: mongoose.Types.ObjectId, ref: "Shift" },
        qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
        session: { type: String, required: false },
        experience: { type: String, required: false },
        keyLearnings: { type: String, required: false }, // for ambassadors
        learnings: { type: String, required: false },
        teacher: { type: String, required: false },
        studentEngagement: { type: String, required: false },
        teacherEngagement: { type: String, required: false },
        improvements: { type: String, required: false },
        sessionImprovements: { type: String, required: false }, // for sprouts
        styles: { type: String, required: false },
        contentDelivery: { type: String, required: false }, // for lead sprouts
        teamDynamics: { type: String, required: false }, // for lead sprouts
        rating: { type: String, required: true },
        formCompleted: { type: Boolean, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
