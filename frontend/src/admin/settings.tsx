import React from "react";
import { NavigationBar } from "../components/navbar";
import { WEITBackground } from "../components/background";
import { ModalBody } from "react-bootstrap";
import { getAllUsers, User } from "../api/userApi";
import { setPageTitle } from "../utility";
import QualificationsTable from "../components/qualificationsTable";
import VenuesTable from "../components/venuesTable";
import CohortTable from "../components/cohortTable";
interface SettingsState {
    loading: boolean;
    errorMessage?: string;
    users: User[];
}

export class Settings extends React.Component<Record<string, never>, SettingsState> {
    state: SettingsState = {
        loading: true,
        users: [],
    };

    constructor(props: Record<string, never>) {
        super(props);
        setPageTitle("Settings");
    }

    componentDidMount = async () => {
        await this.load();
    };

    load = async () => {
        this.setState({ loading: true });
        const [usersInfo] = await Promise.all([getAllUsers()]);
        this.setState({
            loading: false,
            users: usersInfo.data ?? [],
        });
    };
    render = () => {
        return (
            <>
                <NavigationBar />
                <WEITBackground>
                    <ModalBody
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                        }}
                    >
                        <div className="dashboard-table-container">
                            <QualificationsTable tableType="Qualification" />
                            <QualificationsTable tableType="Volunteer" />
                            <VenuesTable />
                        </div>
                    </ModalBody>
                    <ModalBody
                        style={{
                            display: "flex",
                            // justifyContent: "center",
                            alignItems: "center",
                            // height: "100vh",
                        }}
                    >
                        <CohortTable />
                    </ModalBody>
                </WEITBackground>
            </>
        );
    };
}
