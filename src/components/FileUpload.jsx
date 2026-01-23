import { useState } from "react";
import api from "../services/api";
import { validateExcelFile } from "../utils/validateFile";
// import "../styles/fileUpload.css"

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns= rows.length>0 ? Object.keys(rows[0]) : [] ;

    const handleUpload = async () => {
        const error = validateExcelFile(file);
        if (error) {
            setMessage(error);
            return;
        }
        const formData = new FormData();
        formData.append("file", file); // MUST match multer field name

        try {
            setLoading(true);
            const res = await api.post("/api/uploadExcel", formData);
            setRows(res.data.data.rows);
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="fw-semibold mb-3 border-bottom pb-2">Excel File Uploader</h2>
                <input
                    type="file"
                    className="form-control mb-3"
                    accept=".xls,.xlsx"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button  className="btn btn-primary" onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            <div className={`alert ${rows.length ? "alert-success" : "alert-warning"} mt-3`}>
                {message}
            </div>

            <hr></hr>

            <div className="table-responsive mt-4">
                {rows.length > 0 && (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                        <tr>
                            {columns.map((col)=>(
                                <th key={col}>{col.toUpperCase()}</th>
                            ))}
                        </tr>

                        </thead>
                        <tbody>
                        {rows.map((row,rowsIndex)=>(
                            <tr key={rowsIndex}>
                                {columns.map((col)=>(
                                    <td key={col}>{row[col]}</td>
                                ))}
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default FileUpload;
