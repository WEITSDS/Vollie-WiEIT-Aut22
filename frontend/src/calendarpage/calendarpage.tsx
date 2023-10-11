import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { getOwnUser, User } from "../api/userApi";
import React from "react";
import { NavigationBar } from "../components/navbar";
import CalendarModal from "../components/calendarModal/calendarModal";
import "./calendarpage.css";
import { WEITBackground } from "../components/background";
import { ModalBody } from "react-bootstrap";

const CalendarPage = () => {
    const localizer = momentLocalizer(moment);
    const [user, setUser] = React.useState<User>();
    React.useEffect(() => {
        const fetchData = async () => {
            const result = await getOwnUser();
            setUser(result.data as User);
            console.log(result.data);
        };
        fetchData().catch(console.error);
    }, []);
    return (
        <>
            <NavigationBar />

            <div className="background">
                <WEITBackground>
                    <></>
                </WEITBackground>
            </div>

            <ModalBody>
                <div className="calendar-page">
                    <div className="title-header">
                        <h1 className="calendar-header">Calendar</h1>
                        <CalendarModal accountID={user?._id || ""} />
                    </div>
                    <Calendar
                        localizer={localizer}
                        onSelectEvent={(event) => {
                            window.location.replace(`/shift/${event.id}`);
                        }}
                        events={user?.shifts?.map((shift) => {
                            return {
                                startAt: new Date(shift?.shift?.startAt),
                                endAt: new Date(shift?.shift?.endAt),
                                name: shift?.shift?.name || "Shift",
                                id: shift?.shift?._id,
                            };
                        })}
                        startAccessor="startAt"
                        endAccessor="endAt"
                        titleAccessor="name"
                        style={{ height: 500 }}
                    />
                </div>
            </ModalBody>
        </>
    );
};
export { CalendarPage };
