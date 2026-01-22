import FileUpload from "../components/FileUpload";
import "./uploadPage.css";

const UploadPage = () => {
    return (
        <div className={"uploadFile"}>
            <h2>Excel Upload</h2>
            <FileUpload />
        </div>
    );
};

export default UploadPage;
