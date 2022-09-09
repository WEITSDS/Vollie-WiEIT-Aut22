import { NavigationBar } from "../components/navbar";
import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import AddShiftForm from "../components/addShiftForm";
import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import LoadingSpinner from "../components/loadingSpinner";

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
    const [isLoading, setIsLoading] = useState(false);
    const [errorShow, setErrorShow] = useState(true);

    const handleChange = (event: { target: { name: any; value: any } }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { name, value } = event.target;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setFormFields({ ...formFields, [name]: value });
        console.log(formFields);
    };

    const openAddShift = () => {
        setShow(true);
    };

    const closeAddShift = () => {
        setShow(false);
        setErrorShow(true);
    };

    const deleteSelected = () => {
        console.log("button2");
    };

    const handleFilter = () => {
        console.log("button3");
    };

    const handleSubmit = () => {
        setIsLoading(true);
        fetch("https://jsonplaceholder.typicode.com/todos/1")
            .then((response) => response.json())
            .then((response) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.log(response.data);
                setIsLoading(false);
            })
            .catch(() => {
                setErrorShow(false);
                console.log("error");
            });
    };
    return (
        <div>
            <NavigationBar />
            <div className="header-container">
                <h1>Available Shifts</h1>
                <div className="btn-container">
                    {isLoading ? <LoadingSpinner /> : console.log("test")}
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Add Shift"
                        btnIcon={addShiftIcon}
                        onClickHandler={openAddShift}
                        isLoading={isLoading}
                    />

                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Delete Selected"
                        btnIcon={deleteIcon}
                        onClickHandler={deleteSelected}
                        isLoading={false}
                    />
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Filters"
                        btnIcon={filterIcon}
                        onClickHandler={handleFilter}
                        isLoading={false}
                    />
                </div>
            </div>

            <Modal show={show}>
                <AddShiftForm
                    handleEvent={handleChange}
                    handleClose={closeAddShift}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    handleError={errorShow}
                />
            </Modal>
        </div>
    );
};
