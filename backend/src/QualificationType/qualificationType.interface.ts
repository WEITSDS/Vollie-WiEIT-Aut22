import { Types } from "mongoose";

export interface IQualificationType {
    _id: Types.ObjectId;
    name: string;
    description: string;
    requiresApproval: boolean;
}
