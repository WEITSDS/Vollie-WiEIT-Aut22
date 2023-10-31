import "./adminReport.css";
import { ModalBody } from "react-bootstrap";
import { WEITBackground } from "../components/background";
import { NavigationBar } from "../components/navbar";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { useState } from "react";
import { DateRangePicker, Range } from "react-date-range";

interface rUser {
    firstname?: string | undefined;
    lastname?: string | undefined;
    hours?: number | undefined;
}

const AdminReport = () => {
    const consolelogbutton = () => {
        console.log(dateRange);
    };

    const reportUsers: rUser[] = [];

    const { data: allVolTypesData } = useAllVolTypes();
    const volTypes = allVolTypesData?.data;
    const [selectedVolTypes, setSelectedVolTypes] = useState<string[]>([]);

    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });
    /*----------------------------------------------------------------*/
    // Test Data
    const testdata = {} as rUser;
    testdata.firstname = "Fname";
    testdata.lastname = "";
    testdata.hours = 2;
    reportUsers.push(testdata);
    /*----------------------------------------------------------------*/

    const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let exists = false;
        let index = 0;

        if (e.currentTarget.checked) {
            for (let i = 0; i <= selectedVolTypes.length; i++) {
                if (!selectedVolTypes[i]) {
                    if (selectedVolTypes[i] === e.currentTarget.name) {
                        exists = true;
                    } else {
                        index = i;
                    }
                }
            }
            if (exists === false) {
                selectedVolTypes[index] = e.currentTarget.name;
            }
        } else {
            for (let i = 0; i <= selectedVolTypes.length; i++) {
                if (selectedVolTypes[i] === e.currentTarget.name) {
                    delete selectedVolTypes[i];
                }
            }
        }
        setSelectedVolTypes(selectedVolTypes.filter((n) => n));
    };

    const generateReport = () => {
        console.log("This button does nothing at the moment");
    };
    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div className="report-page-container">
                        <h1>Reports Page</h1>

                        <hr className="page-divider" />

                        <h5 className="setting-title">Select Volunteer Type(s)</h5>
                        <div className="checkbox-container">
                            {volTypes?.map((type) => {
                                return (
                                    <>
                                        <input
                                            className="checkbox-input"
                                            type="checkbox"
                                            name={type.name}
                                            id={type._id}
                                            onChange={(e) => handleVolChange(e)}
                                        />
                                        <h6 className="checkbox-name">{type.name}</h6>
                                    </>
                                );
                            })}
                        </div>

                        <hr className="page-divider" />

                        <h5 className="setting-title">Select Date Range</h5>
                        <div className="date-container">
                            <DateRangePicker
                                className="range-date-picker"
                                ranges={[dateRange]}
                                onChange={(newRange) => {
                                    if (newRange["selection"]) {
                                        setDateRange(newRange["selection"]);
                                    }
                                }}
                            />
                        </div>

                        <hr className="page-divider" />

                        <div className="button-container">
                            <button className="btn" onClick={generateReport}>
                                Generate Report
                            </button>

                            <button className="btn" onClick={consolelogbutton}>
                                Temp Console Log Button
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export default AdminReport;
