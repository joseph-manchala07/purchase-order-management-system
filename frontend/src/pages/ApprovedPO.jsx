import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/ApprovedPO.css";
import logo from "../images/logo.jpg";

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

            console.log(response.data);
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


                <div className="po-print-page">

                    <div className="po-body">

                        <div className="po-header">

                            <img
                                src={logo}
                                alt="The Salvation Army"
                                className="sa-logo"
                            />

                            
                            <div className="po-title-row">

                                <div className="po-title-left">
                                    Purchase Order # {po.PO_Number}
                                </div>

                                <div className="po-title-right">
                                    Date {new Date(po.CreatedDate).toLocaleDateString()}
                                </div>

                            </div>


                        </div>

                        <div className="vendor-box">

                            {/* Row 1 */}
                            <div className="field-label">Vendor</div>
                            <div className="field-value">{po.VendorName}</div>

                            <div className="field-label">Phone</div>
                            <div className="field-value">{po.Phone}</div>

                            {/* Row 2 */}
                            <div className="field-label">Address</div>
                            <div className="field-value">{po.Address1}</div>

                            <div className="field-label">Fax</div>
                            <div className="field-value">{po.Fax}</div>

                            {/* Row 3 */}
                            <div className="field-label">City</div>
                            <div className="field-value">{po.City}</div>

                            <div
                                className="field-label"
                                style={{ gridRow: "span 3" }}
                            >
                                Notes
                            </div>

                            <div
                                className="field-value notes-box"
                                style={{ gridRow: "span 3" }}
                            >
                                {po.Notes}
                            </div>

                            {/* Row 4 */}
                            <div className="field-label">State</div>
                            <div className="field-value">{po.State}</div>

                            {/* Row 5 */}
                            <div className="field-label">ZIP</div>
                            <div className="field-value">{po.ZipCode}</div>

                        </div>
                        
                        <table className="purchase-table">

                            <thead>
                                <tr>
                                    <th>Purchase Description</th>
                                    <th>Reason for Purchase</th>
                                    <th>Est cost of purchase</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>{po.PurchaseDescription}</td>

                                    <td>{po.ReasonForPurchase}</td>

                                    <td className="money">
                                        $
                                        {Number(
                                            po.EstimatedCost || 0
                                        ).toFixed(2)}
                                    </td>
                                </tr>

                                <tr className="total-row">

                                    <td colSpan="2" className="total-label">
                                        Total estimated cost of purchase
                                    </td>

                                    <td className="money total-cost">
                                        $
                                        {Number(
                                            po.EstimatedCost || 0
                                        ).toFixed(2)}
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                        

                        <div className="signature-section">
                            <div className="signature-column">

                                <div className="signature-heading">
                                    Approved By
                                </div>

                                <div className="signature-name">
                                    {po.ApproverName}
                                </div>

                                <div className="signature-line"></div>

                                <div className="signature-role">
                                    {po.ApproverTitle}
                                </div>

                            </div>

                            <div className="signature-column">

                                <div className="signature-heading">
                                    Employee Requesting PO
                                </div>

                                <div className="signature-name">
                                    {po.EmployeeName}
                                </div>

                                <div className="signature-line"></div>

                                <div className="signature-role">
                                    {po.EmployeeTitle}
                                </div>

                            </div>

                        </div>
                        
                        <div className="po-footer">

                            <div className="footer-left">
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

                            <div className="footer-right">
                                Page 1 of 1
                            </div>

                        </div>


                    </div>

                </div>
            </div>
            <button
                className="print-btn no-print"
                onClick={printPO}
            >
                Print
            </button>
            
        </>
    );
}

export default ApprovedPO;