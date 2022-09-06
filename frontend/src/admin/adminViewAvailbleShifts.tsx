import { NavigationBar } from "../components/navbar";
import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import AddShiftForm from "../components/addShiftForm";
import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

const defaultFormFields = {
    shiftTitle: "",
    shiftDescription: "",
    startDate: "",
    endDate: "",
    shiftTime: "",
    shiftAddress: "",
    shiftVenue: "",
    addressDescription: "",
    shiftHours: " ",
};

export const AdminViewAvailbleShifts = () => {
    const [show, setShow] = useState(false);
    const [formFields, setFormFields] = useState(defaultFormFields);

    // const {
    //     shiftTitle,
    //     shiftDescription,
    //     startDate,
    //     endDate,
    //     shiftTime,
    //     shiftAddress,
    //     shiftVenue,
    //     addressDescription,
    //     shiftHours,
    // } = formFields;

    const handleChange = (event: { target: { name: any; value: any } }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name, value } = event.target;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setFormFields({ ...formFields, [name]: value });
        console.log(formFields);
    };

    const openAddShift = () => {
        setShow(true);
        console.log("button1");
    };

    const deleteSelected = () => {
        console.log("button2");
    };

    const handleFilter = () => {
        console.log("button3");
    };

    return (
        <div>
            <NavigationBar />
            <div className="header-container">
                <h1>Available Shifts</h1>
                <div className="btn-container">
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Add Shift"
                        btnIcon={addShiftIcon}
                        onClickHandler={openAddShift}
                    />
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Delete Selected"
                        btnIcon={deleteIcon}
                        onClickHandler={deleteSelected}
                    />
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Filters"
                        btnIcon={filterIcon}
                        onClickHandler={handleFilter}
                    />
                </div>
            </div>
            <Modal show={show}>
                <AddShiftForm handleEvent={handleChange} />
            </Modal>
        </div>
    );
};
