import { Badge } from "react-bootstrap";
import { User } from "../../api/userAPI";

interface TagBadgesProps {
    user: User;
    onEditClick?: (e: React.MouseEvent<HTMLElement>, u: User) => void;
}
export const TagBadges = ({ user, onEditClick }: TagBadgesProps) => {
    return (
        <>
            {user.tags.map((tag) => (
                <Badge key={tag._id} title={tag.description} className="mx-1 mb-1">
                    {tag.name}
                </Badge>
            ))}
            {onEditClick && (
                <Badge title="Edit tags" className="bg-success mx-1 mb-1" onClick={(e) => onEditClick(e, user)}>
                    <i className="text-white bi bi-plus-lg" />
                </Badge>
            )}
        </>
    );
};
