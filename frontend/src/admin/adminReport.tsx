import "./adminReport.css";
import { ModalBody } from "react-bootstrap";
import { WEITBackground } from "../components/background";
import { NavigationBar } from "../components/navbar";
import { useAllVolTypes } from "../hooks/useAllVolTypes";
import { useState } from "react";
import { DateRangePicker, Range } from "react-date-range";

const AdminReport = () => {
    const { data: allVolTypesData } = useAllVolTypes();
    const volTypes = allVolTypesData?.data;
    const [selectedVolTypes, setSelectedVolTypes] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [reportData, setReportData] = useState<any>(null);

    const [dateRange, setDateRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const handleVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedVolTypes = [...selectedVolTypes];
        const volTypeId = e.currentTarget.getAttribute("data-id") || ""; // get the ID

        if (e.currentTarget.checked) {
            updatedVolTypes.push(volTypeId);
        } else {
            const index = updatedVolTypes.indexOf(volTypeId);
            if (index > -1) {
                updatedVolTypes.splice(index, 1);
            }
        }
        setSelectedVolTypes(updatedVolTypes);
    };

    const generateReport = async () => {
        const { startDate, endDate } = dateRange;
        const requestBody = {
            volunteerPositions: selectedVolTypes,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        };

        try {
            const response = await fetch("http://localhost:3000/api/shifts/get-volunteer-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const result = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                setReportData(result.data);
            } else {
                console.error("Error generating report:", await response.text());
            }
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    const exportReportAsExcel = async () => {
        const { startDate, endDate } = dateRange;
        const requestBody = {
            volunteerPositions: selectedVolTypes,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
        };

        try {
            const response = await fetch("http://localhost:3000/api/shifts/export-report-excel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "volunteer-report.xlsx");
                document.body.appendChild(link);
                link.click();
            } else {
                console.error("Error exporting report as Excel:", await response.text());
            }
        } catch (error) {
            console.error("Error exporting report as Excel:", error);
        }
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
                                            data-id={type._id} // Storing the ID here
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
                        <div className="report-result-container">
                            {reportData ? (
                                <>
                                    <h5>Report Data:</h5>
                                    <ul>
                                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */}
                                        {reportData?.map((item: any, index: number) => (
                                            <li key={index}>{JSON.stringify(item)}</li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p>No report data available.</p>
                            )}
                        </div>

                        <hr className="page-divider" />

                        <div className="button-container">
                            <button
                                className="btn"
                                onClick={() => {
                                    generateReport().catch((err) => console.error("Error generating report:", err));
                                }}
                            >
                                Submit
                            </button>

                            {reportData && (
                                <button
                                    className="btn"
                                    onClick={() => {
                                        exportReportAsExcel().catch((err) =>
                                            console.error("Error exporting report as Excel:", err)
                                        );
                                    }}
                                >
                                    Generate Excel
                                </button>
                            )}
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
export default AdminReport;
