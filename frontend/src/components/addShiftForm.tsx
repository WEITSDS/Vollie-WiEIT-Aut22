/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect, useCallback } from "react";
import { createShift, updateShift, IShift } from "../api/shiftApi";
import LoadingSpinner from "../components/loadingSpinner";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./addShiftForm.css";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { useAllQualTypes } from "../hooks/useAllQualTypes";
import DateTimePicker from "react-datetime-picker";

import cloneDeep from "lodash/cloneDeep";
import { useShiftById } from "../hooks/useShiftById";
import { IAddress, addNewVenue, getAllVenues } from "../api/addressAPI";

type HandleClose = () => void;
type formProps = {
    handleClose: HandleClose;
    previousShiftFields?: IShift | undefined;
    shiftdata: string;
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
        // notes: fields?.notes || "",
        category: fields?.category || "Other",
        requiredQualifications: fields?.requiredQualifications || [],
        volunteerTypeAllocations: fields?.volunteerTypeAllocations || [],
        isUnreleased: fields?.isUnreleased || false,
    };
};

const AddShiftForm: React.FC<formProps> = ({ shiftdata, handleClose, previousShiftFields }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [responseMsg, setresponseMsg] = useState("");
    const [endDateDisabled, setEndDateDisabled] = useState(true);

    const { data: allVolTypesData, isLoading: loadingAllVolTypes } = useAllVolTypes();
    const { data: allQualTypesData, isLoading: loadingAllQualTypes } = useAllQualTypes();
    const volTypes = allVolTypesData?.data;
    const qualTypes = allQualTypesData?.data;
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [isUnreleased, setIsUnreleased] = useState(previousShiftFields?.isUnreleased || false);

    // In your AddShiftForm component

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const addresses = await getAllVenues();
                setAddresses(addresses);
            } catch (error) {
                console.error("Error fetching addresses:", error);
                setAddresses([]);
            }
        };
        fetchAddresses();
    }, []);

    // Handle adding a new address
    const handleAddAddress = async (venue: string, address: string) => {
        try {
            const newAddress = await addNewVenue(venue, address);
            setAddresses([...addresses, newAddress]);
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    // Handle deleting an address

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
        const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        if (target.type === "checkbox") {
            // Handle checkbox inputs
            const checkboxTarget = target as HTMLInputElement;
            const checked = checkboxTarget.checked;

            if (checkboxTarget.name === "isUnreleased") {
                setIsUnreleased(checked);
            } else {
                setFormFields((prevFormFields) => ({
                    ...prevFormFields,
                    [checkboxTarget.name]: checked,
                }));
            }
        } else {
            // Handle other types of inputs (text, select, number, etc.)
            const value = target.type === "number" ? parseInt(target.value) : target.value;
            setFormFields((prevFormFields) => ({
                ...prevFormFields,
                [target.name]: value,
            }));
        }
    };

    const handleDateChange = (newDate: Date, name: string) => {
        setFormFields((prevFormFields) => {
            return { ...prevFormFields, [`${name}`]: newDate };
        });
    };

    const shiftDuration = (startDate: Date, endDate: Date) => {
        //Converting millseconds to hours
        return (startDate.getTime() - endDate.getTime()) / 1000 / 60 / 60;
    };

    formFields.hours = shiftDuration(formFields.endAt, formFields.startAt);

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
            const submitFields = {
                ...formFields,
                isUnreleased: isUnreleased, // Ensure this state is included
            };

            setIsLoading(true);
            if (!addresses.find((addr) => addr.address === submitFields.address)) {
                await handleAddAddress(submitFields.venue, submitFields.address);
            }
            let response;
            if (previousShiftFields) {
                // do update
                response = await updateShift(submitFields, previousShiftFields._id);
            } else {
                // do create
                response = await createShift(submitFields);
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

    /*---------------------------------------------------------------------*/
    // Work in progress - Recurring Options Feature
    const [repeats, setrepeats] = useState("0");
    const [repeatInterval, setrepeatInterval] = useState("never");

    const onIntervalChange = (option: React.ChangeEvent<HTMLSelectElement>) => {
        setrepeatInterval(option.currentTarget.value);
    };

    const onRepeatsChange = (input: React.ChangeEvent<HTMLInputElement>) => {
        setrepeats(input.currentTarget.value);
    };

    // const recurOps = [
    //     { view: "None", value: "none" },
    //     { view: "Daily", value: "daily" },
    //     { view: "Weekly", value: "weekly" },
    //     { view: "Monthly", value: "monthly" },
    // ];

    const handleAddShift = () => {
        let interval = 0;
        const recurrances: number = +repeats;

        // Interval multiplier
        if (repeatInterval === "day" || repeatInterval === "month") {
            interval = 1;
        } else if (repeatInterval === "week") {
            interval = 7;
        }

        // Create Initial Shift
        handleSubmit().catch((err) => console.log(err));

        // Create Recurring Shifts
        if (repeatInterval === "day" || repeatInterval === "week") {
            for (let i = 0; i < recurrances; i++) {
                setrecurDays(interval);
            }
        } else if (repeatInterval === "month") {
            for (let i = 0; i < recurrances; i++) {
                setrecurMonths(interval);
            }
        }
    };

    const setrecurDays = (interval: number) => {
        formFields.startAt.setDate(formFields.startAt.getDate() + interval);
        formFields.endAt.setDate(formFields.endAt.getDate() + interval);
        handleSubmit().catch((err) => console.log(err));
    };

    const setrecurMonths = (interval: number) => {
        formFields.startAt.setMonth(formFields.startAt.getMonth() + interval);
        formFields.endAt.setMonth(formFields.endAt.getMonth() + interval);
        handleSubmit().catch((err) => console.log(err));
    };
    /*---------------------------------------------------------------------*/
    /*---------------------------------------------------------------------*/
    // Work in progress: Dupe Shift Feature

    const { data } = useShiftById(shiftdata || "");

    // Check if there is a selected shift to duplicate
    const checkifDupe = useCallback(() => {
        if (data) {
            setFormFields((prevFormFields) => {
                return {
                    ...prevFormFields,
                    ["name"]: ["Copy of ", data?.data?.name].join("") || "",
                    ["venue"]: data?.data?.venue || "",
                    ["address"]: data?.data?.address || "",
                    ["description"]: data?.data?.description || "",
                    ["hours"]: data?.data?.hours || 0,
                    ["category"]: data?.data?.category || "Other",
                    ["requiredQualifications"]: data?.data?.requiredQualifications || [],
                    ["volunteerTypeAllocations"]: data?.data?.volunteerTypeAllocations || [],
                };
            });
        }
    }, [data]);

    useEffect(() => {
        checkifDupe();
    }, [checkifDupe, data]);

    const handleVenueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVenue = event.target.value;
        const selectedAddress = addresses.find((addr) => addr.venue === selectedVenue);

        if (selectedAddress) {
            setFormFields((prevFormFields) => ({
                ...prevFormFields,
                venue: selectedAddress.venue,
                address: selectedAddress.address,
            }));
        } else {
            setFormFields((prevFormFields) => ({
                ...prevFormFields,
                venue: "",
                address: "",
            }));
        }
    };

    /*---------------------------------------------------------------------*/

    return (
        <div>
            <form className="add-shift-form">
                <div className="form-header">
                    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <label>Unreleased Shift</label>
                <input
                    type="checkbox"
                    name="isUnreleased"
                    checked={isUnreleased} // Make sure this is controlled by state
                    onChange={handleChange} // Ensure handleChange updates the state correctly
                />
                <label className="title">Title</label>
                <input type="text" defaultValue={formFields.name} name="name" onChange={handleChange} />
                <label>Start Date</label>
                <DateTimePicker
                    format="dd-MM-y h:mm a"
                    className="date-input"
                    value={formFields.startAt}
                    name="startAt"
                    disableClock={true}
                    minDate={new Date()}
                    onChange={(value: Date) => {
                        //Set seconds and milliseconds to zero
                        value.setSeconds(0);
                        value.setMilliseconds(0);
                        handleDateChange(value, "startAt");
                        setEndDateDisabled(value === undefined);
                        //Set disabled to true for endDate field
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
                    disableClock={true}
                    minDate={formFields.startAt}
                    //disable end date until start date is selected
                    disabled={endDateDisabled}
                    onChange={(value: Date) => {
                        value.setSeconds(0);
                        value.setMilliseconds(0);
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
                <select
                    className="form-control"
                    value={formFields.venue}
                    onChange={handleVenueChange}
                    placeholder="Select a venue"
                >
                    <option value="">Select a venue</option>
                    {addresses.map((addr) => (
                        <option key={addr._id} value={addr.venue}>
                            {addr.venue}
                        </option>
                    ))}
                </select>

                <label>Address</label>
                <input type="text" value={formFields.address} name="address" disabled />

                <label>Description</label>
                <textarea name="description" defaultValue={formFields.description} onChange={handleChange} />

                <label>Work Hours: {formFields.hours}</label>

                <hr className="type-line" />

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

                <hr className="type-line" />

                <h1 className="type-header">Qualified Allocations</h1>
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

                <h1 className="type-header">Recurring Options</h1>
                <div className="type-container">
                    <div className="recur-op">
                        {/* {recurOps.map(({ view: title, value: interval }) => {
                            return (
                                <div>
                                    <input
                                        type="radio"
                                        value={interval}
                                        name={interval}
                                        checked={interval === repeatInterval}
                                        onChange={(option) => onIntervalChange(option)}
                                    />
                                    {title}
                                </div>
                            );
                        })} */}

                        <h6 className="recur-text">Repeats every</h6>

                        <select
                            className="recur-interval-input"
                            value={repeatInterval}
                            onChange={(e) => onIntervalChange(e)}
                        >
                            <option value="never">Never</option>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                        <h6 className="recur-text"></h6>
                        <h6 className="recur-text">for the next</h6>

                        <input
                            className="recur-repeats-input"
                            type="number"
                            min={0}
                            max={10} // Limiting for now to not clog up database
                            defaultValue={repeats}
                            name="repeats"
                            onChange={(repeats) => onRepeatsChange(repeats)}
                        />

                        <h6 className="recur-text"> {repeatInterval}(s)</h6>
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
                                handleAddShift();
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
