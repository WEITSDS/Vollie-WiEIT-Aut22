import React from "react";
import { Form, ModalBody, Spinner } from "react-bootstrap";
import { getAllUsers, User } from "../../api/userApi";
import avatar from "../../assets/avatar.svg";
import { Link } from "react-router-dom";
import { WEITBackground } from "../../components/background";
import { NavigationBar } from "../../components/navbar";
import { VerifiedMark } from "../../profile/verifiedMark";
import { getAllTags, Tag } from "../../api/tagApi";
import { EditUserTagsModal } from "../../profile/tags/editUserTagModal";
import { TagBadges } from "../../profile/tags/tagBadges";

interface VolunteerCardProps {
    user: User;
    handleUserClick: (e: React.MouseEvent<HTMLElement>, u: User) => void;
}

function formatUserIntoTitle(user: User): string {
    return `${user.firstName} ${user.lastName}${user.isAdmin ? " (Administrator)" : ""}` + `\n${user.email}`;
}

const VolunteerCard = ({ user, handleUserClick }: VolunteerCardProps) => {
    return (
        <div className="volunteer-card text-center" title={formatUserIntoTitle(user)}>
            <span>
                <i className={`bi bi-star-fill ${user.isAdmin ? "" : "opacity-0"}`} />
            </span>

            <img src={avatar} alt="" />
            <div className="card-body">
                <div>
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>
                    &nbsp;&nbsp;
                    <VerifiedMark user={user} />
                </div>
                <span className="my-1">
                    <TagBadges user={user} onEditClick={handleUserClick} />
                </span>
            </div>
        </div>
    );
};

interface VolunteerListState {
    loading: boolean;
    users: User[];
    tags: Tag[];
    errorMessage?: string;
    showAdmins: boolean;
    showEditUserTagsModal?: boolean;
    selectedUser?: User;
}

export class VolunteersList extends React.Component<Record<string, never>, VolunteerListState> {
    state: VolunteerListState = {
        users: [],
        tags: [],
        loading: true,
        showAdmins: false,
    };

    componentDidMount = async () => {
        await this.showVolunteers();
    };

    showVolunteers = async () => {
        this.setState({ loading: true });
        const [users, tags] = await Promise.all([getAllUsers(), getAllTags()]);
        this.setState({
            loading: false,
            users: users.data ?? [],
            tags: tags.data ?? [],
        });
    };

    toggleShowAdmins = () => {
        this.setState({ showAdmins: !this.state.showAdmins });
    };

    showEditUserTagModal = (e: React.MouseEvent<HTMLElement>, user: User) => {
        e.preventDefault();
        this.setState({ showEditUserTagsModal: true, selectedUser: user });
    };

    onEditUserTagModalClose = (save?: boolean) => {
        this.setState({ showEditUserTagsModal: false, selectedUser: undefined });
        if (save) {
            this.showVolunteers().catch(console.error);
        }
    };

    render = () => {
        const { loading, users, errorMessage, showAdmins, showEditUserTagsModal, selectedUser, tags } = this.state;
        return (
            <>
                <NavigationBar />
                <WEITBackground>
                    <ModalBody>
                        {loading ? (
                            <Spinner animation="border" />
                        ) : (
                            <>
                                {errorMessage && <p>{errorMessage}</p>}
                                <h1 className="text-center">Volunteers</h1>
                                <Form.Check
                                    type="switch"
                                    checked={showAdmins}
                                    label="Show admin users"
                                    onChange={this.toggleShowAdmins}
                                />
                                {users.length > 0 ? (
                                    <div className="cards">
                                        {users
                                            .filter((u) => showAdmins || !u.isAdmin)
                                            .map((u, i) => (
                                                <Link
                                                    style={{ textDecoration: "none" }}
                                                    to={`/profile/${u._id}`}
                                                    key={`user-${i}`}
                                                >
                                                    <VolunteerCard
                                                        handleUserClick={this.showEditUserTagModal}
                                                        user={u}
                                                    />
                                                </Link>
                                            ))}
                                    </div>
                                ) : (
                                    <p>No users to show</p>
                                )}
                            </>
                        )}
                        {showEditUserTagsModal != null && selectedUser != null && (
                            <EditUserTagsModal onClose={this.onEditUserTagModalClose} user={selectedUser} tags={tags} />
                        )}
                    </ModalBody>
                </WEITBackground>
            </>
        );
    };
}
