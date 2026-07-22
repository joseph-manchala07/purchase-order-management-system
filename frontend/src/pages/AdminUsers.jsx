import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/Dashboard.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleResetPasswordClick = (user) => {
        setSelectedUser(user);
        setShowResetModal(true);
    };

    const handleResetPassword = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            const response = await api.post(`/employees/${selectedUser.EmployeeID}/reset-password`);
            await loadUsers();

            setErrorMessage("");
            setSuccessMessage(
                `✅ Password reset for ${selectedUser.EmployeeName}. Reset to: ${response.data?.resetTo || "First Time Setup"}.`
            );
            setShowResetModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error(error);

            setSuccessMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to reset password."
            );
        }
    };

    const handleRemoveAccessClick = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleRemoveAccess = async () => {
        if (!selectedUser) {
            return;
        }

        try {
            await api.put(`/employees/${selectedUser.EmployeeID}/revoke-admin`);
            await loadUsers();

            setErrorMessage("");
            setSuccessMessage(`✅ Access removed for ${selectedUser.EmployeeName}.`);
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error(error);

            setSuccessMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to remove access."
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header-row">
                    <h1>Approver Management</h1>
                </div>

                {successMessage && (
                    <div className="status-success">{successMessage}</div>
                )}

                {errorMessage && (
                    <div className="status-error">{errorMessage}</div>
                )}

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
                                                onClick={() => handleResetPasswordClick(user)}
                                            >
                                                Reset Password
                                            </button>
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleRemoveAccessClick(user)}
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

                {showDeleteModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <h2>Confirm Delete</h2>
                            <p>
                                Are you sure you want to delete {selectedUser.EmployeeName}?
                            </p>
                            <div className="modal-buttons">
                                <button className="submit-btn" onClick={handleRemoveAccess}>
                                    Delete
                                </button>
                                <button
                                    className="save-btn"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showResetModal && selectedUser && (
                    <div className="modal-overlay">
                        <div className="modal-card">
                            <h2>Confirm Reset Password</h2>
                            <p>
                                Are you sure you want to reset password for {selectedUser.EmployeeName}?
                            </p>
                            <div className="modal-buttons">
                                <button className="submit-btn" onClick={handleResetPassword}>
                                    Reset Password
                                </button>
                                <button
                                    className="save-btn"
                                    onClick={() => {
                                        setShowResetModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminUsers;
