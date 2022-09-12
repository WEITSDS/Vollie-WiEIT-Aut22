import "./shiftInformationHeader.css";

const ShiftInformationHeader = () => {
    return (
        <div className="shift-header-container">
            <div className="box-shadow">
                <h1>Food Service</h1>
                <div className="flex-container">
                    <div className="address">12 Orange st Ultimo</div>
                    <div className="date">31/08/2022 - 01/09/22</div>
                </div>
            </div>
        </div>
    );
};

export default ShiftInformationHeader;
