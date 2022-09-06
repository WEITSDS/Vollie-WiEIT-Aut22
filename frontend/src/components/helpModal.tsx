import { useState } from "react";
import { Modal, Button, Nav } from "react-bootstrap";

export default function HelpModal() {
    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);
    return (
        <>
            <Nav.Link href="#" onClick={handleShow} className="text-body me-1">
                <i className="bi bi-question-circle" /> Help
            </Nav.Link>

            <Modal show={modalBox} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Attendance List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Contact us</strong> <br />
                    Building 11, Level 5 – Room 509 <br />
                    <br /> <strong>Women in Engineering and IT Program</strong> <br />
                    University of Technology Sydney <br />
                    PO Box 123, Broadway NSW 2007 <br /> <br />
                    <strong>Telephone</strong> +61 2 9514 2602 <br />
                    <strong>Fax</strong> +61 2 9514 1266 <br />
                    <strong>Email</strong> wieit@uts.edu.au
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
