import "react-big-calendar/lib/css/react-big-calendar.css";
// import "./landingPage.css";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import ModalBody from "react-bootstrap/ModalBody";
import ShiftCard from "../components/shiftCard";
import { useAvailableShifts } from "../hooks/useAvailableShifts";
import { useOwnUser } from "../hooks/useOwnUser";

const HomePage = () => {
    const { isLoading, isError, data, error } = useAvailableShifts();
    const { data: userData } = useOwnUser();

    return (
        <>
            <NavigationBar />
            <WEITBackground>
                <ModalBody className="form-body">
                    {isLoading && <p>Loading available shifts...</p>}
                    {isError && <p>There was a server error while loading available shifts... {error}</p>}
                    {data?.data && data?.data?.length > 0 ? (
                        data?.data?.map((shiftData) => {
                            console.log(shiftData);
                            return (
                                <ShiftCard
                                    key={shiftData._id}
                                    shiftData={shiftData}
                                    isAdmin={userData?.data?.isAdmin}
                                />
                            );
                        })
                    ) : (
                        <p>No available shifts.</p>
                    )}
                </ModalBody>
            </WEITBackground>
        </>
    );
};

export { HomePage };
