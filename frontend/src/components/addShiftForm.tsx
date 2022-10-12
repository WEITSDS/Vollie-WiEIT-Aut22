import React, { useState } from "react";
import { createShift, updateShift, IShift } from "../api/shiftApi";
import LoadingSpinner from "../components/loadingSpinner";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./addShiftForm.css";

type HandleClose = () => void;
type formProps = {
    handleClose: HandleClose;
    previousShiftFields?: IShift | undefined;
};

const shiftFormFields = {
    name: "",
    startAt: "",
    endAt: "",
    venue: "",
    address: "",
    description: "",
    hours: 0,
    notes: "",
    category: "Other",
    requiresWWCC: false,
    numGeneralVolunteers: 0,
    numUndergradAmbassadors: 0,
    numPostgradAmbassadors: 0,
    numStaffAmbassadors: 0,
    numSprouts: 0,
};

const dateStringToHTML = (date: string) => {
    const d = new Date(date);
    const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
    return dateTimeLocalValue;
};

const AddShiftForm: React.FC<formProps> = ({ handleClose, previousShiftFields }) => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState(previousShiftFields || shiftFormFields);
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
            let response;
            if (previousShiftFields) {
                // do update
                response = await updateShift(formFields, previousShiftFields._id);
            } else {
                // do create
                response = await createShift(formFields);
            }

            setIsLoading(false);
            console.log(response);
            if (response.success && response?.data?._id) {
                handleClose();
                navigate(`/shift/${response.data._id}`);
            } else {
                setresponseMsg(response.message || "");
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
                <input type="text" defaultValue={formFields.name} name="name" onChange={handleChange} />

                <label>Start Date</label>
                <input
                    className="date"
                    type="datetime-local"
                    defaultValue={formFields.startAt ? dateStringToHTML(formFields.startAt) : undefined}
                    name="startAt"
                    onChange={handleChange}
                />

                <label>End Date</label>
                <input
                    className="date"
                    type="datetime-local"
                    defaultValue={formFields.startAt ? dateStringToHTML(formFields.endAt) : undefined}
                    name="endAt"
                    onChange={handleChange}
                />

                <hr className="type-line" />

                <label>Venue</label>
                <input type="text" defaultValue={formFields.venue} name="venue" onChange={handleChange} />

                <label>Address</label>
                <input type="text" defaultValue={formFields.address} name="address" onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" defaultValue={formFields.description} onChange={handleChange} />

                <label>Work Hours</label>
                <input
                    className="work-hours"
                    type="number"
                    min={0}
                    defaultValue={formFields.hours}
                    name="hours"
                    onChange={handleChange}
                />

                <hr className="type-line" />

                <label>Notes</label>
                <input type="text" defaultValue={formFields.notes} name="notes" onChange={handleChange} />

                <label>Category</label>
                <Form.Select
                    className="drop-down"
                    onChange={handleChange}
                    aria-label="Shift category"
                    defaultValue={formFields.category}
                >
                    <option value="Other">Other</option>
                    <option value="School Outreach">School Outreach</option>
                    <option value="Event">Event</option>
                    <option value="Committee">Committee</option>
                </Form.Select>

                <hr className="type-line" />

                <div>
                    <label>Requires WWCC?</label>
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={formFields.requiresWWCC}
                        name="requiresWWCC"
                        onChange={handleCheckbox}
                    />
                </div>

                <hr className="type-line" />

                <h1 className="type-header">Volunteer Type Allocations</h1>
                <div className="type-container">
                    <div className="type">
                        <label>General volunteer:</label>
                        <input
                            type="number"
                            name="numGeneralVolunteers"
                            min={0}
                            defaultValue={formFields.numGeneralVolunteers}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Undergraduate ambassadors:</label>
                        <input
                            type="number"
                            name="numUndergradAmbassadors"
                            min={0}
                            defaultValue={formFields.numUndergradAmbassadors}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Postgradute ambassadors:</label>
                        <input
                            type="number"
                            name="numPostgradAmbassadors"
                            min={0}
                            defaultValue={formFields.numPostgradAmbassadors}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>Staff ambassadors:</label>
                        <input
                            type="number"
                            name="numSprouts"
                            min={0}
                            defaultValue={formFields.numStaffAmbassadors}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="type">
                        <label>SPROUT:</label>
                        <input
                            type="number"
                            name="numStaffAmbassadors"
                            min={0}
                            defaultValue={formFields.numSprouts}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <hr className="type-line" />

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
                            {previousShiftFields ? "Update" : "Add"}
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
