import mongoose, { Document, Schema } from "mongoose";

// Interface to represent the structure of an Address document
export interface IAddress extends Document {
    address: string;
}

// Create a Mongoose schema for an address
const addressSchema: Schema = new Schema(
    {
        address: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the Mongoose model
const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
