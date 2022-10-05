import { SetStateAction, useEffect, useState } from "react";
import { NavigationBar } from "../components/navbar";
import "./adminViewAllUsers.css";
import peopleIcon from "../assets/people.svg";
// import axios from "axios";
import { getAllUsers, User } from "../api/userApi";

const AdminViewAllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const getData = async () => {
            const users = await getAllUsers();
            setUsers(users.data ?? []);
        };
        getData().catch(console.error);
    }, []);

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSearch(event.target.value);
    };

    const handleOpenUser = () => {
        // go to user profile
    };

    return (
        <div>
            <NavigationBar />
            <div className="search-page-container">
                <h1>Search Users</h1>
                <input type="text" className="search-bar" onChange={handleChange}></input>
                <div className="all-users-container">
                    <img className="allUsersIcon" src={peopleIcon} alt="participants icon" />
                    <div className="all-users-text">
                        {users.filter((user) => user.email.includes(search)).length}/{users.length}
                    </div>
                </div>
                <table id="userEmailTable" className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody className="email-search-table-body">
                        {users
                            .filter((user) => user.email.includes(search))
                            .sort((a, b) => b.registeredAt - a.registeredAt)
                            .map((user) => (
                                <tr key={user._id} onClick={handleOpenUser}>
                                    <td>{user.firstName + " " + user.lastName}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewAllUsers;
