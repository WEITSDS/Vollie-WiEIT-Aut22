import React from "react";
import avatar from "../assets/avatar.svg";
import Spinner from "react-bootstrap/Spinner";
import { getUser, User } from "../api/userApi";
import { QualificationsSection } from "./qualifications/qualificationManagement";
import { VerifyAccountModal } from "./verifyAccount";
import { NavigationBar } from "../components/navbar";
import { useParams } from "react-router-dom";
import { loggedInUserIsAdmin } from "../protectedRoute";
import { setPageTitle } from "../utility";
import "./profile.css";
import { VerifiedMark } from "./verifiedMark";
import { Button, Table } from "react-bootstrap";

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
}

class ProfilePageClass extends React.Component<ProfilePageProps, ProfilePageState> {
    state: ProfilePageState = {
        loaded: false,
        user: undefined,
    };

    constructor(props: ProfilePageProps) {
        super(props);
        setPageTitle("Profile");
    }

    componentDidMount = async () => {
        const { isAdmin, userId } = this.props;
        const [userResp] = await Promise.all([getUser(isAdmin ? userId : undefined)]);
        if (isAdmin && userId && userId === userResp.data?._id) {
            setPageTitle(`${userResp.data.firstName} ${userResp.data.lastName} - Profile`);
        }
        this.setState({
            loaded: true,
            editingSelf: this.props.userId == null || userResp.data?._id !== this.props.userId,
            user: userResp.data ?? undefined,
            errorMessage: userResp.success ? "" : userResp.message,
        });
    };

    showOTPVerifierModal = () => {
        this.setState({ showOTPModal: true });
    };

    closeOTPVerifierModal = (verified?: boolean) => {
        const user = this.state.user;
        this.setState({ showOTPModal: false, user: user ? { ...user, verified: verified || false } : undefined });
    };

    handleAccept = () => {
        console.log("test");
    };

    render = () => {
        const { loaded, user, errorMessage, showOTPModal, editingSelf } = this.state;
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
                            <div className="profile-table">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Volunteer Type</th>
                                            <th>Qualification</th>
                                            <th>Approval</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>General Volunteer</td>
                                            <td>
                                                <a href="#">Qual</a>
                                            </td>
                                            <td>
                                                <Button onClick={this.handleAccept}>Accept</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Undergrad Ambassador</td>
                                            <td>
                                                {" "}
                                                <a href="#">Qual</a>
                                            </td>
                                            <td>
                                                <Button onClick={this.handleAccept}>Accept</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Postgrad Ambassador</td>
                                            <td>
                                                {" "}
                                                <a href="#">Qual</a>
                                            </td>
                                            <td>
                                                <Button onClick={this.handleAccept}>Accept</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Staff Ambassadors</td>
                                            <td>
                                                {" "}
                                                <a href="#">Qual</a>
                                            </td>
                                            <td>
                                                <Button onClick={this.handleAccept}>Accept</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>SPROUT</td>
                                            <td>
                                                {" "}
                                                <a href="#">Qual</a>
                                            </td>
                                            <td>
                                                <Button onClick={this.handleAccept}>Accept</Button>
                                            </td>
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
}

export const ProfilePage = () => {
    const { id } = useParams();
    const isAdmin = loggedInUserIsAdmin();
    return <ProfilePageClass userId={id} isAdmin={isAdmin} />;
};
