/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// import { Button } from "react-bootstrap/lib/InputGroup";
import "./addShiftForm.css";
import LoadingSpinner from "../components/loadingSpinner";
type formProps = {
    handleEvent: any;
    handleClose: any;
    handleSubmit: any;
    isLoading: boolean;
    handleError: boolean;
    // ...rest of your props
};

const AddShiftForm: React.FC<formProps> = ({ handleEvent, handleClose, handleSubmit, isLoading, handleError }) => {
    return (
        <div>
            <form className="add-shift-form">
                <div className="form-header">
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <label className="title">Title</label>
                <input type="text" name="shiftTitle" onChange={handleEvent} />

                <label>Description</label>
                <textarea name="shiftDescription" onChange={handleEvent} />

                <label>Select Start Date</label>
                <input type="date" name="startDate" onChange={handleEvent} />

                <label>Select End Date</label>
                <input type="date" name="endDate" onChange={handleEvent} />

                <label>Time</label>
                <input type="text" name="shiftTime" onChange={handleEvent} />

                <label>Address</label>
                <input type="text" name="shiftAddress" onChange={handleEvent} />

                <label>Venue</label>
                <input type="text" name="shiftVenue" onChange={handleEvent} />

                <label>Address Description</label>
                <input type="text" name="addressDescription" onChange={handleEvent} />

                <label>Hours</label>
                <input type="text" name="shiftHours" onChange={handleEvent} />

                <h1 className="type-header">Volunteer Type Numbers</h1>
                <hr className="type-line" />
                <div className="type-container">
                    <div className="type">
                        <label>General volunteer:</label>
                        <input type="text" name="type1" min="0" onChange={handleEvent} />
                    </div>
                    <div className="type">
                        <label>Undergraduate ambassadors:</label>
                        <input type="text" name="type1" min="0" onChange={handleEvent} />
                    </div>
                    <div className="type">
                        <label>Postgradute ambassadors:</label>
                        <input type="text" name="type1" min="0" onChange={handleEvent} />
                    </div>
                    <div className="type">
                        <label>Staff ambassadors:</label>
                        <input type="text" name="type1" min="0" onChange={handleEvent} />
                    </div>
                    <div className="type">
                        <label>Sprouts:</label>
                        <input type="text" name="type1" min="0" onChange={handleEvent} />
                    </div>
                </div>
                <div className="error-message" hidden={handleError}>
                    <p>There was an error adding the shift please try again.</p>
                </div>
                <div className="btn-container">
                    <button className="cancel-btn" onClick={handleClose}>
                        Cancel
                    </button>
                    {!isLoading && (
                        <button className="add-btn" type="submit" onClick={handleSubmit}>
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
