/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Address from "./address.model"; // Import the address model
import { Request, Response } from "express";

// Create a new address
export const addAddress = async (_req: Request, res: Response) => {
    try {
        const { address } = _req.body;
        const newAddress = new Address({ address });
        await newAddress.save();
        res.status(201).json(newAddress);
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        res.status(400).json({ message });
    }
};

// Get all addresses
export const getAllAddresses = async (_req: Request, res: Response) => {
    try {
        const addresses = await Address.find({});
        res.json(addresses);
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        res.status(500).json({ message });
        return; // Ensure there's a return statement here
    }
};

// Delete an address
// Delete an address
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const address = await Address.findByIdAndDelete(id);
        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }
        return res.json({ message: "Address deleted successfully", address }); // Ensure return here
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        return res.status(500).json({ message }); // Ensure return here
    }
};
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { address } = req.body;

        const updatedAddress = await Address.findByIdAndUpdate(id, { address }, { new: true });

        if (!updatedAddress) {
            return;
        }

        res.json({ message: "Address updated successfully", updatedAddress });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ message });
    }
};
