import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeForm.css";

function ApproverForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Title: "",
    });

    useEffect(() => {
        if (id) {
            loadApprover();
        }
    }, [id]);

    const loadApprover = async () => {
        try {
            const response = await api.get(`/employees/${id}`);
            const nameParts = (response.data.EmployeeName || "").split(" ");
            const firstName = nameParts.shift() || "";
            const lastName = nameParts.join(" ") || "";

            setFormData({
                FirstName: firstName,
                LastName: lastName,
                Title: response.data.Title || "",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveApprover = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                EmployeeName: `${formData.FirstName.trim()} ${formData.LastName.trim()}`,
                Title: formData.Title,
                IsApprover: 1
            };

            if (id) {
                await api.put(`/employees/${id}`, payload);
            } else {
                await api.post("/employees", payload);
            }
            navigate("/employees");
        } catch (error) {
            console.error(error);
            alert("Failed to save approver.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="employee-form-container">
                <div className="employee-form-card">
                    <h1>{id ? "Edit Approver" : "Add Approver"}</h1>

                    <form className="employee-form" onSubmit={saveApprover}>
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
                            <small>Approver username is generated from first and last name and cannot be edited.</small>
                        </div>

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

                        {/* Active flag removed; employees are either present or deleted */}

                        <div className="button-row">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate("/employees")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                Save Approver
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ApproverForm;
