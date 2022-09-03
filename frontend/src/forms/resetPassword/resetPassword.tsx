import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { passwordIsValid } from "../../utility";

interface ResetPasswordProps {
    email: string;
    resetPassword: (password: string) => Promise<string | void>;
}

interface ResetPasswordState {
    newPassword: string;
    confirmPassword: string;
    errorMessage?: string;
}

export class ResetPassword extends React.Component<ResetPasswordProps, ResetPasswordState> {
    state: ResetPasswordState = { newPassword: "", confirmPassword: "" };

    onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newPassword: e.target.value });
    };

    onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ confirmPassword: e.target.value });
    };

    onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        this.props
            .resetPassword(this.state.newPassword)
            .then((errorMessage) => {
                if (errorMessage) {
                    this.setState({ errorMessage });
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({ errorMessage: "An unknown error occurred" });
            });
    };

    render() {
        const { newPassword, confirmPassword, errorMessage } = this.state;
        const passwordInvalid = !passwordIsValid(newPassword);
        const confirmPasswordInvalid = newPassword !== confirmPassword;
        return (
            <ModalBody className="form-body">
                <div className="form-container">
                    <Form onSubmit={this.onSubmit}>
                        <ModalTitle className="text-center">
                            <p className="display-6">Reset your password</p>
                            <div className="fs-5">
                                <p className="fw-lighter"> Enter a new password for your account</p>
                            </div>
                        </ModalTitle>
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={this.onChangePassword}
                                required
                                isInvalid={passwordInvalid}
                            />
                        </Form.Group>
                        <Form.Group controlId="formConfirmPassword" className="mb-3">
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={this.onChangeConfirmPassword}
                                required
                                isInvalid={confirmPasswordInvalid}
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100">
                            Reset
                        </Button>
                    </Form>
                    {errorMessage && <Form.Text>{errorMessage}</Form.Text>}
                    <hr />
                </div>
            </ModalBody>
        );
    }
}
