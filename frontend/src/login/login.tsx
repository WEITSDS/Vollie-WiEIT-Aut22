import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { getUser, LoginBody, loginUser } from "../api/userApi";
import { SITE_NAME } from "../constants";
import { setPageTitle } from "../utility";
import { WEITBackground } from "../components/background";
import { VerifyAccountModal } from "../profile/verifyAccount";
import { getLoggedInUser } from "../protectedRoute";

interface LoginState extends LoginBody {
    failed?: boolean;
    repeatAttempt?: boolean;
    externalError?: string;
    showOTPModal?: boolean;
}

export class LoginPage extends React.Component<Record<string, never>, LoginState> {
    state: LoginState = {
        email: "",
        password: "",
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Login");
    }

    onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: e.target.value });
    };

    onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined): void => {
        e?.preventDefault();
        void this.performLogin();
    };

    performLogin = async (): Promise<void> => {
        // Reset any error states
        this.setState({ failed: false, externalError: undefined });
        const loginAttempt = await loginUser({ email: this.state.email, password: this.state.password });

        if (loginAttempt.success) {
            const user = await getUser();
            console.log("userLog", user);
            if (user.data && !user.data.verified) {
                this.showOTPVerifierModal();
                return;
            }
            // Redirect to home page if successful and verified
            if (user.data?.isAdmin) {
                window.location.href = "/dashboard";
            } else {
                window.location.href = "/home";
            }
        } else {
            this.setState({
                // Only consider 4** responses as 'failed', don't include anything 5**
                failed: loginAttempt.status >= 400 && loginAttempt.status < 500,
                repeatAttempt: true,
                externalError: loginAttempt.status >= 500 ? loginAttempt.message : undefined,
            });
        }
    };

    showOTPVerifierModal = () => {
        this.setState({ showOTPModal: true });
    };

    closeOTPVerifierModal = () => {
        const currentUser = getLoggedInUser();
        if (currentUser?.isAdmin) {
            window.location.href = "/dashboard";
        } else {
            window.location.href = "/home";
        }
    };

    render() {
        const { email, password, failed, repeatAttempt, externalError, showOTPModal } = this.state;
        return (
            <WEITBackground>
                <ModalBody className="form-body">
                    <div className="form-container">
                        <Form onSubmit={this.onSubmit}>
                            <ModalTitle className="text-center">
                                <h1 className="display-6">{SITE_NAME}</h1>
                            </ModalTitle>
                            <Form.Group controlId="formBasicEmail" className="mb-3">
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
                            <Form.Group controlId="formBasicPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={this.onChangePassword}
                                    required
                                    isInvalid={repeatAttempt && password === ""}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>
                        </Form>
                        <div className="text-center">
                            {failed && <Form.Text>Email or password is incorrect.</Form.Text>}
                            {externalError && <Form.Text>{externalError}</Form.Text>}
                            <hr />
                            <a href="/forgotpassword" role="button">
                                <h6 className="reset-text">Forgot password?</h6>
                            </a>
                            <a href="/register" role="button">
                                <h6 className="link-primary"> New to {SITE_NAME}? Join here.</h6>
                            </a>
                        </div>
                    </div>
                    {showOTPModal && <VerifyAccountModal email={email} closeModal={this.closeOTPVerifierModal} />}
                </ModalBody>
            </WEITBackground>
        );
    }
}
