/* eslint-disable @typescript-eslint/no-unsafe-call */

import { ModalBody } from "react-bootstrap";
import { WEITBackground } from "../components/background";
import { NavigationBar } from "../components/navbar";
import { useAllFeedback } from "../hooks/useAllFeedback";
import "./feedbackPage.css";

export const FeedbackAdminPage = () => {
    const { data, isLoading, error } = useAllFeedback();
    if (isLoading) {
        return <div>Loading:</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    console.log("feedback", data);

    const dataArray = Object.values(data?.data || {});

    console.log("bruhhhh", dataArray);

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div>
                        <div className="button-section">
                            <h1>Feedback Forms</h1>
                            <button className="download-button">Download</button>
                        </div>
                        <div className="table-responsive bdr">
                            <table className="table table-striped table-bg  table-bordered table-hover table-rounded">
                                <thead className="">
                                    <tr>
                                        <th>Teacher</th>
                                        <th>Rating</th>
                                        <th>Column 3</th>
                                        <th>Column 4</th>
                                        <th>Column 5</th>
                                        <th>Improvements</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataArray.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.teacher}</td>
                                            <td>{item.rating}</td>
                                            <td>{item.user}</td>
                                            <td>{item.qualificationType}</td>
                                            <td>{/* Column 5 data */}</td>
                                            <td>{item.shift.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
