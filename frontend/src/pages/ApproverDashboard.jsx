import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/ApproverDashboard.css";

function ApproverDashboard() {

    const [purchaseOrders, setPurchaseOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        if (!storedUser?.EmployeeID) {
            setLoading(false);
            return;
        }

        loadPendingPOs(storedUser.EmployeeID);
    }, []);

    const loadPendingPOs = async (approverId) => {
        try {

            const response = await api.get(
                "/po/pending",
                {
                    params: { approverId }
                }
            );

            setPurchaseOrders(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Navbar />

            <div className="approver-dashboard">

                <div className="dashboard-card">

                    <div className="dashboard-header">

                        <h1>
                            Pending Purchase Orders
                        </h1>

                        <div className="record-count">

                            Records:
                            {" "}
                            {purchaseOrders.length}

                        </div>

                    </div>

                    {loading ? (

                        <div className="empty-message">
                            Loading...
                        </div>

                    ) : purchaseOrders.length === 0 ? (

                        <div className="empty-message">
                            No Purchase Orders Pending Approval
                        </div>

                    ) : (

                        <table className="po-table">

                            <thead>

                                <tr>

                                    <th>PO #</th>
                                    <th>Employee</th>
                                    <th>Vendor</th>
                                    <th>Description</th>
                                    <th>Estimated Cost</th>
                                    <th>Status</th>
                                    <th>Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {purchaseOrders.map((po) => (

                                    <tr key={po.PO_ID}>

                                        <td>
                                            {po.PO_Number}
                                        </td>

                                        <td>
                                            {po.EmployeeName}
                                        </td>

                                        <td>
                                            {po.VendorName}
                                        </td>

                                        <td>
                                            {po.PurchaseDescription}
                                        </td>

                                        <td>
                                            $
                                            {Number(
                                                po.EstimatedCost || 0
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {po.Status}
                                        </td>

                                        <td>

                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/approver-po/${po.PO_ID}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>
        </>
    );
}

export default ApproverDashboard;