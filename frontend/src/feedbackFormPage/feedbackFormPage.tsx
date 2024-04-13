import { useOwnUser } from "../hooks/useOwnUser";
import { useMyShifts } from "../hooks/useMyShifts";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import FeedbackCard from "./feedbackCard";
import VolunteerFeedbackCard from "./volunteerFeedbackCard";
import SproutsFeedbackCard from "./sproutsFeedbackCard";

//TODO - possibly add css file?

export const FeedbackFormsPage = () => {
    const userQuery = useOwnUser();
    const { isLoading = true, isError, data, error } = useMyShifts(userQuery.data?.data?._id);
    const { data: userObj } = userQuery?.data || {};

    const shifts = userObj?.shifts || []; // array of user's shifts
    const completedShifts = shifts.filter((shift) => shift.completed);
    const schoolShifts = data?.data?.filter((shift) => shift.category === "School Outreach");

    // generate feedback card if shift completed and school outreach
    const completedSchoolShifts = schoolShifts?.filter((schoolShift) => {
        return completedShifts?.some((completedShift) => schoolShift._id === completedShift.shift._id);
    });

    //TODO - once finished all forms add another few filters to determine roles

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody>
                    <div className="main-container">
                        <div className="tab-container">
                            <div>Something here?</div>
                        </div>
                        <div className="content-container">
                            <div className="header-container">
                                <h1>My Feedback Forms</h1>
                            </div>
                            <div className="shiftList-container">
                                {isLoading && <p>Loading feedback forms...</p>}
                                {isError && <p>There was a server error while loading feedback forms... {error}</p>}
                                {completedSchoolShifts &&
                                    completedSchoolShifts.map((shift) => (
                                        <FeedbackCard key={shift._id} shiftData={shift} />
                                    ))}
                                {completedSchoolShifts &&
                                    completedSchoolShifts.map((shift) => (
                                        <VolunteerFeedbackCard key={shift._id} shiftData={shift} />
                                    ))}
                                {completedSchoolShifts &&
                                    completedSchoolShifts.map((shift) => (
                                        <SproutsFeedbackCard key={shift._id} shiftData={shift} />
                                    ))}
                                {!isLoading && data?.data?.length === 0 && <p>No feedback forms.</p>}
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </WEITBackground>
        </>
    );
};
