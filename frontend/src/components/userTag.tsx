import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Tag } from "../api/tagApi";

export const UserTag = ({ name, description }: Tag): JSX.Element => {
    const tagRender = <span className="badge">{name}</span>;
    // Only enable tooltip with desc if it exists, otherwise just show the tag as is
    return (
        <div>
            {description ? (
                <OverlayTrigger placement={"top"} overlay={<Tooltip>{description}</Tooltip>}>
                    {tagRender}
                </OverlayTrigger>
            ) : (
                tagRender
            )}
        </div>
    );
};
