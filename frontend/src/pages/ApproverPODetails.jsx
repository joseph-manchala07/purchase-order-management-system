import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/ApproverPODetails.css";
import { useNavigate } from "react-router-dom";

function ApproverPODetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [po, setPO] = useState(null);

    const [successMessage, setSuccessMessage] =
    useState("");

    useEffect(() => {
        loadPO();
    }, []);

    const loadPO = async () => {

        try {

            const response =
                await api.get(`/po/details/${id}`);

            setPO(response.data);

        } catch (error) {

            console.error(error);

        }
    };


    const approvePO = async () => {

        try {

            await api.put(`/po/approve/${id}`);

            navigate(`/approved-po/${id}`);

        } catch (error) {

            console.error(error);

        }
    };


    const rejectPO = async () => {

        try {

            await api.put(
                `/po/reject/${id}`
            );

            setSuccessMessage(`❌ Purchase Order #${po.PO_Number} has been Rejected`);

            await loadPO();

        } catch (error) {

            console.error(error);

        }
    };

    if (!po) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "20px" }}>
                    Loading...
                </div>
            </>
        );
    }

    
return (
    <>
        <Navbar />

        <div className="approver-details-container">

            <div className="details-card">

                
                <h1>
                    Purchase Order #{po.PO_Number}
                </h1>

                {successMessage && (
                    <div className="status-message">
                        {successMessage}
                    </div>
                )}


                <div className="details-grid">

                    <div className="label">
                        Vendor
                    </div>

                    <div className="value">
                        {po.VendorName}
                    </div>

                    <div className="label">
                        Employee
                    </div>

                    <div className="value">
                        {po.EmployeeName}
                    </div>

                    <div className="label">
                        Approver
                    </div>

                    <div className="value">
                        {po.ApproverName}
                    </div>

                    <div className="label">
                        Estimated Cost
                    </div>

                    <div className="value">
                        ${Number(
                            po.EstimatedCost || 0
                        ).toFixed(2)}
                    </div>

                    <div className="label">
                        Status
                    </div>

                    <div
                        className={
                            po.Status === "Approved"
                                ? "status-approved"
                                : po.Status === "Rejected"
                                    ? "status-rejected"
                                    : "status-pending"
                        }
                    >
                        {po.Status}
                    </div>

                </div>

                <div className="section-title">
                    Purchase Description
                </div>

                <div className="section-box">
                    {po.PurchaseDescription}
                </div>

                <div className="section-title">
                    Reason For Purchase
                </div>

                <div className="section-box">
                    {po.ReasonForPurchase}
                </div>

                {po.Status ===
                    "Pending Approval" && (

                    <div className="approval-buttons">

                        <button
                            className="approve-btn"
                            onClick={approvePO}
                        >
                            Approve
                        </button>

                        <button
                            className="reject-btn"
                            onClick={rejectPO}
                        >
                            Reject
                        </button>

                    </div>
                )}
            </div>
        </div>
    </> 
    );
}

export default ApproverPODetails;