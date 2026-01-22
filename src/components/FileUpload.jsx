import { useState } from "react";
import api from "../services/api";
import { validateExcelFile } from "../utils/validateFile";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
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
            const res = await api.post("/uploadExcel", formData);
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
        </div>
    );
};

export default FileUpload;
