import { UploadOutlined } from "@ant-design/icons";
import { Col, Row, Upload, message } from "antd";
import md5 from "md5";
import { useTranslation } from "react-i18next";

import { getAuthHeaders, post } from "../api/utils";

const FileUploader = () => {
  const { t } = useTranslation();

  const parentId = null; // Query string

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === "done") {
      message.success(`${info.file.name} uploaded successfully.`);
    }
  };

  const uploadFile = async (options) => {
    const { onSuccess, onError, onProgress, file } = options;

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
      "Content-Disposition": `attachment; filename="2${fileName}"`,
    };

    const uploadPart = async (filePart, fileId) => {
      let url = `/v1/tdlib/upload?file_size=${fileSize}&total_parts=${totalParts}&file_part=${filePart}&md5_checksum=${md5Checksum}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }
      if (fileId) {
        url += `&file_id=${fileId}`;
      }
      const start = (filePart - 1) * partSize;
      const end = start + partSize;
      const data = file.slice(start, end);
      const resp = await post(url, data, headers);
      if (resp) {
        onProgress({ percent: Math.floor((filePart / totalParts) * 100) });
        if (filePart === totalParts) {
          onSuccess("OK");
        } else {
          await uploadPart(filePart + 1, resp.file_id);
        }
      } else {
        const err = new Error(`${fileName} upload failed.`);
        onError({ err });
      }
    };

    await uploadPart(1);
  };

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Upload.Dragger
          style={{ margin: "10px 0", padding: "0 5px" }}
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
      </Col>
    </Row>
  );
};

export default FileUploader;
