import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import ProtectedRoute from "./protectedRoute";
import { RegisterPage } from "./login/register";
import { LoginPage } from "./login/login";
// import { VolunteerLandingPage } from "./profile/volunteer/landingPage";
import { ResetPaswordForm } from "./forms/resetPassword/resetPasswordForm";
import { ProfilePage } from "./profile/profile";
import { VolunteersList } from "./admin/tags/volunteersList";
import { AdminDashboard } from "./admin/adminDashboard";

//import { ViewAvailableShifts } from "./profile/viewAvailableShifts";
// import { AdminViewAvailbleShifts } from "./admin/adminViewAvailbleShifts";
// import { MyShift } from "./profile/myShift";

//  import { AdminViewAllShifts } from "./admin/adminViewAllShifts";

import { Modal } from "./profile/modal";
import ShiftInformation from "./shiftInformation/shiftInformation";
// import { VolunteerDetails } from "./admin/tags/volunteerDetails";

import AdminViewAllUsers from "./admin/adminViewAllUsers";

import "./profile/data.json";
import { HomePage } from "./homepage/homepage";

const queryClient = new QueryClient();

function App(): JSX.Element {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />}></Route>
                    <Route path="/forgotpassword" element={<ResetPaswordForm redirectTo="/home" />}></Route>
                    <Route path="/register" element={<RegisterPage />}></Route>
                    <Route
                        path="/search"
                        element={<ProtectedRoute needsAdmin={true} outlet={<AdminViewAllUsers />} />}
                    ></Route>
                    <Route
                        path="/volunteers"
                        element={<ProtectedRoute needsAdmin={true} outlet={<VolunteersList />} />}
                    ></Route>
                    <Route path="/profile" element={<ProtectedRoute outlet={<ProfilePage />} />}></Route>
                    <Route path="/profile/:id" element={<ProtectedRoute outlet={<ProfilePage />} />}></Route>
                    <Route
                        path="/home"
                        element={<ProtectedRoute outlet={<HomePage shiftType={"available"} />} />}
                    ></Route>
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute needsAdmin={true} outlet={<AdminDashboard />} />}
                    ></Route>

                    <Route
                        path="/allshifts"
                        element={<ProtectedRoute outlet={<HomePage shiftType={"allShifts"} />} />}
                    ></Route>
                    <Route
                        path="/myshifts"
                        element={<ProtectedRoute outlet={<HomePage shiftType={"myShifts"} />} />}
                    ></Route>

                    <Route path="/shift/:shiftId" element={<ProtectedRoute outlet={<ShiftInformation />} />}></Route>

                    <Route path="/modal" element={<ProtectedRoute outlet={<Modal />} />}></Route>
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
