import { UploadOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import md5 from "md5";
import { useTranslation } from "react-i18next";

import { getAuthHeaders, post } from "../api/utils";

const FileUploader = () => {
  const { t } = useTranslation();

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  const uploadFile = async (options) => {
    const { onSuccess, onError, file } = options;

    const buffer = await file.arrayBuffer();
    const binaryArray = new Uint8Array(buffer);

    const partSize = 512 * 1024;
    const fileName = file.name;
    const fileSize = file.size;
    const totalParts = Math.floor((fileSize + partSize - 1) / partSize);
    const md5Checksum = md5(binaryArray);

    const headers = {
      ...getAuthHeaders(),
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    };

    const uploadPart = async (filePart, fileId) => {
      const url = `/v1/tdlib/upload?file_size=${fileSize}&total_parts=${totalParts}&file_part=${filePart}&md5_checksum=${md5Checksum}&file_id=${fileId}`;
      const start = (filePart - 1) * partSize;
      const end = start + partSize;
      const data = file.slice(start, end);
      const resp = await post(url, data, headers);
      if (resp) {
        if (filePart === totalParts) {
          onSuccess("OK");
        } else {
          await uploadPart(filePart + 1, resp.file_id);
        }
      } else {
        const err = new Error(t(`${fileName} upload failed.`));
        onError({ err });
      }
    };

    await uploadPart(1);
  };

  return (
    <Upload.Dragger
      style={{ padding: "0 5px" }}
      multiple={true}
      onChange={onStatusChange}
      customRequest={uploadFile}
    >
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
    </Upload.Dragger>
  );
};

export default FileUploader;
