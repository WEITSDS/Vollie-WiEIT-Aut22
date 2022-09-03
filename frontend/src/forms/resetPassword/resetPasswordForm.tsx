import React from "react";
import { resetPassword } from "../../api/userAPI";
import { OTPVerifier } from "../otpVerifier";
import { setPageTitle } from "../../utility";
import { EnterEmail } from "./enterEmail";
import { ResetPassword } from "./resetPassword";
import { WEITBackground } from "../../components/background";

// This file defines the flow for resetting password, in three stages as defined in the enum below
enum ResetPasswordStage {
    EmailEntry, // 1. User enters their email (if already provided, we can skip this), and sends OTP to their email
    OTPVerification, // 2. User verifies themselves with OTP
    ResetPassword, // 3. User resets their password with a new one
}

// The stages, in order, so that we can +1/-1 to the current stage's index to find the next/prev stage
const STAGES_IN_ORDER = [
    ResetPasswordStage.EmailEntry,
    ResetPasswordStage.OTPVerification,
    ResetPasswordStage.ResetPassword,
];

interface ResetPasswordFlowProps {
    redirectTo: string;
    email?: string;
}
interface ResetPasswordFlowState {
    stage: ResetPasswordStage;
    email: string;
}

export class ResetPaswordForm extends React.Component<ResetPasswordFlowProps, ResetPasswordFlowState> {
    constructor(props: ResetPasswordFlowProps) {
        super(props);
        setPageTitle("Forgot Password");
        // If an email is provided to the form, skip the email entry stage
        const email = this.props.email;
        this.state = {
            email: email || "",
            stage: email ? ResetPasswordStage.OTPVerification : ResetPasswordStage.EmailEntry,
        };
    }

    setEmail = (email: string): void => {
        this.setState({ email });
    };

    nextStage = () => {
        this.changeStage(true);
    };

    prevStage = () => {
        this.changeStage(false);
    };

    changeStage = (goingForward = true) => {
        // Find the index of the current stage, add 1 if going forward or minus 1 if going backward,
        // and find the stage to move to (if it exists / is not null)
        const stageToMoveTo = STAGES_IN_ORDER[STAGES_IN_ORDER.indexOf(this.state.stage) + (goingForward ? 1 : -1)];
        if (stageToMoveTo != null) {
            this.setState({ stage: stageToMoveTo });
        }
    };

    resetPassword = async (password: string): Promise<string | void> => {
        try {
            // Attempt to reset the user's password, and if successful, redirect to the provided
            // url - if we fail, return some sort of message so whatever func that calls this
            // knows why we failed / can display it to the user
            const resp = await resetPassword({ password, email: this.state.email });
            if (!resp.success) return resp.message;
            window.location.href = this.props.redirectTo;
        } catch (err: unknown) {
            console.error(err);
            return "An unknown error occurred";
        }
    };

    render() {
        return <WEITBackground>{this.getFormStageToShow()}</WEITBackground>;
    }

    getFormStageToShow(): JSX.Element {
        const { email, stage } = this.state;
        switch (stage) {
            case ResetPasswordStage.EmailEntry:
                return <EnterEmail email={email} setEmail={this.setEmail} goNextStage={this.nextStage} />;
            case ResetPasswordStage.OTPVerification:
                return (
                    <OTPVerifier
                        email={email}
                        redirectTo={this.props.redirectTo}
                        goNextStage={this.nextStage}
                        goPrevStage={this.prevStage}
                    />
                );
            case ResetPasswordStage.ResetPassword:
                return <ResetPassword email={email} resetPassword={this.resetPassword} />;
            default:
                // If we've added another stage and forgot to handle it, fail noisily!
                throw new Error("Unhandled form stage!");
        }
    }
}
