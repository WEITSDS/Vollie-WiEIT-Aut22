import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ModalBody from "react-bootstrap/ModalBody";
import ModalTitle from "react-bootstrap/ModalTitle";
import { sendOTPEmail, verifyOTP } from "../api/userApi";

interface OTPProps extends FormStage {
    email: string;
    redirectTo: string;
    dontUseModalBody?: boolean;
    otpReason?: string;
}

interface OTPState {
    code: string;
    failed?: boolean;
    externalError?: string;
    showResendButton: boolean;
    sentInitialOTP: boolean;
}

export class OTPVerifier extends React.Component<OTPProps, OTPState> {
    state: OTPState = {
        code: "",
        showResendButton: false,
        sentInitialOTP: false,
    };

    private showResendTimer: NodeJS.Timeout | undefined;

    constructor(props: OTPProps) {
        super(props);
        this.showResendOTPButtonAfterDelay();
    }

    sendOTPEmailForUser = async (): Promise<void> => {
        try {
            const resp = await sendOTPEmail(this.props.email);
            if (!resp.success && resp.status !== 404) {
                this.setState({ externalError: resp.message });
            }
        } catch (err: unknown) {
            console.error(err);
            this.setState({ externalError: "An unknown error occured!" });
        }
    };

    componentDidMount = async () => {
        if (!this.state.sentInitialOTP) {
            this.setState({ sentInitialOTP: true });
            await this.sendOTPEmailForUser();
        }
    };

    componentWillUnmount() {
        if (this.showResendTimer) {
            clearTimeout(this.showResendTimer);
        }
    }

    showResendOTPButtonAfterDelay = () => {
        // Only show the resend button after a bit so users don't spam it
        this.setState({ showResendButton: false });
        const halfMinute = 30 * 1000;
        this.showResendTimer = setTimeout(() => {
            this.setState({ showResendButton: true });
        }, halfMinute);
    };

    onResendOTP = () => {
        // Reset the visibility of the resend button
        this.showResendOTPButtonAfterDelay();
        // TODO post to server here to resend OTP
        void this.sendOTPEmailForUser();
    };

    private static NUM_DIGITS = 6;

    onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCode = e.target.value;
        // If the user is trying to input something longer than we allow,
        // don't let them make the change. Same if they're trying to add
        // random characters that make the code not a number
        if (newCode.length > OTPVerifier.NUM_DIGITS) return;
        if (isNaN(+newCode)) return;
        this.setState({ code: newCode });
    };

    onSubmitOTP = (e: React.FormEvent<HTMLFormElement> | undefined): void => {
        e?.preventDefault();
        // Reset error states
        this.performVerification().catch(console.error);
    };

    performVerification = async (): Promise<void> => {
        this.setState({ failed: false, externalError: undefined });
        try {
            const response = await verifyOTP({ email: this.props.email, code: this.state.code });
            // const response = { success: false, message: "this is a to do" };
            if (response.success) {
                if (this.props.goNextStage) {
                    this.props.goNextStage();
                } else {
                    window.location.href = this.props.redirectTo;
                }
            } else {
                this.setState({ failed: true, externalError: response.message });
            }
        } catch (err: unknown) {
            console.error(err);
        }
    };

    render() {
        const { code, externalError, failed, showResendButton } = this.state;
        const submitDisabled = code.length !== OTPVerifier.NUM_DIGITS;
        const { goPrevStage, dontUseModalBody, otpReason } = this.props;
        const content = (
            <div className="form-container">
                <Form onSubmit={this.onSubmitOTP}>
                    <ModalTitle className="text-center">
                        <p className="display-6">Enter your OTP</p>
                    </ModalTitle>
                    <div className="fs-5">
                        <p className="fw-lighter">
                            Please enter the code sent to your UTS email account below{otpReason ? ` ${otpReason}` : ""}
                            .
                        </p>
                        <p className="fw-lighter">
                            <strong>Enter 6-digit code:</strong>
                        </p>
                    </div>
                    <Form.Group controlId="otpCode" className="mb-3">
                        <Form.Control
                            className="text-center"
                            type="text"
                            name="otpCode"
                            value={code}
                            onChange={this.onTextChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100" disabled={submitDisabled}>
                        Submit
                    </Button>
                    {goPrevStage && (
                        <Button variant="primary" className="w-100 mt-2" onClick={goPrevStage}>
                            Cancel
                        </Button>
                    )}
                    <div className="text-center">
                        {showResendButton && (
                            <div className="mt-3">
                                <a href="#" role="button" onClick={this.onResendOTP}>
                                    <h6>Didn't get a code? Click here to resend it.</h6>
                                </a>
                            </div>
                        )}
                        {failed && !externalError && (
                            <div className="mt-2">
                                <Form.Text className="mt-2">The code is not valid.</Form.Text>
                                <br />
                            </div>
                        )}
                        {externalError && (
                            <div className="mt-2">
                                <Form.Text>{externalError}</Form.Text>
                                <br />
                            </div>
                        )}
                    </div>
                </Form>
            </div>
        );

        return dontUseModalBody ? <div>{content}</div> : <ModalBody className="form-body">{content}</ModalBody>;
    }
}
