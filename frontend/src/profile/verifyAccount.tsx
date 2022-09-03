// import { Modal } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { OTPVerifier } from "../forms/otpVerifier";

interface VerifyAccountProps {
    email: string;
    closeModal: () => void;
}

export const VerifyAccountModal = ({ email, closeModal }: VerifyAccountProps) => {
    return (
        <Modal centered show={true}>
            <OTPVerifier
                dontUseModalBody={true}
                email={email}
                goNextStage={closeModal}
                redirectTo=""
                goPrevStage={closeModal}
                otpReason="to verify your account"
            />
        </Modal>
    );
};
