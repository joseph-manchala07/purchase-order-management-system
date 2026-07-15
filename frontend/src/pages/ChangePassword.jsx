import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api"
import "../styles/Login.css";

function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setError("You must be logged in to change your password.");
      return;
    }

    try {
      await api.put(
        `/employees/${user.EmployeeID}/change-password`,
        {
          newPassword,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Password changed successfully. Redirecting...");
      setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role === "Administrator") {
          navigate("/approver-dashboard");
        } else {
          navigate("/create-po");
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Change Password</h1>
        <form onSubmit={handleSubmit}>

           <div className="form-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          </div>
          <div className="form-group">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          </div>
          <button type="submit" className="submit-btn">
                    Change Password
                    </button>
        </form>
        {error && <p style={{ color: "#d9534f" }}>{error}</p>}
        {success && <p style={{ color: "#28a745" }}>{success}</p>}
      </div>
    </div>
  );
}

export default ChangePassword;
