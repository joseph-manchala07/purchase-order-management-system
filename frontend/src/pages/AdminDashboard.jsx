import Navbar from "../components/Navbar";

function AdminDashboard() {
    return (
        <>
            <Navbar />

            <div className="page-container">

                <h1>Admin Dashboard</h1>

                <div className="summary-container">

                    <div className="summary-card">
                        <h3>Pending Approvals</h3>
                        <p>8</p>
                    </div>

                    <div className="summary-card">
                        <h3>Approved Today</h3>
                        <p>12</p>
                    </div>

                    <div className="summary-card">
                        <h3>Rejected Today</h3>
                        <p>2</p>
                    </div>

                    <div className="summary-card">
                        <h3>Total Vendors</h3>
                        <p>85</p>
                    </div>

                </div>

                <h2>Recent Approval Activity</h2>

                <table className="po-table">
                    <thead>
                        <tr>
                            <th>PO Number</th>
                            <th>Employee</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>PO-1001</td>
                            <td>Joseph Manchala</td>
                            <td>Approved</td>
                            <td>06/26/2026</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default AdminDashboard;