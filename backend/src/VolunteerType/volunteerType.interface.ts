import { Document } from "mongoose";

export interface IVolunteerType extends Document {
    _id: string;
    name: string;
    description: string;
    requiresApproval: boolean;
}
