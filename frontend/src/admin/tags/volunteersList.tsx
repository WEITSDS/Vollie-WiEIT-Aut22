import React from "react";
import { Form, ModalBody, Spinner } from "react-bootstrap";
import { getAllUsers, User } from "../../api/userApi";
import avatar from "../../assets/avatar.svg";
import { Link } from "react-router-dom";
import { WEITBackground } from "../../components/background";
import { NavigationBar } from "../../components/navbar";
import { VerifiedMark } from "../../profile/verifiedMark";

interface VolunteerCardProps {
    user: User;
}

function formatUserIntoTitle(user: User): string {
    return `${user.firstName} ${user.lastName}${user.isAdmin ? " (Administrator)" : ""}` + `\n${user.email}`;
}

const VolunteerCard = ({ user }: VolunteerCardProps) => {
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
            </div>
        </div>
    );
};

interface VolunteerListState {
    loading: boolean;
    users: User[];
    errorMessage?: string;
    showAdmins: boolean;
    selectedUser?: User;
}

export class VolunteersList extends React.Component<Record<string, never>, VolunteerListState> {
    state: VolunteerListState = {
        users: [],
        loading: true,
        showAdmins: false,
    };

    componentDidMount = async () => {
        await this.showVolunteers();
    };

    showVolunteers = async () => {
        this.setState({ loading: true });
        const [users] = await Promise.all([getAllUsers()]);
        this.setState({
            loading: false,
            users: users.data ?? [],
        });
    };

    toggleShowAdmins = () => {
        this.setState({ showAdmins: !this.state.showAdmins });
    };

    render = () => {
        const { loading, users, errorMessage, showAdmins } = this.state;
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
                                                    <VolunteerCard user={u} />
                                                </Link>
                                            ))}
                                    </div>
                                ) : (
                                    <p>No users to show</p>
                                )}
                            </>
                        )}
                    </ModalBody>
                </WEITBackground>
            </>
        );
    };
}
