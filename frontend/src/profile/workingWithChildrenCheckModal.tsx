import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

interface AddWWCCProps {
    userId?: string;
    onClose: (success?: boolean) => void;
}

export const AddWorkingWithChildrenCheckModal = (props: AddWWCCProps) => {
    //const id = props.userId;
    const [wwcc, setWWCC] = useState({
        number: "",
        expiry: "",
        dob: "",
        fullLegalName: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setWWCC((prevWWCC) => ({ ...prevWWCC, [name]: value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (wwcc.number.length == 0) {
            return setErrorMessage("You must eneter a Working with Children Check Number.");
        }
        if (Date.parse(wwcc.expiry) < Date.now()) {
            return setErrorMessage("You cannot submit an expired Working with Children Check.");
        }
        if (wwcc.fullLegalName.length == 0) {
            return setErrorMessage("You must eneter your Full Legal Name.");
        }
        //void handleSubmit(); TODO once api finished
    };

    const { onClose } = props || {};

    function disabled() {
        return (
            wwcc.number.length == 0 || wwcc.expiry.length == 0 || wwcc.dob.length == 0 || wwcc.fullLegalName.length == 0
        );
    }

    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add Working With Children Check</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="wwccNumber" className="mb-3">
                        <Form.Label>Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter number"
                            name="number"
                            value={wwcc.number}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="wwccExpiry" className="mb-3">
                        <Form.Label>Expiry</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter expiry"
                            name="expiry"
                            value={wwcc.expiry}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="wwccDOB" className="mb-3">
                        <Form.Label>Date Of Birth</Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Enter date of birth"
                            name="dob"
                            value={wwcc.dob}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="wwccFullLegalName" className="mb-3">
                        <Form.Label>Full Legal Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter full legal name"
                            name="fullLegalName"
                            value={wwcc.fullLegalName}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
                {errorMessage && <p>{errorMessage}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose(true)}>
                    Cancel
                </Button>
                <Button onClick={(e) => onSubmit(e)} disabled={disabled()}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
