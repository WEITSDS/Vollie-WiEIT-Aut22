import "react-big-calendar/lib/css/react-big-calendar.css";
import { SetStateAction, useState } from "react";
import { Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navbar";
import { useOwnUser } from "../hooks/useOwnUser";
import { useShiftById } from "../hooks/useShiftById";
import { useNavigate } from "react-router-dom";
import "./shiftInformation.css";
import venueIcon from "../assets/venueIcon.svg";
import addressIcon from "../assets/addressIcon.svg";
import dateIcon from "../assets/dateIcon.svg";
import timeIcon from "../assets/timeIcon.svg";
import backIcon from "../assets/backIcon.svg";
import editIcon from "../assets/editIcon.svg";
import categoryIcon from "../assets/categoryIcon.svg";
import { assignUserToShift, unassignUserFromShift } from "../api/shiftApi";
import { setCompleteShift } from "../api/userApi";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Link } from "react-router-dom";

// import AttendanceListModal from "./attendanceList";
import AddShiftForm from "../components/addShiftForm";
import AttendanceListModal from "../components/attendanceList";
import { useVoltypesForUserShift } from "../hooks/useVolTypesForUserShift";
import { VolTypeAllocation } from "./volTypeAllocation";
import { QualTypeAllocation } from "./qualTypeAllocation";
import AttendanceListVolModal from "../components/attendanceListVol";

