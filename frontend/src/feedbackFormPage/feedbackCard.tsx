import { IShift } from "../api/shiftApi";
import { Button, Card, Stack } from "react-bootstrap";
import locationIcon from "../assets/location.svg";
import calendarIcon from "../assets/calendar.svg";

type FeedbackCardProps = {
    shiftData: IShift;
};

export default function FeedbackCard({ shiftData }: FeedbackCardProps) {
    const { name, startAt, address } = shiftData;

    const dateString = new Date(startAt).toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const latoFont = {
        fontFamily: "Lato",
        fontStyle: "normal",
    };

    const titleTextStyle = {
        fontSize: "25px",
        fontWeight: "600",
        lineHeight: "30px",
        ...latoFont,
    };

    const commonTextStyle = {
        fontSize: "20px",
        fontWeight: "500",
        lineHeight: "24px",
        ...latoFont,
    };

    const buttonTextStyle = {
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "19px",
        color: "#FFFDFD",
        ...latoFont,
    };

    return (
        <>
            <Card
                style={{
                    width: "25rem",
                    padding: "0.5rem",
                    borderRadius: "1rem",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    margin: "15px",
                }}
            >
                <Card.Body>
                    <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                        <Card.Title style={titleTextStyle}>{name}</Card.Title>
                    </Stack>
                    <Card.Text as="h6" style={{ color: "#4D41D8", ...commonTextStyle }}>
                        <img style={{ margin: "0 10px 0 0" }} src={locationIcon} alt="location icon" />
                        {address}
                    </Card.Text>
                    <hr />
                    <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                        <Card.Text as="h6" style={commonTextStyle}>
                            <img style={{ margin: "0 5px 0 0" }} src={calendarIcon} alt="date icon" />
                            {dateString}
                        </Card.Text>
                        <Button style={{ borderRadius: "4rem", padding: "0.5rem 1.5rem", ...buttonTextStyle }}>
                            {"Complete"}
                        </Button>{" "}
                    </Stack>
                </Card.Body>
            </Card>
        </>
    );
}
