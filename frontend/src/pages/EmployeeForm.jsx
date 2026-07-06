import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeForm.css";

function EmployeeForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        EmployeeName: "",
        Title: "",
        Active: 1
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

            setFormData({
                EmployeeName:
                    response.data.EmployeeName || "",
                Title:
                    response.data.Title || "",
                Active:
                    response.data.Active ?? 1
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.name === "Active"
                    ? Number(e.target.value)
                    : e.target.value
        });
    };

    const saveEmployee = async (e) => {
        e.preventDefault();

        try {

            if (id) {

                await api.put(
                    `/employees/${id}`,
                    formData
                );

            } else {

                await api.post(
                    "/employees",
                    formData
                );

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

                            <label>
                                Employee Name
                            </label>

                            <input
                                type="text"
                                name="EmployeeName"
                                value={
                                    formData.EmployeeName
                                }
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
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Active</label>

                            <select
                                name="Active"
                                value={formData.Active}
                                onChange={handleChange}
                            >
                                <option value="1">
                                    Yes
                                </option>
                                <option value="0">
                                    No
                                </option>
                            </select>

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