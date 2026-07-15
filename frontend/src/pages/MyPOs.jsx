import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/MyPOS.css";

function MyPOs() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [viewMode, setViewMode] = useState("employee"); // "admin" | "approver" | "employee"
    const navigate = useNavigate();

    useEffect(() => {
        loadPOs();
    }, []);

    const loadPOs = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const role = localStorage.getItem("role") || "Employee";

            if (role === "Administrator" || role === "Approver") {
                setViewMode("approver");
                if (!user?.EmployeeID) return;
                const response = await api.get(`/po/approver-history/${user.EmployeeID}`);
                setPurchaseOrders(response.data);
            } else {
                setViewMode("employee");
                if (!user?.EmployeeID) return;
                const response = await api.get(`/po/my/${user.EmployeeID}`);
                setPurchaseOrders(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const headings = {
        approver: "My Reviewed Purchase Orders",
        employee: "My Purchase Orders",
    };

    return (
        <>
            <Navbar />

            <div className="mypo-container">
                <div className="mypo-card">

                    <h1>{headings[viewMode]}</h1>

                    <table className="mypo-table">
                        <thead>
                            <tr>
                                <th>PO Number</th>
                                {viewMode === "approver" && <th>Employee</th>}
                                <th>Vendor</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={viewMode === "approver" ? 7 : 6}>
                                        No Purchase Orders Found
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map((po) => (
                                    <tr key={po.PO_ID}>
                                        <td>{po.PO_Number}</td>
                                            {viewMode === "approver" && <td>{po.EmployeeName}</td>}
                                        <td>{po.VendorName}</td>
                                        <td>{po.PurchaseDescription}</td>
                                        <td>${Number(po.EstimatedCost || 0).toFixed(2)}</td>
                                        <td>{po.Status}</td>
                                        {viewMode === "admin" && <td>{po.ApproverName || "—"}</td>}
                                        <td>
                                            {po.Status === "Approved" ? (
                                                <button
                                                    className="view-receipt-btn"
                                                    onClick={() => navigate(`/approved-po/${po.PO_ID}`)}
                                                >
                                                    View Receipt
                                                </button>
                                            ) : "—"}
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

export default MyPOs;