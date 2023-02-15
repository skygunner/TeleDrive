import { UploadOutlined } from '@ant-design/icons';
import {
  Col, Row, Upload, message,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAsync, setUploadDraggerFileList, selectFiles } from './FileUploadSlice';

function FileUploader() {
  const parentId = null; // Query string

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { floatButtonFileList, uploadDraggerFileList } = useSelector(selectFiles);
  const fileList = floatButtonFileList.concat(uploadDraggerFileList);

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === 'uploading' || status === 'error') {
      dispatch(setUploadDraggerFileList(
        info.fileList.filter((file) => file.status === 'uploading'),
      ));
    } else if (status === 'done' || status === 'success') {
      message.success(t(`${info.file.name} uploaded successfully.`));
      dispatch(setUploadDraggerFileList(
        info.fileList.filter((file) => file.status === 'uploading'),
      ));
    }
  };

  const uploadFile = async (uploadOptions) => {
    dispatch(uploadAsync({ parentId, ...uploadOptions }));
  };

  return (
    <Row style={{ marginBottom: 10 }} align="middle">
      <Col offset={1} span={22}>
        <Upload.Dragger
          style={{ margin: '10px 0' }}
          multiple
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
            {t('Click or drag files to this area to upload')}
          </p>
          <p className="ant-upload-hint">
            {t(
              'Support for a single or bulk upload. Strictly prohibit uploading company data or other band files',
            )}
          </p>
        </Upload.Dragger>
      </Col>
    </Row>
  );
}

export default FileUploader;
