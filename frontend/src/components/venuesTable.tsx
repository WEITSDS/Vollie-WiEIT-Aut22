/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { addNewVenue, deleteVenue, getAllVenues, IAddress, updateVenue } from "../api/addressAPI";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import editIcon from "../assets/edit.svg";
import "./qualificationsTable.css"; // Using your provided CSS file
import { useEffect } from "react"; // Import useEffect

const initiFormFields = {
    venue: "",
    address: "",
};

const venuesTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [formFields, setFormFields] = useState(initiFormFields);
    const [editingID, setEditingID] = useState<string | null>(null);
    const [data, setData] = useState<IAddress[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const fetchAddresses = async () => {
        try {
            const addresses = await getAllVenues();
            setData(addresses);
        } catch (error) {
            console.error(error);
        }
    };

    // Call fetchAddresses on component mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchAddresses();
        };
        fetchData();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
    };

    const toggleModal = (address?: IAddress) => {
        if (!address) {
            setModalTitle("Add New Venue");
            setFormFields(initiFormFields);
            setEditingID(null);
        } else {
            setModalTitle(`Edit Venue: ${address.address}`);
            setFormFields({ venue: address.venue, address: address.address });
            setEditingID(address._id || null); // Set to null if _id is undefined
        }
        setShowModal(!showModal);
    };

    const handleModalSubmit = async () => {
        setIsProcessing(true);
        try {
            if (editingID) {
                await updateVenue(editingID, formFields.venue, formFields.address);
            } else {
                await addNewVenue(formFields.venue, formFields.address);
            }
            await fetchAddresses();
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
            await deleteVenue(editingID); // This will only be called if editingID is not null
            setEditingID(null);
            setShowDeleteModal(false);
            await fetchAddresses();
            setIsProcessing(false);
        } catch (error) {
            console.error("error deleting", error);
            setEditingID(null);
            setShowDeleteModal(false);
            setIsProcessing(false);
        }
    };

    const handleEditButtonClick = (address: IAddress) => {
        setShowDeleteModal(true);
        setEditingID(address._id ?? null); // Use null coalescing operator
    };
    return (
        <>
            <div className="dashboard-tablebutton-container">
                <table id="volunteer-table" className="table table-bordered table-light">
                    <thead className="table-danger">
                        <tr>
                            <th>Venue</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((address) => (
                            <tr key={address._id}>
                                <td>{address.venue}</td>
                                <td>{address.address}</td>
                                <td>
                                    <div className="action-button-container">
                                        <Button className="edit-action-btn" onClick={() => toggleModal(address)}>
                                            <img src={editIcon} alt="edit action icon" />
                                        </Button>
                                        <Button
                                            className="delete-action-btn"
                                            onClick={() => handleEditButtonClick(address)}
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
                    Add New Venue
                </Button>
            </div>
            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add-shift-form">
                        <label>Venue</label>
                        <input
                            type="text"
                            value={formFields.venue}
                            name="venue"
                            onChange={handleChange}
                            placeholder="Venue name"
                        />
                        <label>Address</label>
                        <input
                            type="text"
                            value={formFields.address}
                            name="address"
                            onChange={handleChange}
                            placeholder="Venue address"
                        />
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
                <Modal.Body>Are you sure you want to delete this venue?</Modal.Body>
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

export default venuesTable;
