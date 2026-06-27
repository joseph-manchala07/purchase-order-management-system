import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/Vendors.css";

function Vendors() {
    const [vendors, setVendors] = useState([]);

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

    return (
        <>
            <Navbar />

            <div className="vendors-container">

                <div className="vendors-card">

                    <div className="vendors-header">
                        <h1>Vendors</h1>

                        <button className="add-vendor-btn">
                            Add Vendor
                        </button>
                    </div>

                    <table className="vendors-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Email</th>
                            </tr>
                        </thead>

                        <tbody>

                            {vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="3">
                                        No Vendors Found
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor.VendorID}>
                                        <td>{vendor.VendorName}</td>
                                        <td>{vendor.ContactPerson}</td>
                                        <td>{vendor.Email}</td>
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

export default Vendors;
