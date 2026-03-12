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
                src="/icons/treel_logo.png"
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
                        <img src="/icons/upload.png" alt="Upload" />
                    </button>
                )}

                {/* Add User Icon — hidden for ZM */}
                {roleLevel < 4 && (
                    <button
                        className="dh-icon-btn"
                        onClick={() => navigate("/users")}
                        title="User Master"
                    >
                        <img src="/icons/addUser.png" alt="Upload" />
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
                        <img src="/icons/profile.png" alt="Upload" />
                    </div>
                    <div className="dh-user-info">
                        <span className="dh-user-name">{user?.name || "User"}</span>
                        <span className="dh-user-role">{user?.roleName || ""}</span>
                    </div>

                    {/* Logout dropdown */}
                    {showLogout && (
                        <div className="dh-logout-popup">
                            <button className="dh-logout-btn" onClick={handleLogout}>
                                <img src="/icons/logout.png" alt="Upload" />
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
