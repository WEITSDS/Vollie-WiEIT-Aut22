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
                            <th>#</th>
                            <th>User</th>
                            <th>Type</th>
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
                                        <td>{notif.userFirstName}</td>
                                        <td>{notif.type}</td>
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
