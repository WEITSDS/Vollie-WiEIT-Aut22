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
import { Button } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import MapView from "./mapView";

type ShiftPageProps = {
    shiftType: string;
};

const ShiftPage = ({ shiftType }: ShiftPageProps) => {
    const { data: userData } = useOwnUser();
    const { isLoading: loadingAllVolTypes, data: allVolTypes } = useAllVolTypes();
    const { data: userVolTypesData, isLoading: loadingUserVolTypes } = useVoltypesForUser(userData?.data?._id);

// <<<<<<< dev
//     const getFilterInLocalStorage = (): Filters => {
//         const localFiltersString: string | null = localStorage.getItem("shiftResultFilters");
//         console.log(localFiltersString); // Console log for debugging

//         if (!localFiltersString) {
//             console.log("Default");
//             return getDefaultFilters(userVolTypesData?.data || []);
//         }

//         const localFilters = JSON.parse(localFiltersString) as Filters;

//         const locationFilter = localFilters.location || "";

//         const filtersWithLocation = {
//             ...localFilters,
//             location: locationFilter,
//         };

//         console.log(filtersWithLocation); // Console log for debugging
//         return filtersWithLocation;
// =======
    const getFilterInSessionStorage = (): Filters => {
        const sessionFiltersString: string | null = sessionStorage.getItem("shiftResultFilters");
        // CONSOLE
        console.log(sessionFiltersString);
        if (!sessionFiltersString) {
            console.log("Default");
            return getDefaultFilters(userVolTypesData?.data || []);
        }
        const sessionFilters = JSON.parse(sessionFiltersString) as Filters;
        const something = {
            from: new Date(sessionFilters.from),
            to: new Date(sessionFilters.to),
            volTypes: sessionFilters.volTypes,
            category: sessionFilters.category,
            hours: sessionFilters.hours,
            hideUnavailable: sessionFilters.hideUnavailable,
        };
        // CONSOLE sessionFilters
        console.log(sessionFilters);
        return something;
// >>>>>>> master
    };

    const [resultFilters, setResultFilters] = useState<Filters | undefined>(
        loadingUserVolTypes ? undefined : getDefaultFilters(userVolTypesData?.data || [])
    );

    // useEffect(() => {
    //     setResultFilters(getFilterInLocalStorage());
    // }, [loadingUserVolTypes]);

    //Local Storage
    // useEffect(() => {
    //     const localFilters: Record<string, Unknown> = JSON.parse(localStorage.getItem("shiftResultFilters"));
    // const something = {
    //     to: localFilters.to,
    //     from: localFilters.from,
    //     //volTypes: VolType[];
    //     category: localFilters.category,
    //     hours: localFilters.hours,
    //     hideUnavailable: localFilters.hideUnavailable,
    // };
    // }, [resultFilters]);

    // setResultFilters(something);

    //Saves most recent filter into the session storage
    const updateFiltersInSessionStorage = (filters: Filters) => {
        sessionStorage.setItem("shiftResultFilters", JSON.stringify(filters));
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
// <<<<<<< dev
//     const [show2, setShow2] = useState<boolean>(false);
//     const [shiftdata, setshiftData] = useState("");

//     const localizer = momentLocalizer(moment);

//     const [currentView, setCurrentView] = useState("card");
// =======
// >>>>>>> master

    useEffect(() => {
        console.log("useEffect");
        if (userVolTypesData) {
            // setResultFilters(getDefaultFilters(userVolTypesData?.data || []));
            setResultFilters(getFilterInSessionStorage());
        }
    }, [userVolTypesData]);

    //Runs everytime number of selected shift changes
    useEffect(() => {
        setShowDeleteButton(isShiftSelected());
    }, [selectedShifts]);

    // const handleViewChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setCurrentView(event.target.value);
    // };

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
    //Enable button if any shift is selected
    const isShiftSelected = () => {
        if (selectedShifts.length > 0) {
            console.log(selectedShifts.length);
            return true;
        }
        return false;
    };

// <<<<<<< dev
//     // Opens addShiftForm that has copied fields from selected shift
//     const openDupeShift = (shiftId: string) => {
//         setshiftData(shiftId);
//         setShow2(true);
//     };

//     const closeDupeShift = () => {
//         setshiftData("");
//         setShow2(false);
//     };

// =======
// >>>>>>> master
    // Upon clicking Filter button, resets the selectedshifts list
    // Shows filter panel
    const handleFilterPanel = () => {
        setFilterPanelVisible(true);
        setselectedShifts([]);
    };

    interface ShiftEvent {
        id: string;
    }
    //redirect to shift page upon clicking shift on calendar
    const handleSelectEvent = (event: ShiftEvent) => {
        window.location.replace(`/shift/${event.id}`);
    };

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
<!-- <<<<<<< dev
                    <div className="main-container">
                        {/* Tab Container */}
                        <div className="tab-container">
                            <div
                                className={currentView === "card" ? "tab active" : "tab"}
                                onClick={() => setCurrentView("card")}
                            >
                                Card View
                            </div>
                            <div
                                className={currentView === "calendar" ? "tab active" : "tab"}
                                onClick={() => setCurrentView("calendar")}
                            >
                                Calendar View
                            </div>
                            <div
                                className={currentView === "map" ? "tab active" : "tab"}
                                onClick={() => setCurrentView("map")}
                            >
                                Map View
======= -->
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
                                                void openDeleteModal();
                                                // void deleteSelected();
                                            }}
                                            //Disable button if showDeleteButton is false
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
<!-- >>>>>>> master -->
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="content-container">
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
                                                    void openDeleteModal();
                                                }}
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
                            {currentView === "card" && (
                                <div className="shiftList-container">
                                    {isLoading && <p>Loading available shifts...</p>}
                                    {isError && (
                                        <p>There was a server error while loading available shifts... {error}</p>
                                    )}
                                    {data?.data && data?.data?.length > 0
                                        ? data?.data?.map((shiftData) => {
                                              return (
                                                  <ShiftCard
                                                      key={shiftData._id}
                                                      shiftData={shiftData}
                                                      isAdmin={userData?.data?.isAdmin}
                                                      handleSelected={handleSelected}
                                                      handleDuplicate={openDupeShift}
                                                  />
                                              );
                                          })
                                        : !isLoading && <p>No available shifts.</p>}
                                </div>
                            )}
                            {currentView === "calendar" && (
                                <Calendar
                                    localizer={localizer}
                                    events={data?.data?.map((shift) => ({
                                        start: new Date(shift.startAt),
                                        end: new Date(shift.endAt),
                                        title: shift.name,
                                        id: shift._id,
                                        allDay: true,
                                    }))}
                                    startAccessor="start"
                                    endAccessor="end"
                                    titleAccessor="title"
                                    onSelectEvent={handleSelectEvent}
                                    style={{ height: 500 }}
                                />
                            )}
                            {currentView === "map" && <MapView />}
                        </div>
                    </div>
                    <div className="export-parent">
                        <button className="btn-primary export-button" onClick={() => setExportModalVisible(true)}>
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
                    {!loadingAllVolTypes && resultFilters && (
                        <FilterResultsModal
                            visible={filterPanelVisible}
                            filters={resultFilters}
                            updateFilters={(filters) => {
                                setResultFilters(filters);
                                updateFiltersInSessionStorage(filters);
                            }}
                            onClose={() => setFilterPanelVisible(false)}
                            allVolTypes={allVolTypes?.data || []}
                            userVolTypes={userVolTypesData?.data || []}
                        />
                    )}
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
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export { ShiftPage };
