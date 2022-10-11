import { Document, ObjectId } from "mongoose";

export interface IVolunteerType extends Document {
    _id: ObjectId;
    name: string;
    description: string;
    requiresApproval: boolean;
}
