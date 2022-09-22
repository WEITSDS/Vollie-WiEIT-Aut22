import { NavigationBar } from "../components/navbar";
import "./adminViewAllUsers.css";
import peopleIcon from "../assets/people.svg";

const AdminViewAllUsers = () => {
    return (
        <div>
            <NavigationBar />
            <div className="search-page-container" style={{ margin: "0 0 0 75px" }}>
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
