import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole, allowedRoles = [] }) {
    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    const roles = Array.isArray(allowedRoles) && allowedRoles.length > 0
        ? allowedRoles
        : [allowedRole].filter(Boolean);

    const allowed = roles.includes(role);

    if (!allowed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
