import { Button, Card, Form, Stack } from "react-bootstrap";
import participantsIcon from "../assets/participants.svg";
import locationIcon from "../assets/location.svg";
import calendarIcon from "../assets/calendar.svg";
import editIcon from "../assets/edit.svg";

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

export default function ShiftCard({
    shiftName = "Food Service",
    location = "12 Orange St Ultimo",
    date = "31/08/2022",
    admin = false,
}) {
    return (
        <Card
            style={{
                width: "25rem",
                padding: "0.5rem",
                borderRadius: "1rem",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
        >
            <Card.Body>
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Title style={titleTextStyle}>{shiftName}</Card.Title>
                    <Stack direction="horizontal">
                        <Button size="sm" variant="light" style={{ borderRadius: "50%" }}>
                            <img src={participantsIcon} alt="participants icon" />
                        </Button>
                        {admin && (
                            <>
                                <Button size="sm" variant="light" style={{ borderRadius: "50%" }}>
                                    <img src={editIcon} alt="edit shift icon" />
                                </Button>
                                <Form.Check aria-label="option 1" />
                            </>
                        )}
                    </Stack>
                </Stack>
                <Card.Text as="h6" style={{ color: "#4D41D8", ...commonTextStyle }}>
                    <img style={{ margin: "0 10px 0 0" }} src={locationIcon} alt="location icon" />
                    {location}
                </Card.Text>
                <hr />
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Text as="h6" style={commonTextStyle}>
                        <img style={{ margin: "0 5px 0 0" }} src={calendarIcon} alt="date icon" />
                        {date}
                    </Card.Text>
                    <Button style={{ borderRadius: "4rem", padding: "0.5rem 1.5rem", ...buttonTextStyle }}>View</Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}
