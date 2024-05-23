// feedbackPage.tsx
import { ModalBody } from "react-bootstrap";
import { WEITBackground } from "../components/background";
import { NavigationBar } from "../components/navbar";
import { useAllFeedback } from "../hooks/useAllFeedback";

import "./feedbackPage.css";

export const FeedbackAdminPage = () => {
    const { data: feedbackData } = useAllFeedback();
    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div>
                        <div className="button-section">
                            <h1>Feedback Submissions</h1>
                            <button className="download-button">Download</button>
                        </div>
                        <div className="table-responsive bdr">
                            <table className="table table-striped table-bg table-bordered table-hover table-rounded">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Shift Date</th>
                                        <th>School</th>
                                        <th>Improvements</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbackData &&
                                        feedbackData.data &&
                                        feedbackData?.data.map((feedbackItem, index) => {
                                            // const shiftId =
                                            //     feedbackItem.shift !== undefined ? feedbackItem.shift.toString() : "";
                                            // const { data: shiftData } = useShiftById(shiftId || "");

                                            // const shift = feedbackItem.shift; // Accessing shift data from feedback
                                            // const { firstName } = feedbackItem.user;
                                            const user = feedbackItem.user;
                                            const shift = feedbackItem.shift;

                                            return (
                                                <tr key={index}>
                                                    <td>{`${user.firstName} ${user.lastName}`}</td>
                                                    <td>{shift?.startAt}</td>
                                                    <td>{shift?.venue}</td>
                                                    <td>{feedbackItem.improvements}</td>
                                                    <td>{feedbackItem.rating}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
