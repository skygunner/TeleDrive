import { UploadOutlined } from "@ant-design/icons";
import { Col, Row, Upload, message } from "antd";
import md5 from "md5";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getAuthHeaders, post } from "../api/utils";

const FileUploader = () => {
  const { t } = useTranslation();

  const [fileList, setFileList] = useState([]);

  const parentId = null; // Query string

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === "uploading" || status === "error") {
      setFileList(info.fileList.filter((file) => file.status === "uploading"));
    } else if (status === "done" || status === "success") {
      message.success(t(`${info.file.name} uploaded successfully.`));
      setFileList(info.fileList.filter((file) => file.status === "uploading"));
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
      "Content-Disposition": `attachment; filename="${fileName}"`,
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

      const fileInfo = await post(url, data, headers);
      if (fileInfo) {
        onProgress({ percent: Math.floor((filePart / totalParts) * 100) });
        if (filePart === totalParts) {
          onSuccess("OK");
        } else {
          await uploadPart(filePart + 1, fileInfo.file_id);
        }
      } else {
        const err = new Error(`${fileName} upload failed.`);
        onError({ err });
      }
    };

    await uploadPart(1);
  };

  return (
    <Row style={{ marginBottom: 10 }} align="middle">
      <Col offset={1} span={22}>
        <Upload.Dragger
          style={{ margin: "10px 0" }}
          multiple={true}
          fileList={fileList}
          onChange={onStatusChange}
          customRequest={uploadFile}
          showUploadList={{
            showRemoveIcon: false,
            showPreviewIcon: false,
            showDownloadIcon: false,
          }}
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
