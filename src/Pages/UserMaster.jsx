import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../Styles/UserMaster.css";

const ZONES = ["NZ", "SZ", "WZ", "EZ", "CZ", "TZ"];

// ── Edit User Modal ─────────────────────────────────────────
const EditUserModal = ({ user, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        name:     user.name     || "",
        email:    user.email    || "",
        mobile:   user.mobile   || "",
        address:  user.address  || "",
        zone:     user.zone     || "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.mobile || !form.address) {
            setError("Name, Email, Mobile and Address are required.");
            return;
        }
        if (user.roleLevel === 4 && !form.zone) {
            setError("Zone is required for ZM.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                name:    form.name,
                email:   form.email,
                mobile:  form.mobile,
                address: form.address,
                ...(user.roleLevel === 4 && { zone: form.zone }),
                ...(form.password   && { password: form.password })
            };
            const res = await apiService.updateUser(user._id, payload);
            if (res.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.message || "Failed to update user.");
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
                    <h5 className="um-modal-title">Edit User</h5>
                    <button className="um-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="um-modal-body">
                    {error && <div className="um-form-error">{error}</div>}

                    <div className="um-form-row">
                        <label className="um-form-label">Name <span className="um-req">*</span></label>
                        <input className="um-form-input" name="name"
                               value={form.name} onChange={handleChange} placeholder="Enter Name" />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Email <span className="um-req">*</span></label>
                        <input className="um-form-input" name="email"
                               value={form.email} onChange={handleChange} placeholder="Enter Email" />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Mobile <span className="um-req">*</span></label>
                        <input className="um-form-input" name="mobile"
                               value={form.mobile} onChange={handleChange} placeholder="Enter Mobile" />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Address <span className="um-req">*</span></label>
                        <input className="um-form-input" name="address"
                               value={form.address} onChange={handleChange} placeholder="Enter Address" />
                    </div>

                    {/* Zone — only for ZM */}
                    {user.roleLevel === 4 && (
                        <div className="um-form-row">
                            <label className="um-form-label">Zone <span className="um-req">*</span></label>
                            <select className="um-form-input" name="zone"
                                    value={form.zone} onChange={handleChange}>
                                <option value="">Select Zone</option>
                                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="um-form-row">
                        <label className="um-form-label">Password <span className="um-optional">(leave blank to keep old password)</span></label>
                        <input className="um-form-input" name="password" type="password" autoComplete="new-password"
                               value={form.password} onChange={handleChange} placeholder="Enter new password" />
                    </div>
                </div>
                <div className="um-modal-footer">
                    <button className="um-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="um-save-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Add User Modal ──────────────────────────────────────────
const AddUserModal = ({ onClose, onSuccess }) => {
    const [roles, setRoles]         = useState([]);
    const [admins, setAdmins]       = useState([]);
    const [form, setForm]           = useState({
        name: "", email: "", mobile: "", password: "",
        roleId: "", zone: "", customerId: ""
    });
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");

    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        apiService.getRoles().then(res => {
            if (res.success) setRoles(res.data);
        }).catch(() => {});
    }, []);

    const handleRoleChange = (e) => {
        const roleId = e.target.value;
        const role   = roles.find(r => r._id === roleId);
        setSelectedRole(role || null);
        setForm({ ...form, roleId, zone: "", customerId: "" });

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
                name:     form.name,
                email:    form.email,
                mobile:   form.mobile,
                password: form.password,
                address:  "-",
                roleId:   form.roleId,
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

                    <div className="um-form-row">
                        <label className="um-form-label">Role <span className="um-req">*</span></label>
                        <select className="um-form-input" value={form.roleId} onChange={handleRoleChange}>
                            <option value="">Please Select</option>
                            {roles.map(r => (
                                <option key={r._id} value={r._id}>{r.roleName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Name <span className="um-req">*</span></label>
                        <input className="um-form-input" name="name" placeholder="Enter Name"
                               value={form.name} onChange={handleChange} />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Email <span className="um-req">*</span></label>
                        <input className="um-form-input" name="email" placeholder="Enter Email" autoComplete="new-email"
                               value={form.email} onChange={handleChange} />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Mobile <span className="um-req">*</span></label>
                        <input className="um-form-input" name="mobile" placeholder="Enter Mobile No"
                               value={form.mobile} onChange={handleChange} />
                    </div>
                    <div className="um-form-row">
                        <label className="um-form-label">Password <span className="um-req">*</span></label>
                        <input className="um-form-input" name="password" type="password" autoComplete="new-password"
                               placeholder="Enter Password" value={form.password} onChange={handleChange} />
                    </div>

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
                    <button className="um-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="um-save-btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Confirm Modal ───────────────────────────────────────────
const ConfirmModal = ({ user, onClose, onConfirm, loading }) => {
    const isActive = user.activeStatus;
    return (
        <div className="um-overlay">
            <div className="um-modal um-modal-sm">
                <div className={`um-modal-header ${isActive ? "um-modal-header-danger" : "um-modal-header-success"}`}>
                    <h5 className="um-modal-title">
                        {isActive ? "Deactivate User" : "Reactivate User"}
                    </h5>
                    <button className="um-modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="um-modal-body">
                    <p className="um-confirm-text">
                        {isActive
                            ? <>Are you sure you want to deactivate <strong>{user.name}</strong>?</>
                            : <>Are you sure you want to reactivate <strong>{user.name}</strong>?</>
                        }
                    </p>
                </div>
                <div className="um-modal-footer">
                    <button className="um-cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className={`um-save-btn ${!isActive ? "um-save-btn-success" : ""}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : isActive ? "Delete" : "Reactivate"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── User Master Page ────────────────────────────────────────
const UserMaster = () => {
    const navigate = useNavigate();
    const [users, setUsers]           = useState([]);
    const [loading, setLoading]       = useState(true);
    const [showAddModal, setShowAddModal]       = useState(false);
    const [editUser, setEditUser]     = useState(null);
    const [confirmUser, setConfirmUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = () => {
        setLoading(true);
        apiService.getUsers().then(res => {
            if (res.success) setUsers(res.data);
        }).catch(() => {}).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleStatus = async () => {
        if (!confirmUser) return;
        setActionLoading(true);
        try {
            const res = await apiService.deleteUser(confirmUser._id);
            if (res.success) {
                fetchUsers();
                setConfirmUser(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

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
                <button className="um-add-btn" onClick={() => setShowAddModal(true)}>
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
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="um-empty">No users found.</td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.roleName}</td>
                                    <td>{user.email || "—"}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.zone || "—"}</td>
                                    <td>
                                            <span className={`um-badge ${user.activeStatus ? "um-badge-active" : "um-badge-inactive"}`}>
                                                {user.activeStatus ? "Active" : "Inactive"}
                                            </span>
                                    </td>
                                    <td>
                                        <div className="um-actions">
                                            {/* Deactivate / Reactivate */}
                                            {user.activeStatus ? (
                                                <button
                                                    className="um-action-btn um-action-Deactivate"
                                                    onClick={() => setConfirmUser(user)}
                                                    title="Deactivate User"
                                                >
                                                    {/* trash icon */}
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                        <path d="M10 11v6M14 11v6"/>
                                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button
                                                    className="um-action-btn um-action-reactivate"
                                                    onClick={() => setConfirmUser(user)}
                                                    title="Reactivate User"
                                                >
                                                    {/* person+ icon */}
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                                        <circle cx="9" cy="7" r="4"/>
                                                        <line x1="19" y1="8" x2="19" y2="14"/>
                                                        <line x1="16" y1="11" x2="22" y2="11"/>
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Edit */}
                                            <button
                                                className="um-action-btn um-action-edit"
                                                onClick={() => setEditUser(user)}
                                                title="Edit User"
                                            >
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Modals ── */}
            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={fetchUsers}
                />
            )}
            {editUser && (
                <EditUserModal
                    user={editUser}
                    onClose={() => setEditUser(null)}
                    onSuccess={fetchUsers}
                />
            )}
            {confirmUser && (
                <ConfirmModal
                    user={confirmUser}
                    onClose={() => setConfirmUser(null)}
                    onConfirm={handleToggleStatus}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};
export default UserMaster;
