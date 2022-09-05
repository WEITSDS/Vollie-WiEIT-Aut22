import { Component } from "react";
import { NavigationBar } from "../components/navbar";
import "./adminViewAvailableShifts.css";

export class AdminViewAvailbleShifts extends Component {
    render() {
        return (
            <div>
                <NavigationBar />
                <div>
                    <h1>Available Shifts</h1>
                    <button className="available-shifts-button">Add Shift</button>
                    <button className="available-shifts-button">Delete Selected</button>
                    <button className="available-shifts-button">Filters</button>
                </div>
            </div>
        );
    }
}
