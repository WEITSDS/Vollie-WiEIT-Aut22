import React from "react";
import "./viewAvailableShifts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MockData from "./data.json";
//import { get } from "../api/utility";
import { default as dayjs } from "dayjs";
// import { assignUserToShift } from "../api/shiftApi";
// import { getOwnUser } from "../api/userApi";
import { NavigationBar } from "../components/navbar";
//import { userInfo } from "os";

interface SelectedShiftState {
    selectedShift?: data;
}

interface data {
    id: string;
    name: string;
    startAt: string;
    endAt: string;
    address: string;
    description: string;
    status: string;
    hours: number;
}

export class ViewAvailableShifts extends React.Component<SelectedShiftState> {
    state: SelectedShiftState = {
        selectedShift: undefined,
    };

    componentDidMount() {
        //const localToken = localStorage.getItem("token");
        //const shiftData = await get(`/api/shifts/${localToken || ""}`);
        //const shiftResponse = (await shiftData.json()) as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        /*const responseJSON = JSON.parse(shiftResponse);
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
                id: responseJSON[i],
                who: "UTS",
                when: date,
                time: time,
                where: "Sydney Area",
                task: "Available Shift",
                task_description: "test",
                contact: "Marrilee@gmail.com",
            });
        } */
        //this.forceUpdate();
    }

    buttonHandler = (shift: data) => {
        this.setState({
            selectedShift: shift ?? undefined,
        });
    };

    // handleAccept = async (shift: data) => {
    //     // const user = await getOwnUser();
    //     // const data = {
    //     //     userid: user.data?._id as string,
    //     //     shiftid: shift.id,
    //     // };
    //     // console.log(shift);
    //     //Request now requires shiftid and userid to be passed as an object.
    //     // const assignShiftResponse = await assignUserToShift(data);
    //     // console.log(assignShiftResponse);
    // };

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
                                                <td>{d.name}</td>
                                                <td>
                                                    {dayjs(d.startAt).format("DD/DD/YYYY")}
                                                    &nbsp;at&nbsp;
                                                    {dayjs(d.startAt).format("hh:mm A")}
                                                </td>
                                                <td>{d.address}</td>
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
                                            <h2 className="center_shift">{selectedShift.name}</h2>
                                            <h4>When:</h4>
                                            <p>{dayjs(selectedShift.startAt).format("DD/DD/YYYY")}</p>
                                            <h4>Time:</h4>
                                            <p>{dayjs(selectedShift.startAt).format("hh:mm A")}</p>
                                            <h4>Where:</h4>
                                            <p>{selectedShift.address}</p>
                                            <h4>Task:</h4>
                                            <p>{selectedShift.description}</p>
                                        </tr>
                                        <div className="center_shift">
                                            <button
                                                className="btnPink"
                                                // onClick={() => void this.handleAccept(selectedShift)}
                                            >
                                                Accept
                                            </button>
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
