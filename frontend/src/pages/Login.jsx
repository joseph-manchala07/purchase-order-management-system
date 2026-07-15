import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../styles/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email: username,
                password
            });

            const role = response.data.role || response.data.user?.Role || "Employee";
            const user = response.data.user || null;

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", role);

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            if (response.data.forcePasswordChange) {
                navigate("/change-password");
                return;
            }

            if (role === "Administrator" || role === "Approver") {
                navigate("/approver-dashboard");
            } else {
                navigate("/create-po");
            }
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Purchase Order Management System</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;