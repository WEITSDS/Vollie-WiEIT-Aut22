import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
    Qualification,
    CreateQualification,
    createQualification,
    deleteQualification,
} from "../../api/qualificationAPI";
import { useOwnUser } from "../../hooks/useOwnUser";

interface CreateOrEditQualificationProps {
    qualification: CreateQualification;
    onClose: (success?: boolean) => void;
    isNew?: boolean;
}

export const CreateOrEditQualificationModal: React.FC<CreateOrEditQualificationProps> = (props) => {
    const [fullName, setFullName] = useState<string>("");
    const [wWCC, setWWCC] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [dateofbirth, setDateofbirth] = useState<string>("");

    const [uploading, setUploading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const userQuery = useOwnUser();
    const userId = userQuery.data?.data?._id || "";

    const onChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const onChangewWCC = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWWCC(e.target.value);
    };

    const onChangeExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpiryDate(e.target.value);
    };

    const onChangeBirthDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateofbirth(e.target.value);
    };

    const onSubmit = async () => {
        if (Date.parse(expiryDate) < Date.now()) {
            return setErrorMessage("You cannot submit an expired qualification.");
        }

        setUploading(true);
        let errorMessage = "";

        try {
            const response = await createQualification(userId, wWCC, expiryDate, dateofbirth, fullName);
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
            if (props.onClose) props.onClose(true);
        } catch (err) {
            console.error(err);
            errorMessage = "An unexpected error occurred.";
        } finally {
            setErrorMessage(errorMessage);
            setUploading(false);
        }
    };

    const { isNew, onClose } = props;
    const disabled = uploading;

    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton={!uploading}>
                <Modal.Title>{isNew ? "New" : "Edit"} WWCC Qualification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="qName" className="mb-3">
                        <Form.Label>WWCC Number</Form.Label>
                        <Form.Control type="text" name="qWWCC" value={wWCC} onChange={onChangewWCC} required />
                    </Form.Group>
                    <Form.Group controlId="qBirthDate" className="mb-3">
                        <Form.Label>Date of Birth (DOB)</Form.Label>
                        <Form.Control
                            type="date"
                            name="qBirthDate"
                            value={dateofbirth}
                            onChange={onChangeBirthDate}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="qExpiryDate" className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="qExpiryDate"
                            value={expiryDate}
                            onChange={onChangeExpiryDate}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="qName" className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name="qName" value={fullName} onChange={onChangeFullName} required />
                    </Form.Group>
                </Form>
                {errorMessage && <p>{errorMessage}</p>}
                {uploading && <p>Saving...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()} disabled={uploading}>
                    Cancel
                </Button>
                <Button
                    variant={isNew ? "success" : "primary"}
                    onClick={() => {
                        void onSubmit();
                    }}
                    disabled={disabled}
                >
                    {isNew ? "Upload" : "Save"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

interface ConfirmDeleteModalProps {
    qualification: Qualification;
    onClose: (shouldDelete: boolean) => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ qualification, onClose }) => {
    const [errorMessage, setErrorMessage] = useState("");

    const onClickDelete = async () => {
        let errorMessage = "";

        try {
            const response = await deleteQualification(qualification._id);
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
            if (onClose) onClose(true);
        } catch (err) {
            console.error(err);
            errorMessage = "An unexpected error occurred.";
        } finally {
            setErrorMessage(errorMessage);
        }
    };
    return (
        <Modal show={true} onHide={() => onClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Qualification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the qualification '{qualification.wwccNumber}'? This action cannot be
                undone.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose(false)}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        void onClickDelete();
                    }}
                >
                    Delete
                </Button>
                {errorMessage && <p>{errorMessage}</p>}
            </Modal.Footer>
        </Modal>
    );
};
