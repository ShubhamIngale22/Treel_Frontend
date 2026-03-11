import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../Styles/UploadPage.css";

const UploadPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { success, message, count }
    const [error, setError] = useState("");

    const handleFileSelect = (selected) => {
        setResult(null);
        setError("");
        if (!selected) return;
        const ext = selected.name.split(".").pop().toLowerCase();
        if (!["xlsx", "xls","csv"].includes(ext)) {
            setError("Only Excel (.xlsx, .xls) or CSV  (.csv) files are allowed.");
            return;
        }
        setFile(selected);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        handleFileSelect(dropped);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await apiService.uploadExcel(formData);
            if (res.success) {
                setResult({ success: true, message: res.message, count: res.data });
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                setError(res.message || "Upload failed.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setError("");
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="up-page">

            {/* ── Header ── */}
            <div className="up-header">
                <div className="up-header-left">
                    <button className="up-back-btn" onClick={() => navigate("/dashboard")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Back
                    </button>
                    <div className="up-header-divider"/>
                    <h4 className="up-title">Upload Dealer Sells Data</h4>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="up-body">
                <div className="up-card">

                    {/* info */}
                    <div className="up-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>Upload a file containing dealer sells billing data (supported formats: .xlsx, .xls, .csv).</span>
                    </div>

                    {/* drop zone */}
                    <div
                        className={`up-dropzone ${dragging ? "up-dropzone-active" : ""} ${file ? "up-dropzone-filled" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />

                        {file ? (
                            <div className="up-file-selected">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="9" y1="13" x2="15" y2="13"/>
                                    <line x1="9" y1="17" x2="15" y2="17"/>
                                </svg>
                                <div className="up-file-info">
                                    <span className="up-file-name">{file.name}</span>
                                    <span className="up-file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                                <button
                                    className="up-remove-btn"
                                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                                >✕</button>
                            </div>
                        ) : (
                            <div className="up-dropzone-content">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                <p className="up-dropzone-text">
                                    Drag & drop your Excel file here<br/>
                                    <span>or click to browse</span>
                                </p>
                                <p className="up-dropzone-hint">.xlsx, .xls, .csv supported</p>
                            </div>
                        )}
                    </div>

                    {/* error */}
                    {error && (
                        <div className="up-error">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* success */}
                    {result?.success && (
                        <div className="up-success">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            {result.message} — <strong>{result.count} rows</strong> uploaded.
                        </div>
                    )}

                    {/* upload button */}
                    <button
                        className="up-upload-btn"
                        onClick={handleUpload}
                        disabled={loading || !file}
                    >
                        {loading ? (
                            <>
                                <span className="up-spinner"/>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Upload File
                            </>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default UploadPage;
