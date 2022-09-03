import React from "react";
import "./myShift.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavigationBar } from "../components/navbar";

export class MyShift extends React.Component {
    render() {
        return (
            <>
                <NavigationBar />
                <div className="row">
                    <div className="tablecentrecolumn">
                        <div className="myshiftcenter">
                            <h1>My Shifts</h1>
                            <div className="leftCard1">
                                <div className="volunteerType"> </div>
                                <div className="dropdown">
                                    <button className="dropbtn">Status</button>
                                    <div className="dropdown-content">
                                        <a href="#">Completed</a>
                                        <a href="#">Uncomplete</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="myshiftscrollable">
                                <table className="table table-fixed">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>When</th>
                                            <th>Where</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Uncompleted</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">
                                                        <a href="./modal">More Info</a>
                                                    </button>
                                                    {/* <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div> */}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Uncompleted</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Uncompleted</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Uncompleted</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Task</td>
                                            <td>15/05/2002</td>
                                            <td>Location</td>
                                            <td>Completed</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="dropbtn2">More Info</button>
                                                    <div className="dropdown-content">
                                                        <a href="#">Time</a>
                                                        <a href="#">Contact</a>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
