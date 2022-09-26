import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

// 2. Create a Schema corresponding to the document interface.
const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        lastLogin: { type: Number, required: true },
        verified: { type: Boolean, default: false, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        qualifications: [{ type: mongoose.Types.ObjectId, ref: "Qualification" }],
        tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
        shifts: [
            {
                shiftId: { type: mongoose.Types.ObjectId, ref: "Shift" },
                chosenQualificationType: { type: mongoose.Types.ObjectId, ref: "QualificationType", required: true },
            },
        ],
        volunteerTypes: [
            {
                type: { type: mongoose.Types.ObjectId, ref: "VolunteerType" },
                approvalStatus: { type: Boolean, default: false },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// * Hash the password befor it is beeing saved to the database
UserSchema.pre("save", function (this: IUser, next: (err?: Error | undefined) => void) {
    const salt = 10;
    // * Make sure you don't hash the hash
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

// 3. Create a Model.
export default mongoose.model<IUser>("User", UserSchema);
