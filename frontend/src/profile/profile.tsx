import { useState, useEffect } from "react";
import avatar from "../assets/avatar.svg";
import Spinner from "react-bootstrap/Spinner";
// import { User } from "../api/userApi";
import { QualificationsSection } from "./qualifications/qualificationManagement";
import { VerifyAccountModal } from "./verifyAccount";
import { NavigationBar } from "../components/navbar";
import { useParams } from "react-router-dom";
import { loggedInUserIsAdmin } from "../protectedRoute";
import { setPageTitle } from "../utility";
import "./profile.css";
import { VerifiedMark } from "./verifiedMark";
import { Button, Table } from "react-bootstrap";
import { useUserById } from "../hooks/useUserById";
import { useOwnUser } from "../hooks/useOwnUser";

export const ProfilePage = () => {
    const { id } = useParams();
    const isAdmin = loggedInUserIsAdmin();

    const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();
    const user = userData?.data;

    const editingSelf = !id;

    // const [showQualificationModal, setShowQualificationModal] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);

    useEffect(() => {
        if (user) setPageTitle(`${user.firstName} ${user.lastName} - Profile`);
    }, [user]);

    const closeOTPVerifierModal = async () => {
        setShowOTPModal(false);
        await refetchUser();
    };

    if (!(!isLoading && user)) {
        return <Spinner animation="border" />;
    }
    return (
        <>
            <NavigationBar />
            <div className="profile-div">
                <div className="profile-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <img className="profile-image" src={avatar} alt="logo" />
                            </div>
                            <div className="col-6">
                                <h2>
                                    <strong>
                                        {user.firstName} {user.lastName}
                                    </strong>
                                    &nbsp;&nbsp;
                                    <VerifiedMark
                                        editingSelf={editingSelf}
                                        onUnverifiedClick={() => {
                                            if (editingSelf) setShowOTPModal(true);
                                        }}
                                        user={user}
                                    />
                                </h2>
                                <h4>{user.email}</h4>
                            </div>
                            <div className="col-8">
                                {error && <p>{error}</p>}
                                <div className="main-content">
                                    <h4>
                                        <strong>Qualifications</strong>
                                    </h4>
                                    <QualificationsSection isAdmin={isAdmin} userId={user._id} />
                                </div>
                                {showOTPModal && (
                                    <VerifyAccountModal
                                        email={user.email}
                                        closeModal={() => {
                                            void closeOTPVerifierModal();
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="volunteer-type-table">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Volunteer Type</th>
                                        <th>Approval</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>General Volunteer</td>
                                        <td>
                                            <Button>Accept</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Undergrad Ambassador</td>
                                        <td>
                                            <Button>Accept</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Postgrad Ambassador</td>
                                        <td>
                                            <Button>Accept</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>Staff Ambassadors</td>
                                        <td>
                                            <Button>Accept</Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>5</td>
                                        <td>SPROUT</td>
                                        <td>
                                            <Button>Accept</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="qualification-table">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Qualification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Qual</td>
                                    </tr>
                                    <tr>
                                        <td>Qual</td>
                                    </tr>
                                    <tr>
                                        <td>Qual</td>
                                    </tr>
                                    <tr>
                                        <td>Qual</td>
                                    </tr>
                                    <tr>
                                        <td>Qual</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
