/* eslint-disable @typescript-eslint/no-unsafe-call */

// import { ModalBody } from "react-bootstrap";
// import { WEITBackground } from "../components/background";
// import { NavigationBar } from "../components/navbar";
// import { useAllFeedback } from "../hooks/useAllFeedback";
// import "./feedbackPage.css";
// import { useShiftById } from "../hooks/useShiftById";
// import { useOwnUser } from "../hooks/useOwnUser";

// export const FeedbackAdminPage = () => {
//     const { data, isLoading, error } = useAllFeedback();
//     const dataArray = Object.values(data?.data || {});
//     const userQuery = useOwnUser();

//     let shiftId;

//     const {
//         isLoading: shiftIsLoading,
//         isError: shiftIsError,
//         data: shiftData,
//         error: shiftError,
//         refetch: shiftRefetch,
//     } = useShiftById(shiftId || "");

//     if (shiftIsError || userQuery.isLoading) return <p>Loading...</p>;
//     if (shiftIsError || userQuery.isError) return <p>Error loading data...{error || userQuery.error}</p>;

//     if (!data?.data || !userQuery?.data?.data) return <p>No data</p>;

//     const { data: userObj } = userQuery?.data || {};

//     if (isLoading) {
//         return <div>Loading:</div>;
//     }
//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }
//     console.log("feedback", data);

//     const {
//         name,
//         startAt,
//         endAt,
//         venue,
//         address,
//         description,
//         hours,
//         category,
//         // requiresWWCC,
//         // numGeneralVolunteers,
//         // numUndergradAmbassadors,
//         // numPostgradAmbassadors,
//         // numStaffAmbassadors,
//         // numSprouts,
//     } = shiftData?.data || {};

//     console.log("bruhhhh", dataArray);

//     return (
//         <>
//             <NavigationBar />
//             <WEITBackground>
//                 <ModalBody>
//                     <div>
//                         <div className="button-section">
//                             <h1>Feedback Forms</h1>
//                             <button className="download-button">Download</button>
//                         </div>
//                         <div className="table-responsive bdr">
//                             <table className="table table-striped table-bg  table-bordered table-hover table-rounded">
//                                 <thead className="">
//                                     <tr>
//                                         <th>User Name</th>
//                                         <th>Shift Date</th>
//                                         <th>School</th>
//                                         <th>Role</th>
//                                         <th>Rating</th>
//                                         <th>Improvements</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {dataArray.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>{item.teacher}</td>
//                                             <td>{item.rating}</td>
//                                             <td>{item.user}</td>
//                                             <td>{item.qualificationType}</td>
//                                             <td>{item.shift}</td>
//                                             {/* <td>{item.shift.name}</td> */}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </ModalBody>
//             </WEITBackground>
//         </>
//     );
// };

// import { ModalBody } from "react-bootstrap";
// import { WEITBackground } from "../components/background";
// import { NavigationBar } from "../components/navbar";
// import { useAllFeedback } from "../hooks/useAllFeedback";
// import { useShiftById } from "../hooks/useShiftById";
// import { useOwnUser } from "../hooks/useOwnUser";
// import { useState, useEffect } from "react";
// import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
// import { IShift } from "../api/shiftApi";
// import "./feedbackPage.css";
// import { useParams } from "react-router-dom";

// export const FeedbackAdminPage = () => {
//     const { data, isLoading, error } = useAllFeedback();
//     const [shiftDataMap, setShiftDataMap] = useState<{ [key: string]: IShift | undefined }>({});
//     const userQuery = useOwnUser();

//     const dataArray: IFeedback[] = Object.values(data?.data || {});

//     const { id } = useParams();
//     const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();
//     const user = userData?.data;

