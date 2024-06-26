/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// AddressAPI.ts

// The base URL of your backend server
const ROOT_URL = "https://api.wieit.xyz";

// Interface for Address
export interface IAddress {
    _id?: string;
    venue: string;
    address: string;
}

// Helper function for handling responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return response.json();
};

// Add a new venue along with address
export const addNewVenue = async (venue: string, address: string): Promise<IAddress> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/add-venues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ venue, address }),
        });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Get all venues with addresses
export const getAllVenues = async (): Promise<IAddress[]> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/get-venues`);
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/delete-venues/${id}`, {
            method: "DELETE",
        });
        await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Update an existing venue and address
export const updateVenue = async (id: string, venue: string, address: string): Promise<IAddress> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/update-venues/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ venue, address }),
        });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};
