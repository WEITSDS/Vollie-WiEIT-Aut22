import { Nav } from "react-bootstrap";
import "./calendarModal.css";

interface Props {
    accountID: string;
}

export default function CalendarModal(props: Props) {
    const { accountID } = props;

    if (!accountID) return <></>;

    return (
        <>
            <Nav.Link href="/calendar" className="text-body me-1">
                <i className="bi bi-calendar" /> Calendar
            </Nav.Link>
        </>
    );
}
