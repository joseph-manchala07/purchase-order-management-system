import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">

            <div className="logo">
                <h1>The Salvation Army</h1>
                <p>Purchase Order Management System</p>
            </div>

            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/create-po">Create PO</Link>
                <Link to="/my-pos">My Purchase Orders</Link>
                <Link to="/vendors">Vendors</Link>
                <Link to="/reports">Reports</Link>
                <Link to="/">Logout</Link>
            </div>

        </nav>
    );
}

export default Navbar;