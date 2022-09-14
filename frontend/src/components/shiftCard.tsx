import { Button, Card, Form, Stack } from "react-bootstrap";
import locationIcon from "../assets/location.svg";
import calendarIcon from "../assets/calendar.svg";
import editIcon from "../assets/edit.svg";
import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";
import { Link } from "react-router-dom";
import AttendanceListModal from "./attendanceList";

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

type ShiftCardProps = { shiftData: ShiftSummaryAdmin; isAdmin: boolean | undefined };

export default function ShiftCard({ shiftData, isAdmin }: ShiftCardProps) {
    const {
        _id: shiftId,
        name,
        startAt,
        address,
        status,
        numGeneralVolunteers,
        numUndergradAmbassadors,
        numPostgradAmbassadors,
        numStaffAmbassadors,
        numSprouts,
    } = shiftData;
    console.log(
        shiftId,
        address,
        status,
        numGeneralVolunteers,
        numUndergradAmbassadors,
        numPostgradAmbassadors,
        numStaffAmbassadors,
        numSprouts,
        isAdmin
    );

    const dateString = new Date(startAt).toUTCString();

    return (
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
                    <Stack direction="horizontal">
                        {isAdmin && <AttendanceListModal shiftId={shiftData._id || ""} />}
                        {isAdmin && (
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
                    {address}
                </Card.Text>
                <hr />
                <Stack direction="horizontal" style={{ justifyContent: "space-between" }}>
                    <Card.Text as="h6" style={commonTextStyle}>
                        <img style={{ margin: "0 5px 0 0" }} src={calendarIcon} alt="date icon" />
                        {dateString}
                    </Card.Text>
                    <Link to={`/shift/${shiftId}`}>
                        <Button style={{ borderRadius: "4rem", padding: "0.5rem 1.5rem", ...buttonTextStyle }}>
                            {"View"}
                        </Button>{" "}
                    </Link>
                </Stack>
            </Card.Body>
        </Card>
    );
}
