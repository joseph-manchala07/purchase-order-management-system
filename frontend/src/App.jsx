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
import ApproverDashboard from "./pages/ApproverDashboard";
import ApprovedPO from "./pages/ApprovedPO";
import ApproverPODetails from "./pages/ApproverPODetails";
import VendorForm from "./pages/VendorForm";


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
                    path="/vendors/new"
                    element={<VendorForm />}
                />

                
                <Route
                    path="/vendors/edit/:id"
                    element={<VendorForm />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />
                <Route
                    path="/approver-dashboard"
                    element={<ApproverDashboard />}
                />
                
                <Route
                    path="/approver-po/:id"
                    element={<ApproverPODetails />}
                />

                
                <Route
                    path="/approved-po/:id"
                    element={<ApprovedPO />}
                />


            </Routes>

        </BrowserRouter>
    );
}

export default App;