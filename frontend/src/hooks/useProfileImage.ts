import { useState, useEffect } from "react";
//import { ResponseWithData } from "../api/utility";

export const useProfileImage = (userId: string | undefined) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfileImage = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/profileAPI/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile image");
                }
                const data = await response.blob();
                const imageUrl = URL.createObjectURL(data);
                setProfileImage(imageUrl);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };

        void fetchProfileImage(); // Handle promise by explicitly marking it as ignored with 'void'
    }, [userId]);

    return { profileImage, loading, error };
};

export {};
