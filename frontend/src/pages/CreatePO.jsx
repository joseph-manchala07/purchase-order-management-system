import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/CreatePO.css";

function CreatePO() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [EmployeeID, setEmployeeID] = useState("");
    const [ApprovedBy, setApprovedBy] = useState("");
    const [VendorID, setVendorID] = useState("");
    const [vendorSearch, setVendorSearch] = useState("");
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [approverSearch, setApproverSearch] = useState("");
    const [activeSearchField, setActiveSearchField] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [dataLoadError, setDataLoadError] = useState("");

    const [PurchaseDescription, setPurchaseDescription] = useState("");
    const [ReasonForPurchase, setReasonForPurchase] = useState("");
    const [EstimatedCost, setEstimatedCost] = useState("");

    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showApproverModal, setShowApproverModal] = useState(false);

    const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
    const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
    const [newEmployeeTitle, setNewEmployeeTitle] = useState("");

    const [newApproverFirstName, setNewApproverFirstName] = useState("");
    const [newApproverLastName, setNewApproverLastName] = useState("");
    const [newApproverTitle, setNewApproverTitle] = useState("");

    useEffect(() => {
        loadReferenceData();
    }, []);

    const loadReferenceData = async () => {
        setIsLoadingData(true);
        setDataLoadError("");

        const [employeesResult, approversResult, vendorsResult] = await Promise.allSettled([
            loadEmployees(),
            loadApprovers(),
            loadVendors()
        ]);

        const hasFailure = [employeesResult, approversResult, vendorsResult]
            .some((result) => result.status === "rejected");

        if (hasFailure) {
            setDataLoadError("Unable to load dropdown data. Please ensure server is running and click Retry.");
        }

        setIsLoadingData(false);
    };

    const filterByName = (items, key, query) => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return items;
        }

        return items.filter((item) =>
            String(item[key] || "")
                .toLowerCase()
                .includes(normalizedQuery)
        );
    };

    const filteredVendors = filterByName(vendors, "VendorName", vendorSearch);
    const filteredEmployees = filterByName(employees, "EmployeeName", employeeSearch);
    const filteredApprovers = filterByName(approvers, "EmployeeName", approverSearch);

    const updateSelectionFromSearch = (value, items, nameKey, idKey, setSearch, setId) => {
        setSearch(value);

        const exactMatch = items.find(
            (item) => String(item[nameKey] || "").toLowerCase() === value.trim().toLowerCase()
        );

        if (exactMatch) {
            setId(String(exactMatch[idKey]));
            return;
        }

        setId("");
    };

    const closeSearchList = (field) => {
        setTimeout(() => {
            setActiveSearchField((currentField) =>
                currentField === field ? null : currentField
            );
        }, 120);
    };

    const selectFromList = (field, name, id, setSearch, setId) => {
        setSearch(name);
        setId(String(id));
        setActiveSearchField((currentField) =>
            currentField === field ? null : currentField
        );
    };

    const loadEmployees = async () => {
        const response = await api.get("/employees");
        const data = response.data || [];
        setEmployees(data);
        return data;
    };

    const loadApprovers = async () => {
        const response = await api.get("/employees?isApprover=1");
        const data = response.data || [];
        setApprovers(data);
        return data;
    };

    const loadVendors = async () => {
        const response = await api.get("/vendors");
        const data = response.data || [];
        setVendors(data);
        return data;
    };

    const validateForm = () => {
        if (!VendorID) {
            alert("Please select a Vendor");
            return false;
        }

        if (!EmployeeID) {
            alert("Please select an Employee");
            return false;
        }

        if (!ApprovedBy) {
            alert("Please select an Approver");
            return false;
        }

        if (!PurchaseDescription.trim()) {
            alert("Purchase Description is required");
            return false;
        }

        if (!ReasonForPurchase.trim()) {
            alert("Reason For Purchase is required");
            return false;
        }

        if (!EstimatedCost || Number(EstimatedCost) <= 0) {
            alert("Estimated Cost must be greater than zero");
            return false;
        }

        return true;
    };

    const savePO = async () => {
        if (!validateForm()) return;

        try {
            const response = await api.post("/po", {
                EmployeeID,
                ApprovedBy,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                EstimatedCost
            });

            setSuccessMessage(
                `✅ Purchase Order #${response.data.poNumber} has been submitted for approval`
            );
            setErrorMessage("");

            setPurchaseDescription("");
            setReasonForPurchase("");
            setEstimatedCost("");
        } catch (error) {
            console.error(error);
            setSuccessMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to save Purchase Order"
            );
        }
    };

    const saveEmployee = async () => {
        if (!newEmployeeFirstName.trim() || !newEmployeeLastName.trim()) {
            alert("Employee first and last name are required");
            return;
        }

        try {
            const fullName = `${newEmployeeFirstName.trim()} ${newEmployeeLastName.trim()}`;

            await api.post("/employees", {
                EmployeeName: fullName,
                Title: newEmployeeTitle,
                IsApprover: 0
            });

            const updatedEmployees = await loadEmployees();
            const addedEmployee = updatedEmployees.find(
                (employee) =>
                    String(employee.EmployeeName || "").toLowerCase() === fullName.toLowerCase()
            );

            if (addedEmployee) {
                setEmployeeID(String(addedEmployee.EmployeeID));
                setEmployeeSearch(addedEmployee.EmployeeName || fullName);
            } else {
                setEmployeeSearch(fullName);
            }

            setNewEmployeeFirstName("");
            setNewEmployeeLastName("");
            setNewEmployeeTitle("");

            setShowEmployeeModal(false);
            setErrorMessage("");
            setSuccessMessage("✅ Employee added successfully.");
        } catch (error) {
            console.error(error);
            setSuccessMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to save employee"
            );
        }
    };

    const saveApprover = async () => {
        if (!newApproverFirstName.trim() || !newApproverLastName.trim()) {
            alert("Approver first and last name are required");
            return;
        }

        try {
            const fullName = `${newApproverFirstName.trim()} ${newApproverLastName.trim()}`;

            await api.post("/employees", {
                EmployeeName: fullName,
                Title: newApproverTitle,
                IsApprover: 1
            });

            const updatedApprovers = await loadApprovers();
            const addedApprover = updatedApprovers.find(
                (approver) =>
                    String(approver.EmployeeName || "").toLowerCase() === fullName.toLowerCase()
            );

            if (addedApprover) {
                setApprovedBy(String(addedApprover.EmployeeID));
                setApproverSearch(addedApprover.EmployeeName || fullName);
            } else {
                setApproverSearch(fullName);
            }

            setNewApproverFirstName("");
            setNewApproverLastName("");
            setNewApproverTitle("");

            setShowApproverModal(false);
            setErrorMessage("");
            setSuccessMessage("✅ Approver added successfully.");
        } catch (error) {
            console.error(error);
            setSuccessMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to save approver"
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="create-po-container">
                <div className="po-card">
                    <h1>Purchase Orders</h1>
                    {successMessage && (
                        <div className="success-message">{successMessage}</div>
                    )}

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    {isLoadingData && (
                        <div className="info-message">Loading vendor, employee, and approver data...</div>
                    )}

                    {dataLoadError && (
                        <div className="error-message">
                            {dataLoadError}
                            <button
                                type="button"
                                className="retry-btn"
                                onClick={loadReferenceData}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="po-header-grid">
                        <div className="left-section">
                            <div className="row">
                                <label>Vendor:</label>

                                <div className="search-select-group">
                                    <input
                                        type="text"
                                        placeholder="Search vendor by name"
                                        value={vendorSearch}
                                        onFocus={() => setActiveSearchField("vendor")}
                                        onBlur={() => closeSearchList("vendor")}
                                        onChange={(e) =>
                                            updateSelectionFromSearch(
                                                e.target.value,
                                                vendors,
                                                "VendorName",
                                                "VendorID",
                                                setVendorSearch,
                                                setVendorID
                                            )
                                        }
                                    />

                                    {activeSearchField === "vendor" && (
                                        <div className="search-dropdown-list">
                                            {filteredVendors.length > 0 ? (
                                                filteredVendors.map((vendor) => (
                                                    <button
                                                        key={vendor.VendorID}
                                                        type="button"
                                                        className="search-dropdown-item"
                                                        onMouseDown={() =>
                                                            selectFromList(
                                                                "vendor",
                                                                vendor.VendorName,
                                                                vendor.VendorID,
                                                                setVendorSearch,
                                                                setVendorID
                                                            )
                                                        }
                                                    >
                                                        {vendor.VendorName}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="search-dropdown-empty">
                                                    No matching vendor found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() => navigate("/vendors/new")}
                                >
                                    Add
                                </button>
                            </div>

                            <div className="row">
                                <label>Employee:</label>

                                <div className="search-select-group">
                                    <input
                                        type="text"
                                        placeholder="Search employee by name"
                                        value={employeeSearch}
                                        onFocus={() => setActiveSearchField("employee")}
                                        onBlur={() => closeSearchList("employee")}
                                        onChange={(e) =>
                                            updateSelectionFromSearch(
                                                e.target.value,
                                                employees,
                                                "EmployeeName",
                                                "EmployeeID",
                                                setEmployeeSearch,
                                                setEmployeeID
                                            )
                                        }
                                    />

                                    {activeSearchField === "employee" && (
                                        <div className="search-dropdown-list">
                                            {filteredEmployees.length > 0 ? (
                                                filteredEmployees.map((employee) => (
                                                    <button
                                                        key={employee.EmployeeID}
                                                        type="button"
                                                        className="search-dropdown-item"
                                                        onMouseDown={() =>
                                                            selectFromList(
                                                                "employee",
                                                                employee.EmployeeName,
                                                                employee.EmployeeID,
                                                                setEmployeeSearch,
                                                                setEmployeeID
                                                            )
                                                        }
                                                    >
                                                        {employee.EmployeeName}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="search-dropdown-empty">
                                                    No matching employee found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() => setShowEmployeeModal(true)}
                                >
                                    Add
                                </button>
                            </div>

                            <div className="row">
                                <label>Approve By:</label>

                                <div className="search-select-group">
                                    <input
                                        type="text"
                                        placeholder="Search approver by name"
                                        value={approverSearch}
                                        onFocus={() => setActiveSearchField("approver")}
                                        onBlur={() => closeSearchList("approver")}
                                        onChange={(e) =>
                                            updateSelectionFromSearch(
                                                e.target.value,
                                                approvers,
                                                "EmployeeName",
                                                "EmployeeID",
                                                setApproverSearch,
                                                setApprovedBy
                                            )
                                        }
                                    />

                                    {activeSearchField === "approver" && (
                                        <div className="search-dropdown-list">
                                            {filteredApprovers.length > 0 ? (
                                                filteredApprovers.map((approver) => (
                                                    <button
                                                        key={approver.EmployeeID}
                                                        type="button"
                                                        className="search-dropdown-item"
                                                        onMouseDown={() =>
                                                            selectFromList(
                                                                "approver",
                                                                approver.EmployeeName,
                                                                approver.EmployeeID,
                                                                setApproverSearch,
                                                                setApprovedBy
                                                            )
                                                        }
                                                    >
                                                        {approver.EmployeeName}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="search-dropdown-empty">
                                                    No matching approver found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() => setShowApproverModal(true)}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="right-section">
                            <div className="row">
                                <label>PO Number:</label>

                                <input
                                    value="Assigned Upon Submission"
                                    readOnly
                                />
                            </div>

                            <div className="row">
                                <label>PO Date:</label>

                                <input
                                    value={new Date().toLocaleDateString()}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="po-details">
                        <div className="row">
                            <label>Purchase Description:</label>

                            <input
                                type="text"
                                value={PurchaseDescription}
                                onChange={(e) => setPurchaseDescription(e.target.value)}
                            />
                        </div>

                        <div className="row">
                            <label>Reason For Purchase:</label>

                            <input
                                type="text"
                                value={ReasonForPurchase}
                                onChange={(e) => setReasonForPurchase(e.target.value)}
                            />
                        </div>

                        <div className="po-cost-grid">
                            <div className="row">
                                <label>Estimated Cost:</label>

                                <input
                                    type="number"
                                    value={EstimatedCost}
                                    onChange={(e) => setEstimatedCost(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="footer-row">
                        <div className="action-buttons">
                            <button
                                className="submit-btn"
                                onClick={savePO}
                            >
                                Submit For Approval
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEmployeeModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Employee</h2>

                        <div className="modal-field">
                            <label>First Name</label>

                            <input
                                value={newEmployeeFirstName}
                                onChange={(e) => setNewEmployeeFirstName(e.target.value)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Last Name</label>

                            <input
                                value={newEmployeeLastName}
                                onChange={(e) => setNewEmployeeLastName(e.target.value)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Title</label>

                            <input
                                value={newEmployeeTitle}
                                onChange={(e) => setNewEmployeeTitle(e.target.value)}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button
                                className="submit-btn"
                                onClick={saveEmployee}
                            >
                                Save
                            </button>

                            <button
                                className="save-btn"
                                onClick={() => setShowEmployeeModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showApproverModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>Add Approver</h2>

                        <div className="modal-field">
                            <label>First Name</label>

                            <input
                                value={newApproverFirstName}
                                onChange={(e) => setNewApproverFirstName(e.target.value)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Last Name</label>

                            <input
                                value={newApproverLastName}
                                onChange={(e) => setNewApproverLastName(e.target.value)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Title</label>

                            <input
                                value={newApproverTitle}
                                onChange={(e) => setNewApproverTitle(e.target.value)}
                            />
                        </div>

                        <div className="modal-buttons">
                            <button
                                className="submit-btn"
                                onClick={saveApprover}
                            >
                                Save
                            </button>

                            <button
                                className="save-btn"
                                onClick={() => setShowApproverModal(false)}
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

export default CreatePO;
