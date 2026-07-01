import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/ApprovedPO.css";
import logo from "../images/logo.jpg"

function ApprovedPO() {

    const { id } = useParams();

    const [po, setPO] = useState(null);

    useEffect(() => {
        loadPO();
    }, []);

    const loadPO = async () => {

        try {

            const response =
                await api.get(`/po/approved/${id}`);

            setPO(response.data);

        } catch (error) {

            console.error(error);

        }
    };

    const printPO = () => {
        window.print();
    };

    if (!po) {
        return (
            <>
                <Navbar />
                <div className="approved-po-wrapper">
                    Loading...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="approved-po-wrapper">

                <div className="approved-banner no-print">
                    ✅ Purchase Order #{po.PO_Number} has been Approved
                </div>

                <button
                    className="print-btn no-print"
                    onClick={printPO}
                >
                    Print
                </button>

                <div className="po-print-page">

                    <div className="po-header">

                        <img
                            src={logo}
                            alt="The Salvation Army"
                            className="sa-logo"
                        />

                        <div className="po-title-row">

                            <div>
                                <strong>
                                    Purchase Order #
                                </strong>
                                {" "}
                                {po.PO_Number}
                            </div>

                            <div>
                                <strong>
                                    Date
                                </strong>
                                {" "}
                                {new Date(
                                    po.CreatedDate
                                ).toLocaleDateString()}
                            </div>

                        </div>

                    </div>

                    <div className="vendor-box">

                        <div className="vendor-right">

                            <div className="field-row">
                                <div className="field-label">
                                    Vendor
                                </div>

                                <div className="field-value">
                                    {po.VendorName}
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-label">
                                    Address
                                </div>

                                <div className="field-value">

                                    
                                    {po.Address1}
                                    {po.Address2 && (
                                        <>
                                            <br />
                                            {po.Address2}
                                        </>
                                    )}

                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-label">
                                    City
                                </div>

                                <div className="field-value">
                                    {po.City}
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-label">
                                    State
                                </div>

                                <div className="field-value">
                                    {po.State}
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-label">
                                    ZIP
                                </div>

                                <div className="field-value">
                                    {po.ZipCode}
                                </div>
                            </div>

                        </div>

                        <div className="vendor-right">

                            <div className="field-row">
                                <div className="field-label">
                                    Phone
                                </div>

                                <div className="field-value">
                                    {po.Phone}
                                </div>
                            </div>

                            <div className="field-row">
                                <div className="field-label">
                                    Fax
                                </div>

                                <div className="field-value">
                                    {po.Fax}
                                </div>
                            </div>

                            <div className="field-row notes-row">

                                <div className="field-label">
                                    Notes
                                </div>

                                <div className="field-value notes-box">
                                    {po.Notes}
                                </div>

                            </div>

                        </div>

                    </div>

                    <table className="purchase-table">

                        <thead>

                            <tr>

                                <th>
                                    Purchase Description
                                </th>

                                <th>
                                    Reason For Purchase
                                </th>

                                <th>
                                    Est Cost Of Purchase
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>
                                    {po.PurchaseDescription}
                                </td>

                                <td>
                                    {po.ReasonForPurchase}
                                </td>

                                <td className="money">
                                    $
                                    {Number(
                                        po.EstimatedCost || 0
                                    ).toFixed(2)}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                    <div className="total-line">

                        <strong>
                            Total Estimated Cost Of Purchase
                        </strong>

                        <span>
                            $
                            {Number(
                                po.EstimatedCost || 0
                            ).toFixed(2)}
                        </span>

                    </div>

                

                    <div className="signature-section">

                        <div className="signature-column">

                            

                            <div className="signature-name">
                                {po.ApproverName}
                            </div>

                            <div className="signature-line"></div>

                            <div className="signature-role">
                                {po.Title}
                            </div>

                        </div>

                        <div className="signature-column">


                            <div className="signature-name">
                                {po.EmployeeName}
                            </div>

                            <div className="signature-line"></div>

                            <div className="signature-role">
                                {po.Title}
                            </div>

                        </div>

                    </div>
                                            
                    

                        <div className="po-footer">

                            <div>
                                {new Date(
                                    po.CreatedDate
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}
                            </div>

                            <div>
                                Page 1 of 1
                            </div>

                        </div>
                    </div>

            </div>
        </>
    );
}

export default ApprovedPO;