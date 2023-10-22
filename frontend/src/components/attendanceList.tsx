import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { IShift, setApprovalUserForShift, UserShiftAttendaceSummary } from "../api/shiftApi";
import participantsIcon from "../assets/participants.svg";
//import AttendanceList from "./attendanceList.json";
import { useAttendanceList } from "../hooks/useAttendanceList";
import RemoveUserFromShiftModal from "./removeUserFromShiftModal";
// import axios from "axios";
import "./attendanceList.css";
import { Link } from "react-router-dom";
import { setCompleteShift } from "../api/userApi";

type AttendanceListProps = {
    shift: IShift;
    showModal?: boolean;
    hideButton?: boolean;
    setShowModal?: () => void;
    onCloseModal?: () => void;
};

export default function AttendanceListModal({
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

    useEffect(() => {
        void refetch();
    }, [showModal, modalBox]);

    const onDeleteUser = async () => {
        await refetch();
        if (onCloseModal) {
            onCloseModal();
        }
    };

    const onApproveUser = async (targetUserId: string) => {
        try {
            await setApprovalUserForShift(targetUserId, shift._id, "approve");
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };

    const onUnApproveUser = async (targetUserId: string) => {
        try {
            await setApprovalUserForShift(targetUserId, shift._id, "unapprove");
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };

    const onMarkAsComplete = async (targetUserId: string) => {
        try {
            await setCompleteShift(targetUserId, shift._id, "complete");
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };

    const onMarkAsIncomplete = async (targetUserId: string) => {
        try {
            await setCompleteShift(targetUserId, shift._id, "incomplete");
            await refetch();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClosingThis = () => {
        if (onCloseModal) onCloseModal();

        if (setShowModal) setShowModal();
        else if (handleClose) handleClose();
    };

    const handleExport = () => {
        const rows = [
            [
                "Shift ID",
                "Name",
                "Venue",
                "Address",
                "Start Date/Time",
                "End Date/Time",
                "Length (Hours)",
                "Category",
                "Description",
                // "Notes",
            ],
            [
                shift._id,
                shift.name,
                shift.venue,
                shift.address,
                shift.startAt,
                shift.endAt,
                shift.hours,
                shift.category,
                shift.description,
                // shift.notes,
            ],
            [],
            ["Volunteer ID", "First Name", "Last Name", "Volunteer Type", "Approval Status", "Completion Status"],
        ] as string[][];
        attendanceListUsers?.data?.forEach((userShift) =>
            rows.push([
                userShift._id,
                userShift.firstName,
                userShift.lastName,
                userShift.volTypeName,
                userShift.approved ? "Approved" : "Pending Approval",
                userShift.completed ? "Completed" : "Pending Completion",
            ] as string[])
        );
        const csvContent =
            "data:text/csv;charset=utf-8," +
            rows
                .map((e) => e.map((str) => (typeof str === "string" ? str.replace(/,/g, "") : str)).join(","))
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shift_${shift.name}_${shift._id}.csv`);
        document.body.appendChild(link);

        link.click();
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
                    <Link to={`/profile/${userShift._id}`}>
                        {userShift.firstName}&nbsp;{userShift.lastName}
                    </Link>
                </td>
                <td>{userShift.volTypeName}</td>
                <td>{userShift.approved ? "Approved" : "Not Approved"}</td>
                <td>{userShift.completed ? "Completed" : "Not Completed"}</td>
                <td>
                    {!userShift.approved ? (
                        <Button onClick={() => void onApproveUser(userShift._id)}>Approve</Button>
                    ) : (
                        <Button onClick={() => void onUnApproveUser(userShift._id)}>Unapprove</Button>
                    )}
                </td>
                <td>
                    {!userShift.completed ? (
                        <Button onClick={() => void onMarkAsComplete(userShift._id)}>Mark Complete</Button>
                    ) : (
                        <Button onClick={() => void onMarkAsIncomplete(userShift._id)}>Mark Incomplete</Button>
                    )}
                </td>
                <td>
                    <RemoveUserFromShiftModal
                        onDelete={() => {
                            void onDeleteUser();
                        }}
                        shiftId={shift._id || ""}
                        userId={userShift._id || ""}
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
                <Modal.Footer className="attendance-modal-footer">
                    <Button onClick={handleExport}>Export</Button>
                    <Button onClick={handleClosingThis}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
