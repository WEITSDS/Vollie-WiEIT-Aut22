import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
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
    const dateStringEnd = new Date(endAt).toUTCString();

    return (
        <div>
            <NavigationBar />
            {data.success && (
                <div className="shift-page-container">
                    <div className="shift-header-container">
                        <div className="box-shadow">
                            <h1>{name}</h1>
                            <div className="flex-container">
                                <div className="address">{address}</div>
                                <div className="date">
                                    {dateStringStart} - {dateStringEnd}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shift-body-container">
                        <div>
                            <h1>Description:</h1>
                            <p>{description}</p>
                        </div>
                        <div>
                            <p>
                                <strong>Hours:</strong> Get from start-end
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Venue:</strong> {venue}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Category:</strong> {category}
                            </p>
                        </div>
                        <div>
                            <h1>Additional Notes:</h1>
                            <p>{notes}</p>
                        </div>
                        <div>
                            <h1>Requires WWCC:</h1>
                            <p>{requiresWWCC ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p>
                                <strong>Volunteer Allocations</strong>
                            </p>
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
                        <Button>Apply to Shift</Button>
                        <Button>Cancel Shift</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShiftInformation;
