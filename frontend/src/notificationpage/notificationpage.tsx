import "./notificationpage.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { NavigationBar } from "../components/navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { INotification } from "../api/notificationAPI";

export const NotificationPage = () => {
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index: number) => {
        setToggleState(index);
    };

    const DisplayButtonNotif = (notif: INotification) => {
        return (
            <div>
                <Link className="link" to="">
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
                </Link>
            </div>
        );
    };

    const DisplayNotif = (notif: INotification) => {
        return (
            <div>
                <Link className="link" to="">
                    <div key={notif._id} className="notif-container">
                        <div className="notif-box-content">
                            <h2 className="notif-name">{notif.userFirstName}</h2>
                            <h4 className="notif-type">{notif.type}</h4>
                            <h6 className="notif-content">{notif.content}</h6>
                            <h6 className="notif-time">{notif.time}</h6>
                        </div>
                    </div>
                </Link>
            </div>
        );
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
                                        // Filter notifications that require the approve button
                                        if (notif.type === "Volunteer Role Request for Approval") {
                                            return DisplayButtonNotif(notif);
                                        } else {
                                            return DisplayNotif(notif);
                                        }
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
                                            return DisplayNotif(notif);
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
                                            return DisplayNotif(notif);
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
                                        if (notif.type === "Volunteer Role Request for Approval") {
                                            return DisplayButtonNotif(notif);
                                        }
                                        if (notif.type === "Volunteer Type Request Approved") {
                                            return DisplayNotif(notif);
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
                                            return DisplayNotif(notif);
                                        }
                                        return;
                                    })}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};
