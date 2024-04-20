import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

interface VolunteerFeedbackProps {
    //userId?: string;
    onClose: (success?: boolean) => void;
}

export const VolunteerFeedbackForm = (props: VolunteerFeedbackProps) => {
    const [feedback, setFeedback] = useState({
        generalFeedback: "",
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
        //void handleSubmit(); TODO once api finished - see addrolemodal for example
    };

    const { onClose } = props || {};

    function disabled() {
        return feedback.rating == 0;
    }

    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Volunteer Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="generalFeedback" className="mb-3">
                        <Form.Label>
                            If you have any feedback, or things you would like us to know about the session, please note
                            it here: (Optional)
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
};
