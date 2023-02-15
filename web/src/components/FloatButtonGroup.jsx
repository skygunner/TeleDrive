import React from 'react';

import { UploadOutlined, PlusOutlined, FolderAddOutlined } from '@ant-design/icons';
import { FloatButton, Upload, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { uploadAsync, setFloatButtonFileList } from './FileUpload/FileUploadSlice';

function FloatButtonGroup() {
  const parentId = null; // Query string

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === 'uploading' || status === 'error') {
      dispatch(setFloatButtonFileList(
        info.fileList.filter((file) => file.status === 'uploading'),
      ));
    } else if (status === 'done' || status === 'success') {
      message.success(t(`${info.file.name} uploaded successfully.`));
      dispatch(setFloatButtonFileList(
        info.fileList.filter((file) => file.status === 'uploading'),
      ));
    }
  };

  const uploadFile = async (uploadOptions) => {
    dispatch(uploadAsync({ parentId, ...uploadOptions }));
  };

  return (
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ right: 35, marginBottom: -25 }}
      icon={<PlusOutlined />}
    >
      <FloatButton style={{ display: 'flex', alignItems: 'center' }} icon={<FolderAddOutlined />} />
      <Upload
        multiple
        showUploadList={false}
        customRequest={uploadFile}
        onChange={onStatusChange}
      >
        <FloatButton style={{ display: 'flex', alignItems: 'center' }} icon={<UploadOutlined />} />
      </Upload>
    </FloatButton.Group>
  );
}

export default FloatButtonGroup;
