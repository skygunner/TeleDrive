import { UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useTranslation } from "react-i18next";

const { Dragger } = Upload;

const FileUploader = () => {
  const { t } = useTranslation();

  const props = {
    name: "files",
    multiple: true,
  };

  return (
    <Dragger style={{ padding: "0 5px" }} {...props}>
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">
        {t("Click or drag files to this area to upload")}
      </p>
      <p className="ant-upload-hint">
        {t(
          "Support for a single or bulk upload. Strictly prohibit uploading company data or other band files"
        )}
      </p>
    </Dragger>
  );
};

export default FileUploader;
