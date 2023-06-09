// import "react-big-calendar/lib/css/react-big-calendar.css";
import "./shiftpage.css";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import ShiftCard from "../components/shiftCard";
import { useSearchShifts } from "../hooks/useSearchShifts";
import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import AddShiftForm from "../components/addShiftForm";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { deleteShift } from "../api/shiftApi";
import { ResponseWithStatus } from "../api/utility";
import { FilterResultsModal } from "../components/filterResultsModal/filterResultsModal";
import { Filters } from "../components/filterResultsModal/types";
import { getDefaultFilters } from "../components/filterResultsModal/util";
import { useVoltypesForUser } from "../hooks/useVolTypesForUser";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { ExportModal } from "../components/exportModal/exportModal";

type ShiftPageProps = {
    shiftType: string;
};

const ShiftPage = ({ shiftType }: ShiftPageProps) => {
    const { data: userData } = useOwnUser();
    const { isLoading: loadingAllVolTypes, data: allVolTypes } = useAllVolTypes();
    const { data: userVolTypesData, isLoading: loadingUserVolTypes } = useVoltypesForUser(userData?.data?._id);

    const [resultFilters, setResultFilters] = useState<Filters | undefined>(
        loadingUserVolTypes ? undefined : getDefaultFilters(userVolTypesData?.data || [])
    );

    const {
        isLoading = true,
        isError,
        data,
        error,
        refetch: refetchShifts,
    } = shiftType === "searchShifts" ? useSearchShifts(resultFilters) : useMyShifts(userData?.data?._id);

    const [show, setShow] = useState<boolean>(false);
    const [filterPanelVisible, setFilterPanelVisible] = useState<boolean>(false);
    const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
    const [isDeleteLoading, setisDeleteLoading] = useState<boolean>(false);
    const [selectedShifts, setselectedShifts] = useState<string[]>([]);

    useEffect(() => {
        if (userVolTypesData) {
            setResultFilters(getDefaultFilters(userVolTypesData?.data || []));
        }
    }, [userVolTypesData]);

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

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div className="page-container">
                        <div className="header-container">
                            <h1>{shiftType == "myShifts" ? "My" : "Search"} Shifts</h1>
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

                                {shiftType === "searchShifts" && (
                                    <button
                                        id="whiteButton"
                                        className={"admin-btn"}
                                        onClick={() => setFilterPanelVisible(true)}
                                    >
                                        <img className="btn-icon" src={filterIcon} />
                                        {"Filters"}
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* container for when shifts are added */}
                        <div className="shiftList-container">
                            {isLoading && <p>Loading available shifts...</p>}
                            {isError && <p>There was a server error while loading available shifts... {error}</p>}
                            {data?.data && data?.data?.length > 0
                                ? data?.data?.map((shiftData) => {
                                      return (
                                          <ShiftCard
                                              key={shiftData._id}
                                              shiftData={shiftData}
                                              isAdmin={userData?.data?.isAdmin}
                                              handleSelected={handleSelected}
                                          />
                                      );
                                  })
                                : !isLoading && <p>No available shifts.</p>}
                        </div>
                    </div>
                    <div className="export-parent">
                        <button className="btn-primary" onClick={() => setExportModalVisible(true)}>
                            Export
                        </button>
                    </div>
                    <ExportModal
                        visible={exportModalVisible}
                        onClose={() => setExportModalVisible(false)}
                        isAdmin={userData?.data?.isAdmin || false}
                    />
                    <Modal show={show}>
                        <AddShiftForm handleClose={closeAddShift} />
                    </Modal>
                    {!loadingAllVolTypes && resultFilters && (
                        <FilterResultsModal
                            visible={filterPanelVisible}
                            filters={resultFilters}
                            updateFilters={(filters) => setResultFilters(filters)}
                            onClose={() => setFilterPanelVisible(false)}
                            allVolTypes={allVolTypes?.data || []}
                            userVolTypes={userVolTypesData?.data || []}
                        />
                    )}
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export { ShiftPage };
