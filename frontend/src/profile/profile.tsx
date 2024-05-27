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
import { removeVolunteerType, setApprovalUserVolunteerType } from "../api/userApi";
import { loggedInUserIsAdmin } from "../protectedRoute";
import { AddRoleModal, ConfirmDeleteModal } from "./volunteer/addRoleModal";
import { IVolunteerTypeUserWithApproved } from "../api/volTypeAPI";
import { useProfileImage } from "../hooks/useProfileImage";
import { CreateOrEditImageModal } from "./updateImageModal";

export const ProfilePage = () => {
    const { id } = useParams();
    const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();
    const user = userData?.data;
    const { profileImage, loading: loadingProfileImage } = useProfileImage(user?._id);
    const [showAddModal, setshowAddModal] = useState(false);
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [showCreateModal, setshowCreateModal] = useState(false);
    const [selectedVolType, setselectedVolType] = useState<IVolunteerTypeUserWithApproved | null>(null);

    const isAdmin = loggedInUserIsAdmin();

    const {
        data: userVolTypesData,
        isLoading: isLoadingVolTypes,
        refetch: refetchVolTypeUser,
    } = useVoltypesForUser(user?._id);

    const editingSelf = !id;

    const [showOTPModal, setShowOTPModal] = useState(false);

    useEffect(() => {
        if (user) setPageTitle(`${user.firstName} ${user.lastName} - Profile`);
    }, [user]);

    const closeOTPVerifierModal = async () => {
        setShowOTPModal(false);
        await refetchUser();
    };

    const handleSetVolunteerTypeApproval = async (qualId: string, status: string) => {
        console.log(qualId);
        try {
            if (user) {
                await setApprovalUserVolunteerType(qualId, user?._id, status);
                await refetchVolTypeUser();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateImage = () => {
        setshowCreateModal(true);
    };

    const onCreateClose = () => {
        setshowCreateModal(false);
    };

    const handleAddRole = () => {
        setshowAddModal(true);
    };

    const handleDeleteRole = (volType: IVolunteerTypeUserWithApproved) => {
        setselectedVolType(volType);
        setshowDeleteModal(true);
    };

    const onAddRoleClose = async () => {
        setshowAddModal(false);
        await refetchVolTypeUser();
    };

    const onDeleteRoleClose = async (shouldDelete: boolean) => {
        try {
            setshowDeleteModal(false);
            if (user?._id && selectedVolType && shouldDelete) {
                await removeVolunteerType(user?._id, selectedVolType?._id);
                console.log("Trying to delete");
            }
            await refetchVolTypeUser();
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
                                {loadingProfileImage ? (
                                    <Spinner animation="border" />
                                ) : (
                                    <img className="profile-image" src={profileImage || avatar} alt="Profile" />
                                )}
                                <div className="image-button">
                                    <Button
                                        title={`Update profile image`}
                                        variant="success"
                                        hidden={!editingSelf}
                                        onClick={() => handleCreateImage()}
                                    >
                                        {" "}
                                        Update image
                                    </Button>
                                    {showCreateModal && (
                                        <CreateOrEditImageModal
                                            image={{
                                                _id: "",
                                                filePath: "",
                                                fileId: "",
                                                user: "",
                                            }}
                                            onClose={() => {
                                                void onCreateClose();
                                            }}
                                            isNew={true}
                                        />
                                    )}
                                </div>
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
                        <div className="volunteer-type-table" hidden={!isAdmin && !editingSelf}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Volunteer Type</th>
                                        <th>Approval Status</th>
                                        <th>Delete</th>
                                        {isAdmin && <th>Set Approval</th>}
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
                                                    <td>
                                                        <Button
                                                            onClick={() => handleDeleteRole(volType)}
                                                            title={`Delete`}
                                                            variant="danger"
                                                            disabled={!editingSelf && !isAdmin}
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </Button>
                                                    </td>
                                                    {isAdmin && (
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
                            <Button
                                title="Add Volunteer Type"
                                variant="success"
                                onClick={() => handleAddRole()}
                                disabled={!editingSelf && !isAdmin}
                            >
                                Add Volunteer Type {"   "}
                                <i className="bi bi-plus-square" />
                            </Button>
                            {showAddModal && user._id && userVolTypesData?.data && (
                                <AddRoleModal
                                    userId={user?._id}
                                    userVolTypes={userVolTypesData?.data}
                                    onClose={() => {
                                        void onAddRoleClose();
                                    }}
                                />
                            )}
                            {showDeleteModal && selectedVolType && (
                                <ConfirmDeleteModal
                                    type={selectedVolType}
                                    onClose={(shouldDelete: boolean) => void onDeleteRoleClose(shouldDelete)}
                                />
                            )}
                        </div>
                        <br></br>
                        {user?._id && (
                            <QualificationsSection userId={user._id} isAdmin={isAdmin} editingSelf={editingSelf} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
