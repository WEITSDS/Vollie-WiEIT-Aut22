import React, { useState } from "react";
import { createShift } from "../api/shiftApi";
import LoadingSpinner from "../components/loadingSpinner";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./addShiftForm.css";

type HandleClose = () => void;
type formProps = {
    handleClose: HandleClose;
};

const shiftFormFields = {
    name: "",
    startAt: "",
    endAt: "",
    venue: "",
    address: "",
    description: "",
    notes: "",
    category: "Other",
    requiresWWCC: false,
    numGeneralVolunteers: 0,
    numUndergradAmbassadors: 0,
    numPostgradAmbassadors: 0,
    numStaffAmbassadors: 0,
    numSprouts: 0,
};

const AddShiftForm: React.FC<formProps> = ({ handleClose }) => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState(shiftFormFields);
    const [isLoading, setIsLoading] = useState(false);
    const [responseMsg, setresponseMsg] = useState("");

    const handleChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        event.preventDefault();
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.type === "number" ? parseInt(target.value) : target.value;
        console.log(value);
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${target.name}`]: value };
        });
    };

    const handleCheckbox = (event: React.FormEvent<HTMLInputElement>): void => {
        // event.preventDefault();
        const target = event.target as HTMLInputElement;
        console.log(target.checked);
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, requiresWWCC: target.checked };
        });
    };

    const handleSubmit = async (): Promise<void> => {
        try {
            setIsLoading(true);
            console.log(formFields);
            const createResponse = await createShift(formFields);
            setIsLoading(false);
            console.log(createResponse);
            if (createResponse.success && createResponse?.data?._id) {
                handleClose();
                navigate(`/shift/${createResponse.data._id}`);
            } else {
                setresponseMsg(createResponse.message || "");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form className="add-shift-form">
                <div className="form-header">
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <label className="title">Title</label>
                <input type="text" name="name" onChange={handleChange} />

                <label>Start Date</label>
                <input type="datetime-local" name="startAt" onChange={handleChange} />

                <label>End Date</label>
                <input type="datetime-local" name="endAt" onChange={handleChange} />

                <label>Venue</label>
                <input type="text" name="venue" onChange={handleChange} />

                <label>Address</label>
                <input type="text" name="address" onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" onChange={handleChange} />

                <label>Notes</label>
                <input type="text" name="notes" onChange={handleChange} />

                <label>Category</label>
                <Form.Select onChange={handleChange} aria-label="Shift category" defaultValue={"Other"}>
                    <option value="Other">Other</option>
                    <option value="School Outreach">School Outreach</option>
                    <option value="Event">Event</option>
                    <option value="Committee">Committee</option>
                </Form.Select>

                <label>Requires WWCC?</label>
                <input
                    type="checkbox"
                    checked={formFields.requiresWWCC}
                    name="requiresWWCC"
                    onChange={handleCheckbox}
                />

                <h1 className="type-header">Volunteer Type Allocations</h1>
                <hr className="type-line" />
                <div className="type-container">
                    <div className="type">
                        <label>General volunteer:</label>
                        <input
                            type="number"
                            name="numGeneralVolunteers"
                            min={0}
                            defaultValue={0}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Undergraduate ambassadors:</label>
                        <input
                            type="number"
                            name="numUndergradAmbassadors"
                            min={0}
                            defaultValue={0}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Postgradute ambassadors:</label>
                        <input
                            type="number"
                            name="numPostgradAmbassadors"
                            min={0}
                            defaultValue={0}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Staff ambassadors:</label>
                        <input type="number" name="numSprouts" min={0} defaultValue={0} onChange={handleChange} />
                    </div>
                    <div className="type">
                        <label>SPROUT:</label>
                        <input
                            type="number"
                            name="numStaffAmbassadors"
                            min={0}
                            defaultValue={0}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="error-message" hidden={responseMsg === ""}>
                    {responseMsg !== "" && <p>{responseMsg}</p>}
                </div>
                <div className="btn-container">
                    <button
                        className="cancel-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            handleClose();
                        }}
                    >
                        Cancel
                    </button>
                    {!isLoading && (
                        <button
                            className="add-btn"
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit().catch((err) => console.log(err));
                            }}
                        >
                            Add
                        </button>
                    )}
                    {isLoading && (
                        <button className="add-btn" type="submit" disabled>
                            <div className="loading-btn">
                                <div className="spinner-icon">
                                    <LoadingSpinner />
                                </div>
                                <div className=" load-txt">Add</div>
                            </div>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddShiftForm;
