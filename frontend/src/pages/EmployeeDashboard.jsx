import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/EmployeeDashboard.css";

function EmployeeDashboard() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [selectedView, setSelectedView] = useState("employees");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        loadEmployees();
        loadApprovers();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadApprovers = async () => {
        try {
            const response = await api.get("/employees?isApprover=1");
            setApprovers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const deleteItem = async () => {
        if (!selectedItem) {
            return;
        }

        try {
            const path = selectedView === "employees"
                ? `/employees/${selectedItem.EmployeeID}`
                : `/employees/${selectedItem.EmployeeID}`;

            await api.delete(path);
            setShowDeleteModal(false);
            setSelectedItem(null);

            if (selectedView === "employees") {
                loadEmployees();
            } else {
                loadApprovers();
            }
        } catch (error) {
            console.error(error);
            alert("Unable to delete item.");
        }
    };

    const filteredEmployees = employees.filter((employee) =>
        (employee.EmployeeName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const filteredApprovers = approvers.filter((approver) =>
        (approver.EmployeeName || "")
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
                            <h1>
                                {selectedView === "employees"
                                    ? "Employee Management"
                                    : "Approver Management"}
                            </h1>
                            <p>
                                Total {selectedView === "employees" ? "Employees" : "Approvers"}: {selectedView === "employees" ? employees.length : approvers.length}
                            </p>
                        </div>

                        <div className="header-controls">
                            <label htmlFor="view-select">Show:</label>
                            <select
                                id="view-select"
                                value={selectedView}
                                onChange={(e) => setSelectedView(e.target.value)}
                            >
                                <option value="employees">Employees</option>
                                <option value="approvers">Approvers</option>
                            </select>

                            {selectedView === "employees" ? (
                                <button
                                    className="add-employee-btn"
                                    onClick={() => navigate("/employees/new")}
                                >
                                    + Add Employee
                                </button>
                            ) : (
                                <button
                                    className="add-employee-btn"
                                    onClick={() => navigate("/approvers/new")}
                                >
                                    + Add Approver
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="employees-toolbar">
                        <input
                            type="text"
                            placeholder="Search Employee..."
                            className="employee-search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {selectedView === "employees" ? (
                        <table className="employees-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">No Employees Found</td>
                                    </tr>
                                ) : (
                                    filteredEmployees.map((employee) => (
                                        <tr key={employee.EmployeeID}>
                                            <td>{employee.EmployeeName}</td>
                                            <td>{employee.Title}</td>
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
                                                    onClick={() => handleDeleteClick(employee)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="employees-table">
                            <thead>
                                <tr>
                                    <th>Approver Name</th>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApprovers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3">No Approvers Found</td>
                                    </tr>
                                ) : (
                                    filteredApprovers.map((approver) => (
                                        <tr key={approver.EmployeeID}>
                                            <td>{approver.EmployeeName}</td>
                                            <td>{approver.Title}</td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/approvers/edit/${approver.EmployeeID}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteClick(approver)}
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
            </div>

            {showDeleteModal && selectedItem && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Confirm Delete</h2>
                        <p>
                            Are you sure you want to delete {selectedItem.EmployeeName}?
                        </p>
                        <div className="modal-buttons">
                            <button className="submit-btn" onClick={deleteItem}>
                                Delete
                            </button>
                            <button
                                className="save-btn"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedItem(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EmployeeDashboard;
