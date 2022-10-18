import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { UserShiftAttendaceSummary } from "../api/shiftApi";
import participantsIcon from "../assets/participants.svg";
//import AttendanceList from "./attendanceList.json";
import { useAttendanceList } from "../hooks/useAttendanceList";
import RemoveUserFromShiftModal from "./removeUserFromShiftModal";
// import axios from "axios";
import "./attendanceList.css";
import { Link } from "react-router-dom";

type AttendanceListProps = {
    shiftId: string;
    showModal?: boolean;
    hideButton?: boolean;
    setShowModal?: () => void;
    onCloseModal?: () => void;
};

export default function AttendanceListModal({
    shiftId,
    showModal,
    setShowModal,
    hideButton,
    onCloseModal,
}: AttendanceListProps) {
    /*For Testing Purposes, the Attendance List Modal/Table is mapped to the help button on the NAV bar
    To revert to previous state, 
    1) Link helpModal.ts to Navbar.TSX (All Under Components Folder)
    2) Test  */

    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);

    const { data: attendanceListUsers, isLoading, isError, refetch } = useAttendanceList(shiftId);

    useEffect(() => {
        void refetch();
    }, [showModal, modalBox]);

    const onDeleteUser = async () => {
        await refetch();
        if (onCloseModal) {
            onCloseModal();
        }
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
        return attendanceList?.map((user, index) => (
            <tr key={user._id}>
                <th scope="row">{index + 1}</th>
                <td>
                    <Link to={`/profile/${user._id}`}>
                        {user.firstName}&nbsp;{user.lastName}
                    </Link>
                </td>
                <td>{user.volTypeName}</td>
                <td>{user.approved ? "Approved" : "Not Approved"}</td>
                <td>{user.completed ? "Completed" : "Not Completed"}</td>
                <td>
                    <Button>Approve</Button>
                </td>
                <td>
                    <Button>Mark Completed</Button>
                </td>
                <td>
                    <RemoveUserFromShiftModal
                        onDelete={() => {
                            void onDeleteUser();
                        }}
                        shiftId={shiftId || ""}
                        userId={user._id || ""}
                    />
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
                    <img src={participantsIcon} alt="participants icon" />
                </Button>
            )}

            {/* Table template for attendance list */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal || modalBox}
                onHide={setShowModal || handleClose}
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
                                    <th scope="col">Name</th>
                                    <th scope="col">Chosen Volunteer Type</th>
                                    <th scope="col">Approval Status</th>
                                    <th scope="col">Completion Status</th>
                                    <th scope="col">Approve</th>
                                    <th scope="col">Mark Completed</th>
                                    <th scope="col">Remove User</th>
                                </tr>
                            </thead>
                            <tbody>{displayAttendanceList(attendanceListUsers?.data || [])}</tbody>
                        </table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={setShowModal || handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
