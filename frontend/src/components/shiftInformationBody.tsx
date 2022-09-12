import "./shiftInformationBody.css";
import { Button } from "react-bootstrap";

const ShiftInformationBody = () => {
    return (
        <body>
            <div>
                <h1>Brief Description:</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            <div>
                <p>
                    <strong>Time:</strong> 8am - 12pm
                </p>
            </div>
            <div>
                <p>
                    <strong>Venue:</strong> Orange High School
                </p>
            </div>
            <div>
                <h1>Address Description:</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
            <div>
                <p>
                    <strong>Volunteer Type:</strong> Teaching
                </p>
            </div>
            <div>
                <p>
                    <strong>Volunteer Numbers:</strong> 2
                </p>
            </div>
            <Button>Cancel</Button>
        </body>
    );
};

export default ShiftInformationBody;
