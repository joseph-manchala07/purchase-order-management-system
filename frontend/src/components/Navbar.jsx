import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isAdministrator = role === "Administrator";
    const isApprover = role === "Approver" || isAdministrator;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">
                <h1>The Salvation Army</h1>
                <p>Purchase Order Management System</p>
            </div>

            <div className="nav-links">
                {isAdministrator ? (
                    <>
                        <Link to="/approver-dashboard">Pending Approvals</Link>
                        <Link to="/create-po">Create PO</Link>
                        <Link to="/my-pos">My Purchase Orders</Link>
                        <Link to="/vendors">Vendors</Link>
                        <Link to="/admin-users">Approver Accounts</Link>
                        <Link to="/employee-dashboard">Employees</Link>
                        <button
                            type="button"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : isApprover ? (
                    <>
                        <Link to="/approver-dashboard">Pending Approvals</Link>
                        <Link to="/create-po">Create PO</Link>
                        <Link to="/my-pos">My Purchase Orders</Link>
                        <Link to="/vendors">Vendors</Link>
                        <button
                            type="button"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : token ? (
                    <>
                        <Link to="/create-po">Create PO</Link>
                        <Link to="/vendors">Vendors</Link>
                        <button
                            type="button"
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/create-po">Create PO</Link>
                        <Link to="/vendors">Vendors</Link>
                        <Link to="/login">Admin Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;