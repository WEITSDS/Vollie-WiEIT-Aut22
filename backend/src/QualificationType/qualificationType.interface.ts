import { Document } from "mongoose";

export interface IQualificationType extends Document {
    name: string;
    description: string;
    requiresApproval: boolean;
}
