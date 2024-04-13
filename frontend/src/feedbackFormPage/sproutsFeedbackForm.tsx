import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

interface SproutsFeedbackProps {
    //userId?: string;
    onClose: (success?: boolean) => void;
}

export const SproutsFeedbackForm = (props: SproutsFeedbackProps) => {
    const [feedback, setFeedback] = useState({
        teacher: "",
        studentEngagement: "",
        teacherEngagement: "",
        bestPart: "",
        partImproved: "",
        improvementSuggestion: "",
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
        //void handleSubmit(); TODO once api finished - see addrolemodal for example
    };

    const { onClose } = props || {};

    function disabled() {
        return (
            feedback.rating == 0 ||
            feedback.teacher.length == 0 ||
            feedback.studentEngagement.length == 0 ||
            feedback.teacherEngagement.length == 0 ||
            feedback.bestPart.length == 0 ||
            feedback.partImproved.length == 0 ||
            feedback.improvementSuggestion.length == 0
        );
    }

    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Sprouts Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="teacher" className="mb-3">
                        <Form.Label>Who was your class teacher?</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Teacher..."
                            name="teacher"
                            value={feedback.teacher}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="studentEngagment" className="mb-3">
                        <Form.Label>How engaged were the students?</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Student Engagement..."
                            name="studentEngagement"
                            value={feedback.studentEngagement}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="teacherEngagement" className="mb-3">
                        <Form.Label>How engaged were the teacher(s)?</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Teacher Engagement..."
                            name="teacherEngagement"
                            value={feedback.teacherEngagement}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="bestPart" className="mb-3">
                        <Form.Label>
                            What was the best part of the session? (in terms of classroom delivery or content)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Best part of the session..."
                            name="bestPart"
                            value={feedback.bestPart}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="partImproved" className="mb-3">
                        <Form.Label>
                            What part of the session could be improved? (in terms of classroom delivery or content)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Improvements..."
                            name="partImproved"
                            value={feedback.partImproved}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="improvementSuggestion" className="mb-3">
                        <Form.Label>
                            How could this part be improved? (in terms of classroom delivery or content)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="This can be improved by..."
                            name="improvementSuggestion"
                            value={feedback.improvementSuggestion}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="comments" className="mb-3">
                        <Form.Label>
                            If you have any other thoughts or comments (for your own record or for us to know), note
                            them here: (Optional)
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Any comments..."
                            name="comments"
                            value={feedback.comments}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="rating" className="mb-3">
                        <Form.Label>Please rate your overall experience for this session. </Form.Label>
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
