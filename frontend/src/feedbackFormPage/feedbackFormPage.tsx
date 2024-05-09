import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import FeedbackCard from "./feedbackCard";
import { useState } from "react";
import { useFeedbackByUserId } from "../hooks/useFeedbackByUserId";
import { IShift } from "../api/shiftApi";

export const FeedbackFormsPage = () => {
    // to store feedback data
    const [currentView, setCurrentView] = useState("pending");

    const userQuery = useOwnUser();
    const userId = userQuery.data?.data?._id || "";
    const { isLoading = true, isError, data, error } = useMyShifts(userId);
    const feedbackQuery = useFeedbackByUserId();

    // get user's completed school outreach shifts
    const completedShifts = userQuery?.data?.data?.shifts.filter((shift) => shift.completed);
    const schoolShifts = data?.data?.filter((shift) => shift.category === "School Outreach");
    const completedSchoolShifts = schoolShifts?.filter((schoolShift) => {
        return completedShifts?.some((completedShift) => schoolShift._id === completedShift.shift._id);
    });

    // get completed forms
    let feedback = feedbackQuery.data?.data;
    if (feedbackQuery.data?.success != true) {
        feedback = null;
    }

    let pendingForms: IShift[] | undefined;

    if (feedback != null) {
        // pending forms
        pendingForms = completedSchoolShifts?.filter((shift) => {
            return feedback?.some((form) => shift._id !== form.shift);
        });
    } else {
        pendingForms = completedSchoolShifts;
    }

    // completed forms
    const completedForms = completedSchoolShifts?.filter((shift) => {
        return feedback?.some((form) => shift._id === form.shift);
    });

    console.log(completedForms);

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

                            {/* show completed shifts and pending forms */}
                            {currentView === "pending" && (
                                <div className="shiftList-container">
                                    {isLoading && <p>Loading feedback forms...</p>}
                                    {isError && <p>There was a server error while loading feedback forms... {error}</p>}
                                    {pendingForms &&
                                        pendingForms.map((shift) => (
                                            <FeedbackCard
                                                key={shift._id}
                                                userId={userId}
                                                shiftData={shift}
                                                view={"pending"}
                                            />
                                        ))}
                                    {!isLoading && data?.data?.length === 0 && <p>No feedback forms.</p>}
                                </div>
                            )}

                            {/* show completed shifts and completed forms */}
                            {currentView === "completed" && (
                                <div className="shiftList-container">
                                    {isLoading && <p>Loading feedback forms...</p>}
                                    {isError && <p>There was a server error while loading feedback forms... {error}</p>}
                                    {completedForms &&
                                        completedForms.map((shift) => (
                                            <FeedbackCard
                                                key={shift._id} // feedback form id
                                                userId={userId}
                                                shiftData={shift}
                                                view={"completed"}
                                            />
                                        ))}
                                    {!isLoading && data?.data?.length === 0 && <p>No feedback forms.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
