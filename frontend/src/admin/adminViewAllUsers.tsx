import { SetStateAction, useEffect, useState } from "react";
import { NavigationBar } from "../components/navbar";
import "./adminViewAllUsers.css";
import peopleIcon from "../assets/people.svg";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { getAllUsers, User } from "../api/userApi";

import { getAllVolTypes, IVolunteerType } from "../api/volTypeAPI";
import { ExportUsersModal } from "../components/exportUserModal/UserExportModal";

const AdminViewAllUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");
    const [volunteerTypes, setVolunteerTypes] = useState<IVolunteerType[]>([]);
    const [selectedVolType, setSelectedVolType] = useState<string>("");
    const [showExportModal, setShowExportModal] = useState(false);

    const downloadCSV = (csv: string, filename: string) => {
        const csvFile = new Blob([csv], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    };

    const exportUsersToCSV = () => {
        let csvContent = "Name,Email,Role\n";

        filteredUsers.forEach((user) => {
            const userName = `${user.firstName} ${user.lastName}`;
            const userEmail = user.email;
            const userRoles = getVolunteerTypeNames(user).replace(/, /g, " | ");
            const row = [userName, userEmail, userRoles].join(",");
            csvContent += row + "\r\n";
        });

        const fileName = "users_export.csv";
        downloadCSV(csvContent, fileName);
        setShowExportModal(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await getAllUsers();
                setUsers(usersResponse.data ?? []);

                const volTypesResponse = await getAllVolTypes();
                setVolunteerTypes(volTypesResponse.data ?? []);
            } catch (error) {
                console.error(error);
            }
        };

        void fetchData();
    }, []);

    // useEffect(() => {
    //     const getData = async () => {
    //         const users = await getAllUsers();
    //         setUsers(users.data ?? []);
    //     };
    //     getData().catch(console.error);
    // }, []);

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSearch(event.target.value);
    };

    const handleOpenUser = (userId: string) => {
        navigate(`/profile/${userId}`);
    };

    const handleVolTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVolType(event.target.value);
    };

    const filteredUsers = users.filter((user) => {
        // Filter for admins if 'admin' is selected
        if (selectedVolType === "admin") {
            return user.isAdmin;
        }

        // Filter for unapproved users if 'unapproved' is selected
        if (selectedVolType === "unapproved") {
            return user.volunteerTypes.some((volType) => !volType.approved);
        }

        const filterByVolType = selectedVolType
            ? user.volunteerTypes.some((volType) => volType.type === selectedVolType)
            : true;

        const filterBySearch = search
            ? (user.firstName + " " + user.lastName).toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase())
            : true;

        return filterByVolType && filterBySearch;
    });

    const getVolunteerTypeNames = (user: User) => {
        if (user.isAdmin) {
            return "Admin";
        }
        return user.volunteerTypes
            .map((volType) => {
                const foundType = volunteerTypes.find((type) => type._id === volType.type);
                const typeName = foundType ? foundType.name : "Unknown Type";
                const approvalStatus = volType.approved ? "" : " (***NEEDS APPROVAL***)";
                return typeName + approvalStatus;
            })
            .join(", ");
    };

    //for highlighting users that need approval
    const needsApproval = (user: User) => {
        return user.volunteerTypes.some((volType) => !volType.approved);
    };

    return (
        <div>
            <NavigationBar />
            <div className="search-page-container">
                <h1>Search Users</h1>
                <input type="text" className="search-bar" onChange={handleChange}></input>
                <select onChange={handleVolTypeChange} value={selectedVolType} className="volunteer-type-select">
                    <option value="">All User Types</option>
                    <option value="admin">Admin</option>
                    <option value="unapproved">Unapproved User</option>
                    {volunteerTypes.map((volType) => (
                        <option key={volType._id} value={volType._id}>
                            {volType.name}
                        </option>
                    ))}
                </select>
                <button id="exportButton" onClick={() => setShowExportModal(true)}>
                    Export Users
                </button>
                <ExportUsersModal
                    visible={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    onExport={exportUsersToCSV}
                />
                <div className="all-users-container">
                    <img className="allUsersIcon" src={peopleIcon} alt="participants icon" />
                    <div className="all-users-text">
                        {filteredUsers.length}/{users.length}
                    </div>
                </div>
                <table id="userEmailTable" className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody className="email-search-table-body">
                        {filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                onClick={() => handleOpenUser(user._id)}
                                className={needsApproval(user) ? "needs-approval" : ""}
                            >
                                <td>{user.firstName + " " + user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{getVolunteerTypeNames(user)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewAllUsers;
