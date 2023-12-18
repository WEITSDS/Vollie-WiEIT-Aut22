/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-useless-catch */
// AddressAPI.ts

// The base URL of your backend server
const ROOT_URL = window.location.origin;

// Interface for Address
export interface IAddress {
    _id?: string;
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

// Add a new address
export const addNewAddress = async (address: string): Promise<IAddress> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/add-addresses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
        });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Get all addresses
export const getAllAddresses = async (): Promise<IAddress[]> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/get-addresses`);
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};

// Delete an address
export const deleteAddress = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/delete-addresses/${id}`, {
            method: "DELETE",
        });
        await handleResponse(response);
    } catch (error) {
        throw error;
    }
};
// Update an existing address
export const updateAddress = async (id: string, address: string): Promise<IAddress> => {
    try {
        const response = await fetch(`${ROOT_URL}/api/addresses/update-addresses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address }),
        });
        return handleResponse(response);
    } catch (error) {
        throw error;
    }
};
export default {
    addNewAddress,
    getAllAddresses,
    deleteAddress,
};
