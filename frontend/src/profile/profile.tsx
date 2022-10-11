import { useState, useEffect } from "react";
import avatar from "../assets/avatar.svg";
import Spinner from "react-bootstrap/Spinner";
// import { User } from "../api/userApi";
import { QualificationsSection } from "./qualifications/qualificationManagement";
import { VerifyAccountModal } from "./verifyAccount";
import { NavigationBar } from "../components/navbar";
import { useParams } from "react-router-dom";
import { setPageTitle } from "../utility";
import "./profile.css";
import { VerifiedMark } from "./verifiedMark";
import { Button, Table } from "react-bootstrap";
import { useUserById } from "../hooks/useUserById";
import { useOwnUser } from "../hooks/useOwnUser";
import { useVoltypesForUser } from "../hooks/useVolTypesForUser";
import { setApprovalUserVolunteerType } from "../api/userApi";

export const ProfilePage = () => {
    const { id } = useParams();
    const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();
    const user = userData?.data;

    const {
        data: userVolTypesData,
        isLoading: isLoadingVolTypes,
        refetch: refetchVolTypeUser,
    } = useVoltypesForUser(user?._id);

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

    const handleSetVolunteerTypeApproval = async (qualId: string, status: string) => {
        try {
            if (user) {
                await setApprovalUserVolunteerType(qualId, user?._id, status);
                await refetchVolTypeUser();
            }
        } catch (error) {
            console.log(error);
        }
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
                                {/* <div className="main-content">
                                    <h4>
                                        <strong>Qualifications</strong>
                                    </h4>
                                    <QualificationsSection
                                        isAdmin={isAdmin}
                                        userId={user._id}
                                        onFinishAddingQualification={() => void refetchQualifications()}
                                    />
                                </div> */}
                                {showOTPModal && (
                                    <VerifyAccountModal
                                        email={user.email}
                                        closeModal={() => {
                                            void closeOTPVerifierModal;
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
                                        <th>Approval Status</th>
                                        {user.isAdmin && <th>Set Approval</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!isLoadingVolTypes &&
                                        userVolTypesData?.data &&
                                        userVolTypesData.data.map((volType, index) => {
                                            return (
                                                <tr key={volType._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{volType.name}</td>
                                                    <td>{volType.approved ? "Yes" : "No"}</td>
                                                    {user.isAdmin && (
                                                        <td>
                                                            <Button
                                                                onClick={() => {
                                                                    void handleSetVolunteerTypeApproval(
                                                                        volType._id,
                                                                        volType.approved ? "revoke" : "approve"
                                                                    );
                                                                }}
                                                            >
                                                                {volType.approved ? "Revoke" : "Approve"}
                                                            </Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </div>
                        {user?._id && <QualificationsSection userId={user._id} isAdmin={user.isAdmin} />}
                    </div>
                </div>
            </div>
        </>
    );
};
