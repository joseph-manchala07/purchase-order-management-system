import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeForm.css";

function TempAddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Title: "",
    IsApprover: 0
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    });
  };

  const saveUser = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", {
        EmployeeName: `${formData.FirstName.trim()} ${formData.LastName.trim()}`,
        Title: formData.Title,
        IsApprover: formData.IsApprover
      });

      setSuccessMessage("Temporary user created successfully.");
      setErrorMessage("");
      setFormData({
        FirstName: "",
        LastName: "",
        Title: "",
        IsApprover: 0
      });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Failed to create user.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Navbar />

      <div className="employee-form-container">
        <div className="employee-form-card">
          <h1>Temp Add User</h1>

          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              <label>Title</label>
              <input
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              />
            </div>

            {formData.IsApprover === 1 && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={`${formData.FirstName.trim()}.${formData.LastName.trim()}`.toLowerCase()}
                  readOnly
                />
                <small>Approver username is generated from first and last name and cannot be edited.</small>
              </div>
            )}

            <div className="form-group">
              <label>Administrator</label>
              <input
                type="checkbox"
                name="IsApprover"
                checked={formData.IsApprover === 1}
                onChange={handleChange}
              />
            </div>

            <div className="button-row">
              <button type="button" className="cancel-btn" onClick={() => navigate("/login")}>Cancel</button>
              <button type="submit" className="save-btn">Create User</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TempAddUser;
