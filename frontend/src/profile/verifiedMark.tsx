import { User } from "../api/userAPI";

interface VerifiedMarkProps {
    editingSelf?: boolean;
    user: User;
    onUnverifiedClick?: () => void;
}

function monthDiff(d1: Date, d2: Date) {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months;
}

export const VerifiedMark = ({ editingSelf, user, onUnverifiedClick }: VerifiedMarkProps) => {
    const diff = monthDiff(new Date(user.registeredAt), new Date(user.lastLogin));
    const userHasntLoggedInRecently = diff < 1;
    return (
        <>
            {user.verified ? (
                <i
                    title={`${editingSelf ? "Your" : "This"} account is verified!`}
                    className="bi bi-patch-check-fill text-success"
                />
            ) : (
                <i
                    onClick={onUnverifiedClick}
                    title={`${editingSelf ? "Your" : "This"} account is not verified!`}
                    className="bi bi-patch-exclamation-fill text-danger"
                />
            )}
            {userHasntLoggedInRecently && false && (
                <i
                    title={`${editingSelf ? "Your" : "This"} account has not been logged into for at least 1 month!`}
                    className="bi bi-exclamation-triangle-fill text-warning"
                />
            )}
        </>
    );
};
