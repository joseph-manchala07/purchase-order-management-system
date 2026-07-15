import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/Dashboard.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get("/employees?isApprover=1");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (id) => {
        try {
            await api.post(`/employees/${id}/reset-password`);
            loadUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveAccess = async (id) => {
        try {
            await api.put(`/employees/${id}/revoke-admin`);
            loadUsers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header-row">
                    <h1>Approver Management</h1>
                </div>

                {loading ? (
                    <div>Loading users...</div>
                ) : (
                    <table className="po-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.EmployeeID}>
                                        <td>{user.EmployeeName}</td>
                                        <td>{user.Username || user.Email || `${user.FirstName}.${user.LastName}`.toLowerCase()}</td>
                                        <td>{user.Title || "-"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="edit-btn"
                                                onClick={() => handleResetPassword(user.EmployeeID)}
                                            >
                                                Reset Password
                                            </button>
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleRemoveAccess(user.EmployeeID)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default AdminUsers;
