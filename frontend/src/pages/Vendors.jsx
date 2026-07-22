import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/Vendors.css";

function Vendors() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "Employee";
    const canDeleteVendor = role === "Approver" || role === "Administrator";

    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const response = await api.get("/vendors");
            setVendors(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleDeleteClick = (vendor) => {
        setSelectedVendor(vendor);
        setShowDeleteModal(true);
    };

    const deleteVendor = async () => {
        if (!selectedVendor) {
            return;
        }

        try {

            await api.delete(
                `/vendors/${selectedVendor.VendorID}`
            );

            await loadVendors();
            setErrorMessage("");
            setStatusMessage(`✅ ${selectedVendor.VendorName} deleted successfully.`);
            setShowDeleteModal(false);
            setSelectedVendor(null);

        } catch (error) {

            console.error(error);

            setStatusMessage("");
            setErrorMessage(
                error.response?.data?.message ||
                "Unable to delete vendor."
            );

        }
    };
    const filteredVendors = vendors.filter((vendor) =>
        (vendor.VendorName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />

            <div className="vendors-container">

                <div className="vendors-card">

                    <div className="vendors-header">

                        <div>
                            <h1>Vendor Management</h1>

                            <p className="vendor-count">
                                Total Vendors: {vendors.length}
                            </p>
                        </div>

                        <button
                            className="add-vendor-btn"
                            onClick={() =>
                                navigate("/vendors/new")
                            }
                        >
                            + Add Vendor
                        </button>

                    </div>

                    <div className="vendor-toolbar">

                        {statusMessage && (
                            <div className="status-success">{statusMessage}</div>
                        )}

                        {errorMessage && (
                            <div className="status-error">{errorMessage}</div>
                        )}

                        <input
                            type="text"
                            className="vendor-search"
                            placeholder="Search Vendor..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <table className="vendors-table">

                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Contact</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredVendors.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        No Vendors Found
                                    </td>
                                </tr>
                            ) : (
                                filteredVendors.map((vendor) => (
                                    <tr key={vendor.VendorID}>

                                        <td>
                                            {vendor.VendorName}
                                        </td>

                                        <td>
                                            {vendor.ContactName}
                                        </td>

                                        <td>
                                            {vendor.Phone}
                                        </td>

                                        <td>
                                            {vendor.Email}
                                        </td>

                                        <td>
                                            {vendor.City}
                                        </td>

                                        <td>
                                            {vendor.State}
                                        </td>

                                        <td>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/vendors/edit/${vendor.VendorID}`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            {canDeleteVendor && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDeleteClick(vendor)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                    {showDeleteModal && selectedVendor && (
                        <div className="modal-overlay">
                            <div className="modal-card">
                                <h2>Confirm Delete</h2>
                                <p>
                                    Are you sure you want to delete {selectedVendor.VendorName}?
                                </p>
                                <div className="modal-buttons">
                                    <button className="submit-btn" onClick={deleteVendor}>
                                        Delete
                                    </button>
                                    <button
                                        className="save-btn"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                            setSelectedVendor(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
}

export default Vendors;