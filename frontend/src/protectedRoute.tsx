import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUser, User } from "./api/userApi";

const authPath = "/login";

export type ProtectedRouteProps = {
    needsAdmin?: boolean;
    outlet: JSX.Element;
};

export const loggedInUserIsAdmin = (): boolean => _user != null && _user.isAdmin;

let _user: User | undefined = undefined;
export const getLoggedInUser = (): User | undefined => {
    return _user != null ? { ..._user } : undefined;
};

const setCurrentUser = (user: User): void => {
    _user = user;
};

export default function ProtectedRoute({ needsAdmin, outlet }: ProtectedRouteProps) {
    const [loading, setLoading] = useState(true);
    const [authDetails, setAuthDetails] = useState<{ isAdmin: boolean; isAuthenticated: boolean } | undefined>();
    useEffect(() => {
        async function updateSessionStateFromAPI() {
            try {
                if (!(authDetails && authDetails.isAuthenticated)) {
                    const { success, data } = await getUser();
                    if (!(success && data)) return;
                    const authDeets = { isAdmin: data.isAdmin, isAuthenticated: true };
                    setAuthDetails(authDeets);
                    setCurrentUser(data);
                }
            } finally {
                setLoading(false);
            }
        }
        updateSessionStateFromAPI().catch(console.error);
    }, []);
    if (loading) {
        return <div></div>;
    } else if (!authDetails || !authDetails.isAuthenticated || (needsAdmin && !authDetails.isAdmin)) {
        return <Navigate to={{ pathname: authPath }} replace />;
    } else {
        return outlet;
    }
}
