import { UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";

const { Dragger } = Upload;

const FileUploader = () => {
  const props = {
    name: "files",
    multiple: true,
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag files to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit uploading company
        data or other band files
      </p>
    </Dragger>
  );
};

export default FileUploader;
