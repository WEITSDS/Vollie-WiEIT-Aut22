import "./notificationpage.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { NavigationBar } from "../components/navbar";
import { useState } from "react";
// import { Table } from "react-bootstrap";

export const NotificationPage = () => {
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index: number) => {
        setToggleState(index);
    };

    return (
        <>
            <NavigationBar />
            <div className="tabs-container">
                <div className="tabs-block">
                    <button className={toggleState === 1 ? "tabs-active" : "tabs"} onClick={() => toggleTab(1)}>
                        All
                    </button>
                    <button className={toggleState === 2 ? "tabs-active" : "tabs"} onClick={() => toggleTab(2)}>
                        Shift Approval
                    </button>
                    <button className={toggleState === 3 ? "tabs-active" : "tabs"} onClick={() => toggleTab(3)}>
                        Qualification Approval
                    </button>
                    <button className={toggleState === 4 ? "tabs-active" : "tabs"} onClick={() => toggleTab(4)}>
                        Role Approval
                    </button>
                    <button className={toggleState === 5 ? "tabs-active" : "tabs"} onClick={() => toggleTab(5)}>
                        Shift Changes
                    </button>
                </div>

                <div className="content-tabs">
                    <div className={toggleState === 1 ? "content-active" : "content"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        return (
                                            <div key={notif._id} className="notif-container">
                                                <div className="notif-box-content">
                                                    <h2 className="notif-name">{notif.userFirstName}</h2>
                                                    <h4 className="notif-type">{notif.type}</h4>
                                                    <h6 className="notif-content">{notif.content}</h6>
                                                    <h6 className="notif-time">{notif.time}</h6>
                                                </div>
                                                <div className="notif-box-buttons">
                                                    <button className="notif-button">Approve</button>
                                                    <button className="notif-button">Decline</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </li>
                        </ul>
                    </div>
                    <div className={toggleState === 2 ? "content-active" : "content"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        if (notif.type === "Sign Up Shift") {
                                            return (
                                                <div key={notif._id} className="notif-container">
                                                    <div className="notif-box-content">
                                                        <h2 className="notif-name">{notif.userFirstName}</h2>
                                                        <h4 className="notif-type">{notif.type}</h4>
                                                        <h6 className="notif-content">{notif.content}</h6>
                                                        <h6 className="notif-time">{notif.time}</h6>
                                                    </div>
                                                    <div className="notif-box-buttons">
                                                        <button className="notif-button">Approve</button>
                                                        <button className="notif-button">Decline</button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return;
                                    })}
                            </li>
                        </ul>
                    </div>
                    <div className={toggleState === 3 ? "content-active" : "content"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        if (
                                            notif.type === "Qualification Approved" ||
                                            notif.type === "Expired Qualification"
                                        ) {
                                            return (
                                                <div key={notif._id} className="notif-container">
                                                    <div className="notif-box-content">
                                                        <h2 className="notif-name">{notif.userFirstName}</h2>
                                                        <h4 className="notif-type">{notif.type}</h4>
                                                        <h6 className="notif-content">{notif.content}</h6>
                                                        <h6 className="notif-time">{notif.time}</h6>
                                                    </div>
                                                    <div className="notif-box-buttons">
                                                        <button className="notif-button">Approve</button>
                                                        <button className="notif-button">Decline</button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return;
                                    })}
                            </li>
                        </ul>
                    </div>
                    <div className={toggleState === 4 ? "content-active" : "content"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        if (
                                            notif.type === "Volunteer Role Request for Approval" ||
                                            notif.type === "Volunteer Type Request Approved"
                                        ) {
                                            return (
                                                <div key={notif._id} className="notif-container">
                                                    <div className="notif-box-content">
                                                        <h2 className="notif-name">{notif.userFirstName}</h2>
                                                        <h4 className="notif-type">{notif.type}</h4>
                                                        <h6 className="notif-content">{notif.content}</h6>
                                                        <h6 className="notif-time">{notif.time}</h6>
                                                    </div>
                                                    <div className="notif-box-buttons">
                                                        <button className="notif-button">Approve</button>
                                                        <button className="notif-button">Decline</button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return;
                                    })}
                            </li>
                        </ul>
                    </div>
                    <div className={toggleState === 5 ? "content-active" : "content"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        if (notif.type === "Cancelled Shift" || notif.type === "Updated Shift") {
                                            return (
                                                <div key={notif._id} className="notif-container">
                                                    <div className="notif-box-content">
                                                        <h2 className="notif-name">{notif.userFirstName}</h2>
                                                        <h4 className="notif-type">{notif.type}</h4>
                                                        <h6 className="notif-content">{notif.content}</h6>
                                                        <h6 className="notif-time">{notif.time}</h6>
                                                    </div>
                                                    <div className="notif-box-buttons">
                                                        <button className="notif-button">Approve</button>
                                                        <button className="notif-button">Decline</button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return;
                                    })}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* <div className="notification-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>User</th>
                            <th>Type</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoadingNotifications &&
                            userNotificationsData?.data &&
                            userNotificationsData.data.map((notif) => {
                                return (
                                    <tr key={notif._id}>
                                        <td>{notif.time}</td>
                                        <td>{notif.userFirstName}</td>
                                        <td>{notif.type}</td>
                                        <td>{notif.content}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div> */}
        </>
    );
};
