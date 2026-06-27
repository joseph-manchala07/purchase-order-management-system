import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/CreatePO.css";

function CreatePO() {
    const [vendors, setVendors] = useState([]);

    const [VendorID, setVendorID] = useState("");
    const [PurchaseDescription, setPurchaseDescription] = useState("");
    const [ReasonForPurchase, setReasonForPurchase] = useState("");
    const [EstimatedCost, setEstimatedCost] = useState("");
    const [ActualCost, setActualCost] = useState("");
    const [InvoiceReceived, setInvoiceReceived] = useState(false);
    const [Notes, setNotes] = useState("");

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

    const savePO = async () => {
        try {
            const response = await api.post("/po", {
                EmployeeID: 10001,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                EstimatedCost,
                ActualCost,
                InvoiceReceived,
                Notes
            });

            alert(response.data.message);

            setVendorID("");
            setPurchaseDescription("");
            setReasonForPurchase("");
            setEstimatedCost("");
            setActualCost("");
            setInvoiceReceived(false);
            setNotes("");

        } catch (error) {
            console.error(error);
            alert("Error creating Purchase Order");
        }
    };

    return (
        <>
            <Navbar />

            <div className="create-po-container">

                <div className="create-po-card">

                    <h1>Create Purchase Order</h1>

                    <div className="form-group">
                        <label>Vendor</label>

                        <select
                            value={VendorID}
                            onChange={(e) => setVendorID(e.target.value)}
                        >
                            <option value="">
                                Select Vendor
                            </option>

                            {vendors.map((vendor) => (
                                <option
                                    key={vendor.VendorID}
                                    value={vendor.VendorID}
                                >
                                    {vendor.VendorName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Purchase Description</label>

                        <textarea
                            value={PurchaseDescription}
                            onChange={(e) =>
                                setPurchaseDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Reason For Purchase</label>

                        <textarea
                            value={ReasonForPurchase}
                            onChange={(e) =>
                                setReasonForPurchase(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Estimated Cost</label>

                        <input
                            type="number"
                            value={EstimatedCost}
                            onChange={(e) =>
                                setEstimatedCost(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Actual Cost</label>

                        <input
                            type="number"
                            value={ActualCost}
                            onChange={(e) =>
                                setActualCost(e.target.value)
                            }
                        />
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            checked={InvoiceReceived}
                            onChange={(e) =>
                                setInvoiceReceived(e.target.checked)
                            }
                        />

                        <label>
                            Invoice Received
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Notes</label>

                        <textarea
                            value={Notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className="save-btn"
                        onClick={savePO}
                    >
                        Create Purchase Order
                    </button>

                </div>

            </div>
        </>
    );
}

export default CreatePO;