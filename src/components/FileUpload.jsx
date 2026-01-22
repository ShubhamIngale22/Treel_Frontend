import { useState } from "react";
import api from "../services/api";
import { validateExcelFile } from "../utils/validateFile";

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
            // const formattedRows=res.data.data.rows.map((row)=>({
            //     name:row.Name,
            //     email:row.Email,
            //     age:row.Age
            //
            // }));
            setRows(res.data.data.rows);
            setMessage(res.data.message);
        } catch (err) {
            setMessage("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".xls,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <br /><br />

            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </button>

            <p>{message}</p>

            {rows.length>0 && (
                <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
                    <thead>
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
    );
};

export default FileUpload;
