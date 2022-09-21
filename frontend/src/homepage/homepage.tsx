// import "react-big-calendar/lib/css/react-big-calendar.css";
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
import LoadingSpinner from "../components/loadingSpinner";
import { deleteShift } from "../api/shiftApi";
import { ResponseWithStatus } from "../api/utility";

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
        refetch: refetchShifts,
    } = shiftType === "available"
        ? useAvailableShifts()
        : shiftType === "myShifts"
        ? useMyShifts(userData?.data?._id)
        : useAllShifts();

    const [show, setShow] = useState<boolean>(false);
    const [isDeleteLoading, setisDeleteLoading] = useState<boolean>(false);
    const [selectedShifts, setselectedShifts] = useState<string[]>([]);

    const handleSelected = (id: string, checkStatus: boolean) => {
        setselectedShifts((prevSelectedShifts) => {
            if (checkStatus) {
                return [...prevSelectedShifts, id];
            } else if (!checkStatus) {
                return prevSelectedShifts.filter((shiftId) => shiftId !== id);
            } else {
                return prevSelectedShifts;
            }
        });
    };

    const openAddShift = () => {
        setShow(true);
    };

    const closeAddShift = () => {
        setShow(false);
    };

    const deleteSelected = async () => {
        setisDeleteLoading(true);
        try {
            let deleteActions: Array<Promise<ResponseWithStatus>> = [];
            selectedShifts.forEach((shiftId) => {
                const deletePromise = deleteShift({ _id: shiftId });
                deleteActions = [...deleteActions, deletePromise];
            });
            await Promise.all(deleteActions);
        } catch (error) {
            console.log("error deleting shifts", error);
        }
        await refetchShifts();
        setisDeleteLoading(false);
        setselectedShifts([]);
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
                            <h1>
                                {shiftType == "available" ? "Available" : shiftType == "myShifts" ? "My" : "All"} Shifts
                            </h1>
                            <div className="btn-container">
                                {userData?.data?.isAdmin && (
                                    <>
                                        <button id="whiteButton" className={"admin-btn"} onClick={openAddShift}>
                                            <img className="btn-icon" src={addShiftIcon} />
                                            {"Add Shift"}
                                        </button>
                                        <button
                                            id="whiteButton"
                                            className={"admin-btn"}
                                            onClick={() => {
                                                void deleteSelected();
                                            }}
                                            disabled={isDeleteLoading}
                                        >
                                            {isDeleteLoading ? (
                                                <>
                                                    <LoadingSpinner />
                                                    {"Loading"}
                                                </>
                                            ) : (
                                                <>
                                                    <img className="btn-icon" src={deleteIcon} />
                                                    {"Delete Selected"}
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

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
                                            handleSelected={handleSelected}
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
