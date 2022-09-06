/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component } from "react";
import { NavigationBar } from "../components/navbar";
import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import AddShiftForm from "../components/addShiftForm";
import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";

export class AdminViewAvailbleShifts extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
        };
    }
    openAddShift = () => {
        this.setState({ show: true });
        console.log("button1");
    };

    deleteSelected = () => {
        console.log("button2");
    };

    handleFilter = () => {
        console.log("button3");
    };

    render() {
        return (
            <div>
                <NavigationBar />
                <div className="header-container">
                    <h1>Available Shifts</h1>
                    <div className="btn-container">
                        <AvailableShiftsBtn
                            className="admin-btn"
                            btnText="Add Shift"
                            btnIcon={addShiftIcon}
                            onClickHandler={this.openAddShift}
                        />
                        <AvailableShiftsBtn
                            className="admin-btn"
                            btnText="Delete Selected"
                            btnIcon={deleteIcon}
                            onClickHandler={this.deleteSelected}
                        />
                        <AvailableShiftsBtn
                            className="admin-btn"
                            btnText="Filters"
                            btnIcon={filterIcon}
                            onClickHandler={this.handleFilter}
                        />
                    </div>
                </div>
                <Modal show={this.state.show}>
                    <AddShiftForm />
                </Modal>
            </div>
        );
    }
}
