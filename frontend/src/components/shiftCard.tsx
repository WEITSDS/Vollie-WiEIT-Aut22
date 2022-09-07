import { Button, Card, Stack } from "react-bootstrap";
import participantsIcon from "../assets/participants.svg";
import locationIcon from "../assets/location.svg";
import calendarIcon from "../assets/calendar.svg";

export default function ShiftCard({ shiftName = "Shift Name", location = "Location info", date = "Date text" }) {
    return (
        <Card className="shadow p-3 mb-5 bg-body" style={{ width: "25rem", borderRadius: "1rem" }}>
            <Card.Body>
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Title>{shiftName}</Card.Title>
                    <Button size="sm" variant="light" style={{ borderRadius: "50%" }}>
                        <img src={participantsIcon} alt="participants icon" />
                    </Button>
                </Stack>
                <Card.Text as="h6" style={{ color: "blue" }}>
                    <img src={locationIcon} alt="location icon" />
                    {location}
                </Card.Text>
                <hr />
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Text as="h6">
                        <img src={calendarIcon} alt="date icon" />
                        {date}
                    </Card.Text>
                    <Button style={{ borderRadius: "4rem", padding: "0.5rem 1.5rem" }}>View</Button>
                </Stack>
            </Card.Body>
        </Card>
    );
}
