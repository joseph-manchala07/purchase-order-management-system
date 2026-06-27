import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import CreatePO from "./pages/CreatePO";
import MyPOs from "./pages/MyPOs";
import PODetails from "./pages/PODetails";
import Vendors from "./pages/Vendors";
import Reports from "./pages/Reports";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/employee-dashboard"
                    element={<EmployeeDashboard />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/create-po"
                    element={<CreatePO />}
                />

                <Route
                    path="/my-pos"
                    element={<MyPOs />}
                />

                <Route
                    path="/po/:id"
                    element={<PODetails />}
                />

                <Route
                    path="/vendors"
                    element={<Vendors />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;