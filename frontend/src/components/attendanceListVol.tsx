import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { IShift, UserShiftAttendaceSummary } from "../api/shiftApi";
import participantsIcon from "../assets/participants.svg";
import { useAttendanceList } from "../hooks/useAttendanceList";
import "./attendanceList.css";

type AttendanceListProps = {
    shift: IShift;
    showModal?: boolean;
    hideButton?: boolean;
    setShowModal?: () => void;
    onCloseModal?: () => void;
};

export default function AttendanceListVolModal({
    shift,
    showModal,
    setShowModal,
    hideButton,
    onCloseModal,
}: AttendanceListProps) {
    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);

    const { data: attendanceListUsers, isLoading, isError, refetch } = useAttendanceList(shift._id);
    console.log(attendanceListUsers);

    useEffect(() => {
        void refetch();
    }, [showModal, modalBox]);

    const handleClosingThis = () => {
        if (onCloseModal) onCloseModal();

        if (setShowModal) setShowModal();
        else if (handleClose) handleClose();
    };

    //With typescript, we should be defining a type for the users variable because it's a non standard datatype.
    //We set this type prior to setting the default value. Where null is the default. since we cant set a type, User[], as the default
    //We say the users variable can be a User[] or null and then set the default to null
    //We later deal with this in displayAttendanceList where we say the parameter can be User[] or null
    // const [users, setUsers] = useState<User[] | null>(null);

    // //Will run on component mount (once it's inserted into the view).
    // //Run with blank list at end to ensure it is only run once. When variables/s inside list change, the useEffect is run again
    // useEffect(() => {
    //     //Get the users from the userAPI in the interface User[] format
    //     const getUsers = async () => {
    //         //Wait for the response
    //         const response = await getAllUsers();
    //         //Since the response is in the format ResponseWithData<User[]>
    //         // Retrieve the users from the data object (message, success, data) which is of type User[]
    //         const users = response.data;

    //         //Use the useState functionality to set the users which is to be used later when rendering.
    //         setUsers(users);
    //     };
    //     //Run the above function
    //     void getUsers();
    // }, []);

    /**
     *
     * @param attendanceList User[] or null (defined in ResponseWithData interface in the utility class)
     * @returns map of rows to render
     *
     */

    const displayAttendanceList = (attendanceList: UserShiftAttendaceSummary[]) => {
        return attendanceList?.map((userShift, index) => (
            <tr key={userShift._id}>
                <th scope="row">{index + 1}</th>
                <td>
                    {userShift.firstName} {userShift.lastName}
                </td>
            </tr>
        ));
    };

    return (
        <>
            {/* Replace this with view attendance list button */}
            {/* <Nav.Link href="#" onClick={handleShow} className="text-body me-1">
                <i className="bi bi-question-circle" /> Help
            </Nav.Link> */}
            {!hideButton && (
                <Button size="sm" onClick={handleShow} variant="light" style={{ borderRadius: "50%" }}>
                    <img src={participantsIcon} alt="participants icon" title="Participants List" />
                </Button>
            )}

            {/* Table template for attendance list */}
            <Modal
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal || modalBox}
                onHide={handleClosingThis}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Attendance List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading && <p>Loading...</p>}
                    {isError && <p>Error loading attendance list...</p>}
                    {attendanceListUsers?.data && (
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col" align="center">
                                        Name
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{displayAttendanceList(attendanceListUsers?.data || [])}</tbody>
                        </table>
                    )}
                </Modal.Body>
                <Modal.Footer className="attendance-modal-footer">
                    <Button onClick={handleClosingThis}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
