// import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
// import { ShiftSummaryAdmin } from "../../../backend/src/Shift/shift.interface";
import { NavigationBar } from "../components/navbar";
import { useOwnUser } from "../hooks/useOwnUser";
import { useShiftById } from "../hooks/useShiftById";
import "./shiftInformation.css";

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
        // startAt,
        // endAt,
        address,
        // status,
        // description,
        // hours,
        // numGeneralVolunteers,
        // numUndergradAmbassadors,
        // numPostgradAmbassadors,
        // numStaffAmbassadors,
        // numSprouts,
    } = data?.data || {};

    // const dateStringStart = new Date(startAt).toUTCString();
    // const dateStringEnd = new Date(endAt).toUTCString();

    return (
        <div>
            <NavigationBar />
            {data.success && (
                <div className="shift-page-container">
                    <div className="header-button-container">
                        <div className="left-btns">
                            <button>Back to shifts</button>
                        </div>
                        <div className="right-btns">
                            <button>Edit</button>
                            <button>Apply to Shift</button>
                        </div>
                    </div>
                    <hr className="header-divider" />
                    <div className="information-container">
                        <h1 className="shift-name">{name}</h1>
                        <div className="info-box">
                            <h2 className="info-title">Venue</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
                        </div>

                        <div className="info-box">
                            <h2 className="info-title">{address}</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
                        </div>

                        <div className="info-box">
                            <h2 className="info-title">Venue</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
                        </div>

                        <div className="info-box">
                            <h2 className="info-title">Venue</h2>
                            <div className="line"></div>
                            <h3 className="info-body">Orange High School</h3>
                        </div>
                    </div>
                    <hr className="info-divider" />
                </div>
            )}
        </div>
    );
};

export default ShiftInformation;
