import "./addShiftForm.css";

const AddShiftForm = () => {
    return (
        <div>
            <form className="add-shift-form">
                <label>Title</label>
                <input type="text" required name="shiftTitle" />

                <label>Description</label>
                <input type="text" required name="shiftDescription" />

                <label>Select Start Date</label>
                <input type="date" required name="startDate" />

                <label>Select End Date</label>
                <input type="date" required name="endDate" />

                <label>Time</label>
                <input type="text" required name="shiftDescription" />

                <label>Address</label>
                <input type="text" required name="shiftDescription" />

                <label>Venue</label>
                <input type="text" required name="shiftDescription" />

                <label>Address Description</label>
                <input type="text" required name="shiftDescription" />

                <label>Hours</label>
                <input type="text" required name="shiftDescription" />
            </form>
        </div>
    );
};

export default AddShiftForm;
