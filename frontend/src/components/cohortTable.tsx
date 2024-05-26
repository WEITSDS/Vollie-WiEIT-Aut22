/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
// import { addNewVenue, deleteVenue, getAllVenues, IAddress, updateVenue } from "../api/addressAPI";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import "./qualificationsTable.css"; // Using your provided CSS file
// import { useEffect } from "react"; // Import useEffect
import deleteCohort, { ICohort, createCohort, getAllCohorts } from "../api/cohortTypeAPI";

const initiFormFields = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
};

const cohortTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [formFields, setFormFields] = useState(initiFormFields);
    const [editingID, setEditingID] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [cohorts, setCohorts] = useState<ICohort[]>([]);
    // const { refetch } = useAllCohort();

    const fetchCohorts = async () => {
        try {
            const response = await getAllCohorts();
            setCohorts(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Call fetchAddresses on component mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchCohorts();
        };
        fetchData();
    }, []);

    const handleChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>): void => {
        event.preventDefault();
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${target.name}`]: target.value };
        });
    };

    const toggleModal = (cohort?: ICohort) => {
        if (!cohort) {
            setModalTitle("Add New Cohort");
            setFormFields(initiFormFields);
            setEditingID(null);
        } else {
            setModalTitle(`Edit Cohort`);
            setFormFields({ name: cohort.name, startDate: cohort.startDate, endDate: cohort.endDate });
            setEditingID(cohort._id || null); // Set to null if _id is undefined
        }
        setShowModal(!showModal);
    };

    const handleModalSubmit = async () => {
        setIsProcessing(true);
        try {
            // if (editingID) {
            //     await updateVenue(editingID, formFields.venue, formFields.address);
            // } else {
            //     await addNewVenue(formFields.venue, formFields.address);
            // }
            await createCohort(formFields);
            await fetchCohorts();
            setIsProcessing(false);
            toggleModal();
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const handleDeleteModalSubmit = async () => {
        if (!editingID) return;
        setIsProcessing(true);
        try {
            await deleteCohort(editingID); // This will only be called if editingID is not null
            setEditingID(null);
            setShowDeleteModal(false);
            await fetchCohorts();
            setIsProcessing(false);
        } catch (error) {
            console.error("error deleting", error);
            setEditingID(null);
            setShowDeleteModal(false);
            setIsProcessing(false);
        }
    };

    const handleEditButtonClick = (cohort: ICohort) => {
        setShowDeleteModal(true);
        setEditingID(cohort._id ?? null); // Use null coalescing operator
    };
    return (
        <>
            <div className="dashboard-tablebutton-container">
                <table id="volunteer-table" className="table table-bordered table-light">
                    <thead className="table-danger">
                        <tr>
                            <th>Cohort</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cohorts.map((cohort) => (
                            <tr key={cohort._id}>
                                <td>{cohort.name}</td>
                                <td>{cohort.startDate}</td>
                                <td>{cohort.endDate}</td>
                                <td>
                                    <div className="action-button-container">
                                        <Button
                                            className="delete-action-btn"
                                            onClick={() => handleEditButtonClick(cohort)}
                                        >
                                            <img src={deleteIcon} alt="delete action icon" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button className="add-action-button align-items-center" onClick={() => toggleModal()}>
                    <img src={addShiftIcon} alt="add venue icon" />
                    Add New Cohort
                </Button>
            </div>
            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add-shift-form">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formFields.name}
                            name="name"
                            onChange={handleChange}
                            placeholder="Name"
                        />
                        <label>Start Date</label>
                        <input type="date" name="startDate" onChange={handleChange} placeholder="Start Date" />
                        <label> End Date </label>
                        <input type="date" name="endDate" onChange={handleChange} placeholder="End Date" />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button disabled={isProcessing} onClick={handleModalSubmit}>
                        {isProcessing ? "Submitting..." : "Submit"}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Delete Confirm Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this cohort?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" disabled={isProcessing} onClick={handleDeleteModalSubmit}>
                        {isProcessing ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default cohortTable;
