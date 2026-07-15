import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/CreatePO.css";

function CreatePO() {
    const [employees, setEmployees] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [EmployeeID, setEmployeeID] = useState("");
    const [ApprovedBy, setApprovedBy] = useState("");
    const [VendorID, setVendorID] = useState("");
    const [successMessage, setSuccessMessage] =    useState("");


    const [PurchaseDescription, setPurchaseDescription] = useState("");
    const [ReasonForPurchase, setReasonForPurchase] = useState("");
    const [EstimatedCost, setEstimatedCost] = useState("");


    const [showEmployeeModal, setShowEmployeeModal] =
        useState(false);

    const [showApproverModal, setShowApproverModal] =
        useState(false);

    const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
    const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
    const [newEmployeeTitle, setNewEmployeeTitle] = useState("");

    const [newApproverFirstName, setNewApproverFirstName] = useState("");
    const [newApproverLastName, setNewApproverLastName] = useState("");
    const [newApproverTitle, setNewApproverTitle] = useState("");

    const [poNumber, setPoNumber] = useState("");

    useEffect(() => {
        loadEmployees();
        loadApprovers();
        loadVendors();
        loadNextPONumber();
    }, []);
    
    const loadNextPONumber = async () => {
        try {

            const response =
                await api.get("/po/next-number");

            setPoNumber(response.data.poNumber);

            return response.data.poNumber;

        } catch (error) {

            console.error(error);

            return null;
        }
    };

    const loadEmployees = async () => {
        try {
            const response =
                await api.get("/employees");

            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadApprovers = async () => {
        try {
            // Load approvers from Employees where IsApprover = 1
            const response = await api.get("/employees?isApprover=1");
            setApprovers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadVendors = async () => {
        try {
            const response =
                await api.get("/vendors");

            setVendors(response.data);
        } catch (error) {
            console.error(error);
        }
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
                `✅ Purchase Order #${response.data.poNumber} has been submitted for Approval`
            );

            await loadNextPONumber();

            setPurchaseDescription("");
            setReasonForPurchase("");
            setEstimatedCost("");


        } catch (error) {
            console.error(error);
            alert("Failed to save Purchase Order");
        }
    };

    const saveEmployee = async () => {
        if (!newEmployeeFirstName.trim() || !newEmployeeLastName.trim()) {
            alert("Employee first and last name are required");
            return;
        }

        try {
            await api.post("/employees", {
                EmployeeName: `${newEmployeeFirstName.trim()} ${newEmployeeLastName.trim()}`,
                Title: newEmployeeTitle,
                IsApprover: 0
            });

            await loadEmployees();

            setNewEmployeeFirstName("");
            setNewEmployeeLastName("");
            setNewEmployeeTitle("");

            setShowEmployeeModal(false);

        } catch (error) {
            console.error(error);
            alert("Failed to save employee");
        }
    };

    const saveApprover = async () => {
        if (!newApproverFirstName.trim() || !newApproverLastName.trim()) {
            alert("Approver first and last name are required");
            return;
        }

        try {
            await api.post("/employees", {
                EmployeeName: `${newApproverFirstName.trim()} ${newApproverLastName.trim()}`,
                Title: newApproverTitle,
                IsApprover: 1
            });

            await loadApprovers();

            setNewApproverFirstName("");
            setNewApproverLastName("");
            setNewApproverTitle("");

            setShowApproverModal(false);

        } catch (error) {
            console.error(error);
            alert("Failed to save approver");
        }
    };

    return (
        <>
            <Navbar />

            <div className="create-po-container">

                <div className="po-card">

                    <h1>Purchase Orders</h1>
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    <div className="po-header-grid">

                        <div className="left-section">

                            <div className="row">
                                <label>Vendor:</label>

                                <select
                                    value={VendorID}
                                    onChange={(e) =>
                                        setVendorID(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Vendor
                                    </option>

                                    {vendors.map(vendor => (
                                        <option
                                            key={vendor.VendorID}
                                            value={vendor.VendorID}
                                        >
                                            {vendor.VendorName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="row">
                                <label>Employee:</label>

                                <select
                                    value={EmployeeID}
                                    onChange={(e) =>
                                        setEmployeeID(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Employee
                                    </option>

                                    {employees.map(employee => (
                                        <option
                                            key={employee.EmployeeID}
                                            value={employee.EmployeeID}
                                        >
                                            {employee.EmployeeName}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() =>
                                        setShowEmployeeModal(true)
                                    }
                                >
                                    Add
                                </button>
                            </div>

                            <div className="row">
                                <label>Approve By:</label>

                                <select
                                    value={ApprovedBy}
                                    onChange={(e) =>
                                        setApprovedBy(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Approver
                                    </option>

                                    {approvers.map(approver => (
                                        <option
                                            key={approver.EmployeeID}
                                            value={approver.EmployeeID}
                                        >
                                            {approver.EmployeeName}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={() =>
                                        setShowApproverModal(true)
                                    }
                                >
                                    Add
                                </button>
                            </div>

                        </div>

                        <div className="right-section">

                            <div className="row">
                                <label>PO #:</label>

                                <input
                                    value={poNumber}
                                    readOnly
                                />
                            </div>

                            <div className="row">
                                <label>PO Date:</label>

                                <input
                                    value={
                                        new Date()
                                            .toLocaleDateString()
                                    }
                                    readOnly
                                />
                            </div>

                        </div>

                    </div>

                    <div className="po-details">

                        <div className="row">
                            <label>
                                Purchase Description:
                            </label>

                            <input
                                type="text"
                                value={PurchaseDescription}
                                onChange={(e) =>
                                    setPurchaseDescription(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="row">
                            <label>
                                Reason For Purchase:
                            </label>

                            <input
                                type="text"
                                value={ReasonForPurchase}
                                onChange={(e) =>
                                    setReasonForPurchase(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="po-cost-grid">

                            <div className="row">
                                <label>
                                    Estimated Cost:
                                </label>

                                <input
                                    type="number"
                                    value={EstimatedCost}
                                    onChange={(e) =>
                                        setEstimatedCost(
                                            e.target.value
                                        )
                                    }
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
                                onChange={(e) =>
                                    setNewEmployeeFirstName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="modal-field">
                            <label>Last Name</label>

                            <input
                                value={newEmployeeLastName}
                                onChange={(e) =>
                                    setNewEmployeeLastName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="modal-field">
                            <label>Title</label>

                            <input
                                value={newEmployeeTitle}
                                onChange={(e) =>
                                    setNewEmployeeTitle(
                                        e.target.value
                                    )
                                }
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
                                onClick={() =>
                                    setShowEmployeeModal(false)
                                }
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
                                onChange={(e) =>
                                    setNewApproverFirstName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="modal-field">
                            <label>Last Name</label>

                            <input
                                value={newApproverLastName}
                                onChange={(e) =>
                                    setNewApproverLastName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="modal-field">
                            <label>Username</label>

                            <input
                                type="text"
                                value={`${newApproverFirstName.trim()}.${newApproverLastName.trim()}`.toLowerCase()}
                                readOnly
                            />
                        </div>

                        <div className="modal-field">
                            <label>Title</label>

                            <input
                                value={newApproverTitle}
                                onChange={(e) =>
                                    setNewApproverTitle(
                                        e.target.value
                                    )
                                }
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
                                onClick={() =>
                                    setShowApproverModal(false)
                                }
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