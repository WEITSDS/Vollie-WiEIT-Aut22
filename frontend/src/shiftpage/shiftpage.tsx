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
import { FilterResultsModal } from "../components/filterResultsModal/filterResultsModal";
import { Filters } from "../components/filterResultsModal/types";
import { getDefaultFilters } from "../components/filterResultsModal/util";
import { useVoltypesForUser } from "../hooks/useVolTypesForUser";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { ExportModal } from "../components/exportModal/exportModal";
import { Button } from "react-bootstrap";

type ShiftPageProps = {
    shiftType: string;
};

const ShiftPage = ({ shiftType }: ShiftPageProps) => {
    const { data: userData } = useOwnUser();
    const { isLoading: loadingAllVolTypes, data: allVolTypes } = useAllVolTypes();
    const { data: userVolTypesData, isLoading: loadingUserVolTypes } = useVoltypesForUser(userData?.data?._id);

    const getFilterInLocalStorage = (): Filters => {
        const localFiltersString: string | null = localStorage.getItem("shiftResultFilters");
        console.log(localFiltersString);
        if (!localFiltersString) {
            console.log("Default");
            return getDefaultFilters(userVolTypesData?.data || []);
        }
        const localFilters = JSON.parse(localFiltersString) as Filters;
        return {
            from: new Date(localFilters.from),
            to: new Date(localFilters.to),
            volTypes: localFilters.volTypes,
            category: localFilters.category,
            hours: localFilters.hours,
            hideUnavailable: localFilters.hideUnavailable,
        };
    };

    const [resultFilters, setResultFilters] = useState<Filters | undefined>(
        loadingUserVolTypes ? undefined : getDefaultFilters(userVolTypesData?.data || [])
    );

    const updateFiltersInLocalStorage = (filters: Filters) => {
        localStorage.setItem("shiftResultFilters", JSON.stringify(filters));
        console.log("Updated");
        console.log(filters);
        console.log(JSON.stringify(filters));
    };

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [show2, setShow2] = useState<boolean>(false);
    const [shiftdata, setshiftData] = useState("");

    useEffect(() => {
        if (userVolTypesData) {
            setResultFilters(getFilterInLocalStorage());
        }
    }, [userVolTypesData]);

    useEffect(() => {
        setShowDeleteButton(selectedShifts.length > 0);
    }, [selectedShifts]);

    const handleSelected = (id: string, checkStatus: boolean) => {
        setselectedShifts((prevSelectedShifts) => {
            if (checkStatus) {
                return [...prevSelectedShifts, id];
            } else {
                return prevSelectedShifts.filter((shiftId) => shiftId !== id);
            }
        });
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
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
            const deleteActions = selectedShifts.map((shiftId) => deleteShift({ _id: shiftId }));
            await Promise.all(deleteActions);
        } catch (error) {
            console.log("error deleting shifts", error);
        }
        await refetchShifts();
        setisDeleteLoading(false);
        setselectedShifts([]);
    };

    const openDupeShift = (shiftId: string) => {
        setshiftData(shiftId);
        setShow2(true);
    };

    const closeDupeShift = () => {
        setshiftData("");
        setShow2(false);
    };

    const handleFilterPanel = () => {
        setFilterPanelVisible(true);
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
                                            onClick={openDeleteModal}
                                            disabled={!showDeleteButton}
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
                                    <button id="whiteButton" className={"admin-btn"} onClick={handleFilterPanel}>
                                        <img className="btn-icon" src={filterIcon} />
                                        {"Filters"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="shiftList-container">
                            {isLoading && <p>Loading available shifts...</p>}
                            {isError && <p>There was a server error while loading available shifts... {error}</p>}
                            {data?.data && data?.data?.length > 0
                                ? data?.data?.map((shiftData) => (
                                      <ShiftCard
                                          key={shiftData._id}
                                          shiftData={shiftData}
                                          isAdmin={userData?.data?.isAdmin}
                                          handleSelected={handleSelected}
                                          handleDuplicate={openDupeShift}
                                      />
                                  ))
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
                        <AddShiftForm handleClose={closeAddShift} shiftdata={""} />
                    </Modal>
                    <Modal show={show2}>
                        <AddShiftForm handleClose={closeDupeShift} shiftdata={shiftdata} />
                    </Modal>
                    {!loadingAllVolTypes && resultFilters && (
                        <FilterResultsModal
                            visible={filterPanelVisible}
                            filters={resultFilters}
                            updateFilters={(filters) => {
                                setResultFilters(filters);
                                updateFiltersInLocalStorage(filters);
                            }}
                            onClose={() => setFilterPanelVisible(false)}
                            allVolTypes={allVolTypes?.data || []}
                            userVolTypes={userVolTypesData?.data || []}
                        />
                    )}
                </ModalBody>
                <Modal show={showDeleteModal} onHide={closeDeleteModal} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Shift Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        You have selected {selectedShifts.length} shift/s to delete. Do you want to proceed?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeDeleteModal}>
                            No
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                closeDeleteModal();
                                void deleteSelected();
                            }}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </WEITBackground>
        </>
    );
};

export { ShiftPage };
