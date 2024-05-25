import { useState, useEffect, ChangeEvent } from "react";
import Spinner from "../components/spinner";
import { QualificationsSection } from "./qualifications/qualificationManagement";
import { VerifyAccountModal } from "./verifyAccount";
import { NavigationBar } from "../components/navbar";
import { useParams } from "react-router-dom";
import { setPageTitle } from "../utility";
import "./profile.css";
import { VerifiedMark } from "./verifiedMark";
import { useUserById } from "../hooks/useUserById";
import { useOwnUser } from "../hooks/useOwnUser";
import { useVoltypesForUser } from "../hooks/useVolTypesForUser";
import { removeVolunteerType, setApprovalUserVolunteerType } from "../api/userApi";
import { loggedInUserIsAdmin } from "../protectedRoute";
import { AddRoleModal, ConfirmDeleteModal } from "./volunteer/addRoleModal";
import { IVolunteerTypeUserWithApproved } from "../api/volTypeAPI";
import { useProfileImage } from "../hooks/useProfileImage";
import avatar from "../assets/avatar.svg";

export const ProfilePage = () => {
    const { id } = useParams();
    const { isLoading, data: userData, refetch: refetchUser, error } = id ? useUserById(id) : useOwnUser();
    const user = userData?.data;
    const [showAddModal, setshowAddModal] = useState(false);
    const [showDeleteModal, setshowDeleteModal] = useState(false);
    const [selectedVolType, setselectedVolType] = useState<IVolunteerTypeUserWithApproved | null>(null);
    const {
        profileImage,
        loading: loadingProfileImage,
        error: errorProfileImage,
        updateProfileImage,
    } = useProfileImage(user?._id);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        try {
            if (user) {
                await setApprovalUserVolunteerType(qualId, user?._id, status);
                await refetchVolTypeUser();
            }
        } catch (error) {
            console.log(error);
        }
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
            }
            await refetchVolTypeUser();
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpdateProfileImage = async () => {
        if (selectedFile) {
            await updateProfileImage(selectedFile);
            setSelectedFile(null);
        }
    };

    if (isLoading || !user) {
        return <Spinner />;
    }

    return (
        <>
            <NavigationBar />
            <div className="profile-div">
                <div className="profile-container">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <img className="profile-image" src={profileImage || avatar} alt="Profile" />
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                {selectedFile && (
                                    <button onClick={handleUpdateProfileImage}>Update Profile Image</button>
                                )}
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
                                {errorProfileImage && <p>{errorProfileImage}</p>}
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
                        <div className="volunteer-type-table" hidden={!isAdmin && !editingSelf}>
                            <table>
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
                                        userVolTypesData.data.map((volType, index) => (
                                            <tr key={volType._id}>
                                                <td>{index + 1}</td>
                                                <td>{volType.name}</td>
                                                <td>{volType.approved ? "Yes" : "No"}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteRole(volType)}
                                                        title={`Delete`}
                                                        disabled={!editingSelf && !isAdmin}
                                                    >
                                                        <i className="bi bi-trash" />
                                                    </button>
                                                </td>
                                                {isAdmin && (
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                void handleSetVolunteerTypeApproval(
                                                                    volType._id,
                                                                    volType.approved ? "revoke" : "approve"
                                                                );
                                                            }}
                                                        >
                                                            {volType.approved ? "Revoke" : "Approve"}
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <button
                                title="Add Volunteer Type"
                                onClick={() => handleAddRole()}
                                disabled={!editingSelf && !isAdmin}
                            >
                                Add Volunteer Type {"   "}
                                <i className="bi bi-plus-square" />
                            </button>
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
                        <br />
                        {user?._id && (
                            <QualificationsSection userId={user._id} isAdmin={isAdmin} editingSelf={editingSelf} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
