import "./notificationpage.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
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
            </div>
        </>
    );
};
