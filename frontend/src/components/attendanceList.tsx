import { useState } from "react";
import { Modal, Button, Nav } from "react-bootstrap";

export default function AttendanceListModal() {
    /*For Testing Purposes, the Attendance List Modal/Table is mapped to the help button on the NAV bar
    To revert to previous state, 
    1) Link helpModal.ts to Navbar.TSX (All Under Components Folder)
    2) Test  */
    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);
    return (
        <>
            {/* Replace this with view attendance list button */}
            <Nav.Link href="#" onClick={handleShow} className="text-body me-1">
                <i className="bi bi-question-circle" /> Help
            </Nav.Link>
            {/* Table template for attendance list */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalBox}
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Attendance List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped table-hover">
                        {/* Dummy Data */}
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Volunteer Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td scope="row">Brendon Tong</td>
                                <td>Sprouts</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jim Gordon</td>
                                <td>Volunteer</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
