import { useState } from "react";
// import { useOwnUser } from "../hooks/useOwnUser";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addFeedback } from "../api/feedbackAPI";
import { useFeedbackByUserId } from "../hooks/useFeedbackByUserId";

interface VolunteerFeedbackProps {
    shiftId: string | undefined;
    userId: string | undefined;
    view: string;
    onClose: (success?: boolean) => void;
}

export const VolunteerFeedbackForm = (props: VolunteerFeedbackProps) => {
    // const userQuery = useOwnUser();
    // const shift = userQuery.data?.data?.shifts.find((shift) => shift.shift._id === props.shiftId);

    const [feedback, setFeedback] = useState({
        generalFeedback: "",
        rating: 0,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const completedFeedback = {
        additionalComments: "",
        rating: "",
    };
    // getFeedback with userId
    const feedbackQuery = useFeedbackByUserId();

    if (props.view == "completed") {
        const feedbackData = feedbackQuery.data?.data;

        // sort until finding matching shift in returned forms
        const matchingFeedback = feedbackData?.filter((data) => data.shift === props.shiftId);
        const firstMatching = matchingFeedback?.at(0);

        // set feedback variable above to feedback recieved that matches shift
        if (firstMatching != undefined) {
            completedFeedback.additionalComments = firstMatching.additionalComments || "";
            completedFeedback.rating = firstMatching.rating || "0";
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFeedback((prevFeedback) => ({ ...prevFeedback, [name]: value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.rating == 0) {
            return setErrorMessage("Please provide a rating for your experience.");
        }

        void handleSubmit();
    };

    const handleSubmit = async () => {
        let errorMessage = "";
        try {
            const response = await addFeedback(
                props.userId || "",
                props.shiftId || "",
                feedback.rating.toString(),
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                feedback.generalFeedback,
                true
            );
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
            await feedbackQuery.refetch();
            if (props.onClose) props.onClose(true);
        } catch (err) {
            console.error(err);
            errorMessage = "An unexpected error occurred.";
        } finally {
            setErrorMessage(errorMessage);
            //setUploading(false);
        }
    };

    const { onClose } = props || {};

    function disabled() {
        return feedback.rating == 0;
    }

    if (props.view == "pending") {
        return (
            <Modal show={true} onHide={onClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="generalFeedback" className="mb-3">
                            <Form.Label>
                                If you have any feedback, or things you would like us to know about the session, please
                                note it here: (Optional)
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Enter feedback..."
                                name="generalFeedback"
                                value={feedback.generalFeedback}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="rating" className="mb-3">
                            <Form.Label>Please rate your overall experience for this session:</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={feedback.rating}
                                min={1}
                                max={5}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                    {errorMessage && <p>{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose(true)}>
                        Cancel
                    </Button>
                    <Button onClick={(e) => onSubmit(e)} disabled={disabled()}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    } else {
        return (
            <Modal show={true} onHide={onClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="generalFeedback" className="mb-3">
                            <Form.Label>
                                If you have any feedback, or things you would like us to know about the session, please
                                note it here: (Optional)
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="generalFeedback"
                                value={completedFeedback?.additionalComments}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group controlId="rating" className="mb-3">
                            <Form.Label>Please rate your overall experience for this session:</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={parseInt(completedFeedback.rating || "0")}
                                disabled
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose(true)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
};
