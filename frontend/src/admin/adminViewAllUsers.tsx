import { useEffect, useState } from "react";
import { NavigationBar } from "../components/navbar";
import "./adminViewAllUsers.css";
import peopleIcon from "../assets/people.svg";
// import axios from "axios";
import { getAllUsers, User } from "../api/userApi";

const AdminViewAllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getData = async () => {
            const users = await getAllUsers();
            setUsers(users.data ?? []);
        };
        getData().catch(console.error);
    }, []);

    return (
        <div>
            <NavigationBar />
            <div className="search-page-container">
                <div className="search-page-header">Users</div>
                <input type="text" className="search-bar"></input>
                <div className="all-users">
                    <img src={peopleIcon} alt="participants icon" />
                    <div className="all-users-text"> 1/82</div>
                </div>

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Ron</td>
                            <td>ron.sidons@student.uts.edu.au</td>
                        </tr>
                        <tr>
                            <td>Jake</td>
                            <td>jake.sidons@student.uts.edu.au</td>
                        </tr>
                        <tr>
                            <td>Ben</td>
                            <td>ben.sidons@student.uts.edu.au</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewAllUsers;
