import { FilterResultsModalProps, VolType } from "./types";
import DateTimePicker from "react-datetime-picker";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select, { MultiValue } from "react-select";
import "./styles.css";
import { useState } from "react";

export const FilterResultsModal = (props: FilterResultsModalProps): JSX.Element => {
    const { visible, onClose, allVolTypes, updateFilters, filters } = props;
    const [currentMenu, setCurrentMenu] = useState("Date");

    if (!allVolTypes) return <></>;

    const volTypesSelection = allVolTypes.map((vol) => {
        return { value: vol._id, label: vol.name };
    }) as VolType[];

    return (
        <Modal
            show={visible}
            onHide={() => onClose()}
            contentClassName="content-modal"
            className="filter-modal"
            size="lg"
        >
            <Modal.Header>
                <Modal.Title>Filters</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="left-section">
                    <button type="button" onClick={() => setCurrentMenu("Date")}>
                        Date
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Category")}>
                        Category
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Length")}>
                        Length
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Role")}>
                        Role
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Availability")}>
                        Availability
                    </button>
                </div>
                <div className="right-section">
                    <form>
                        {currentMenu === "Date" && (
                            <>
                                <label>From</label>
                                <DateTimePicker
                                    required
                                    format="dd-MM-y"
                                    className="filter-date-input"
                                    value={filters.from}
                                    onChange={(value: Date) => updateFilters({ ...filters, from: value })}
                                />
                                <br />
                                <label>To</label>
                                <DateTimePicker
                                    required
                                    format="dd-MM-y"
                                    className="filter-date-input"
                                    value={filters.to}
                                    onChange={(value: Date) => updateFilters({ ...filters, to: value })}
                                />
                            </>
                        )}
                        {currentMenu === "Category" && (
                            <>
                                <label>Category</label>
                                <Form.Select
                                    className="drop-down"
                                    onChange={(e) => updateFilters({ ...filters, category: e.target.value })}
                                    value={filters.category}
                                    aria-label="Shift category"
                                >
                                    <option value="All">All</option>
                                    <option value="Committee">Committee</option>
                                    <option value="Event">Event</option>
                                    <option value="Other">Other</option>
                                    <option value="School Outreach">School Outreach</option>
                                </Form.Select>
                            </>
                        )}
                        {currentMenu === "Length" && (
                            <>
                                <label>Length</label>
                                <Form.Select
                                    className="drop-down"
                                    onChange={(e) => updateFilters({ ...filters, hours: e.target.value })}
                                    value={filters.hours}
                                    aria-label="Shift Length"
                                >
                                    <option value="All">All</option>
                                    <option value="Short">Short (1-2 Hours)</option>
                                    <option value="Medium">Medium (3-4 Hours)</option>
                                    <option value="Long">Long (5+ Hours)</option>
                                </Form.Select>
                            </>
                        )}
                        {currentMenu === "Role" && (
                            <>
                                <label>Volunteer Types</label>
                                <Form.Group>
                                    <Select
                                        options={volTypesSelection}
                                        placeholder="Select volunteer type"
                                        isSearchable={true}
                                        value={filters.volTypes}
                                        isMulti
                                        onChange={(newVals: MultiValue<VolType>) =>
                                            updateFilters({ ...filters, volTypes: newVals.map((t) => t) })
                                        }
                                    />
                                </Form.Group>
                            </>
                        )}
                        {currentMenu === "Availability" && (
                            <>
                                <label>Hide Unavailable</label>
                                <br />
                                <Form.Select
                                    className="drop-down"
                                    onChange={(e) =>
                                        updateFilters({ ...filters, hideUnavailable: e.target.value === "true" })
                                    }
                                    value={filters.hideUnavailable.toString()}
                                    aria-label="Shift Length"
                                >
                                    <option value="true">Hide Unavailable Shifts</option>
                                    <option value="false">Show Taken Shifts</option>
                                </Form.Select>
                            </>
                        )}
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};
