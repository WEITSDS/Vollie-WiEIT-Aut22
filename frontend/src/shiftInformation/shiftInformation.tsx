import ShiftInformationBody from "../components/shiftInformationBody";
import { NavigationBar } from "../components/navbar";
import ShiftInformationHeader from "../components/shiftInformationHeader";
import "./shiftInformation.css";

const ShiftInformation = () => {
    return (
        <div>
            <NavigationBar />
            <div className="shift-page-container">
                <ShiftInformationHeader />
                <ShiftInformationBody />
            </div>
        </div>
    );
};

export default ShiftInformation;