const ShiftInformation = () => {
    const { shiftId } = useParams();
    const userQuery = useOwnUser();
    const { isLoading, isError, data, error, refetch } = useShiftById(shiftId || "");
    const { isLoading: loadingVolTypesForUser, data: volTypesForUser } = useVoltypesForUserShift(
        userQuery.data?.data?._id,
        shiftId
    );
    const [showEditModal, setshowEditModal] = useState(false);
    const [showParticipantsModal, setshowParticipantsModal] = useState(false);
    const navigate = useNavigate();
    const [userType, setUserType] = useState("");
    const [show, setShow] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const toggleShow = () => setShowError(false);

    if (isLoading || userQuery.isLoading) return <p>Loading...</p>;
    if (isError || userQuery.isError) return <p>Error loading data...{error || userQuery.error}</p>;

    if (!data?.data || !userQuery?.data?.data) return <p>No data</p>;

    const { data: userObj } = userQuery?.data || {};

    const {
        name,
        startAt,
        endAt,
        venue,
        address,
        description,
        hours,
        category,
        // requiresWWCC,
        // numGeneralVolunteers,
        // numUndergradAmbassadors,
        // numPostgradAmbassadors,
        // numStaffAmbassadors,
        // numSprouts,
    } = data?.data || {};

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setshowEditModal(true);
    };

    const handleEditClose = async () => {
        await refetch();
        setshowEditModal(false);
    };

    const handleApply = () => {
        handleShowRoles();
    };
    const handleComplete = async () => {
        try {
            if (typeof shiftId === "string" && userObj?._id) {
                await setCompleteShift(userObj?._id, shiftId, "complete");
                await refetch();
                await userQuery.refetch();
            }
        } catch (error) {
            console.log("Error completing shift");
            console.error(error);
        }
    };

    // const handleApply = async () => {
    //     try {
    //         if (typeof shiftId === "string" && userObj?._id) {
    //             const assignResponse = await assignUserToShift({
    //                 shiftid: shiftId,
    //                 userid: userObj?._id,
    //                 volunteerTypeId: "634320042a444bc07bd4cff7",
    //             });
    //             console.log(assignResponse);
    //             await refetch();
    //             await userQuery.refetch();
    //         }
    //     } catch (error) {
    //         console.log("error assigning user", error);
    //     }
    // };

    const handleParticipants = () => {
        setshowParticipantsModal((prev) => !prev);
    };

    const onCloseParticipantModal = async () => {
        try {
            console.log("reloading stuff");
            await refetch();
            await userQuery.refetch();
        } catch (error) {
            console.log("Error refetching", error);
        }
    };

    const handleCancel = async () => {
        try {
            if (typeof shiftId === "string" && userObj?._id) {
                await unassignUserFromShift({
                    shiftid: shiftId,
                    userid: userObj?._id,
                });
                await refetch();
                await userQuery.refetch();
            }
        } catch (error) {
            console.log("error assigning user", error);
        }
    };

    const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
        setUserType(e.target.value);
    };

    const handleApplySubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        // Handle applying to shift
        try {
            if (typeof shiftId === "string" && userObj?._id) {
                const result = await assignUserToShift({
                    shiftid: shiftId,
                    userid: userObj?._id,
                    selectedVolType: userType,
                });
                if (result.success == false) {
                    setShowError(true);
                }
                await refetch();
                await userQuery.refetch();
                setShow(false);
            }
        } catch (error) {
            console.log("error assigning user", error);
        }
    };

    /* Assign this to the apply to shift button  this opens the modal for role selection*/
    const handleShowRoles = () => {
        setShow(true);
    };

    const handleRoleSelectClose = () => {
        setShow(false);
    };

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    const targetShiftInUser = userObj?.shifts.find((shift) => shiftId === shift.shift?._id); //xiaobing shift.shift

    const localizer = momentLocalizer(moment);

    return (
        <div className="page-background">
            <NavigationBar />
            {data.success && (
                <>
                    <div className="shift-info-page-container">
                        <div className="left-box-container">
                            <div className="header-button-container">
                                <div className="header-flex">
                                    <div className="left-btns">
                                        <button className="back-btn" onClick={handleBack}>
                                            <img src={backIcon} />
                                            Back to Shifts
                                        </button>
                                    </div>
                                    <div className="left-btns">
                                        <Link to="/calendar" style={{ textDecoration: "none" }}>
                                            <button className="back-btn">
                                                <img src={backIcon} />
                                                Back to Calendar
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="right-btns">
                                        {userObj?.isAdmin && (
                                            <button className="edit-btn" onClick={handleEdit}>
                                                <img src={editIcon} className="edit-icon" />
                                                Edit
                                            </button>
                                        )}
                                        {!userObj?.isAdmin && !!userObj && shiftId && !targetShiftInUser && (
                                            <button
                                                className="apply-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    void handleApply();
                                                }}
                                            >
                                                Apply to Shift
                                            </button>
                                        )}
                                        {!!userObj && shiftId && targetShiftInUser && (
                                            <button
                                                className="apply-btn"
                                                disabled={targetShiftInUser.completed || !targetShiftInUser.approved}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    void handleComplete();
                                                }}
                                            >
                                                {targetShiftInUser.completed
                                                    ? "Shift Completed"
                                                    : !targetShiftInUser.approved
                                                    ? "Requires Approval"
                                                    : "Complete Shift"}
                                            </button>
                                        )}
                                        {!!userObj && shiftId && targetShiftInUser && !targetShiftInUser.completed && (
                                            <button
                                                className="cancel-shift-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    void handleCancel();
                                                }}
                                            >
                                                Cancel shift
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr className="header-divider" />
                            <div className="information-container">
                                <h1 className="shift-name">{name}</h1>
                                <div className="information-body-container">
                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="venueIcon" src={venueIcon}></img>
                                            <h2 className="info-title">Venue</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">{venue}</h3>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="addressIcon" src={addressIcon}></img>
                                            <h2 className="info-title">Address</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">{address}</h3>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="dateIcon" src={dateIcon}></img>
                                            <h2 className="info-title">Event Start</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">
                                                {startDate.toLocaleDateString()}{" "}
                                                {startDate.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="dateIcon" src={dateIcon}></img>
                                            <h2 className="info-title">Event End</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">
                                                {endDate.toLocaleDateString()}{" "}
                                                {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="timeIcon" src={timeIcon}></img>
                                            <h2 className="info-title">Work Hours</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">{hours} hours</h3>
                                        </div>
                                    </div>
                                    <div className="info-box">
                                        <div className="info-box-left-container">
                                            <img className="venueIcon" src={categoryIcon}></img>
                                            <h2 className="info-title">Category</h2>
                                        </div>

                                        <div className="info-box-right-container">
                                            <h3 className="info-body">{category}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="info-divider" />
                            <div className="description-container">
                                <div className="description-body-container">
                                    <h1 className="description-title">Description</h1>
                                    <p>{description}</p>
                                </div>
                            </div>
                            {/* <hr className="description-divider" /> */}
                            {/* <div className="notes-container">
                                <div className="description-body-container">
                                    <h1 className="description-title">Notes</h1>
                                    <p>{notes}</p>
                                </div>
                            </div> */}
                            {/* <hr className="notes-divider" /> */}
                            {/* <div className="footer-container">
                                {!!userObj && shiftId && targetShiftInUser && !targetShiftInUser.completed && (
                                    <button
                                        className="cancel-shift-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            void handleCancel();
                                        }}
                                    >
                                        Cancel shift
                                    </button>
                                )}
                            </div> */}
                        </div>
                        <div className="right-box-container">
                            <div className="header-right-box-container">
                                <div className="header-flex">
                                    <h1 className="right-box-title">Volunteer Allocations</h1>
                                    <button className="participants-btn" onClick={handleParticipants}>
                                        Participants
                                    </button>
                                </div>
                            </div>

                            <hr className="right-box-header-divider" />
                            <div className="volunteer-table-container">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Type</th>
                                            <th scope="col">Allocated Slots</th>
                                            <th scope="col">Currently Applied</th>
                                            <td scope="col">Slots Available</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.data.volunteerTypeAllocations.map((volAlloc) => (
                                            <VolTypeAllocation key={volAlloc.type} volAllocationObj={volAlloc} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="right-box-header-divider" />
                            <div className="volunteer-table-container">
                                <h1 className="calendar-title">Qualification Allocations</h1>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Type</th>
                                            <th scope="col">Allocated Slots</th>
                                            <th scope="col">Currently Applied</th>
                                            <td scope="col">Slots Remaining</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.data.requiredQualifications.map((qualAlloc) => (
                                            <QualTypeAllocation
                                                key={qualAlloc.qualificationType}
                                                qualAllocationObj={qualAlloc}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="table-divider" />
                            <div className="calender-title-box">
                                <h1 className="calendar-title">Calendar</h1>
                                <Calendar
                                    localizer={localizer}
                                    events={[
                                        {
                                            startAt: new Date(data.data.startAt),
                                            endAt: new Date(data.data.endAt),
                                            name: data.data.name,
                                        },
                                    ]}
                                    startAccessor="startAt"
                                    endAccessor="endAt"
                                    titleAccessor="name"
                                    style={{ height: 500 }}
                                />
                                <hr className="calendar-title-divider" />
                            </div>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleRoleSelectClose}>
                        <Modal.Header closeButton />
                        {loadingVolTypesForUser && <p>Loading volunteer types...</p>}
                        {!loadingVolTypesForUser && volTypesForUser?.data && (
                            <form
                                className="select-role-form"
                                onSubmit={(e) => {
                                    void handleApplySubmit(e);
                                }}
                            >
                                <div className="select-role-title-div">
                                    <h1 className="select-role-title">Please select a role:</h1>
                                </div>
                                <div className="select-role-list-div">
                                    <ul className="select-role-list">
                                        {volTypesForUser?.data.map((volType) => {
                                            return (
                                                <li key={volType._id}>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            value={volType._id}
                                                            checked={userType === volType._id}
                                                            onChange={handleChange}
                                                        />
                                                        {volType.name}
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="select-role-button-div">
                                    <Button type="submit" className="select-role-submit-button">
                                        Apply
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Modal>
                    <AttendanceListVolModal
                        showModal={showParticipantsModal}
                        hideButton={true}
                        shift={data?.data || {}}
                        setShowModal={handleParticipants}
                        onCloseModal={() => {
                            void onCloseParticipantModal();
                        }}
                    />
                    {userObj?.isAdmin && (
                        <>
                            <AttendanceListModal
                                showModal={showParticipantsModal}
                                hideButton={true}
                                shift={data?.data || {}}
                                setShowModal={handleParticipants}
                                onCloseModal={() => {
                                    void onCloseParticipantModal();
                                }}
                            />
                            <Modal show={showEditModal}>
                                <AddShiftForm
                                    previousShiftFields={data?.data}
                                    handleClose={() => {
                                        void handleEditClose();
                                    }}
                                    shiftdata={""}
                                />
                            </Modal>
                        </>
                    )}
                </>
            )}
            <ToastContainer position="top-center" style={{ zIndex: 9999 }}>
                <Toast bg="danger" onClose={toggleShow} show={showError}>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>Unable to assign user to shift</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default ShiftInformation;
