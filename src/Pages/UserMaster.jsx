import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../Styles/UserMaster.css";

// ── Add User Modal ──────────────────────────────────────────
const AddUserModal = ({ onClose, onSuccess }) => {
    const [roles, setRoles] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [form, setForm] = useState({
        name: "", email: "", mobile: "", password: "",
        roleId: "", zone: "", customerId: ""
    });
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const ZONES = ["NZ", "SZ", "WZ", "EZ", "CZ", "TZ"];

    useEffect(() => {
        apiService.getRoles().then(res => {
            if (res.success) setRoles(res.data);
        }).catch(() => {});
    }, []);

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        const role = roles.find(r => r._id === roleId);
        setSelectedRole(role || null);
        setForm({ ...form, roleId, zone: "", customerId: "" });

        // if System Admin creating ZM → fetch admins
        if (loggedInUser.roleLevel === 2 && role?.roleLevel === 4) {
            apiService.getAdmins().then(res => {
                if (res.success) setAdmins(res.data);
            }).catch(() => {});
        } else {
            setAdmins([]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.mobile || !form.password || !form.roleId) {
            setError("Please fill all required fields.");
            return;
        }
        if (selectedRole?.roleLevel === 4 && !form.zone) {
            setError("Zone is required for ZM.");
            return;
        }
        if (loggedInUser.roleLevel === 2 && selectedRole?.roleLevel === 4 && !form.customerId) {
            setError("Please select an Admin to manage this ZM.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                password: form.password,
                address: "-",
                roleId: form.roleId,
                ...(selectedRole?.roleLevel === 4 && { zone: form.zone }),
                ...(loggedInUser.roleLevel === 2 && selectedRole?.roleLevel === 4 && { customerId: form.customerId })
            };
            const res = await apiService.addUser(payload);
            if (res.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.message || "Failed to add user.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="um-overlay">
            <div className="um-modal">
                <div className="um-modal-header">
                    <h5 className="um-modal-title">User Details</h5>
                    <button className="um-modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="um-modal-body">
                    {error && <div className="um-form-error">{error}</div>}

                    {/* Role */}
                    <div className="um-form-row">
                        <label className="um-form-label">Role <span className="um-req">*</span></label>
                        <select className="um-form-input" value={form.roleId} onChange={handleRoleChange}>
                            <option value="">Please Select</option>
                            {roles.map(r => (
                                <option key={r._id} value={r._id}>{r.roleName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Name */}
                    <div className="um-form-row">
                        <label className="um-form-label">Name <span className="um-req">*</span></label>
                        <input className="um-form-input" name="name" placeholder="Enter Name"
                               value={form.name} onChange={handleChange} />
                    </div>

                    {/* Email */}
                    <div className="um-form-row">
                        <label className="um-form-label">Email <span className="um-req">*</span></label>
                        <input className="um-form-input" name="email" placeholder="Enter Email"
                               value={form.email} onChange={handleChange} />
                    </div>

                    {/* Mobile */}
                    <div className="um-form-row">
                        <label className="um-form-label">Mobile <span className="um-req">*</span></label>
                        <input className="um-form-input" name="mobile" placeholder="Enter Mobile No"
                               value={form.mobile} onChange={handleChange} />
                    </div>

                    {/* Password */}
                    <div className="um-form-row">
                        <label className="um-form-label">Password <span className="um-req">*</span></label>
                        <input className="um-form-input" name="password" type="password"
                               placeholder="Enter Password" value={form.password} onChange={handleChange} />
                    </div>

                    {/* Zone — only for ZM */}
                    {selectedRole?.roleLevel === 4 && (
                        <div className="um-form-row">
                            <label className="um-form-label">Zone <span className="um-req">*</span></label>
                            <select className="um-form-input" name="zone"
                                    value={form.zone} onChange={handleChange}>
                                <option value="">Select Zone</option>
                                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Admin dropdown — only System Admin creating ZM */}
                    {loggedInUser.roleLevel === 2 && selectedRole?.roleLevel === 4 && (
                        <div className="um-form-row">
                            <label className="um-form-label">Admin <span className="um-req">*</span></label>
                            <select className="um-form-input" name="customerId"
                                    value={form.customerId} onChange={handleChange}>
                                <option value="">Select Admin</option>
                                {admins.map(a => (
                                    <option key={a._id} value={a._id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="um-modal-footer">
                    <button className="um-save-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── User Master Page ────────────────────────────────────────
const UserMaster = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = () => {
        setLoading(true);
        apiService.getUsers().then(res => {
            if (res.success) setUsers(res.data);
        }).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="um-page">

            {/* ── Header ── */}
            <div className="um-header">
                <div className="um-header-left">
                    <button className="um-back-btn" onClick={() => navigate("/dashboard")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Back
                    </button>
                    <div className="um-header-divider"/>
                    <h4 className="um-title">User Master</h4>
                </div>
                <button className="um-add-btn" onClick={() => setShowModal(true)}>
                    + Add User
                </button>
            </div>

            {/* ── Table ── */}
            <div className="um-table-wrap">
                {loading ? (
                    <div className="um-loading">Loading...</div>
                ) : (
                    <table className="um-table">
                        <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Name</th>
                            <th>Role Name</th>
                            <th>E-Mail</th>
                            <th>Mobile No</th>
                            <th>Zone</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="um-empty">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.roleName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.zone || "—"}</td>
                                    <td>
                                            <span className={`um-badge ${user.activeStatus ? "um-badge-active" : "um-badge-inactive"}`}>
                                                {user.activeStatus ? "Active" : "Inactive"}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Add User Modal ── */}
            {showModal && (
                <AddUserModal
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

export default UserMaster;
