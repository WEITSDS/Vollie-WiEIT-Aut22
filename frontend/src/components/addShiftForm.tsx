import React, { useState } from "react";
import { createShift, updateShift, IShift } from "../api/shiftApi";
import LoadingSpinner from "../components/loadingSpinner";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./addShiftForm.css";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { useAllQualTypes } from "../hooks/useAllQualTypes";
import DateTimePicker from "react-datetime-picker";

import cloneDeep from "lodash/cloneDeep";

type HandleClose = () => void;
type formProps = {
    handleClose: HandleClose;
    previousShiftFields?: IShift | undefined;
};

// const dateStringToHTML = (date: string) => {
//     const d = new Date(date);
//     const dateTimeLocalValue = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, -1);
//     return dateTimeLocalValue;
// };

const shiftFormFields = (
    fields?: IShift | undefined,
    startDate?: Date | undefined,
    endDate?: Date | undefined
): IShift => {
    return {
        _id: fields?._id || "",
        name: fields?.name || "",
        startAt: startDate ? new Date(startDate) : new Date(),
        endAt: endDate ? new Date(endDate) : new Date(),
        venue: fields?.venue || "",
        address: fields?.address || "",
        users: fields?.users || [],
        description: fields?.description || "",
        hours: fields?.hours || 0,
        notes: fields?.notes || "",
        category: fields?.category || "Other",
        requiredQualifications: fields?.requiredQualifications || [],
        volunteerTypeAllocations: fields?.volunteerTypeAllocations || [],
    };
};

