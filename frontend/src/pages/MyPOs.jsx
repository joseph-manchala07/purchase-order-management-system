import { useEffect, useState } from "react";
import api from "../Services/api";

function MyPOs() {

  const [purchaseOrders,
    setPurchaseOrders] =
    useState([]);

  useEffect(() => {

    loadPOs();

  }, []);

  const loadPOs = async () => {

    const response =
      await api.get("/po/my/1");

    setPurchaseOrders(
      response.data
    );
  };

  return (
    <div>

      <h2>My Purchase Orders</h2>

      <table>

        <thead>

          <tr>
            <th>PO Number</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {purchaseOrders.map(po => (

            <tr key={po.POID}>

              <td>{po.PONumber}</td>
              <td>{po.VendorName}</td>
              <td>${po.Amount}</td>
              <td>{po.Status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default MyPOs;