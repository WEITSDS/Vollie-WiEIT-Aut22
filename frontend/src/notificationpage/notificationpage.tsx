//import { useParams } from "react-router-dom";
import "./notificationpage.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
/*import { useOwnUser } from "../hooks/useOwnUser";
import { useUserById } from "../hooks/useUserById";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { ResponseWithStatus } from "../api/utility";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { useUserById } from "../hooks/useUserById";
import { useParams } from "react-router-dom";
*/
//import { useState } from "react";
import { NavigationBar } from "../components/navbar";
import { Table } from "react-bootstrap";

export const NotificationPage = () => {
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();

    return (
        <>
            <NavigationBar />
            <div className="notification-table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Content</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoadingNotifications &&
                            userNotificationsData?.data &&
                            userNotificationsData.data.map((notif, index) => {
                                return (
                                    <tr key={notif._id}>
                                        <td>{index + 1}</td>
                                        <td>{notif.user}</td>
                                        <td>{notif.content}</td>
                                        <td>{notif.time}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </Table>
            </div>
        </>
    );
};
