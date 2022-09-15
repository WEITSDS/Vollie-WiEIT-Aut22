// import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
// import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";
import { NavigationBar } from "../components/navbar";
import { useOwnUser } from "../hooks/useOwnUser";
import { useShiftById } from "../hooks/useShiftById";
import "./shiftInformation.css";
import venueIcon from "../assets/venueIcon.svg";
import addressIcon from "../assets/addressIcon.svg";
import dateIcon from "../assets/dateIcon.svg";
import timeIcon from "../assets/timeIcon.svg";

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
        // endAt,
        address,
        // status,
        description,
        // hours,
        // numGeneralVolunteers,
        // numUndergradAmbassadors,
        // numPostgradAmbassadors,
        // numStaffAmbassadors,
        // numSprouts,
    } = data?.data || {};

    const dateStringStart = new Date(startAt).toUTCString();
    // const dateStringEnd = new Date(endAt).toUTCString();

    return (
        <div className="page-background">
            <NavigationBar />
            {data.success && (
                <div className="shift-page-container">
                    <div className="header-button-container">
                        <div className="header-flex">
                            <div className="left-btns">
                                <button className="back-btn">Back to shifts</button>
                            </div>
                            <div className="right-btns">
                                <button className="edit-btn">Edit</button>
                                <button className="apply-btn">Apply to Shift</button>
                            </div>
                        </div>
                    </div>
                    <hr className="header-divider" />
                    <div className="information-container">
                        <h1 className="shift-name">{name}</h1>
                        <div className="info-box">
                            <img src={venueIcon}></img>
                            <h2 className="info-title">Venue</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
                        </div>

                        <div className="info-box">
                            <img src={addressIcon}></img>
                            <h2 className="info-title">Address</h2>
                            <div className="line"></div>
                            <h3 className="info-body">{address}</h3>
                        </div>

                        <div className="info-box">
                            <img src={dateIcon}></img>
                            <h2 className="info-title">Date</h2>
                            <div className="line"></div>
                            <h3 className="info-body">{dateStringStart}</h3>
                        </div>

                        <div className="info-box">
                            <img src={timeIcon}></img>
                            <h2 className="info-title">Time</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
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
                        <button className="cancel-shift-btn">Cancel shift</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftInformation;
