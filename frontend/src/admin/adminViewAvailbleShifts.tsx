/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component } from "react";
import { NavigationBar } from "../components/navbar";
import { AvailableShiftsBtn } from "../components/availableShiftsBtn";
import AddShiftForm from "../components/addShiftForm";
import "./adminViewAvailableShifts.css";
import addShiftIcon from "../assets/addShiftIcon.svg";
// import deleteIcon from "../assets/deleteIcon.svg";
// import filterIcon from "../assets/filterIcon.svg";
import Modal from "react-bootstrap/Modal";

export class AdminViewAvailbleShifts extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
        };
    }
    handleEvent = () => {
        this.setState({ show: true });
        console.log("button1");
    };

    render() {
        return (
            <div>
                <NavigationBar />
                <div>
                    <h1>Available Shifts</h1>
                    <AvailableShiftsBtn
                        className="admin-btn"
                        btnText="Add Shift"
                        btnIcon={addShiftIcon}
                        onClickHandler={this.handleEvent}
                    />
                    {/* <AvailableShiftsBtn className="admin-btn" btnText="Delete Selected" btnIcon={deleteIcon} />
                    <AvailableShiftsBtn className="admin-btn" btnText="Filters" btnIcon={filterIcon} /> */}
                    <Modal show={this.state.show}>
                        <AddShiftForm />
                    </Modal>
                </div>
            </div>
        );
    }
}
