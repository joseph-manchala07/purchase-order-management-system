import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../Services/api";
import "../styles/VendorForm.css";

function VendorForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        VendorName: "",
        ContactName: "",
        Phone: "",
        Fax: "",
        Email: "",
        Address1: "",
        City: "",
        State: "",
        ZipCode: "",
        Notes: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (id) {
            loadVendor();
        }
    }, [id]);

    const loadVendor = async () => {
        try {
            const response = await api.get(`/vendors/${id}`);

            setFormData({
                VendorName: response.data.VendorName || "",
                ContactName: response.data.ContactName || "",
                Phone: response.data.Phone || "",
                Fax: response.data.Fax || "",
                Email: response.data.Email || "",
                Address1: response.data.Address1 || "",
                City: response.data.City || "",
                State: response.data.State || "",
                ZipCode: response.data.ZipCode || "",
                Notes: response.data.Notes || ""
            });
        } catch (error) {
            console.error(error);

            setErrorMessage(
                "Unable to load vendor information."
            );
        }
    };
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const saveVendor = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await api.put(
                    `/vendors/${id}`,
                    formData
                );

                setSuccessMessage(
                    "✅ Vendor updated successfully."
                );
            } else {
                await api.post(
                    "/vendors",
                    formData
                );

                setSuccessMessage(
                    "✅ Vendor added successfully."
                );
            }

            setErrorMessage("");

            setTimeout(() => {
                navigate("/vendors");
            }, 1000);

        } catch (error) {
            console.error(error);

            setSuccessMessage("");

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to save vendor."
            );
        }
    };

    return (
        <>
            <Navbar />

            <div className="vendor-form-container">

                <div className="vendor-form-card">

                    <h1>
                        {id
                            ? "Edit Vendor"
                            : "Add Vendor"}
                    </h1>

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}

                    <form
                        className="vendor-form"
                        onSubmit={saveVendor}
                    >

                        <div className="form-grid">

                            <input
                                type="text"
                                name="VendorName"
                                placeholder="Vendor Name *"
                                value={formData.VendorName}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="ContactName"
                                placeholder="Contact Name"
                                value={formData.ContactName}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="Phone"
                                placeholder="Phone"
                                value={formData.Phone}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="Fax"
                                placeholder="Fax"
                                value={formData.Fax}
                                onChange={handleChange}
                            />

                            <input
                                type="email"
                                name="Email"
                                placeholder="Email"
                                value={formData.Email}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="Address1"
                                placeholder="Address Line 1"
                                value={formData.Address1}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="City"
                                placeholder="City"
                                value={formData.City}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="State"
                                placeholder="State"
                                value={formData.State}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="ZipCode"
                                placeholder="Zip Code"
                                value={formData.ZipCode}
                                onChange={handleChange}
                            />

                            <textarea
                                name="Notes"
                                rows="5"
                                placeholder="Notes"
                                value={formData.Notes}
                                onChange={handleChange}
                            ></textarea>

                        </div>

                        <div className="button-row">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    navigate("/vendors")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-btn"
                            >
                                {id
                                    ? "Update Vendor"
                                    : "Save Vendor"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    );
}

export default VendorForm;