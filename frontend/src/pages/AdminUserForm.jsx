import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeForm.css";

function AdminUserForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveUser = async (e) => {
        e.preventDefault();

        try {
            await api.post("/employees", {
                EmployeeName: `${formData.FirstName.trim()} ${formData.LastName.trim()}`,
                Title: null,
                IsApprover: 1
            });

            setSuccessMessage("User added successfully.");
            setErrorMessage("");
            setTimeout(() => {
                navigate("/admin-users");
            }, 800);
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to add user."
            );
            setSuccessMessage("");
        }
    };

    return (
        <>
            <Navbar />

            <div className="employee-form-container">
                <div className="employee-form-card">
                    <h1>Add User</h1>

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}

                    <form className="employee-form" onSubmit={saveUser}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="FirstName"
                                value={formData.FirstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="LastName"
                                value={formData.LastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={`${formData.FirstName.trim()}.${formData.LastName.trim()}`.toLowerCase()}
                                readOnly
                            />
                            <small>Administrator username is generated from first and last name and cannot be edited.</small>
                        </div>

                        {/* Role is managed by IsApprover flag; administrators/approvers are created with IsApprover=1 */}

                        <div className="button-row">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/admin-users")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                Add User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminUserForm;
