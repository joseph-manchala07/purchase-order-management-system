import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/MyPOs.css";

function MyPOs() {
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    useEffect(() => {
        loadPOs();
    }, []);

    const loadPOs = async () => {
        try {
            const response = await api.get("/po/my/1");
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

                    <h1>My Purchase Orders</h1>

                    <table className="mypo-table">

                        <thead>
                            <tr>
                                <th>PO Number</th>
                                <th>Vendor</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {purchaseOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        No Purchase Orders Found
                                    </td>
                                </tr>
                            ) : (
                                purchaseOrders.map((po) => (
                                    <tr key={po.POID}>
                                        <td>{po.PONumber}</td>
                                        <td>{po.VendorName}</td>
                                        <td>{po.Description}</td>
                                        <td>${po.Amount}</td>
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