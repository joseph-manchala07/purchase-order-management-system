import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import CreatePO from "./pages/CreatePO";
import MyPOs from "./pages/MyPOs";
import PODetails from "./pages/PODetails";
import Vendors from "./pages/Vendors";
import ApproverDashboard from "./pages/ApproverDashboard";
import ApprovedPO from "./pages/ApprovedPO";
import ApproverPODetails from "./pages/ApproverPODetails";
import VendorForm from "./pages/VendorForm";
import PendingApprovals from "./pages/PendingApprovals";
import ReviewPO from "./pages/ReviewPO";
import ApproverForm from "./pages/ApproverForm";
import AdminUsers from "./pages/AdminUsers";
import AdminUserForm from "./pages/AdminUserForm";
import TempAddUser from "./pages/TempAddUser";
import ChangePassword from "./pages/ChangePassword";

import EmployeeForm from "./pages/EmployeeForm";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<CreatePO />} />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/change-password"
                    element={<ChangePassword />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/employee-dashboard"
                    element={<EmployeeDashboard />}
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

                
                <Route
                    path="/employees"
                    element={<EmployeeDashboard />}
                />

                <Route
                    path="/employees/new"
                    element={<EmployeeForm />}
                />

                <Route
                    path="/employees/edit/:id"
                    element={<EmployeeForm />}
                />

                <Route
                    path="/approvers/new"
                    element={<ApproverForm />}
                />

                <Route
                    path="/approvers/edit/:id"
                    element={<ApproverForm />}
                />

                

                <Route
                    path="/admin-users"
                    element={<AdminUsers />}
                />

                <Route
                    path="/admin-users/new"
                    element={<AdminUserForm />}
                />
                <Route
                    path="/temp-add-user"
                    element={<TempAddUser />}
                />
                
                <Route
                    path="/pending-approvals"
                    element={<PendingApprovals />}
                />

                <Route
                    path="/review-po/:id"
                    element={<ReviewPO />}
                />



            </Routes>

        </BrowserRouter>
    );
}

export default App;