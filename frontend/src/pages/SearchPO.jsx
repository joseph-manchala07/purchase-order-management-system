import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/SearchPO.css";

function SearchPO() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Load all POs on mount
    useEffect(() => {
        api.get("/po/all")
            .then((res) => setResults(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!query.trim()) {
                // Empty search → reload all
                const res = await api.get("/po/all");
                setResults(res.data);
            } else {
                const res = await api.get("/po/search", { params: { q: query.trim() } });
                setResults(res.data);
            }
        } catch (error) {
            console.error(error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="search-po-container">
                <div className="search-po-card">

                    <h1>Search Purchase Orders</h1>

                    <form onSubmit={handleSearch} className="search-po-form">
                        <input
                            type="text"
                            placeholder="Search by PO number, description, vendor or employee..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-po-input"
                        />
                        <button type="submit" className="search-po-btn">
                            Search
                        </button>
                    </form>

                    {loading ? (
                        <p className="search-po-msg">Loading...</p>
                    ) : (
                        <table className="search-po-table">
                            <thead>
                                <tr>
                                    <th>PO #</th>
                                    <th>Employee</th>
                                    <th>Vendor</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="search-po-msg">
                                            No purchase orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    results.map((po) => (
                                        <tr key={po.PO_ID}>
                                            <td>{po.PO_Number}</td>
                                            <td>{po.EmployeeName}</td>
                                            <td>{po.VendorName}</td>
                                            <td>{po.PurchaseDescription}</td>
                                            <td>${Number(po.EstimatedCost || 0).toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge status-${(po.Status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                                                    {po.Status}
                                                </span>
                                            </td>
                                            <td>
                                                {po.Status === "Approved" ? (
                                                    <button
                                                        className="receipt-btn"
                                                        onClick={() => navigate(`/approved-po/${po.PO_ID}`)}
                                                    >
                                                        View &amp; Print
                                                    </button>
                                                ) : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                </div>
            </div>
        </>
    );
}

export default SearchPO;
