import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Dashboard</h1>

        <div className="summary-grid">

          <div className="summary-card">
            <h3>Total POs</h3>
            <h1>24</h1>
          </div>

          <div className="summary-card">
            <h3>Pending</h3>
            <h1>3</h1>
          </div>

          <div className="summary-card">
            <h3>Approved</h3>
            <h1>18</h1>
          </div>

          <div className="summary-card">
            <h3>Rejected</h3>
            <h1>3</h1>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;