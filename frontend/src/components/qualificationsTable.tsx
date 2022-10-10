import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import editIcon from "../assets/edit.svg";
import "./qualificationsTable.css";
// import Form from "react-bootstrap/Form";

type TableProps = {
    tableName: string; // Should be plural
    tableData: Array<string>;
};

const dummyData = ["Working with Children", "First-Aid", "Some other name", "A Qualification name"];

const QualificationsTable = ({ tableName = "Test Name", tableData = dummyData }: TableProps) => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");

    const toggleModal = (name = "") => {
        setShowModal(!showModal);
        const tableNameWithoutS = tableName.slice(0, -1);
        if (name === "") setModalTitle("Add New " + tableNameWithoutS);
        else {
            setModalTitle("Edit " + tableNameWithoutS + ": " + name);
            // Prepopulate form fields
        }
    };

    const handleModalSubmit = () => {
        // Handle creation/edit here
    };

    return (
        <>
            <div className="dashboard-tablebutton-container">
                <table id="volunteer-table" className="table table-bordered table-light">
                    <thead className="table-danger">
                        <tr>
                            <th>{tableName}</th>
                            <th>Actions </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item) => (
                            <tr>
                                <td>{item}</td>
                                <td>
                                    <div className="action-button-container">
                                        <Button className="edit-action-btn" onClick={() => toggleModal(item)}>
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
                <Button className="add-action-button align-items-center" onClick={() => toggleModal()}>
                    <img src={addShiftIcon} alt="add type icon" />
                    Add New Qualification Type
                </Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Generate fields from model here</Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button onClick={handleModalSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QualificationsTable;
