import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import FeedbackCard from "./feedbackCard";
import { useState } from "react";

//TODO - possibly add css file?

export const FeedbackFormsPage = () => {
    const [currentView, setCurrentView] = useState("pending");

    const userQuery = useOwnUser();
    const userId = userQuery.data?.data?._id;
    const { isLoading = true, isError, data, error } = useMyShifts(userId);

    // generate feedback card if shift completed and school outreach
    const completedShifts = userQuery?.data?.data?.shifts.filter((shift) => shift.completed);
    const schoolShifts = data?.data?.filter((shift) => shift.category === "School Outreach");
    const completedSchoolShifts = schoolShifts?.filter((schoolShift) => {
        return completedShifts?.some((completedShift) => schoolShift._id === completedShift.shift._id);
    });

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div className="main-container">
                        <div className="tab-container">
                            <div
                                className={currentView === "pending" ? "tab active" : "tab"}
                                onClick={() => setCurrentView("pending")}
                            >
                                Pending Forms
                            </div>
                            <div
                                className={currentView === "completed" ? "tab active" : "tab"}
                                onClick={() => setCurrentView("completed")}
                            >
                                Completed Forms
                            </div>
                        </div>
                        <div className="content-container">
                            <div className="header-container">
                                <h1>My Feedback Forms</h1>
                            </div>

                            {currentView === "pending" && (
                                <div className="pendingFormsList-container">
                                    {isLoading && <p>Loading feedback forms...</p>}
                                    {isError && <p>There was a server error while loading feedback forms... {error}</p>}
                                    {completedSchoolShifts &&
                                        completedSchoolShifts.map((shift) => (
                                            <FeedbackCard key={shift._id} userId={userId} shiftData={shift} />
                                        ))}
                                    {!isLoading && data?.data?.length === 0 && <p>No feedback forms.</p>}
                                </div>
                            )}

                            {currentView === "completed" && (
                                <div className="completedFormsList-container">
                                    {isLoading && <p>Loading feedback forms...</p>}
                                    {isError && <p>There was a server error while loading feedback forms... {error}</p>}
                                    {!isLoading && <p>No feedback forms.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
