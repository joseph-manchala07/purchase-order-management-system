import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import "../styles/Login.css";

// Step 1: enter name → check approver
// Step 2 (same page): enter password + confirm
function FirstTimeSetup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1); // 1 = name check, 2 = set password
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleCheckApprover = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/auth/check-approver", { firstName, lastName });
            setStep(2);
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong.";
            setError(msg);
        }
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await api.post("/auth/first-time-setup", {
                firstName,
                lastName,
                newPassword,
                confirmPassword,
            });

            setSuccess("Password set successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>First Time User Setup</h1>

                {step === 1 && (
                    <>
                        <p style={{ color: "#555", marginBottom: "20px", fontSize: "14px" }}>
                            Enter your name to verify your account.
                        </p>

                        <form onSubmit={handleCheckApprover}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "#d9534f", marginBottom: "12px", fontWeight: "600" }}>
                                    {error}
                                </p>
                            )}

                            <button type="submit" className="submit-btn">
                                Continue
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p style={{ color: "#28a745", marginBottom: "20px", fontSize: "14px", fontWeight: "600" }}>
                            Approver verified. Set your password below.
                        </p>

                        <form onSubmit={handleSetPassword}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: "#d9534f", marginBottom: "12px" }}>{error}</p>
                            )}
                            {success && (
                                <p style={{ color: "#28a745", marginBottom: "12px" }}>{success}</p>
                            )}

                            <button type="submit" className="submit-btn">
                                Set Password
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                            style={{
                                marginTop: "10px",
                                width: "100%",
                                background: "transparent",
                                border: "1px solid #ccc",
                                padding: "11px 0",
                                borderRadius: "8px",
                                fontSize: "14px",
                                cursor: "pointer",
                                color: "#555",
                            }}
                        >
                            Back
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                        marginTop: "14px",
                        width: "100%",
                        background: "transparent",
                        border: "1px solid #ccc",
                        padding: "11px 0",
                        borderRadius: "8px",
                        fontSize: "14px",
                        cursor: "pointer",
                        color: "#555",
                    }}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default FirstTimeSetup;
