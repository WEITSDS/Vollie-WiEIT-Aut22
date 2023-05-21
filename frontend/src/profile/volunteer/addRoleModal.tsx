import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAllVolTypes } from "../../hooks/useAllVolTypes";
import { assignVolunteerType } from "../../api/userApi";
import { IVolunteerTypeUserWithApproved } from "../../api/volTypeAPI";

interface AddRoleProps {
    userId?: string;
    userVolTypes: IVolunteerTypeUserWithApproved[];
    onClose: (success?: boolean) => void;
}

export const AddRoleModal = (props: AddRoleProps) => {
    const id = props.userId;
    const { data: volTypesData } = useAllVolTypes();
    const volTypesSelection = volTypesData?.data;
    const [selectedVolType, setSelectedVolType] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleVolTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVolType(e.target.value);
        for (let v = 0; volTypesSelection && v < volTypesSelection.length; v++) {
            if (volTypesSelection[v]._id == e.target.value && volTypesSelection[v].requiresApproval) {
                setErrorMessage("Adding this volunteer type will notify an administrator for approval.");
                break;
            } else setErrorMessage("");
        }
        console.log("selected vol type:", e.target.value);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedVolType.length == 0) {
            return setErrorMessage("You must select a volunteer role.");
        }
        for (let i = 0; i < props.userVolTypes.length; i++) {
            if (props.userVolTypes[i]._id == selectedVolType) {
                return setErrorMessage("You already have this volunteer type.");
            }
        }
        void handleSubmit();
    };

    const handleSubmit = async (): Promise<void> => {
        setUpdating(true);
        try {
            id && (await assignVolunteerType(id, selectedVolType));
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to add volunteer role");
        }
        setUpdating(false);
        if (props.onClose) props.onClose(false);
    };

    const { onClose } = props || {};
    function disabled() {
        return selectedVolType == "" || updating;
    }
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add Volunteer Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="vType" className="mb-3">
                        <Form.Label>Volunteer Type</Form.Label>
                        <Form.Select aria-label="Volunteer type" onChange={handleVolTypeChange} name="category">
                            <option value={""}>Select Volunteer Type</option>
                            {volTypesSelection?.map((volType) => {
                                return (
                                    <option key={volType._id} value={volType._id}>
                                        {volType.name}
                                        {volType.requiresApproval && " (requires administrator approval)"}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Form>
                {errorMessage && <p>{errorMessage}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose(true)}>
                    Cancel
                </Button>
                <Button onClick={(e) => onSubmit(e)} disabled={disabled()}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

interface ConfirmDeleteModalProps {
    type: IVolunteerTypeUserWithApproved;
    onClose: (shouldDelete: boolean) => void;
}
export const ConfirmDeleteModal = ({ type, onClose }: ConfirmDeleteModalProps): JSX.Element => {
    return (
        <Modal show={true} onHide={() => onClose(false)}>
            <Modal.Body>
                Are you sure you want to delete the volunteer type '<b>{type.name}</b>'? Any volunteer type requiring
                administrator approval will require it again if you add it in the future.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => onClose(true)}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
