import { useState, useEffect } from "react";

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
                const response = await fetch(`/api/profile-image/${userId}`);
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

    const updateProfileImage = async (file: File) => {
        if (!userId) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/profile-image/${userId}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload profile image");
            }

            const data = await response.json();
            setProfileImage(data.imageUrl);
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

    return { profileImage, loading, error, updateProfileImage };
};

// Adding this empty export statement makes the file a module
export {};
