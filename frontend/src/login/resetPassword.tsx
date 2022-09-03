import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { SITE_NAME } from "../constants";
import { setPageTitle } from "../utility";
interface ResetPasswordDetails {
    email: string;
}

interface ResetPasswordState extends ResetPasswordDetails {
    failed?: boolean;
    repeatAttempt?: boolean;
}
export class ResetPasswordPage extends React.Component<Record<string, never>, ResetPasswordState> {
    state: ResetPasswordState = {
        email: "",
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Forgot Password");
    }

    onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        // login here with email and password
        const { email } = this.state;
        const loginDetails: ResetPasswordDetails = { email };
        console.log(loginDetails); //TODO remove :)
        const success = false;
        if (success) {
            // redirect to homepage
        } else {
            this.setState({ failed: true, repeatAttempt: true });
        }
    };

    render() {
        const { email, failed, repeatAttempt } = this.state;
        return (
            <ModalBody id="login-body">
                <Form className="form-background" onSubmit={this.onSubmit}>
                    <ModalTitle style={{ textAlign: "center" }}>
                        {/* <img src={logo} class="Uts-logo" /> */}
                        <p>Reset Your Password</p>
                    </ModalTitle>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={this.onChangeEmail}
                            required
                            isInvalid={repeatAttempt && email === ""}
                        />
                    </Form.Group>
                    <Button variant="outline-dark" type="submit" style={{ width: "100%" }}>
                        Submit
                    </Button>
                    {failed && <Form.Text>Email or password is incorrect.</Form.Text>}
                </Form>
                <hr />
                <a href="/register" role="button">
                    <h6 className="register-text">New to {SITE_NAME}? Join here.</h6>
                </a>
            </ModalBody>
        );
    }
}