//     useEffect(() => {
//         if (dataArray.length > 0) {
//             const uniqueShiftIds = Array.from(new Set(dataArray.map((item) => item.shift?.toString()).filter(Boolean)));
//             const fetchShifts = async () => {
//                 try {
//                     const shiftDataPromises = uniqueShiftIds.map((shiftId) => useShiftById(shiftId).refetch());
//                     const shiftDataResults = await Promise.all(shiftDataPromises);
//                     const shiftDataMap = uniqueShiftIds.reduce((acc, shiftId, index) => {
//                         const shiftData = shiftDataResults[index]?.data?.data;
//                         if (shiftData) {
//                             acc[shiftId] = shiftData;
//                         }
//                         return acc;
//                     }, {} as { [key: string]: IShift | undefined });
//                     setShiftDataMap(shiftDataMap);
//                 } catch (error) {
//                     console.error("Error fetching shift data:", error);
//                 }
//             };
//             void fetchShifts(); // Ensuring the promise is not left floating
//         }
//     }, [dataArray]);

//     if (isLoading || userQuery.isLoading) return <p>Loading...</p>;
//     if (error || userQuery.isError) return <p>Error loading data...{error || userQuery.error}</p>;

//     return (
//         <>
//             <NavigationBar />
//             <WEITBackground>
//                 <ModalBody>
//                     <div>
//                         <div className="button-section">
//                             <h1>Feedback Forms</h1>
//                             <button className="download-button">Download</button>
//                         </div>
//                         <div className="table-responsive bdr">
//                             <table className="table table-striped table-bg table-bordered table-hover table-rounded">
//                                 <thead className="">
//                                     <tr>
//                                         <th>User Name</th>
//                                         <th>Shift Date</th>
//                                         <th>School</th>
//                                         <th>Role</th>
//                                         <th>Rating</th>
//                                         <th>Improvements</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {dataArray.map((item, index) => {
//                                         const shiftId = item.shift?.toString();
//                                         const shift = shiftId ? shiftDataMap[shiftId] : undefined;
//                                         return (
//                                             <tr key={index}>
//                                                 <td>{item.teacher}</td>
//                                                 <td>{shift?.startAt}</td>
//                                                 <td>{shift?.name}</td>
//                                                 <td>{shift?.venue}</td>
//                                                 <td>{item.rating}</td>
//                                                 <td>{item.improvements}</td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </ModalBody>
//             </WEITBackground>
//         </>
//     );
// };

// import { ModalBody } from "react-bootstrap";
// import { WEITBackground } from "../components/background";
// import { NavigationBar } from "../components/navbar";
// import { useAllFeedback } from "../hooks/useAllFeedback";
// import { useShiftById } from "../hooks/useShiftById";
// import { useUserById } from "../hooks/useUserById";
// import { useOwnUser } from "../hooks/useOwnUser";
// import { useState, useEffect } from "react";
// import { IFeedback } from "../../../backend/src/Feedback/feedback.interface";
// import { IShift } from "../api/shiftApi";
// import { User } from "../api/userApi"; // Add this line
// import "./feedbackPage.css";
// import { useParams } from "react-router-dom";

// export const FeedbackAdminPage = () => {
//     const { data, isLoading, error } = useAllFeedback();
//     const [shiftDataMap, setShiftDataMap] = useState<{ [key: string]: IShift | undefined }>({});
//     const [userDataMap, setUserDataMap] = useState<{ [key: string]: User | undefined }>({});
//     const { id } = useParams();
//     const userQuery = id ? useUserById(id) : useOwnUser();

//     const dataArray: IFeedback[] = Object.values(data?.data || {});

//     useEffect(() => {
//         if (dataArray.length > 0) {
//             const uniqueShiftIds = Array.from(new Set(dataArray.map((item) => item.shift?.toString()).filter(Boolean)));
//             const fetchShifts = async () => {
//                 try {
//                     const shiftDataPromises = uniqueShiftIds.map((shiftId) => useShiftById(shiftId).refetch());
//                     const shiftDataResults = await Promise.all(shiftDataPromises);
//                     const shiftDataMap = uniqueShiftIds.reduce((acc, shiftId, index) => {
//                         const shiftData = shiftDataResults[index]?.data?.data;
//                         if (shiftData) {
//                             acc[shiftId] = shiftData;
//                         }
//                         return acc;
//                     }, {} as { [key: string]: IShift | undefined });
//                     setShiftDataMap(shiftDataMap);
//                 } catch (error) {
//                     console.error("Error fetching shift data:", error);
//                 }
//             };
//             void fetchShifts();
//         }
//     }, [dataArray]);

