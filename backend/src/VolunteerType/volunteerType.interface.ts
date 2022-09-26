import { Document } from "mongoose";

export interface IVolunteerType extends Document {
    name: string;
    description: string;
    requiresApproval: boolean;
}
