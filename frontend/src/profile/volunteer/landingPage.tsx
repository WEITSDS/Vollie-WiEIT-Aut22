import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./landingPage.css";
import { NavigationBar } from "../../components/navbar";
import { get } from "../../api/utility";
import { Button, Form, Modal, CloseButton } from "react-bootstrap";
import { setPageTitle } from "../../utility";
import { WEITBackground } from "../../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import { events, upcomingEventCard } from "../stub/calendarStub";

interface SlingState {
    email: string;
    password: string;
    showModal: boolean;
    showSignIn: boolean;
    token: string;
}

const localizer = momentLocalizer(moment);
const myEventsList = events;

export class VolunteerLandingPage extends React.Component<Record<string, never>> {
    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Home");
    }
    state: SlingState = {
        email: "",
        password: "",
        showModal: false,
        showSignIn: true,
        token: "",
    };

    componentDidMount() {
        if (localStorage.getItem("token") != null) {
            this.setState({ showSignIn: false });
        }
    }

    onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: e.target.value });
    };

    onSubmitSling = (e: React.FormEvent<HTMLFormElement> | undefined): void => {
        e?.preventDefault();
        void this.getToken();
        this.setState({ showModal: false });
    };

    handleShowModal = (e?: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        e?.preventDefault();
        this.setState({ showModal: true });
    };

    handleCloseModal = (e?: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        e?.preventDefault();
        this.setState({ showModal: false });
    };

    handleShowShifts = (e?: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        e?.preventDefault();
        void this.getShifts();
    };

    getToken = async () => {
        const data = await get(`/api/credentials/${this.state.email}/${this.state.password}`);
        const token = (await data.json()) as string;
        localStorage.setItem("token", token);
        this.setState({ showSignIn: false });
    };

    getShifts = async () => {
        const localToken = localStorage.getItem("token");
        const shiftData = await get(`/api/shifts/${localToken || ""}`);
        const shiftResponse = (await shiftData.json()) as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseJSON = JSON.parse(shiftResponse);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        for (let i = 0; i < responseJSON.length; i++) {
            myEventsList.push({
                title: "Available Shift",
                allDay: false,
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
                start: new Date(responseJSON[i].dtstart),
                /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
                end: new Date(responseJSON[i].dtend),
            });
        }
        this.forceUpdate();
    };

    render() {
        const cards = upcomingEventCard;
        const { email, password } = this.state;
        return (
            <>
                <NavigationBar />
                <WEITBackground>
                    <ModalBody className="form-body">
                        <div className="row">
                            <div className="sling-link-wrapper">
                                {this.state.showSignIn ? (
                                    <div className="sling-link">
                                        <h3>To see shifts, sign in to Sling!</h3>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="sling-btn"
                                            onClick={this.handleShowModal}
                                        >
                                            Sign in here
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="sling-link">
                                        <h3>Signed in to sling</h3>
                                    </div>
                                )}
                            </div>
                            <Modal show={this.state.showModal}>
                                <Modal.Header>
                                    <Modal.Title>Sign in to Sling</Modal.Title>
                                    <CloseButton onClick={this.handleCloseModal}></CloseButton>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="sling-form-container">
                                        <Form onSubmit={this.onSubmitSling}>
                                            <Form.Group controlId="formBasicEmail" className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="email"
                                                    placeholder="Email"
                                                    value={email}
                                                    onChange={this.onChangeEmail}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={this.onChangePassword}
                                                    required
                                                />
                                            </Form.Group>
                                            <Button variant="primary" type="submit" className="sling-btn">
                                                Sign in
                                            </Button>
                                        </Form>
                                    </div>
                                </Modal.Body>
                            </Modal>
                            <div className="leftcolumn">
                                <div className="card">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="update-btn"
                                        onClick={this.handleShowShifts}
                                    >
                                        Update Calender
                                    </Button>
                                    <div className="calendar">
                                        <Calendar
                                            localizer={localizer}
                                            events={myEventsList}
                                            startAccessor="start"
                                            endAccessor="end"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="rightcolumn">
                                <div className="center">
                                    <div className="upcomingEvent">
                                        <h2>Upcoming Event</h2>
                                    </div>
                                </div>
                                {cards.map((c) => (
                                    <div className="rightCard">
                                        <tr key={c.id}>
                                            <tr>{c.title}</tr>
                                            <tr>{c.date}</tr>
                                            <tr>{c.text}</tr>
                                        </tr>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ModalBody>
                </WEITBackground>
            </>
        );
    }
}
