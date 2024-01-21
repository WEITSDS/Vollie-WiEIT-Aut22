import mongoose, { Document, Schema } from "mongoose";

// Interface to represent the structure of an Address document
export interface IAddress extends Document {
    address: string;
    veune: string;
}

// Create a Mongoose schema for an address
const addressSchema: Schema = new Schema(
    {
        venue: {
            type: String,
            required: true,
            unique: true,
        },

        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create and export the Mongoose model
const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
