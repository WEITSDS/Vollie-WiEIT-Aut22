import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { SITE_NAME } from "../../constants";

interface EnterEmailProps extends FormStage {
    email: string;
    setEmail: (email: string) => void;
}

interface EnterEmailState {
    errorMessage: string;
}

export class EnterEmail extends React.Component<EnterEmailProps, EnterEmailState> {
    onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setEmail(e.target.value);
    };

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.props.goNextStage?.();
    };

    render() {
        const { email } = this.props;
        return (
            <ModalBody className="form-body">
                <div className="form-container">
                    <Form onSubmit={this.onSubmit}>
                        <ModalTitle className="text-center">
                            <p className="display-6">Reset Your Password</p>
                            <div className="fs-5">
                                <p className="fw-lighter"> Enter your email address below to reset your password</p>
                            </div>
                        </ModalTitle>
                        <Form.Group controlId="formBasicEmail" className="mb-3">
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={email}
                                onChange={this.onChangeEmail}
                                required
                                // TODO add email verification here
                            />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100" disabled={email === ""}>
                            Submit
                        </Button>
                        {/* {failed && <Form.Text>Email or password is incorrect.</Form.Text>} */}
                    </Form>
                    <hr />
                    <div className="text-center">
                        <a href="/register" role="button">
                            <h6 className="register-text">New to {SITE_NAME}? Join here.</h6>
                        </a>
                    </div>
                </div>
            </ModalBody>
        );
    }
}
