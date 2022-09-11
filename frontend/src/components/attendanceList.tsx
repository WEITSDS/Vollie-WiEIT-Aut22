import { useState, useEffect } from "react";
import { Modal, Button, Nav } from "react-bootstrap";
//import AttendanceList from "./attendanceList.json";
import { getAllUsers, User } from "../api/userAPI";
// import axios from "axios";

export default function AttendanceListModal() {
    /*For Testing Purposes, the Attendance List Modal/Table is mapped to the help button on the NAV bar
    To revert to previous state, 
    1) Link helpModal.ts to Navbar.TSX (All Under Components Folder)
    2) Test  */

    const [modalBox, setModalBox] = useState(false);
    const handleClose = () => setModalBox(false);
    const handleShow = () => setModalBox(true);

    //With typescript, we should be defining a type for the users variable because it's a non standard datatype.
    //We set this type prior to setting the default value. Where null is the default. since we cant set a type, User[], as the default
    //We say the users variable can be a User[] or null and then set the default to null
    //We later deal with this in displayAttendanceList where we say the parameter can be User[] or null
    const [users, setUsers] = useState<User[] | null>(null);
    

    //Will run on component mount (once it's inserted into the view). 
    //Run with blank list at end to ensure it is only run once. When variables/s inside list change, the useEffect is run again
    useEffect(() => {
        //Get the users from the userAPI in the interface User[] format
        const getUsers = async () => {
            //Wait for the response
            let response = await getAllUsers();
            //Since the response is in the format ResponseWithData<User[]> 
            // Retrieve the users from the data object (message, success, data) which is of type User[]
            let users = response.data;

            //Use the useState functionality to set the users which is to be used later when rendering.
            setUsers(users);
        }
        //Run the above function
        getUsers();
    }, []);

    /**
     * 
     * @param attendanceList User[] or null (defined in ResponseWithData interface in the utility class)
     * @returns map of rows to render
     * 
     */

    const displayAttendanceList = (attendanceList: User[] | null) => {
        return (
            attendanceList?.map((attendanceList, index) => (
                <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{attendanceList.firstName}&nbsp;{attendanceList.lastName}</td>
                    <td>{attendanceList.isAdmin}</td>
                </tr>
            ))
        )
    }

    return (
        <>
            {/* Replace this with view attendance list button */}   
            <Nav.Link href="#" onClick={handleShow} className="text-body me-1">
                <i className="bi bi-question-circle" /> Help
            </Nav.Link>
            {/* Table template for attendance list */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalBox}
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Attendance List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Volunteer Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayAttendanceList(users)}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
