import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import POTable from "../components/POTable";

function EmployeeDashboard() {

    const recentOrders = [
        {
            id: 1,
            poNumber: "PO-1001",
            vendor: "Amazon",
            amount: 450,
            status: "Submitted"
        },
        {
            id: 2,
            poNumber: "PO-1002",
            vendor: "CDW",
            amount: 1800,
            status: "Approved"
        }
    ];

    return (
        <>
            <Navbar />

            <div className="page-container">

                <h1>Welcome, Joseph Manchala</h1>

                <p>Information Technology</p>

                <SummaryCards />

                <h2>Recent Purchase Orders</h2>

                <POTable data={recentOrders} />

            </div>
        </>
    );
}

export default EmployeeDashboard;