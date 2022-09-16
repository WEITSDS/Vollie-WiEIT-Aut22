// import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { NavigationBar } from "../components/navbar";
import { useOwnUser } from "../hooks/useOwnUser";
import { useShiftById } from "../hooks/useShiftById";
import "./shiftInformation.css";
import venueIcon from "../assets/venueIcon.svg";
import addressIcon from "../assets/addressIcon.svg";
import dateIcon from "../assets/dateIcon.svg";
import timeIcon from "../assets/timeIcon.svg";
import backIcon from "../assets/backIcon.svg";
import editIcon from "../assets/editIcon.svg";

const ShiftInformation = () => {
    const { shiftId } = useParams();
    console.log("shift id", shiftId);
    const { isLoading, isError, data, error } = useShiftById(shiftId || "");
    const userQuery = useOwnUser();
    console.log("get shift data", data);

    if (isLoading || userQuery.isLoading) return <p>Loading...</p>;
    if (isError || userQuery.isError) return <p>Error loading data...{error || userQuery.error}</p>;

    if (!data?.data || !userQuery?.data?.data) return <p>No data</p>;

    const { data: userObj } = userQuery?.data || {};

    console.log(userObj);

    const {
        name,
        startAt,

        endAt,
        venue,
        address,

        description,
        notes,
        // users,
        category,
        requiresWWCC,
        numGeneralVolunteers,
        numUndergradAmbassadors,
        numPostgradAmbassadors,
        numStaffAmbassadors,
        numSprouts,
    } = data?.data || {};

    const dateStringStart = new Date(startAt).toUTCString();
    // const dateStringEnd = new Date(endAt).toUTCString();

    const handleBack = () => {
        console.log("");
    };

    const handleEdit = () => {
        console.log("");
    };
    const handleApply = () => {
        console.log("");
    };

    const handleParticipants = () => {
        console.log("");
    };

    const handleCancel = () => {
        console.log("");
    };

    return (
        <div className="page-background">
            <NavigationBar />
            {data.success && (
                <div className="shift-info-page-container">
                    <div className="left-box-container">
                        <div className="header-button-container">
                            <div className="header-flex">
                                <div className="left-btns">
                                    <button className="back-btn" onClick={handleBack}>
                                        <img src={backIcon} />
                                        Back to shifts
                                    </button>
                                </div>
                                <div className="right-btns">
                                    <button className="edit-btn" onClick={handleEdit}>
                                        <img src={editIcon} className="edit-icon" />
                                        Edit
                                    </button>
                                    <button className="apply-btn" onClick={handleApply}>
                                        Apply to Shift
                                    </button>
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
                                        <h3 className="info-body">Orange High School</h3>
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
                                        <h2 className="info-title">Date</h2>
                                    </div>

                                    <div className="info-box-right-container">
                                        <h3 className="info-body">{dateStringStart}</h3>
                                    </div>
                                </div>

                                <div className="info-box">
                                    <div className="info-box-left-container">
                                        <img className="timeIcon" src={timeIcon}></img>
                                        <h2 className="info-title">Hours</h2>
                                    </div>

                                    <div className="info-box-right-container">
                                        <h3 className="info-body">{hours}</h3>
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
                        <hr className="description-divider" />
                        <div className="notes-container">
                            <div className="description-body-container">
                                <h1 className="description-title">Notes</h1>
                                <p>{description}</p>
                            </div>
                        </div>
                        <hr className="notes-divider" />
                        <div className="footer-container">
                            <button className="cancel-shift-btn" onClick={handleCancel}>
                                Cancel shift
                            </button>
                        </div>
                    </div>
                    <div className="right-box-container">
                        <div className="header-right-box-container">
                            <div className="header-flex">
                                <h1 className="right-box-title">Volunteer allocations</h1>
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
                                        <th scope="col">Available Slots</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={0}>
                                        <td>General Volunteers</td>
                                        <td>{numGeneralVolunteers}</td>
                                    </tr>
                                    <tr key={1}>
                                        <td>Undergrad Ambassadors</td>
                                        <td>{numUndergradAmbassadors}</td>
                                    </tr>
                                    <tr key={2}>
                                        <td>Postgrad Ambassadors</td>
                                        <td>{numPostgradAmbassadors}</td>
                                    </tr>
                                    <tr key={3}>
                                        <td>Staff Ambassadors</td>
                                        <td>{numStaffAmbassadors}</td>
                                    </tr>
                                    <tr key={4}>
                                        <td>SPROUT</td>
                                        <td>{numSprouts}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr className="table-divider" />
                        <h1 className="calender-title">Calendar</h1>
                        <hr className="calendar-title-divider" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftInformation;
