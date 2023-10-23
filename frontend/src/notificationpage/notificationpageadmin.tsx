import "./notificationpageadmin.css";
// import { useMyNotifications } from "../hooks/useMyNotifications";
import { NavigationBar } from "../components/navbar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { INotification } from "../api/notificationAPI";
import { WEITBackground } from "../components/background";
import { ModalBody } from "react-bootstrap";
import { setApprovalUserForShift } from "../api/shiftApi";
import { useAllNotifications } from "../hooks/useAllNotifications";
import { setApprovalUserVolunteerType } from "../api/userApi";

export const NotificationPageAdmin = () => {
    // const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useAllNotifications();

    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index: number) => {
        setToggleState(index);
    };

    const [isUserID, setIsUserID] = useState("");
    const hoverIsUserID = (notif: INotification) => {
        setIsUserID(notif.user);
    };

    // const updateNotificationStatus = async (notificationId: string, action: string) => {
    //     console.log("updateNotificationStatus function called");
    //     try {
    //         const res = await fetch("/api/notifications/update-notification-status", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ notificationId, action }),
    //         });

    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         const data = await res.json();

    //         if (res.ok) {
    //             // Update state or do whatever you need to update the UI here
    //             alert("Notification status updated successfully!");
    //         } else {
    //             // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    //             alert(`Failed to update: ${data.message}`);
    //         }
    //     } catch (error) {
    //         console.error("Could not update notification status:", error);
    //     }
    // };

    const ShiftApprovalButtonNotif = (notif: INotification, currentUserId: string) => {
        const handleApproval = (approvalStatus: string) => {
            setApprovalUserForShift(currentUserId, notif.typeId, approvalStatus)
                .then((response) => {
                    if (response.status === 200) {
                        alert("Shift status updated successfully!");
                    } else {
                        alert(`Failed to update shift:`);
                    }
                })
                .catch((error) => {
                    console.error("Could not update shift approval status:", error);
                });
        };

        return (
            <div>
                <div key={notif?._id} className="notif-container-admin" onMouseEnter={() => hoverIsUserID(notif)}>
                    <div className="notif-box-content">
                        <Link className="link" to={`/profile/${isUserID}`}>
                            <h2 className="notif-name">{notif?.userFirstName} </h2>
                        </Link>
                        <h4 className="notif-type">{notif?.type}</h4>
                        <h6 className="notif-content">{notif?.content}</h6>
                        <h6 className="notif-time">{notif?.time}</h6>
                    </div>
                    <div className="notif-box-buttons">
                        <span className="notif-current-status">Current Status: {notif.action}</span>
                        <button
                            className={notif.action === "Approved" ? "notif-button-hidden" : "notif-button"}
                            onClick={() => handleApproval("approve")}
                        >
                            Approve
                        </button>
                        <button
                            className={notif.action === "Declined" ? "notif-button-hidden" : "notif-button"}
                            onClick={() => handleApproval("unapprove")}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const RoleApprovalButtonNotif = (notif: INotification) => {
        console.log(notif);
        const handleApproval = (approvalStatus: string) => {
            setApprovalUserVolunteerType(notif.typeId, notif.userVolType, approvalStatus)
                .then((response) => {
                    if (response.status === 200) {
                        alert("Role status updated successfully!");
                    } else {
                        alert(`Failed to update Role:`);
                    }
                })
                .catch((error) => {
                    console.error("Could not update Role approval status:", error);
                });
        };

        return (
            <div>
                <div key={notif?._id} className="notif-container-admin" onMouseEnter={() => hoverIsUserID(notif)}>
                    <div className="notif-box-content">
                        <Link className="link" to={`/profile/${notif.userVolType}`}>
                            <h2 className="notif-name">{notif?.userFirstName} </h2>
                        </Link>
                        <h4 className="notif-type">{notif?.type}</h4>
                        <h6 className="notif-content">{notif?.content}</h6>
                        <h6 className="notif-time">{notif?.time}</h6>
                    </div>
                    <div className="notif-box-buttons">
                        <span className="notif-current-status">Current Status: {notif.action}</span>
                        <button
                            className={notif.action === "Approved" ? "notif-button-hidden" : "notif-button"}
                            onClick={() => handleApproval("approve")}
                        >
                            Approve
                        </button>
                        <button
                            className={notif.action === "Declined" ? "notif-button-hidden" : "notif-button"}
                            onClick={() => handleApproval("unapprove")}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // const DisplayButtonNotif = (notif: INotification) => {
    //     // Notifications that need to use the approve/decline buttons
    //     return (
    //         <div>
    //             <div key={notif?._id} className="notif-container-admin" onMouseEnter={() => hoverIsUserID(notif)}>
    //                 <div className="notif-box-content">
    //                     <Link className="link" to={`/profile/${isUserID}`}>
    //                         <h2 className="notif-name">{notif?.userFirstName}</h2>
    //                     </Link>
    //                     <h4 className="notif-type">{notif?.type}</h4>
    //                     <h6 className="notif-content">{notif?.content}</h6>
    //                     <h6 className="notif-time">{notif?.time}</h6>
    //                 </div>
    //                 <div className="notif-box-buttons">
    //                     <span className="notif-current-status">Current Status: {notif.action}</span>
    //                     <button
    //                         className={notif.action === "Approved" ? "notif-button-hidden" : "notif-button"}
    //                         onClick={() => {
    //                             updateNotificationStatus(notif._id, "Approved")
    //                                 .then(() => {
    //                                     //alert("Notification status updated woah successfully!");
    //                                 })
    //                                 .catch((error) => {
    //                                     console.error("Could not update notification status:", error);
    //                                 });
    //                         }}
    //                     >
    //                         Approve
    //                     </button>

    //                     <button
    //                         className={notif.action === "Declined" ? "notif-button-hidden" : "notif-button"}
    //                         onClick={() => {
    //                             updateNotificationStatus(notif._id, "Declined")
    //                                 .then(() => {
    //                                     // Handle success here, if needed
    //                                 })
    //                                 .catch((error) => {
    //                                     console.error("Could not update notification status:", error);
    //                                 });
    //                         }}
    //                     >
    //                         Decline
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

    const DisplayNotif = (notif: INotification) => {
        // Regular notifications w/ no buttons
        return (
            <div>
                <div key={notif?._id} className="notif-container-admin" onMouseEnter={() => hoverIsUserID(notif)}>
                    <div className="notif-box-content">
                        <Link className="link" to={`/profile/${isUserID}`}>
                            <h2 className="notif-name">{notif?.userFirstName}</h2>
                        </Link>
                        <h4 className="notif-type">{notif?.type}</h4>
                        <h6 className="notif-content">{notif?.content}</h6>
                        <h6 className="notif-time">{notif?.time}</h6>
                    </div>
                </div>
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
                                        {toggleState === 1 &&
                                            !isLoadingNotifications &&
                                            userNotificationsData?.data &&
                                            userNotificationsData.data.map((notif?) => {
                                                if (notif?.type === "Volunteer Role Approval") {
                                                    return RoleApprovalButtonNotif(notif);
                                                } else if (notif?.type === "Approve Shift") {
                                                    return notif.user
                                                        ? ShiftApprovalButtonNotif(notif, notif.user)
                                                        : null;
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
                                        {toggleState === 2 &&
                                            !isLoadingNotifications &&
                                            userNotificationsData?.data &&
                                            userNotificationsData.data.map((notif) => {
                                                if (notif?.type === "Approve Shift") {
                                                    return notif.user
                                                        ? ShiftApprovalButtonNotif(notif, notif.user)
                                                        : null;
                                                }
                                                return;
                                            })}
                                    </li>
                                </ul>
                            </div>
                            <div className={toggleState === 3 ? "content-active" : "content"}>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        {toggleState === 3 &&
                                            !isLoadingNotifications &&
                                            userNotificationsData?.data &&
                                            userNotificationsData.data.map((notif) => {
                                                if (
                                                    notif?.type === "Qualification Approved" ||
                                                    notif?.type === "Expired Qualification"
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
                                        {toggleState === 4 &&
                                            !isLoadingNotifications &&
                                            userNotificationsData?.data &&
                                            userNotificationsData.data.map((notif) => {
                                                if (notif?.type === "Gender Equity" || notif?.type === "SPROUT") {
                                                    return notif ? RoleApprovalButtonNotif(notif) : null;
                                                }
                                                return;
                                            })}
                                    </li>
                                </ul>
                            </div>
                            <div className={toggleState === 5 ? "content-active" : "content"}>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        {toggleState === 5 &&
                                            !isLoadingNotifications &&
                                            userNotificationsData?.data &&
                                            userNotificationsData.data.map((notif) => {
                                                if (
                                                    notif?.type === "Cancelled Shift" ||
                                                    notif?.type === "Updated Shift"
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
