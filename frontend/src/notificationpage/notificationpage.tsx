import "./notificationpageadmin.css";
import { useMyNotifications } from "../hooks/useMyNotifications";
import { NavigationBar } from "../components/navbar";
import { Link } from "react-router-dom";
import { INotification } from "../api/notificationAPI";
// import { useAllNotifications } from "../hooks/useAllNotifications";
export const NotificationPage = () => {
    const { data: userNotificationsData, isLoading: isLoadingNotifications } = useMyNotifications();
    // const { data: userNotificationsData, isLoading: isLoadingNotifications } = useAllNotifications();

    // TO-DO: Insert relevant Link destinations for DisplayNotif
    // TO-DO: Filter to only show user-relevant notifications

    const DisplayNotif = (notif: INotification) => {
        // Regular notifications w/ no buttons
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
                <div className="content-tabs">
                    <div className={"content-active"}>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {!isLoadingNotifications &&
                                    userNotificationsData?.data &&
                                    userNotificationsData.data.map((notif) => {
                                        return DisplayNotif(notif);
                                    })}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};
