import "./adminReport.css";
import { ModalBody } from "react-bootstrap";
import { WEITBackground } from "../components/background";
import { NavigationBar } from "../components/navbar";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import DateTimePicker from "react-datetime-picker";
import { useState } from "react";

interface rUser {
    firstname?: string | undefined;
    lastname?: string | undefined;
    hours?: number | undefined;
}

interface IDate {
    startAt: Date;
    endAt: Date;
}

const reportUsers: rUser[] = [];
const dateformFields = (startDate?: Date | undefined, endDate?: Date | undefined): IDate => {
    return {
        startAt: startDate ? new Date(startDate) : new Date(),
        endAt: endDate ? new Date(endDate) : new Date(),
    };
};

const AdminReport = () => {
    const consolelogbutton = () => {
        console.log(dateFields);
    };

    /*----------------------------------------------------------------*/
    // Test Data
    const testdata = {} as rUser;
    testdata.firstname = "Fname";
    testdata.lastname = "";
    testdata.hours = 2;
    reportUsers.push(testdata);
    /*----------------------------------------------------------------*/

    const { data: allVolTypesData } = useAllVolTypes();
    const volTypes = allVolTypesData?.data;
    const [selectedVolTypes, setSelectedVolTypes] = useState<string[]>([]);
    const [dateFields, setDateFields] = useState<IDate>(dateformFields());

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

    const handleDateChange = (newDate: Date, name: string) => {
        setDateFields((prev) => {
            return { ...prev, [`${name}`]: newDate };
        });
    };

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <button onClick={consolelogbutton}>Temp Console Log Button</button>
                    <div className="report-page-container">
                        <h1>Reports Page</h1>
                        <button>Generate Report (placeholder)</button>

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

                        <h5 className="setting-title">Select Dates</h5>
                        <div className="date-container">
                            <label>Start Date:</label>
                            <DateTimePicker
                                format="dd-MM-y h:mm a"
                                className="date-input"
                                value={dateFields?.startAt}
                                name="startAt"
                                onChange={(value: Date) => {
                                    handleDateChange(value, "startAt");
                                }}
                            />
                            <label>End Date:</label>
                            <DateTimePicker
                                format="dd-MM-y h:mm a"
                                className="date-input"
                                value={dateFields?.endAt}
                                name="startAt"
                                onChange={(value: Date) => {
                                    handleDateChange(value, "endAt");
                                }}
                            />
                        </div>

                        <hr className="page-divider" />
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export default AdminReport;
