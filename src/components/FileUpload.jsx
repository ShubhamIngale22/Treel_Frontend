import { useState } from "react";
import api from "../services/api";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploads, setUploads] = useState([]);
    const [rows, setRows] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // Upload Excel
    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await api.post("/api/uploadExcel", formData);
            setMessage(res.data.message);
            setRows([]);
            setUploads([]);
        } catch {
            setMessage("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // Get file list
    const handleDisplay = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/excel/uploads");
            setUploads(res.data.data || []);
            setMessage("Select a file to view data");
        } catch {
            setMessage("Failed to load uploads");
        } finally {
            setLoading(false);
        }
    };

    // Get rows for selected file
    const handleFileClick = async (uploadId) => {
        try {
            setLoading(true);
            const res = await api.get(`/api/excel/data/${uploadId}`);
            const formattedRows = res.data.data.map(item => item.data);
            setRows(formattedRows);
        } catch {
            setMessage("Failed to load file data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4">

                <h3 className="text-center text-primary mb-3">
                    Excel Upload & Viewer
                </h3>

                <input
                    type="file"
                    className="form-control mb-3"
                    accept=".xls,.xlsx"
                    onChange={e => setFile(e.target.files[0])}
                />

                <div className="d-flex gap-3 mb-3">
                    <button className="btn btn-primary w-50" onClick={handleUpload}>
                        Upload
                    </button>
                    <button className="btn btn-success w-50" onClick={handleDisplay}>
                        Display
                    </button>
                </div>

                {message && <div className="alert alert-info">{message}</div>}

                {/* File list */}
                {uploads.length > 0 && (
                    <>
                        <h5 className="text-center text-dark mb-3">Uploaded file List</h5>
                        <ul className="list-group mb-4">
                            {uploads.map(upload => (
                                <li
                                    key={upload.uploadId}
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleFileClick(upload.uploadId)}
                                >
                                    {upload.fileName} ({upload.totalRows} rows)
                                </li>
                            ))}
                        </ul>
                    </>

                )}

                {/* Table */}
                {rows.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-primary">
                            <tr>
                                {columns.map(col => (
                                    <th key={col}>{col.toUpperCase()}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row, i) => (
                                <tr key={i}>
                                    {columns.map(col => (
                                        <td key={col}>{row[col]}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FileUpload;
