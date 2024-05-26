import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { ICohort } from "../../api/cohortTypeAPI";
import { assignCohortType } from "../../api/userApi";
import { useAllCohort } from "../../hooks/useAllCohort";

interface AddCohort {
    userId?: string;
    userCohorts: ICohort[];
    onClose: (success?: boolean) => void;
}

export const AddCohortModal = (props: AddCohort) => {
    const id = props.userId;
    const { data: cohorts } = useAllCohort();
    const allCohorts = cohorts?.data;
    const [selectedCohort, setselectedCohort] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleCohortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setselectedCohort(e.target.value);
        console.log("selected vol type:", e.target.value);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        void handleSubmit();
    };

    const handleSubmit = async (): Promise<void> => {
        setUpdating(true);
        try {
            id && (await assignCohortType(id, selectedCohort));
        } catch (error) {
            console.log(error);
            setErrorMessage("Failed to create cohort");
        }
        setUpdating(false);
        if (props.onClose) props.onClose(false);
    };

    const { onClose } = props || {};
    function disabled() {
        return selectedCohort == "" || updating;
    }
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add Cohort</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Cohort</Form.Label>
                    <Form.Select aria-label="Volunteer type" onChange={handleCohortChange} name="category">
                        <option value={""}>Select Cohort</option>
                        {allCohorts?.map((cohort) => {
                            return (
                                <option key={cohort._id} value={cohort._id}>
                                    {cohort.name}
                                </option>
                            );
                        })}
                    </Form.Select>
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

interface ConfirmDeleteCohortModalProps {
    type: ICohort;
    onClose: (shouldDelete: boolean) => void;
}
export const ConfirmDeleteCohortModal = ({ type, onClose }: ConfirmDeleteCohortModalProps): JSX.Element => {
    return (
        <Modal show={true} onHide={() => onClose(false)}>
            <Modal.Body>
                Are you sure you want to delete the cohort '<b>{type.name}</b>'?
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
