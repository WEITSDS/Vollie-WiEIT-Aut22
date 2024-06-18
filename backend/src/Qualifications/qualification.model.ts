// import mongoose from "mongoose";
// import { Schema } from "mongoose";
// import { IQualification } from "./qualifications.interface";

// const QualificationSchema: Schema = new Schema(
//     {
//         // title: { type: String, required: true },
//         // description: { type: String, required: true },
//         // filePath: { type: String, required: true },
//         // fileId: { type: String, required: true },
//         user: { type: mongoose.Types.ObjectId, ref: "User" },
//         qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
//         expiredAndNotified: { type: Boolean, default: false },
//         approved: { type: Boolean, default: false },
//         wwccNumber: { type: String, required: true },
//         expiryDate: { type: String, required: true },
//         dateOfbirth: { type: String, required: true },
//         fullName: { type: String, required: true },
//     },
//     {
//         timestamps: true,
//     }
// );

// export default mongoose.model<IQualification>("Qualification", QualificationSchema);
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IQualification } from "./qualifications.interface";

const QualificationSchema: Schema = new Schema(
    {
        // title: { type: String, required: true },
        // description: { type: String, required: true },
        // filePath: { type: String, required: true },
        // fileId: { type: String, required: true },

        user: { type: mongoose.Types.ObjectId, ref: "User" },
        // qualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType" },
        // expiredAndNotified: { type: Boolean, default: false },
        // approved: { type: Boolean, default: false },
        wwccNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
        dateOfbirth: { type: String, required: true },
        fullName: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IQualification>("Qualification", QualificationSchema);
