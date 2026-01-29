import { useState } from "react";
import api from "../services/api";
import { validateExcelFile } from "../utils/validateFile";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // derive columns dynamically
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // 🔹 Upload Excel → Save to MongoDB
    const handleUpload = async () => {
        const error = validateExcelFile(file);
        if (error) {
            setMessage(error);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await api.post("/api/uploadExcel", formData);

            setMessage(res.data.message);
            setRows([]); // clear old data after upload
        } catch (err) {
            setMessage("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Display Data → Fetch from MongoDB
    const handleDisplay = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/displayExcel");

            // backend returns [{ _id, data, createdAt, ... }]
            const formattedRows = res.data.data.map(item => item.data);

            setRows(formattedRows);
            setMessage("Data loaded successfully");
        } catch (err) {
            setMessage("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">

                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">

                            <h2 className="text-center fw-bold text-primary mb-3">
                                Excel File Uploader
                            </h2>

                            <input
                                type="file"
                                className="form-control mb-3"
                                accept=".xls,.xlsx"
                                onChange={(e) => setFile(e.target.files[0])}
                            />

                            <div className="d-flex gap-3 mb-3">
                                <button
                                    className="btn btn-primary w-50"
                                    onClick={handleUpload}
                                    disabled={loading}
                                >
                                    Upload
                                </button>

                                <button
                                    className="btn btn-success w-50"
                                    onClick={handleDisplay}
                                    disabled={loading}
                                >
                                    Display
                                </button>
                            </div>

                            {message && (
                                <div className="alert alert-info text-center">
                                    {message}
                                </div>
                            )}

                            {rows.length > 0 && (
                                <div className="table-responsive mt-4">
                                    <table className="table table-bordered table-hover align-middle">
                                        <thead className="table-primary text-center">
                                        <tr>
                                            {columns.map(col => (
                                                <th key={col}>{col.toUpperCase()}</th>
                                            ))}
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {rows.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="text-center">
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

                </div>
            </div>
        </div>
    );
};

export default FileUpload;
