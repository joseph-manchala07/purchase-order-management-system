import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeForm.css";

function EmployeeForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Title: "",
        IsApprover: 0
    });

    useEffect(() => {
        if (id) {
            loadEmployee();
        }
    }, [id]);

    const loadEmployee = async () => {
        try {
            const response = await api.get(
                `/employees/${id}`
            );

            const nameParts = (response.data.EmployeeName || "").split(" ");
            const firstName = nameParts.shift() || "";
            const lastName = nameParts.join(" ") || "";

            setFormData({
                FirstName: firstName,
                LastName: lastName,
                Title: response.data.Title || "",
                IsApprover: Number(response.data.IsApprover) === 1 ? 1 : 0
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value
        });
    };

    const saveEmployee = async (e) => {
        e.preventDefault();

        const payload = {
            EmployeeName: `${formData.FirstName.trim()} ${formData.LastName.trim()}`,
            Title: formData.Title,
            IsApprover: formData.IsApprover ? 1 : 0
        };

        try {
            if (id) {
                await api.put(`/employees/${id}`, payload);
            } else {
                await api.post("/employees", payload);
            }
            navigate("/employees");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="employee-form-container">

                <div className="employee-form-card">

                    <h1>
                        {id
                            ? "Edit Employee"
                            : "Add Employee"}
                    </h1>

                    <form
                        className="employee-form"
                        onSubmit={saveEmployee}
                    >

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
                            <label>Title</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Approver</label>
                            <input
                                type="checkbox"
                                name="IsApprover"
                                checked={formData.IsApprover === 1}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="button-row">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/employees")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                Save Employee
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    );
}

export default EmployeeForm;