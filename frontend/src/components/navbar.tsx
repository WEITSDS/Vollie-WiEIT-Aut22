import React from "react";
import logo from "../images/uts-logo.svg";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import HelpModal from "./helpModal";
import { logoutUser, User } from "../api/userApi";
import { getLoggedInUser } from "../protectedRoute";
//import CalendarModal from "./calendarModal/calendarModal";
import CalendarLink from "./calendarModal/calendarLink";

interface NavBarState {
    currentUser: User | undefined;
}
export class NavigationBar extends React.Component<Record<string, never>, NavBarState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = { currentUser: getLoggedInUser() };
    }

    handleLogout = (): void => {
        logoutUser()
            .then(({ success, status }) => {
                if (success && status == 200) {
                    window.location.href = "/login";
                    sessionStorage.clear();
                } else {
                    console.error(`Failed to logout`);
                }
            })
            .catch(console.error);
    };

    render() {
        const { currentUser } = this.state;
        return (
            <Navbar expand="lg" sticky="top" style={{ backgroundColor: "whitesmoke" }}>
                <Container fluid>
                    <Navbar.Brand href="/home">
                        <img className="uts-logo" src={logo} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-options" />
                    <Navbar.Collapse id="navbar-options">
                        <Nav className="me-auto">
                            <Nav.Link href="/home" className="text-body me-1">
                                <i className="bi bi-search" /> Search Shifts
                            </Nav.Link>
                            {currentUser?.isAdmin && (
                                <Nav.Link href="/dashboard" className="text-body me-1">
                                    <i className="bi bi-activity" /> Admin Dashboard
                                </Nav.Link>
                            )}
                            {!currentUser?.isAdmin && (
                                <Nav.Link href="/myshifts" className="text-body">
                                    <i className="bi bi-alarm" /> My Shifts
                                </Nav.Link>
                            )}

                            {currentUser?.isAdmin && (
                                <Nav.Link href="/notificationsadmin" className="text-body">
                                    <i className="bi bi-bell" /> Admin Notifications
                                </Nav.Link>
                            )}
                            {currentUser?.isAdmin && (
                                <Nav.Link href="/settings" className="text-body">
                                    <i className="bi bi-gear" /> Settings
                                </Nav.Link>
                            )}
                            {!currentUser?.isAdmin && (
                                <Nav.Link href="notifications" className="text-body">
                                    <i className="bi bi-bell" /> My Notifications
                                </Nav.Link>
                            )}
                        </Nav>
                        <Nav>
                            <HelpModal />
                            <CalendarLink accountID={currentUser?._id || ""} />
                            <NavDropdown
                                align="end"
                                title={
                                    <span className="text-body">
                                        <i className="bi bi-person-circle" /> {currentUser?.firstName || "Anonymous"}
                                    </span>
                                }
                            >
                                <Nav.Link href="/profile" className="text-body">
                                    <i className="bi bi-person" /> Profile
                                </Nav.Link>

                                <NavDropdown.Divider />
                                <Nav.Link href="#" onClick={this.handleLogout}>
                                    <i className="bi bi-box-arrow-right" /> Logout
                                </Nav.Link>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}
