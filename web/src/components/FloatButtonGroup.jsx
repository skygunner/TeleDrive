import React, { useState } from 'react';

import { UploadOutlined, PlusOutlined, FolderAddOutlined } from '@ant-design/icons';
import {
  FloatButton, Upload, Form, Input, Modal,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { post, getAuthHeaders } from '../api';
import { uploadAsync, setFloatButtonFileList } from './FileUpload/FileUploadSlice';
import { folderCreated } from './FilesView/FilesViewSlice';

function FloatButtonGroup() {
  const parentId = null; // Query string
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [modalConfig, setModalConfig] = useState({});
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

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

  const handleCreateFolder = () => {
    form.resetFields();

    setModalConfig({
      open: true,
      title: t('Create folder'),
      okText: t('Create'),
      okButtonProps: { type: 'primary' },
      onCancel: () => {
        setModalConfig({});
      },
      onOk: async () => {
        form
          .validateFields()
          .then(async (values) => {
            setModalConfirmLoading(true);

            const folder = await post('/v1/tdlib/folder', { ...values, parent_id: parentId }, authHeaders);
            if (folder) {
              dispatch(folderCreated(folder));
            }

            setModalConfirmLoading(false);
            setModalConfig({});
          })
          .catch(() => {});
      },
      body: (
        <Form form={form}>
          <Form.Item
            style={{ marginTop: 20 }}
            name="folder_name"
            rules={[{
              required: true,
              message: t('Please input the folder name!'),
            }]}
          >
            <Input placeholder={t('Folder name')} />
          </Form.Item>
        </Form>
      ),
    });
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 40, marginBottom: -20 }}
        icon={<PlusOutlined />}
      >
        <FloatButton
          icon={<FolderAddOutlined />}
          tooltip={t('Create folder')}
          onClick={handleCreateFolder}
        />
        <Upload
          multiple
          showUploadList={false}
          customRequest={uploadFile}
          onChange={onStatusChange}
        >
          <FloatButton
            icon={<UploadOutlined />}
            tooltip={t('Upload file')}
          />
        </Upload>
      </FloatButton.Group>
      <Modal
        open={modalConfig.open}
        title={modalConfig.title}
        okText={modalConfig.okText}
        okButtonProps={modalConfig.okButtonProps}
        confirmLoading={modalConfirmLoading}
        onCancel={modalConfig.onCancel}
        onOk={modalConfig.onOk}
      >
        {modalConfig.body}
      </Modal>
    </>
  );
}

export default FloatButtonGroup;
