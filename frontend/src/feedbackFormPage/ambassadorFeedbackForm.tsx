import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { addFeedback } from "../api/feedbackAPI";
import { useFeedbackByUserId } from "../hooks/useFeedbackByUserId";

interface AmbassadorFeedbackProps {
    shiftId: string;
    userId: string | undefined;
    view: string;
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

    const completedFeedback = {
        experience: "",
        learnings: "",
        improvements: "",
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
            completedFeedback.experience = firstMatching.experience || "";
            completedFeedback.learnings = firstMatching.learnings || "";
            completedFeedback.improvements = firstMatching.improvements || "";
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
                feedback.comments,
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
        }
    };

    const { onClose } = props || {};

    function disabled() {
        return feedback.rating == 0;
    }

    // if ambassador, all optional except for rating
    if (props.view == "pending") {
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
    } else {
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
                                name="sessionActivities"
                                value={completedFeedback.experience}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="experience" className="mb-3">
                            <Form.Label>How did you find the experience?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="experience"
                                value={completedFeedback.learnings}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="lessons" className="mb-3">
                            <Form.Label>What were some key learnings from the experience?</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="lessons"
                                value={completedFeedback.improvements}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="comments" className="mb-3">
                            <Form.Label>Please tell us of any feedback you would like us to know:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="comments"
                                value={completedFeedback.additionalComments}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group controlId="rating" className="mb-3">
                            <Form.Label>Please rate your overall experience for this session:</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={parseInt(completedFeedback.rating || "0")}
                                min={1}
                                max={5}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                    </Form>
                    {errorMessage && <p>{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => onClose(true)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
};