const AddShiftForm: React.FC<formProps> = ({ handleClose, previousShiftFields }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [responseMsg, setresponseMsg] = useState("");

    const { data: allVolTypesData, isLoading: loadingAllVolTypes } = useAllVolTypes();
    const { data: allQualTypesData, isLoading: loadingAllQualTypes } = useAllQualTypes();
    const volTypes = allVolTypesData?.data;
    const qualTypes = allQualTypesData?.data;

    const [formFields, setFormFields] = useState<IShift>(
        previousShiftFields
            ? shiftFormFields(previousShiftFields, previousShiftFields.startAt, previousShiftFields.endAt)
            : shiftFormFields()
    );

    const handleVolChange = (event: React.FormEvent<HTMLInputElement>, volId: string) => {
        const target = event.target as HTMLInputElement;
        // console.log(target.value, volId);
        // Find this allocation, if none exists, push to array
        setFormFields((prevFormFields) => {
            const newFormFields = cloneDeep(prevFormFields);
            const volIdx = newFormFields.volunteerTypeAllocations.findIndex((vol) => vol.type === volId);
            if (volIdx === -1) {
                newFormFields.volunteerTypeAllocations.push({
                    type: volId,
                    numMembers: parseInt(target.value),
                    currentNum: 0,
                    users: [],
                });
                return { ...newFormFields };
            } else {
                newFormFields.volunteerTypeAllocations[volIdx].numMembers = parseInt(target.value);
                return { ...newFormFields };
            }
        });
    };

    const handleQualChange = (event: React.FormEvent<HTMLInputElement>, qualId: string) => {
        const target = event.target as HTMLInputElement;
        setFormFields((prevFormFields) => {
            const newFormFields = cloneDeep(prevFormFields);
            const volIdx = newFormFields.requiredQualifications.findIndex((qual) => qual.qualificationType === qualId);
            if (volIdx === -1) {
                newFormFields.requiredQualifications.push({
                    qualificationType: qualId,
                    numRequired: parseInt(target.value),
                    currentNum: 0,
                    users: [],
                });
                return { ...newFormFields };
            } else {
                newFormFields.requiredQualifications[volIdx].numRequired = parseInt(target.value);
                return { ...newFormFields };
            }
        });
    };

    const handleChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        event.preventDefault();
        const target = event.target as HTMLInputElement | HTMLSelectElement;
        const value = target.type === "number" ? parseInt(target.value) : target.value;
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${target.name}`]: value };
        });
    };

    const handleDateChange = (newDate: Date, name: string) => {
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${name}`]: newDate };
        });
    };

    // const handleCheckbox = (event: React.FormEvent<HTMLInputElement>): void => {
    //     // event.preventDefault();
    //     const target = event.target as HTMLInputElement;
    //     console.log(target.checked);
    //     setFormFields((prevFormFields) => {
    //         return { ...prevFormFields, requiresWWCC: target.checked };
    //     });
    // };

    const handleSubmit = async (): Promise<void> => {
        try {
            setIsLoading(true);
            let response;
            if (previousShiftFields) {
                // do update
                response = await updateShift(formFields, previousShiftFields._id);
            } else {
                // do create
                response = await createShift(formFields);
            }

            setIsLoading(false);
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
                <DateTimePicker
                    format="dd-MM-y h:mm a"
                    className="date-input"
                    value={formFields.startAt}
                    name="startAt"
                    onChange={(value: Date) => {
                        handleDateChange(value, "startAt");
                    }}
                />
                {/* <input
                    className="date"
                    type="datetime-local"
                    defaultValue={formFields.startAt ? dateStringToHTML(formFields.startAt) : undefined}
                    name="startAt"
                    onChange={handleChange}
                /> */}

                <label>End Date</label>
                <DateTimePicker
                    format="dd-MM-y h:mm a"
                    className={"date-input"}
                    value={formFields.endAt}
                    name="endAt"
                    onChange={(value: Date) => {
                        handleDateChange(value, "endAt");
                    }}
                />
                {/* <input
                    className="date"
                    type="datetime-local"
                    defaultValue={formFields.startAt ? dateStringToHTML(formFields.endAt) : undefined}
                    name="endAt"
                    onChange={handleChange}
                /> */}

                <hr className="type-line" />

                <label>Venue</label>
                <input type="text" defaultValue={formFields.venue} name="venue" onChange={handleChange} />

                <label>Address</label>
                <input type="text" defaultValue={formFields.address} name="address" onChange={handleChange} />

                <label>Description</label>
                <textarea name="description" defaultValue={formFields.description} onChange={handleChange} />

                <label>Work Hours</label>
                <input
                    className="work-hours add-shift-form-number-input"
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
                    name="category"
                >
                    <option value="Other">Other</option>
                    <option value="School Outreach">School Outreach</option>
                    <option value="Event">Event</option>
                    <option value="Committee">Committee</option>
                </Form.Select>

                {/* <hr className="type-line" />

                <div>
                    <label>Requires WWCC?</label>
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={formFields.requiresWWCC}
                        name="requiresWWCC"
                        onChange={handleCheckbox}
                    />
                </div> */}

                <hr className="type-line" />

                <h1 className="type-header">Volunteer Type Allocations</h1>
                <div className="type-container">
                    {!loadingAllVolTypes &&
                        volTypes &&
                        volTypes.map((vol) => {
                            return (
                                <div key={vol._id} className="type">
                                    <label>{vol.name}</label>
                                    <input
                                        className="add-shift-form-number-input"
                                        type="number"
                                        name={`num${vol.name}`}
                                        min={0}
                                        defaultValue={
                                            formFields.volunteerTypeAllocations.find(
                                                (volAlloc) => volAlloc.type === vol._id
                                            )?.numMembers || 0
                                        }
                                        onChange={(e) => handleVolChange(e, vol._id)}
                                    />
                                </div>
                            );
                        })}
                </div>

                <h1 className="type-header">Qualification Allocations</h1>
                <hr className="type-line" />
                <div className="type-container">
                    {!loadingAllQualTypes &&
                        qualTypes &&
                        qualTypes.map((qual) => {
                            return (
                                <div key={qual._id} className="type">
                                    <label>{qual.name}</label>
                                    <input
                                        className="add-shift-form-number-input"
                                        type="number"
                                        name={`num${qual.name}`}
                                        min={0}
                                        defaultValue={
                                            formFields.requiredQualifications.find(
                                                (qualAlloc) => qualAlloc.qualificationType === qual._id
                                            )?.numRequired || 0
                                        }
                                        onChange={(e) => handleQualChange(e, qual._id)}
                                    />
                                </div>
                            );
                        })}
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
