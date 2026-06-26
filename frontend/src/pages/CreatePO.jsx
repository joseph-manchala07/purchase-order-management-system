import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/CreatePO.css";

function CreatePO() {
    const [vendors, setVendors] = useState([]);
    const [VendorID, setVendorID] = useState("");
    const [Description, setDescription] = useState("");
    const [Amount, setAmount] = useState("");

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
                UserID: 1,
                VendorID,
                Description,
                Amount
            });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert("Error creating PO");
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
                            <option value="">Select Vendor</option>

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
                        <label>Description</label>

                        <textarea
                            value={Description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Amount</label>

                        <input
                            type="number"
                            value={Amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                        />
                    </div>

                    <button
                        className="save-btn"
                        onClick={savePO}
                    >
                        Create PO
                    </button>

                </div>
            </div>
        </>
    );
}

export default CreatePO;