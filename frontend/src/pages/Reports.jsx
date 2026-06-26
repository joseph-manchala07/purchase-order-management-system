import Navbar from "../components/Navbar";

function Reports() {
    return (
        <>
            <Navbar />

            <div className="page-container">
                <h1>Reports</h1>

                <div className="summary-container">

                    <div className="summary-card">
                        <h3>Total Spend</h3>
                        <p>$125,000</p>
                    </div>

                    <div className="summary-card">
                        <h3>Monthly Spend</h3>
                        <p>$12,450</p>
                    </div>

                    <div className="summary-card">
                        <h3>Open POs</h3>
                        <p>15</p>
                    </div>

                    <div className="summary-card">
                        <h3>Completed POs</h3>
                        <p>102</p>
                    </div>

                </div>

                <h2>Department Spending</h2>

                <div className="summary-card">
                    Chart Placeholder
                </div>

                <h2>Vendor Spending</h2>

                <div className="summary-card">
                    Chart Placeholder
                </div>
            </div>
        </>
    );
}

export default Reports;