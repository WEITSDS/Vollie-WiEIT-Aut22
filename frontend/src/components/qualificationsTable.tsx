import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createQualificationType, IQualificationType, updateQualificationType } from "../api/qualificationTypeAPI";
import { createVolunteerType, IVolunteerType, updateVolunteerType } from "../api/volTypeAPI";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import editIcon from "../assets/edit.svg";
import { useAllQualTypes } from "../hooks/useAllQualTypes";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import "./qualificationsTable.css";

type TableProps = {
    tableType: "Qualification" | "Volunteer";
};

const initiFormFields = {
    name: "",
    description: "",
    requiresApproval: false,
};

const QualificationsTable = ({ tableType }: TableProps) => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    const [formFields, setFormFields] = useState(initiFormFields);

    const [editingID, seteditingID] = useState<string | null>(null);

    const { data, isLoading, refetch } = tableType === "Qualification" ? useAllQualTypes() : useAllVolTypes();

    const [isProcessing, setisProcessing] = useState(false);

    const handleChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>): void => {
        event.preventDefault();
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${target.name}`]: target.value };
        });
    };
    const handleCheckbox = (event: React.FormEvent<HTMLInputElement>): void => {
        const target = event.target as HTMLInputElement;
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, requiresApproval: target.checked };
        });
    };

    const toggleModal = (item?: IVolunteerType | IQualificationType | null) => {
        if (!item) {
            setModalTitle(`Add New ${tableType} Type`);
            setFormFields(initiFormFields);
            seteditingID(null);
        } else {
            setModalTitle(`Edit ${tableType} Type: ${item.name}`);
            setFormFields({
                name: item.name,
                description: item.description,
                requiresApproval: item.requiresApproval,
            });
            seteditingID(item._id);
        }
        setShowModal(!showModal);
    };

    const handleModalSubmit = async () => {
        try {
            setisProcessing(true);
            // Handle creation/edit here
            if (tableType === "Qualification") {
                // Submission for Qualification Type
                if (editingID) {
                    await updateQualificationType(formFields, editingID);
                } else {
                    await createQualificationType(formFields);
                }
            } else {
                // Submission for Volunteer Type
                if (editingID) {
                    await updateVolunteerType(formFields, editingID);
                } else {
                    await createVolunteerType(formFields);
                }
            }
            await refetch();
            setisProcessing(false);
            toggleModal();
        } catch (error) {
            console.log(error);
            setisProcessing(false);
        }
    };

    return (
        <>
            <div className="dashboard-tablebutton-container">
                {isLoading ? (
                    <p>Loading {tableType} Types...</p>
                ) : (
                    <table id="volunteer-table" className="table table-bordered table-light">
                        <thead className="table-danger">
                            <tr>
                                <th>{tableType} Type</th>
                                <th>Requires Approval</th>
                                <th>Actions </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.data &&
                                data.data.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>{item.requiresApproval ? "Yes" : "No"}</td>
                                        <td>
                                            <div className="action-button-container">
                                                <Button
                                                    className="edit-action-btn"
                                                    onClick={() => {
                                                        toggleModal(item);
                                                    }}
                                                >
                                                    <img src={editIcon} alt="edit action icon" />
                                                </Button>
                                                <Button className="delete-action-btn">
                                                    <img src={deleteIcon} alt="delete action icon" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
                <Button
                    className="add-action-button align-items-center"
                    onClick={() => {
                        toggleModal();
                    }}
                >
                    <img src={addShiftIcon} alt="add type icon" />
                    Add New {tableType} Type
                </Button>
            </div>
            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add-shift-form">
                        <label>Name</label>
                        <input type="text" defaultValue={formFields.name} name="name" onChange={handleChange} />
                        <label>Description</label>
                        <input
                            type="text"
                            defaultValue={formFields.description}
                            name="description"
                            onChange={handleChange}
                        />
                        <div>
                            <label>Requires Approval?</label>
                            <input
                                type="checkbox"
                                checked={formFields.requiresApproval}
                                name="requiresApproval"
                                onChange={handleCheckbox}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button
                        disabled={isProcessing}
                        onClick={() => {
                            void handleModalSubmit();
                        }}
                    >
                        {!isProcessing ? "Submit" : "Submitting..."}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QualificationsTable;
