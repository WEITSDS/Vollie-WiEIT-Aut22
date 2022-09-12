import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import ProtectedRoute from "./protectedRoute";
import { RegisterPage } from "./login/register";
import { LoginPage } from "./login/login";
import { VolunteerLandingPage } from "./profile/volunteer/landingPage";
import { ResetPaswordForm } from "./forms/resetPassword/resetPasswordForm";
import { ProfilePage } from "./profile/profile";
import { TagManagement } from "./admin/tags/tagManagement";
import { VolunteersList } from "./admin/tags/volunteersList";
import { AdminDashboard } from "./admin/adminDashboard";
//import { ViewAvailableShifts } from "./profile/viewAvailableShifts";
import { AdminViewAvailbleShifts } from "./admin/adminViewAvailbleShifts";
// import { MyShift } from "./profile/myShift";
import { Modal } from "./profile/modal";
import ShiftInformation from "./shiftInformation/shiftInformation";
// import { VolunteerDetails } from "./admin/tags/volunteerDetails";

import "./profile/data.json";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/forgotpassword" element={<ResetPaswordForm redirectTo="/home" />}></Route>
                <Route path="/register" element={<RegisterPage />}></Route>
                <Route
                    path="/volunteers"
                    element={<ProtectedRoute needsAdmin={true} outlet={<VolunteersList />} />}
                ></Route>
                <Route path="/profile" element={<ProtectedRoute outlet={<ProfilePage />} />}></Route>
                <Route path="/profile/:id" element={<ProtectedRoute outlet={<ProfilePage />} />}></Route>
                <Route path="/tags" element={<ProtectedRoute needsAdmin={true} outlet={<TagManagement />} />}></Route>
                <Route path="/home" element={<ProtectedRoute outlet={<VolunteerLandingPage />} />}></Route>
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute needsAdmin={true} outlet={<AdminDashboard />} />}
                ></Route>
                <Route path="/allocate" element={<ProtectedRoute outlet={<AdminViewAvailbleShifts />} />}></Route>
                <Route path="/myshifts" element={<ProtectedRoute outlet={<ShiftInformation />} />}></Route>
                <Route path="/modal" element={<ProtectedRoute outlet={<Modal />} />}></Route>
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
