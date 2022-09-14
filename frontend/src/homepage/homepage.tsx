import "react-big-calendar/lib/css/react-big-calendar.css";
import "./homepage.css";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import ShiftCard from "../components/shiftCard";
import { useAvailableShifts } from "../hooks/useAvailableShifts";
import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";

import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import AddShiftForm from "../components/addShiftForm";
// import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { useAllShifts } from "../hooks/useAllShifts";
import { createShift } from "../api/shiftApi";
import { useNavigate } from "react-router-dom";

type HomePageProps = {
    shiftType: string;
};

const shiftFormFields = {
    name: "",
    startAt: "",
    endAt: "",
    hours: 0,
    address: "",
    description: "",
    addressDescription: "",
    numGeneralVolunteers: 0,
    numUndergradAmbassadors: 0,
    numPostgradAmbassadors: 0,
    numSprouts: 0,
    numStaffAmbassadors: 0,
};

const HomePage = ({ shiftType }: HomePageProps) => {
    const navigate = useNavigate();
    const { data: userData } = useOwnUser();

    const {
        isLoading = true,
        isError,
        data,
        error,
    } = shiftType === "available"
        ? useAvailableShifts()
        : shiftType === "myShifts"
        ? useMyShifts(userData?.data?._id, "Scheduled")
        : useAllShifts();

    const [show, setShow] = useState(false);
    const [formFields, setFormFields] = useState(shiftFormFields);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [responseMsg, setresponseMsg] = useState("");
    // const [components, setComponents] = useState([formFields]);

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        const value = target.type === "number" ? parseInt(target.value) : target.value;
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${target.name}`]: value };
        });
    };

    const openAddShift = () => {
        setShow(true);
    };

    const closeAddShift = () => {
        setShow(false);
    };

    const deleteSelected = () => {
        console.log("button2");
    };

    const handleFilter = () => {
        console.log("button3");
    };

    const handleSubmit = async () => {
        setIsLoadingSubmit(true);
        // setComponents([...components, formFields]);
        console.log(formFields);

        const createResponse = await createShift(formFields);
        setIsLoadingSubmit(false);
        console.log(createResponse);
        if (createResponse.success && createResponse?.data?._id) {
            closeAddShift();
            navigate(`/shift/${createResponse.data._id}`);
        } else {
            setresponseMsg(createResponse.message || "");
        }

        // fetch("https://jsonplaceholder.typicode.com/todos/1")
        //     .then((response) => response.json())
        //     .then((response) => {
        //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        //         console.log(response.data);
        //         setIsLoadingSubmit(false);
        //     })
        //     .catch(() => {
        //         setErrorShow(false);
        //         console.log("error");
        //     });
    };

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody className="form-body">
                    <div className="page-container">
                        <div className="header-container">
                            <h1>Available Shifts</h1>
                            <div className="btn-container">
                                {isLoadingSubmit && <LoadingSpinner />}
                                <AvailableShiftsBtn
                                    className="admin-btn"
                                    btnText="Add Shift"
                                    btnIcon={addShiftIcon}
                                    onClickHandler={openAddShift}
                                    isLoading={isLoadingSubmit}
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
                        {/* container for when shifts are added */}
                        <div className="shiftList-container">
                            {isLoading && <p>Loading available shifts...</p>}
                            {isError && <p>There was a server error while loading available shifts... {error}</p>}
                            {data?.data && data?.data?.length > 0 ? (
                                data?.data?.map((shiftData) => {
                                    // console.log(shiftData);
                                    return (
                                        <ShiftCard
                                            key={shiftData._id}
                                            shiftData={shiftData}
                                            isAdmin={userData?.data?.isAdmin}
                                        />
                                    );
                                })
                            ) : (
                                <p>No available shifts.</p>
                            )}
                        </div>
                    </div>
                    <Modal show={show}>
                        <AddShiftForm
                            handleEvent={handleChange}
                            handleClose={closeAddShift}
                            handleSubmit={handleSubmit}
                            isLoading={isLoadingSubmit}
                            responseMsg={responseMsg}
                        />
                    </Modal>
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export { HomePage };
