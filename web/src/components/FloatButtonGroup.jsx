import React from 'react';

import { UploadOutlined, PlusOutlined, FolderAddOutlined } from '@ant-design/icons';
import { FloatButton, Upload } from 'antd';
import { useDispatch } from 'react-redux';
import { uploadAsync, setFloatButtonFileList } from './FileUpload/FileUploadSlice';

function FloatButtonGroup() {
  const parentId = null; // Query string

  const dispatch = useDispatch();

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === 'uploading' || status === 'error' || status === 'done' || status === 'success') {
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
      style={{ right: 40, marginBottom: -20 }}
      icon={<PlusOutlined />}
    >
      <FloatButton icon={<FolderAddOutlined />} />
      <Upload
        multiple
        showUploadList={false}
        customRequest={uploadFile}
        onChange={onStatusChange}
      >
        <FloatButton icon={<UploadOutlined />} />
      </Upload>
    </FloatButton.Group>
  );
}

export default FloatButtonGroup;
