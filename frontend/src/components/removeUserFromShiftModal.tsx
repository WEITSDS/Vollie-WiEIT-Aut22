import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import removeIcon from "../assets/removeIcon.svg";

const centerText = {
    right: "50%",
};

type RemoveUserFromShiftModalProps = {
    shiftId: string;
    userId: string;
    showModal?: boolean;
    setShowModal?: () => void;
};

export default function RemoveUserFromShiftModal({ showModal, setShowModal }: RemoveUserFromShiftModalProps) {
    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);

    return (
        <>
            <Button className="remove-btn" onClick={handleShow}>
                <img className="remove-icon" src={removeIcon}></img>
            </Button>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal || modalBox}
                onHide={setShowModal || handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Remove User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={centerText}>Are you sure you want to remove this user?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Yes</Button>
                    <Button onClick={setShowModal || handleClose}>No</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
