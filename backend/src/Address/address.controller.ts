/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Address from "./address.model"; // Import the address model
import { Request, Response } from "express";

export const addVenue = async (req: Request, res: Response) => {
    try {
        const { venue, address } = req.body; // Extracting address from the request body
        const newVenue = new Address({ venue, address }); // Including address in the new document
        await newVenue.save();
        res.status(201).json(newVenue);
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        res.status(400).json({ message });
    }
};

export const getAllVenues = async (_req: Request, res: Response) => {
    try {
        const venues = await Address.find({});
        res.json(venues);
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        res.status(500).json({ message });
    }
};

export const deleteVenue = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const venue = await Address.findByIdAndDelete(id);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }
        return res.json({ message: "Venue deleted successfully", venue }); // Ensure return here
    } catch (error) {
        const message = (error as Error).message; // Type assertion
        return res.status(500).json({ message }); // Ensure return here
    }
};

export const updateVenue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { venue, address } = req.body; // Extracting address from the request body

        const updatedVenue = await Address.findByIdAndUpdate(
            id,
            { venue, address }, // Updating both venue and address
            { new: true }
        );

        if (!updatedVenue) {
            res.status(404).json({ message: "Venue not found" });
            return;
        }

        res.json({ message: "Venue updated successfully", updatedVenue });
    } catch (error) {
        const message = (error as Error).message;
        res.status(500).json({ message });
    }
};
