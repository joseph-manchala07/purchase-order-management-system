import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/PendingApprovals.css";

function PendingApprovals() {

    const navigate = useNavigate();

    const [purchaseOrders, setPurchaseOrders] =
        useState([]);

    useEffect(() => {
        loadPendingPOs();
    }, []);

    const loadPendingPOs = async () => {
        try {

            const response =
                await api.get(
                    "/purchaseorders/pending"
                );

            setPurchaseOrders(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    return (
        <>
            <Navbar />

            <div className="pending-container">

                <div className="pending-card">

                    <div className="pending-header">

                        <h1>
                            Pending Approvals
                        </h1>

                    </div>

                    <table className="pending-table">

                        <thead>

                            <tr>
                                <th>PO #</th>
                                <th>Date</th>
                                <th>Employee</th>
                                <th>Vendor</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6">
                                        No Pending Purchase Orders
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map((po) => (
                                    <tr
                                        key={po.POID}
                                    >
                                        <td>
                                            {po.PO_Number}
                                        </td>

                                        <td>
                                            {new Date(
                                                po.CreatedDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td>
                                            {po.EmployeeName}
                                        </td>

                                        <td>
                                            {po.VendorName}
                                        </td>

                                        <td>
                                            $
                                            {Number(
                                                po.EstimatedCost || 0
                                            ).toFixed(2)}
                                        </td>

                                        <td>

                                            <button
                                                className="review-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/review-po/${po.POID}`
                                                    )
                                                }
                                            >
                                                Review
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

export default PendingApprovals;