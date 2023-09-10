import "./notificationpageadmin.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { NavigationBar } from "../components/navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { INotification } from "../api/notificationAPI";
import { WEITBackground } from "../components/background";
import { ModalBody } from "react-bootstrap";

export const NotificationPageAdmin = () => {
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index: number) => {
        setToggleState(index);
    };
    const updateNotificationStatus = async (notificationId: string, action: string) => {
        console.log("updateNotificationStatus function called");
        try {
            const res = await fetch("/api/notifications/update-notification-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notificationId, action }),
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data = await res.json();

            if (res.ok) {
                // Update state or do whatever you need to update the UI here
                alert("Notification status updated successfully!");
            } else {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                alert(`Failed to update: ${data.message}`);
            }
        } catch (error) {
            console.error("Could not update notification status:", error);
        }
    };

    // TO-DO: Insert relevant Link destinations for DisplayButtonNotif & DisplayNotif
    // TO-DO: Insert relevant Link destinations for Approve/Decline buttons

    const DisplayButtonNotif = (notif: INotification) => {
        // Notifications that need to use the approve/decline buttons
        return (
            <div>
                <Link className="link" to="">
                    <div key={notif._id} className="notif-container-admin">
                        <div className="notif-box-content">
                            <h2 className="notif-name">{notif.userFirstName}</h2>
                            <h4 className="notif-type">{notif.type}</h4>
                            <h6 className="notif-content">{notif.content}</h6>
                            <h6 className="notif-time">{notif.time}</h6>
                        </div>
                        <div className="notif-box-buttons">
                            <span className="notif-current-status">Current Status: {notif.action}</span>
                            <button
                                className="notif-button"
                                onClick={() => {
                                    updateNotificationStatus(notif._id, "Approved")
                                        .then(() => {
                                            //alert("Notification status updated woah successfully!");
                                        })
                                        .catch((error) => {
                                            console.error("Could not update notification status:", error);
                                        });
                                }}
                            >
                                Approve
                            </button>

                            <button
                                className="notif-button"
                                onClick={() => {
                                    updateNotificationStatus(notif._id, "Declined")
                                        .then(() => {
                                            // Handle success here, if needed
                                        })
                                        .catch((error) => {
                                            console.error("Could not update notification status:", error);
                                        });
                                }}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        );
    };
    const DisplayNotif = (notif: INotification) => {
        // Regular notifications w/ no buttons
        return (
            <div>
                <Link className="link" to="">
                    <div key={notif._id} className="notif-container-admin">
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
            <WEITBackground>
                <ModalBody>
                    <div className="tabs-container-admin">
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
                                                if (
                                                    notif.type === "Cancelled Shift" ||
                                                    notif.type === "Updated Shift"
                                                ) {
                                                    return DisplayNotif(notif);
                                                }
                                                return;
                                            })}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
