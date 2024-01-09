import React, { useRef, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { registerUser } from "../api/userApi";
import { SITE_NAME } from "../constants";
import { emailIsValid, setPageTitle, stringValueIsValid } from "../utility";
import { WEITBackground } from "../components/background";
import Select from "react-select";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { IVolunteerTypeUser } from "../api/volTypeAPI";
interface IVolTypeSelect {
    value: string;
    label: string;
}

const RegisterPage = () => {
    const { isLoading: loadingVolTypes, isError, data: volTypes, error } = useAllVolTypes();
    const [errorMessages, seterrorMessages] = useState<string[]>([]);
    const [repeatAttempt, setrepeatAttempt] = useState<boolean>(false);
    const [externalError, setexternalError] = useState<string>("");

    const [firstName, setfirstName] = useState<string>("");
    const [lastName, setlastName] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const [confirmPassword, setconfirmPassword] = useState<string>("");
    const [volunteerTypes, setvolunteerTypes] = useState<IVolunteerTypeUser[]>([]);
    const [elWidth, setElWidth] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPageTitle("Register");
        setElWidth(ref?.current?.offsetWidth || 315);
    }, []);

    function containsUpperCase(val: string): boolean {
        return /[A-Z]/.test(val);
    }

    function passwordIsValid(val: string): boolean {
        return stringValueIsValid(val) && val.length >= 8 && val.length <= 64 && containsUpperCase(val) === true;
    }

    const onChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setfirstName(e.target.value);
    };

    const onChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setlastName(e.target.value);
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setemail(e.target.value);
    };

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpassword(e.target.value);
    };

    const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setconfirmPassword(e.target.value);
    };

    const onChangeVolunteerType = (option: readonly IVolTypeSelect[]) => {
        const volIds = option.map((opt) => {
            return { type: opt.value, approved: false };
        }); // Just map to appropriate interface shape, server will override approved status anyway
        setvolunteerTypes(volIds);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        void performRegister();
    };

    const performRegister = async () => {
        // Reset any error states
        seterrorMessages([]);
        setexternalError("");
        // Some of these checks are redundant as the form checks some of them, but good to have anyway
        const errorMessages: string[] = [];
        if (!firstName || !lastName) {
            errorMessages.push("First name and last name must not be empty");
        }
        if (!email || !/(uts\.edu\.au)/gm.test(email)) {
            errorMessages.push("Email must be a valid UTS email ending in 'uts.edu.au'");
        }
        if (!passwordIsValid(password)) {
            errorMessages.push("Passwords must have at least one uppercase letter and more than 8 characters.");
        }
        if (password !== confirmPassword) {
            errorMessages.push("Passwords must match");
        }

        if (volunteerTypes.length < 1) {
            errorMessages.push("You must select at least 1 volunteer type.");
        }
        seterrorMessages(errorMessages);
        setrepeatAttempt(true);
        if (errorMessages.length > 0) {
            return;
        }

        const registerAttempt = await registerUser({ firstName, lastName, email, password, volunteerTypes });
        if (registerAttempt.success) {
            window.location.href = "/home";
        } else {
            console.log(registerAttempt);
            setexternalError(registerAttempt.message);
        }
    };

    const firstNameInvalid = repeatAttempt && !stringValueIsValid(firstName);
    const lastNameInvalid = repeatAttempt && !stringValueIsValid(lastName);
    const emailInvalid = repeatAttempt && !emailIsValid(email);
    const passwordInvalid = repeatAttempt && !passwordIsValid(password);
    const confirmPasswordInvalid = repeatAttempt && password !== confirmPassword;

    const volTypesSelection = volTypes?.data
        ? volTypes.data.map((vol) => {
              return { value: vol._id, label: vol.name };
          })
        : [];

    return (
        <>
            {loadingVolTypes && <p>Loading data...</p>}
            {isError && <p>There was a server error while loading available registration data... {error}</p>}
            {!loadingVolTypes && volTypes && (
                <WEITBackground>
                    <ModalBody className="form-body">
                        <div className="form-container">
                            <Form onSubmit={onSubmit}>
                                <ModalTitle className="text-center">
                                    <h1 className="display-6">Join {SITE_NAME}!</h1>
                                </ModalTitle>
                                <Form.Group controlId="formFName" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="fname"
                                        placeholder="First Name*"
                                        value={firstName}
                                        onChange={onChangeFirstName}
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
                                        onChange={onChangeLastName}
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
                                        onChange={onChangeEmail}
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
                                        onChange={onChangePassword}
                                        required
                                        isInvalid={passwordInvalid}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword" className="mb-3" ref={ref}>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password*"
                                        value={confirmPassword}
                                        onChange={onChangeConfirmPassword}
                                        required
                                        isInvalid={confirmPasswordInvalid}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formVolunteerType" className="mb-3">
                                    <Select
                                        options={volTypesSelection}
                                        placeholder="Select volunteer type"
                                        isSearchable={true}
                                        isMulti
                                        onChange={onChangeVolunteerType}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                width: `${elWidth}px`,
                                            }),
                                        }}
                                    />
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
            )}
        </>
    );
};

export { RegisterPage };
