import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { NewUserBody, registerUser } from "../api/userApi";
import { SITE_NAME } from "../constants";
import { emailIsValid, passwordIsValid, setPageTitle, stringValueIsValid, volunteerTypeIsValid } from "../utility";
import { WEITBackground } from "../components/background";

interface RegisterState extends NewUserBody {
    confirmPassword: string;
    errorMessages?: string[];
    repeatAttempt?: boolean;
    externalError?: string;
}

export class RegisterPage extends React.Component<Record<string, never>, RegisterState> {
    state: RegisterState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        volunteerType: "generalVolunteer",
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Register");
    }

    onChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ firstName: e.target.value });
    };

    onChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ lastName: e.target.value });
    };

    onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: e.target.value });
    };

    onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ confirmPassword: e.target.value });
    };

    onChangeVolunteerType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ volunteerType: e.target.value });
    };

    onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        void this.performRegister();
    };

    private async performRegister() {
        // Reset any error states
        this.setState({ errorMessages: undefined, externalError: undefined });
        const { firstName, lastName, email, password, confirmPassword, volunteerType } = this.state;
        // Some of these checks are redundant as the form checks some of them, but good to have anyway
        const errorMessages: string[] = [];
        if (!firstName || !lastName) {
            errorMessages.push("First name and last name must not be empty");
        }
        if (!email || !/(uts\.edu\.au)/gm.test(email)) {
            errorMessages.push("Email must be a valid UTS email ending in 'uts.edu.au'");
        }
        if (password !== confirmPassword) {
            errorMessages.push("Passwords must match");
        }
        this.setState({ errorMessages, repeatAttempt: true });
        if (errorMessages.length > 0) {
            return;
        }

        const registerAttempt = await registerUser({ firstName, lastName, email, password, volunteerType });
        if (registerAttempt.success) {
            window.location.href = "/home";
        } else {
            console.log(registerAttempt);
            this.setState({ externalError: registerAttempt.message });
        }
    }

    render() {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            errorMessages,
            externalError,
            repeatAttempt,
            volunteerType,
        } = this.state;
        const firstNameInvalid = repeatAttempt && !stringValueIsValid(firstName);
        const lastNameInvalid = repeatAttempt && !stringValueIsValid(lastName);
        const emailInvalid = repeatAttempt && !emailIsValid(email);
        const passwordInvalid = repeatAttempt && !passwordIsValid(password);
        const confirmPasswordInvalid = repeatAttempt && password !== confirmPassword;
        const volunteerTypeInvalid = !volunteerTypeIsValid(volunteerType);
        return (
            <WEITBackground>
                <ModalBody className="form-body">
                    <div className="form-container">
                        <Form onSubmit={this.onSubmit}>
                            <ModalTitle className="text-center">
                                <h1 className="display-6">Join {SITE_NAME}!</h1>
                            </ModalTitle>
                            <Form.Group controlId="formFName" className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="fname"
                                    placeholder="First Name*"
                                    value={firstName}
                                    onChange={this.onChangeFirstName}
                                    required
                                    isInvalid={firstNameInvalid}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLName" className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="lname"
                                    placeholder="Last Name*"
                                    value={lastName}
                                    onChange={this.onChangeLastName}
                                    required
                                    isInvalid={lastNameInvalid}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="UTS Email*"
                                    value={email}
                                    onChange={this.onChangeEmail}
                                    required
                                    isInvalid={emailInvalid}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password*"
                                    value={password}
                                    onChange={this.onChangePassword}
                                    required
                                    isInvalid={passwordInvalid}
                                />
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password*"
                                    value={confirmPassword}
                                    onChange={this.onChangeConfirmPassword}
                                    required
                                    isInvalid={confirmPasswordInvalid}
                                />
                            </Form.Group>
                            <Form.Group controlId="formVolunteerType" className="mb-3">
                                <Form.Select
                                    onChange={this.onChangeVolunteerType}
                                    aria-label="Volunteer type selection"
                                    value={volunteerType}
                                    isInvalid={volunteerTypeInvalid}
                                >
                                    <option value="generalVolunteer">General Volunteer</option>
                                    <option value="undergradAmbassador">Undergrad Ambassador</option>
                                    <option value="postgradAmbassador">Postgrad Ambassador</option>
                                    <option value="staffAmbassador">Staff Ambassador</option>
                                    <option value="sprout">SPROUT</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Register
                            </Button>
                        </Form>
                        <div className="text-center">
                            {errorMessages != null && errorMessages.length > 0 && (
                                <>
                                    <br></br>
                                    <ul>
                                        {errorMessages.map((err, index) => (
                                            <li key={`err-message-${index}`}>{err}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {externalError && (
                                <>
                                    <br></br>
                                    <ul>
                                        <li key={`err-message-external`}>{externalError}</li>
                                    </ul>
                                </>
                            )}
                            <hr />
                            <span>Already on {SITE_NAME}?</span>{" "}
                            <a href="/login" role="button">
                                <h6 className="link-primary">Login here.</h6>
                            </a>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        );
    }
}
