import { Document } from "mongoose";

// Interface for an Address
export interface IAddress extends Document {
    address: string;
}
