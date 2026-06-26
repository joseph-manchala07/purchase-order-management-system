import { useEffect, useState } from "react";
import api from "../Services/api";

function Vendors() {

  const [vendors, setVendors] =
    useState([]);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {

    const response =
      await api.get("/vendors");

    setVendors(response.data);
  };

  return (

            <div className="page-container">
            <div className="content-wrapper">

                <PageHeader
                title="Vendors"
                buttonText="Add Vendor"
                />

                <Card>

                <table className="app-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                </tr>
                </thead>

                <tbody>

                {vendors.map(v => (

                    <tr key={v.VendorID}>
                    <td>{v.VendorName}</td>
                    <td>{v.ContactPerson}</td>
                    <td>{v.Email}</td>
                    </tr>

                ))}

                </tbody>
                </table>

                </Card>



            <div className="card">

                <table>
                

            </table>

            </div>

        </div>

      

    </div>
  );
}

export default Vendors;