//     useEffect(() => {
//         if (dataArray.length > 0) {
//             const uniqueUserIds = Array.from(new Set(dataArray.map((item) => item.user?.toString()).filter(Boolean)));
//             const fetchUsers = async () => {
//                 try {
//                     const userDataPromises = uniqueUserIds.map((userId) => useUserById(userId).refetch());
//                     const userDataResults = await Promise.all(userDataPromises);
//                     const userDataMap = uniqueUserIds.reduce((acc, userId, index) => {
//                         const userData = userDataResults[index]?.data?.data;
//                         if (userData) {
//                             acc[userId] = userData;
//                         }
//                         return acc;
//                     }, {} as { [key: string]: User | undefined });
//                     setUserDataMap(userDataMap);
//                 } catch (error) {
//                     console.error("Error fetching user data:", error);
//                 }
//             };
//             void fetchUsers();
//         }
//     }, [dataArray]);

//     if (isLoading || userQuery.isLoading) return <p>Loading...</p>;
//     if (error || userQuery.isError) return <p>Error loading data...{error || userQuery.error}</p>;

//     return (
//         <>
//             <NavigationBar />
//             <WEITBackground>
//                 <ModalBody>
//                     <div>
//                         <div className="button-section">
//                             <h1>Feedback Forms</h1>
//                             <button className="download-button">Download</button>
//                         </div>
//                         <div className="table-responsive bdr">
//                             <table className="table table-striped table-bg table-bordered table-hover table-rounded">
//                                 <thead className="">
//                                     <tr>
//                                         <th>User Name</th>
//                                         <th>Shift Date</th>
//                                         <th>School</th>
//                                         <th>Role</th>
//                                         <th>Rating</th>
//                                         <th>Improvements</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {dataArray.map((item, index) => {
//                                         const shiftId = item.shift?.toString();
//                                         const shift = shiftId ? shiftDataMap[shiftId] : undefined;
//                                         const userId = item.user?.toString();
//                                         const user = userId ? userDataMap[userId] : undefined;
//                                         return (
//                                             <tr key={index}>
//                                                 <td>{`${user?.firstName || ""} ${user?.lastName || ""}`}</td>
//                                                 <td>{shift?.startAt}</td>
//                                                 <td>{shift?.venue}</td>
//                                                 <td>{shift?.volunteerTypeAllocations}</td>
//                                                 <td>{item.rating}</td>
//                                                 <td>{item.improvements}</td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </ModalBody>
//             </WEITBackground>
//         </>
//     );
// };

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
                            <h1>Feedback Forms</h1>
                            <button className="download-button">Download</button>
                        </div>
                        <div className="table-responsive bdr">
                            <table className="table table-striped table-bg table-bordered table-hover table-rounded">
                                <thead>
                                    <tr>
                                        <th>User Name</th>
                                        <th>Shift Date</th>
                                        <th>School</th>
                                        <th>Role</th>
                                        <th>Rating</th>
                                        <th>Improvements</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbackData &&
                                        feedbackData.data &&
                                        feedbackData?.data.map((feedbackItem, index) => {
                                            const user = feedbackItem.user; // Accessing user data from feedback
                                            const shift = feedbackItem.shift; // Accessing shift data from feedback
                                            return (
                                                <tr key={index}>
                                                    <td>{user.firstName}</td>
                                                    <td>{user.lastName}</td>
                                                    <td>{shift.startAt}</td>
                                                    <td>{shift.venue}</td>
                                                    <td>{feedbackItem.rating}</td>
                                                    <td>{feedbackItem.improvements}</td>
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
