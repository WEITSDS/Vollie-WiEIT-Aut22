import React from "react";
import { Tag, getAllTags } from "../api/tagApi";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import { ModalBody, Spinner } from "react-bootstrap";
import { getAllUsers, User } from "../api/userAPI";
import moment from "moment";
import { Link } from "react-router-dom";
import { setPageTitle } from "../utility";
// import "./adminLandingPage.css";

interface DashboardProps {
    tag: Tag;
}

const Dashboard = ({ tag }: DashboardProps) => {
    return (
        <div className="dashboard-tiles">
            <div>
                <strong>{tag.name}</strong>
            </div>
            <div>
                <span>{tag.userCount}</span>
            </div>
        </div>
    );
};

interface AdminDashboardState {
    loading: boolean;
    tags: Tag[];
    errorMessage?: string;
    users: User[];
}

export class AdminDashboard extends React.Component<Record<string, never>, AdminDashboardState> {
    state: AdminDashboardState = {
        tags: [],
        loading: true,
        users: [],
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Dashboard");
    }

    componentDidMount = async () => {
        await this.load();
    };

    load = async () => {
        this.setState({ loading: true });
        const [tagsInfo, usersInfo] = await Promise.all([getAllTags(), getAllUsers()]);
        this.setState({
            loading: false,
            tags: tagsInfo.data ?? [],
            users: usersInfo.data ?? [],
        });
    };
    render = () => {
        const { loading, tags, errorMessage, users } = this.state;
        const today = new Date();
        const startDate = moment().startOf("month");
        return (
            <>
                <NavigationBar />
                <WEITBackground>
                    <ModalBody>
                        {loading ? (
                            <Spinner animation="border" />
                        ) : (
                            <div className="fs-4">
                                {errorMessage && <p>{errorMessage}</p>}
                                <div>
                                    {tags.length > 0 ? (
                                        tags.map((tag, i) => <Dashboard tag={tag} key={`tag-${i}`} />)
                                    ) : (
                                        <p>No users to show</p>
                                    )}
                                </div>

                                <div className="dashboard-tiles">
                                    <div>
                                        <strong>New Volunteers</strong>
                                    </div>
                                    <div>
                                        <span>
                                            {
                                                users.filter(
                                                    (u) =>
                                                        !u.isAdmin && moment(u.registeredAt).isBetween(startDate, today)
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <br />
                        <br />
                        <>
                            <div className="dashboard-buttons">
                                <Link to="/volunteers">
                                    <button>
                                        <i className="bi bi-person"></i> Volunteers
                                    </button>
                                </Link>
                                <Link to="/tags">
                                    <button>
                                        <i className="bi bi-tags"></i> Tags
                                    </button>
                                </Link>
                                <Link to="/">
                                    <button>
                                        <i className="bi bi-clipboard-data"></i> Reports
                                    </button>
                                </Link>
                            </div>
                        </>
                    </ModalBody>
                </WEITBackground>
            </>
        );
    };
}
