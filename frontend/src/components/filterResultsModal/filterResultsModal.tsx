import { FilterResultsModalProps, VolType } from "./types";
import DateTimePicker from "react-datetime-picker";
import Select, { MultiValue } from "react-select";
import "./styles.css";
import { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { getAllVenues, IAddress } from "../../api/addressAPI";
import "../../../src/shiftpage/shiftpage.css";

export const FilterResultsModal = (props: FilterResultsModalProps): JSX.Element => {
    const { visible, onClose, allVolTypes, updateFilters, filters } = props;
    const [currentMenu, setCurrentMenu] = useState("Date");
    const [allLocations, setAllLocations] = useState<IAddress[]>([]);

    const [selectedVenue, setSelectedVenue] = useState<string>(""); // State to hold the selected venue

    if (!allVolTypes) return <></>;

    const volTypesSelection = allVolTypes.map((vol) => {
        return { value: vol._id, label: vol.name };
    }) as VolType[];

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const venues = await getAllVenues();
                const allLocations = venues.filter((location) => location.address.toLowerCase());
                setAllLocations(allLocations);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVenues().catch((error) => console.error(error));
    }, [filters.location]);

    return (
        <Modal
            show={visible}
            onHide={() => onClose()}
            contentClassName="content-modal"
            className="filter-modal"
            size="lg"
        >
            <Modal.Header closeButton>
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
                    <button type="button" onClick={() => setCurrentMenu("Role")}>
                        Role
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Availability")}>
                        Availability
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Venue")}>
                        Venue
                    </button>
                    <button type="button" onClick={() => setCurrentMenu("Length")}>
                        Length
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
                                    minDate={filters.from}
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
                                    <option value="Short">Short (0-2 Hours)</option>
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

                                <Form.Group>
                                    <div className="availability-filter">
                                        <div className="availability-radio-buttons">
                                            <input
                                                type={"radio"}
                                                id="hideUnavailableTrue"
                                                name="hideUnavailable"
                                                value="true"
                                                checked={filters.hideUnavailable === true}
                                                onChange={() => updateFilters({ ...filters, hideUnavailable: true })}
                                            />
                                            <label>Yes</label>
                                        </div>
                                        <div className="availability-radio-buttons ">
                                            <input
                                                type={"radio"}
                                                id="hideUnavailableFalse"
                                                name="hideUnavailable"
                                                value="false"
                                                checked={filters.hideUnavailable === false}
                                                onChange={() => updateFilters({ ...filters, hideUnavailable: false })}
                                            />
                                            <label>No</label>
                                        </div>
                                    </div>
                                </Form.Group>
                            </>
                        )}

                        {currentMenu === "Venue" && (
                            <>
                                <label htmlFor="venue-select">Venue</label>
                                <select
                                    id="venue-select"
                                    className="venue-input venue-filters"
                                    value={selectedVenue}
                                    onChange={(e) => {
                                        const newSelectedVenue = e.target.value;
                                        setSelectedVenue(newSelectedVenue);
                                        updateFilters({ ...filters, location: newSelectedVenue }); // Update filters with selected venue
                                    }}
                                >
                                    <option value="">Select venue</option>
                                    {allLocations.length === 0 ? (
                                        <option disabled>No venues found</option>
                                    ) : (
                                        allLocations.map((location, index) => (
                                            <option key={index} value={location.address}>
                                                {location.address}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </>
                        )}

                        <div className="filter-buttons">
                            <button
                                className=" reset-filter-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    updateFilters({
                                        to: new Date(new Date(Date.now() + 63120000000)),
                                        from: new Date(),
                                        volTypes: [],
                                        category: "All",
                                        hours: "All",
                                        hideUnavailable: false,
                                        location: "",
                                    });
                                    setSelectedVenue("");
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};
