import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DashboardHeader = () => {
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const profileRef = useRef(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const roleLevel = user?.roleLevel || 4;

    // close logout on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowLogout(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (err) {
            console.error('[logout] API error:', err.message);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
    };

    return (
        <header className="dashboard-header">
            <img
                src="/treel_logo.png"
                alt="Treel Logo"
                className="dashboard-logo"
            />
            <h4 className="dashboard-title">Smart Tyre Dashboard</h4>

            {/* ── Right side ── */}
            <div className="dh-right">


                {/* Upload Icon — System Admin only */}
                {roleLevel === 2 && (
                    <button
                        className="dh-icon-btn"
                        onClick={() => navigate("/upload")}
                        title="Upload Data"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </button>
                )}

                {/* Add User Icon — hidden for ZM */}
                {roleLevel < 4 && (
                    <button
                        className="dh-icon-btn"
                        onClick={() => navigate("/users")}
                        title="User Master"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="16" y1="11" x2="22" y2="11"/>
                        </svg>
                    </button>
                )}

                <div className="dh-divider" />

                {/* Profile — hover/click shows logout */}
                <div
                    className="dh-profile"
                    ref={profileRef}
                    onClick={() => setShowLogout(!showLogout)}
                >
                    <div className="dh-avatar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <div className="dh-user-info">
                        <span className="dh-user-name">{user?.name || "User"}</span>
                        <span className="dh-user-role">{user?.roleName || ""}</span>
                    </div>

                    {/* Logout dropdown */}
                    {showLogout && (
                        <div className="dh-logout-popup">
                            <button className="dh-logout-btn" onClick={handleLogout}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
