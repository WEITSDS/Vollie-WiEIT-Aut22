import { useState } from "react";
import { Modal, Button, Nav } from "react-bootstrap";
import "./calendarModal.css";

interface Props {
    accountID: string;
}

export default function CalendarModal(props: Props) {
    const { accountID } = props;
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const calLink = `http://localhost:4000/api/shifts/calendar/${accountID}`;

    if (!accountID) return <></>;

    return (
        <>
            <Nav.Link href="#" onClick={() => setCalendarModalVisible(true)} className="text-body me-1">
                <i className="bi bi-calendar" /> Import
            </Nav.Link>

            <Modal show={calendarModalVisible} onHide={() => setCalendarModalVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Connect Calendar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    To subscribe to shifts in your calendar please use the following URL:
                    <br />
                    <br />
                    <input className="calInput" value={calLink} />
                    <Button
                        onClick={() => {
                            navigator.clipboard
                                .writeText(calLink)
                                .then(() => {
                                    alert("Copied to clipboard");
                                })
                                .catch((err) => {
                                    console.log("failed to copy", err);
                                });
                        }}
                        className="copyButton"
                    >
                        Copy
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setCalendarModalVisible(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
