import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeDashboard.css";

function EmployeeDashboard() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            await api.delete(`/employees/${employeeId}`);
            loadEmployees();
        } catch (error) {
            console.error(error);
            alert("Unable to delete employee.");
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        (employee.EmployeeName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />

            <div className="employees-container">

                <div className="employees-card">

                    <div className="employees-header">

                        <div>
                            <h1>Employee Management</h1>
                            <p>
                                Total Employees: {employees.length}
                            </p>
                        </div>

                        <button
                            className="add-employee-btn"
                            onClick={() =>
                                navigate("/employees/new")
                            }
                        >
                            + Add Employee
                        </button>

                    </div>

                    <div className="employees-toolbar">

                        <input
                            type="text"
                            placeholder="Search Employee..."
                            className="employee-search"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                    <table className="employees-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="4">
                                        No Employees Found
                                    </td>
                                </tr>
                            ) : (
                                filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.EmployeeID}
                                    >
                                        <td>
                                            {
                                                employee.EmployeeName
                                            }
                                        </td>

                                        <td>
                                            {employee.Title}
                                        </td>

                                        <td>
                                            {employee.Active
                                                ? "Yes"
                                                : "No"}
                                        </td>

                                        <td>

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/employees/edit/${employee.EmployeeID}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteEmployee(
                                                        employee.EmployeeID
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}

export default EmployeeDashboard;
