import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../styles/Login.css";

export default function Login() {
    const [form, setForm] = useState({ emailOrMobile: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.emailOrMobile || !form.password) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const res = await apiService.login({
                emailOrMobile: form.emailOrMobile,
                password: form.password
            });
            console.log("res:", res);
            if (res.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/dashboard");
            } else {
                setError(res.message || "Login failed.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="login-root">
            <div className="login-card">

                {/* accent bar */}
                <div className="login-accent-bar" />

                {/* logo */}
                <div className="login-logo-row">
                    <img
                        src="/icons/treel_logo.png"
                        alt="Treel Logo"
                        className="login-logo-img"
                    />
                </div>

                {/* header */}
                <div className="login-tag">Dashboard Access</div>
                <div className="login-title">Sign In</div>
                <div className="login-sub">Enter your credentials to continue</div>

                {/* email / Mobile */}
                <label className="login-label">Email or Mobile</label>
                <div className="login-input-wrap">
                    <input
                        className="login-input form-control"
                        type="text"
                        name="emailOrMobile"
                        placeholder="admin@example.com"
                        value={form.emailOrMobile}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="username"
                    />
                </div>

                {/* password */}
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                    <input
                        className="login-input form-control"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="current-password"
                    />
                    <button
                        className="login-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        )}
                    </button>
                </div>

                {/* error */}
                {error && (
                    <div className="login-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* submit */}
                <button
                    className="login-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="login-spinner" />
                            AUTHENTICATING...
                        </>
                    ) : (
                        "SIGN IN →"
                    )}
                </button>

                {/* footer */}
                <div className="login-divider">
                    <span className="login-footer-dot" />
                    <span className="login-footer-text">Secured with JWT Authentication</span>
                    <span className="login-footer-dot" />
                </div>

            </div>
        </div>
    );
}
