import FileUpload from "../components/FileUpload";
import "./uploadPage.css";

const UploadPage = () => {
    return (
        <div className={"uploadFile"} style={{ padding: "40px" }}>
            <h2>Excel Upload</h2>
            <FileUpload />
        </div>
    );
};

export default UploadPage;
