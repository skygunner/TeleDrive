import React, { useState, useRef } from 'react';

import { UploadOutlined, PlusOutlined, FolderAddOutlined } from '@ant-design/icons';
import {
  FloatButton, Upload, Form, Input, Modal, Tooltip,
} from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { post, getAuthHeaders } from '../api';
import { uploadAsync, setFloatButtonFileList } from './FileUploader/FileUploaderSlice';
import { folderCreated } from './FilesView/FilesViewSlice';

function FloatButtonGroup() {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');

  const textInput = useRef();
  const [form] = Form.useForm();
  const [tooltipOpen, setTooltipOpen] = useState(false);
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

    const onOk = async () => {
      form
        .validateFields()
        .then(async (values) => {
          setModalConfirmLoading(true);

          const folder = await post('/v1/tdlib/folder', { ...values, parent_id: parseInt(parentId, 10) }, authHeaders);
          if (folder) {
            dispatch(folderCreated(folder));
          }

          textInput.current.blur();
          setModalConfirmLoading(false);
          setModalConfig({});
        })
        .catch(() => {});
    };

    setModalConfig({
      open: true,
      title: t('Create folder'),
      okText: t('Create'),
      okButtonProps: { type: 'primary' },
      onCancel: () => {
        textInput.current.blur();
        setModalConfig({});
      },
      onOk,
      body: (
        <Form form={form}>
          <Form.Item
            style={{ marginTop: 20 }}
            name="folder_name"
            rules={[{
              required: true,
              message: t('Please input the folder name.'),
            }]}
          >
            <Input
              ref={textInput}
              placeholder={t('Folder name')}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onOk();
                }
              }}
            />
          </Form.Item>
        </Form>
      ),
    });

    setTimeout(() => {
      textInput.current.focus();
    }, 500);
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 40, marginBottom: -20 }}
        icon={<PlusOutlined />}
        onOpenChange={(open) => {
          setTimeout(() => {
            setTooltipOpen(open);
          }, 300);
        }}
      >
        <Tooltip
          open={tooltipOpen}
          placement="left"
          title={t('Create folder')}
        >
          <FloatButton
            icon={<FolderAddOutlined />}
            onClick={handleCreateFolder}
          />
        </Tooltip>
        <Upload
          multiple
          showUploadList={false}
          customRequest={uploadFile}
          onChange={onStatusChange}
        >
          <Tooltip
            open={tooltipOpen}
            placement="left"
            title={t('Upload file')}
          >
            <FloatButton icon={<UploadOutlined />} />
          </Tooltip>
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
