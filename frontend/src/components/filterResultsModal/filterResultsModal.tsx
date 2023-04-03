import { FilterResultsModalProps, VolType } from "./types";
import DateTimePicker from "react-datetime-picker";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Select, { MultiValue } from "react-select";

export const FilterResultsModal = (props: FilterResultsModalProps): JSX.Element => {
    const { visible, onClose, allVolTypes, updateFilters, filters } = props;

    if (!allVolTypes) return <></>;

    const volTypesSelection = allVolTypes.map((vol) => {
        return { value: vol._id, label: vol.name };
    }) as VolType[];

    return (
        <Modal show={visible} onHide={() => onClose()}>
            <Modal.Header>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <label>From</label>
                    <DateTimePicker
                        required
                        format="dd-MM-y"
                        className="date-input"
                        value={filters.from}
                        onChange={(value: Date) => updateFilters({ ...filters, from: value })}
                    />
                    <br />
                    <label>To</label>
                    <DateTimePicker
                        required
                        format="dd-MM-y"
                        className="date-input"
                        value={filters.to}
                        onChange={(value: Date) => updateFilters({ ...filters, to: value })}
                    />
                    <br />
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
                    <br />
                    <label>Hours</label>
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
                    <label>Hide Unavailable</label>
                    <br />
                    <input
                        type="checkbox"
                        checked={filters.hideUnavailable}
                        onChange={(e) => updateFilters({ ...filters, hideUnavailable: e.target.checked })}
                    />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => onClose()}>Filter</button>
            </Modal.Footer>
        </Modal>
    );
};
