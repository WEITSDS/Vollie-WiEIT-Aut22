import React from "react";
import "./viewAvailableShifts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MockData from "./data.json";
import { get } from "../api/utility";
import { NavigationBar } from "../components/navbar";

interface SelectedShiftState {
    selectedShift?: data;
}

interface data {
    id: number;
    who: string;
    when: string;
    time: string;
    where: string;
    task: string;
    task_description: string;
    contact: string;
}

export class ViewAvailableShifts extends React.Component<SelectedShiftState> {
    state: SelectedShiftState = {
        selectedShift: undefined,
    };

    async componentDidMount() {
        const localToken = localStorage.getItem("token");
        const shiftData = await get(`/api/shifts/${localToken || ""}`);
        const shiftResponse = (await shiftData.json()) as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseJSON = JSON.parse(shiftResponse);
        console.log(responseJSON);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (let i = 0; i < responseJSON.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            const myArray = responseJSON[i].dtstart.split("T");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const date = myArray[0] as string;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const time = myArray[1] as string;
            MockData.push({
                id: i,
                who: "UTS",
                when: date,
                time: time,
                where: "Sydney Area",
                task: "Available Shift",
                task_description: "test",
                contact: "Marrilee@gmail.com",
            });
        }
        this.forceUpdate();
    }

    buttonHandler = (shift: data) => {
        this.setState({
            selectedShift: shift ?? undefined,
        });
    };
    render = () => {
        const data = MockData;
        const { selectedShift } = this.state;

        return (
            <>
                <NavigationBar />
                <div className="row">
                    <div className="leftcolumn_shift">
                        <div className="center_shift">
                            <h1>Available Shifts</h1>
                        </div>
                        <div className="container_shift">
                            <div className="scrollable_shift">
                                <table className="table table-fixed">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>When</th>
                                            <th>Where</th>
                                            <th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((d) => (
                                            <tr key={d.id}>
                                                <td>{d.task}</td>
                                                <td>{d.when}</td>
                                                <td>{d.where}</td>
                                                <td>
                                                    <button className="btnPink" onClick={() => this.buttonHandler(d)}>
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="rightcolumn_shift">
                        <div className="info_card">
                            <div>
                                {selectedShift ? (
                                    <tbody>
                                        <tr key={selectedShift.id}>
                                            <h2 className="center_shift">{selectedShift.task}</h2>
                                            <h4>Who:</h4>
                                            <p>{selectedShift.who}</p>
                                            <h4>When:</h4>
                                            <p>{selectedShift.when}</p>
                                            <h4>Time:</h4>
                                            <p>{selectedShift.time}</p>
                                            <h4>Where:</h4>
                                            <p>{selectedShift.where}</p>
                                            <h4>Task:</h4>
                                            <p>{selectedShift.task_description}</p>
                                        </tr>
                                        <div className="center_shift">
                                            <button className="btnPink">Accept</button>
                                        </div>
                                    </tbody>
                                ) : (
                                    <div>
                                        <h1>please select a shift...</h1>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };
}
