import "react-big-calendar/lib/css/react-big-calendar.css";
import "./homepage.css";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import ShiftCard from "../components/shiftCard";
import { useAvailableShifts } from "../hooks/useAvailableShifts";
import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import AddShiftForm from "../components/addShiftForm";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useAllShifts } from "../hooks/useAllShifts";

type HomePageProps = {
    shiftType: string;
};

const HomePage = ({ shiftType }: HomePageProps) => {
    const { data: userData } = useOwnUser();

    const {
        isLoading = true,
        isError,
        data,
        error,
    } = shiftType === "available"
        ? useAvailableShifts()
        : shiftType === "myShifts"
        ? useMyShifts(userData?.data?._id)
        : useAllShifts();

    const [show, setShow] = useState(false);

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

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody className="form-body">
                    <div className="page-container">
                        <div className="header-container">
                            <h1>Shifts</h1>
                            <div className="btn-container">
                                <button id="whiteButton" className={"admin-btn"} onClick={openAddShift}>
                                    <img className="btn-icon" src={addShiftIcon} />
                                    {"Add Shift"}
                                </button>

                                <button id="whiteButton" className={"admin-btn"} onClick={deleteSelected}>
                                    <img className="btn-icon" src={deleteIcon} />
                                    {"Delete Selected"}
                                </button>

                                <button id="whiteButton" className={"admin-btn"} onClick={handleFilter}>
                                    <img className="btn-icon" src={filterIcon} />
                                    {"Filters"}
                                </button>
                            </div>
                        </div>
                        {/* container for when shifts are added */}
                        <div className="shiftList-container">
                            {isLoading && <p>Loading available shifts...</p>}
                            {isError && <p>There was a server error while loading available shifts... {error}</p>}
                            {data?.data && data?.data?.length > 0 ? (
                                data?.data?.map((shiftData) => {
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
                        <AddShiftForm handleClose={closeAddShift} />
                    </Modal>
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export { HomePage };
