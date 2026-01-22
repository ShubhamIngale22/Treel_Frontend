import FileUpload from "../components/FileUpload";
import "../styles/uploadPage.css";

const UploadPage = () => {
    return (
        <div className={"uploadFile"}>
            <h2 >Excel File Uploader</h2>
            <FileUpload />
        </div>
    );
};

export default UploadPage;
