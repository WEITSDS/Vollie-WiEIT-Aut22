import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addFeedback } from "../api/feedbackAPI";

interface LeadSproutFeedbackProps {
    shiftId: string;
    userId: string | undefined;
    onClose: (success?: boolean) => void;
}

export const LeadSproutFeedbackForm = (props: LeadSproutFeedbackProps) => {
    const [feedback, setFeedback] = useState({
        teachersAndFacilitators: "",
        classroomContent: "",
        teamDynamics: "",
        managementStyles: "",
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
                "",
                "",
                feedback.teachersAndFacilitators,
                "",
                "",
                "",
                "",
                feedback.managementStyles,
                feedback.classroomContent,
                feedback.teamDynamics,
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
        return (
            feedback.teachersAndFacilitators.length == 0 ||
            feedback.classroomContent.length == 0 ||
            feedback.teamDynamics.length == 0 ||
            feedback.managementStyles.length == 0 ||
            feedback.rating == 0
        );
    }

    // if lead sprout, all optional except for rating
    return (
        <Modal show={true} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Lead SPROUT feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="teachersAndFacilitators" className="mb-3">
                        <Form.Label>Who were the classroom teachers and the facilitators with each?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Teachers and facilitators..."
                            name="teachersAndFacilitators"
                            value={feedback.teachersAndFacilitators}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="classroomContent" className="mb-3">
                        <Form.Label>Where did each classroom get up to in content delivery?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Classroom content..."
                            name="classroomContent"
                            value={feedback.classroomContent}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="teamDynamics" className="mb-3">
                        <Form.Label>
                            How were the team dynamics in each classroom? (Did they work together well, who was
                            presenting, how were classroom activities managed, were tasks shared)
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Team dynamics..."
                            name="teamDynamics"
                            value={feedback.teamDynamics}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="managementStyles" className="mb-3">
                        <Form.Label>
                            What comments do you have on individual facilitator's classroom management and facilitation
                            styles? (What are some stand-out skills/positives and areas for development amongst the
                            team)
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Management styles..."
                            name="managementStyles"
                            value={feedback.managementStyles}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="comments" className="mb-3">
                        <Form.Label>
                            If you have any other thoughts or comments (for your own record or for us to know), note
                            them here: (Optional)
                        </Form.Label>
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
