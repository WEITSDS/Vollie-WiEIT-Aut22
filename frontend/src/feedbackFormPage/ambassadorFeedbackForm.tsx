import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addFeedback } from "../api/feedbackAPI";

interface AmbassadorFeedbackProps {
    shiftId: string;
    userId: string | undefined;
    onClose: (success?: boolean) => void;
}

export const AmbassadorFeedbackForm = (props: AmbassadorFeedbackProps) => {
    const [feedback, setFeedback] = useState({
        sessionActivities: "",
        experience: "",
        lessons: "",
        comments: "",
        rating: 0,
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFeedback((prevFeedback) => ({ ...prevFeedback, [name]: value }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.rating == 0) {
            return setErrorMessage("Please provide a rating for your experience.");
        }

        //setUploading(true);

        void handleSubmit();
    };

    const handleSubmit = async () => {
        let errorMessage = "";
        try {
            const response = await addFeedback(
                props.userId || "",
                feedback.rating.toString(),
                feedback.sessionActivities, // experience
                feedback.lessons, // learnings
                "",
                "",
                "",
                feedback.experience, // improvements
                "",
                "",
                "",
                "",
                feedback.comments
            );
            if (!response.success) {
                errorMessage = response.message;
                return;
            }
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

    // if ambassador, all optional except for rating
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Ambassador Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="sessionActivities" className="mb-3">
                        <Form.Label>What did you do in the session?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Session activities..."
                            name="sessionActivities"
                            value={feedback.sessionActivities}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="experience" className="mb-3">
                        <Form.Label>How did you find the experience?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Experience..."
                            name="experience"
                            value={feedback.experience}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="lessons" className="mb-3">
                        <Form.Label>What were some key learnings from the experience?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Key learnings..."
                            name="lessons"
                            value={feedback.lessons}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="comments" className="mb-3">
                        <Form.Label>Please tell us of any feedback you would like us to know:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Comments..."
                            name="comments"
                            value={feedback.comments}
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
};
