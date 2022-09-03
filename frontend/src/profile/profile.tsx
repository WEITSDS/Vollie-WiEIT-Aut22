import React from "react";
import avatar from "../assets/avatar.svg";
import Spinner from "react-bootstrap/Spinner";
import { getUser, User } from "../api/userAPI";
import { QualificationsSection } from "./qualifications/qualificationManagement";
import { VerifyAccountModal } from "./verifyAccount";
import { NavigationBar } from "../components/navbar";
import { useParams } from "react-router-dom";
import { loggedInUserIsAdmin } from "../protectedRoute";
import { setPageTitle } from "../utility";
import "./profile.css";
import { VerifiedMark } from "./verifiedMark";
import { TagBadges } from "./tags/tagBadges";
import { EditUserTagsModal } from "./tags/editUserTagModal";
import { getAllTags, Tag } from "../api/tagApi";

interface ProfilePageProps {
    isAdmin?: boolean;
    userId?: string;
}

interface ProfilePageState {
    loaded: boolean;
    user: User | undefined;
    errorMessage?: string;
    showOTPModal?: boolean;
    editingSelf?: boolean;
    showEditUserTagsModal?: boolean;
    tags: Tag[];
}

class ProfilePageClass extends React.Component<ProfilePageProps, ProfilePageState> {
    state: ProfilePageState = {
        loaded: false,
        user: undefined,
        tags: [],
    };

    constructor(props: ProfilePageProps) {
        super(props);
        setPageTitle("Profile");
    }

    componentDidMount = async () => {
        const { isAdmin, userId } = this.props;
        const [userResp, tagResp] = await Promise.all([getUser(isAdmin ? userId : undefined), getAllTags()]);
        if (isAdmin && userId && userId === userResp.data?._id) {
            setPageTitle(`${userResp.data.firstName} ${userResp.data.lastName} - Profile`);
        }
        this.setState({
            loaded: true,
            editingSelf: this.props.userId == null || userResp.data?._id !== this.props.userId,
            user: userResp.data ?? undefined,
            tags: tagResp.data ?? [],
            errorMessage: userResp.success ? "" : userResp.message,
        });
    };

    onEditUserTagModalClose = (save?: boolean) => {
        this.setState({ showEditUserTagsModal: false });
        if (save) {
            const { isAdmin, userId } = this.props;
            getUser(isAdmin ? userId : undefined)
                .then((resp) => {
                    this.setState({
                        loaded: true,
                        editingSelf: this.props.userId == null || resp.data?._id !== this.props.userId,
                        user: resp.data ?? undefined,
                        errorMessage: resp.success ? "" : resp.message,
                    });
                })
                .catch(console.error);
        }
    };

    showEditUserTagModal = (e: React.MouseEvent<HTMLElement>, _user: User) => {
        e.preventDefault();
        this.setState({ showEditUserTagsModal: true });
    };

    showOTPVerifierModal = () => {
        this.setState({ showOTPModal: true });
    };

    closeOTPVerifierModal = (verified?: boolean) => {
        const user = this.state.user;
        this.setState({ showOTPModal: false, user: user ? { ...user, verified: verified || false } : undefined });
    };

    render = () => {
        const { loaded, user, errorMessage, showOTPModal, editingSelf, showEditUserTagsModal, tags } = this.state;
        const { isAdmin, userId } = this.props;
        if (!(loaded && user)) {
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
                                            onUnverifiedClick={editingSelf ? this.showOTPVerifierModal : undefined}
                                            user={user}
                                        />
                                    </h2>
                                    <h4>{user.email}</h4>
                                    <div>
                                        <TagBadges
                                            user={user}
                                            onEditClick={isAdmin ? this.showEditUserTagModal : undefined}
                                        />
                                    </div>
                                </div>
                                <div className="col-8">
                                    {errorMessage && <p>{errorMessage}</p>}
                                    <div className="main-content">
                                        <h4>
                                            <strong>Qualifications</strong>
                                        </h4>
                                        <QualificationsSection isAdmin={isAdmin} userId={userId} />
                                    </div>
                                    {showOTPModal && (
                                        <VerifyAccountModal
                                            email={user.email}
                                            closeModal={this.closeOTPVerifierModal}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showEditUserTagsModal && (
                    <EditUserTagsModal tags={tags} user={user} onClose={this.onEditUserTagModalClose} />
                )}
            </>
        );
    };
}

export const ProfilePage = () => {
    const { id } = useParams();
    const isAdmin = loggedInUserIsAdmin();
    return <ProfilePageClass userId={id} isAdmin={isAdmin} />;
};
