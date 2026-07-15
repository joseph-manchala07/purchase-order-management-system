import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/MyPOs.css";

function MyPOs() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isApproverView, setIsApproverView] = useState(false);

    useEffect(() => {
        loadPOs();
    }, []);

    const loadPOs = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const role = localStorage.getItem("role") || "Employee";

            if (!user?.EmployeeID) {
                setPurchaseOrders([]);
                return;
            }

            const approverView = role === "Approver" || role === "Administrator";
            setIsApproverView(approverView);

            const endpoint = approverView
                ? `/po/approver-history/${user.EmployeeID}`
                : `/po/my/${user.EmployeeID}`;

            const response = await api.get(endpoint);
            setPurchaseOrders(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />

            <div className="mypo-container">

                <div className="mypo-card">

                    <h1>{isApproverView ? "My Reviewed Purchase Orders" : "My Purchase Orders"}</h1>

                    <table className="mypo-table">

                        <thead>
                            <tr>
                                <th>PO Number</th>
                                {isApproverView && <th>Employee</th>}
                                <th>Vendor</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={isApproverView ? "6" : "5"}>
                                        No Purchase Orders Found
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map((po) => (
                                    <tr key={po.PO_ID}>
                                        <td>{po.PO_Number}</td>
                                        {isApproverView && <td>{po.EmployeeName}</td>}
                                        <td>{po.VendorName}</td>
                                        <td>{po.PurchaseDescription}</td>
                                        <td>${Number(po.EstimatedCost || 0).toFixed(2)}</td>
                                        <td>{po.Status}</td>
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