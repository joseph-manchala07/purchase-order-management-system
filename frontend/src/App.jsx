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
import TempAddUser from "./pages/TempAddUser";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeForm from "./pages/EmployeeForm";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CreatePO />} />
                <Route path="/login" element={<Login />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                    path="/employee-dashboard"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/create-po" element={<CreatePO />} />
                <Route
                    path="/my-pos"
                    element={
                        <ProtectedRoute allowedRoles={["Approver", "Administrator"]}>
                            <MyPOs />
                        </ProtectedRoute>
                    }
                />
                <Route path="/po/:id" element={<PODetails />} />

                <Route path="/vendors" element={<Vendors />} />

                <Route path="/vendors/new" element={<VendorForm />} />

                <Route path="/vendors/edit/:id" element={<VendorForm />} />

                <Route
                    path="/approver-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["Approver", "Administrator"]}>
                            <ApproverDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/approver-po/:id"
                    element={
                        <ProtectedRoute allowedRoles={["Approver", "Administrator"]}>
                            <ApproverPODetails />
                        </ProtectedRoute>
                    }
                />

                <Route path="/approved-po/:id" element={<ApprovedPO />} />

                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/new"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <EmployeeForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employees/edit/:id"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <EmployeeForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/approvers/new"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <ApproverForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/approvers/edit/:id"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <ApproverForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin-users"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/temp-add-user"
                    element={
                        <ProtectedRoute allowedRole="Administrator">
                            <TempAddUser />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pending-approvals"
                    element={
                        <ProtectedRoute allowedRoles={["Approver", "Administrator"]}>
                            <PendingApprovals />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;