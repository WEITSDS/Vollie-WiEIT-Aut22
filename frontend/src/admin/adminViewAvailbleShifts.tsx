import { Component } from "react";
import { NavigationBar } from "../components/navbar";
import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";

export class AdminViewAvailbleShifts extends Component {
    render() {
        return (
            <div>
                <NavigationBar />
                <div>
                    <h1>Available Shifts</h1>
                    <AvailableShiftsBtn className="admin-btn" btnText="Add Shift" btnIcon={addShiftIcon} />
                    <AvailableShiftsBtn className="admin-btn" btnText="Delete Selected" btnIcon={deleteIcon} />
                    <AvailableShiftsBtn className="admin-btn" btnText="Filters" btnIcon={filterIcon} />
                </div>
            </div>
        );
    }
}
