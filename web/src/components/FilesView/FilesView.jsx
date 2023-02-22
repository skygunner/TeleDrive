import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderTwoTone,
  EllipsisOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import {
  Col, Dropdown, Modal, Row, List, Breadcrumb,
  Skeleton, Form, Input, Typography, Result,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector, useDispatch } from 'react-redux';
import {
  resetState, selectDetails, fetchDataAsync, fileDeleted, folderDeleted, fileRenamed, folderRenamed,
} from './FilesViewSlice';

import {
  get, del, put, getAuthHeaders,
} from '../../api';
import cfg from '../../config';
import { fileExtension, humanReadableDate } from '../../utils';

function FilesView() {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');

  const details = useSelector(selectDetails);
  const dataSource = details.folders.concat(details.files);

  const [form] = Form.useForm();
  const [breadcrumb, setBreadcrumb] = useState();
  const [modalConfig, setModalConfig] = useState({});
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

  const applyBreadcrumb = (items) => {
    setBreadcrumb(
      <Breadcrumb
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 14,
        }}
        separator=">"
      >
        {items.map((item) => {
          const itemName = item.folder_id ? item.folder_name : t('My Drive');

          return (
            <Breadcrumb.Item
              key={item.folder_id}
              onClick={() => {
                if (item.folder_id !== parentId) {
                  setSearchParams(item.folder_id ? { parentId: item.folder_id } : {});
                }
              }}
            >
              {item.folder_id === parentId ? itemName : (<a>{itemName}</a>)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>,
    );
  };

  const fetchBreadcrumb = () => {
    if (!parentId) {
      applyBreadcrumb([{
        folder_id: null,
        folder_name: null,
      }]);
      return;
    }

    get(`/v1/tdlib/folder/${parentId}`, authHeaders)
      .then((folder) => {
        if (folder) {
          applyBreadcrumb(folder.breadcrumb);
        }
      });
  };

  useEffect(() => {
    dispatch(resetState(parentId));
    fetchBreadcrumb();
    dispatch(fetchDataAsync(parentId));
  }, [parentId]);

  const folderAvatar = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 36, marginRight: 10 }}>
        <FolderTwoTone style={{ fontSize: 38, padding: '6px 0' }} />
      </div>
    </div>
  );

  const folderMenuItems = (folder) => {
    const handleDeleteFolder = () => {
      setModalConfig({
        open: true,
        title: t('Delete folder'),
        okText: t('Delete'),
        okButtonProps: { danger: true },
        onCancel: () => {
          setModalConfig({});
        },
        onOk: async () => {
          setModalConfirmLoading(true);

          const ok = await del(`/v1/tdlib/folder/${folder.folder_id}`, authHeaders);
          if (ok) {
            dispatch(folderDeleted(folder.folder_id));
          }

          setModalConfirmLoading(false);
          setModalConfig({});
        },
        body: <p>{t(`Are you sure you want to delete ${folder.folder_name}?`)}</p>,
      });
    };

    const handleRenameFolder = () => {
      form.resetFields();

      setModalConfig({
        open: true,
        title: t('Rename folder'),
        okText: t('Rename'),
        okButtonProps: { type: 'primary' },
        onCancel: () => {
          setModalConfig({});
        },
        onOk: async () => {
          form
            .validateFields()
            .then(async (values) => {
              setModalConfirmLoading(true);

              const renamedFolder = await put(`/v1/tdlib/folder/${folder.folder_id}`, values, authHeaders);
              if (renamedFolder) {
                dispatch(folderRenamed(renamedFolder));
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
              initialValue={folder.folder_name}
              rules={[{
                required: true,
                message: t('Please input the folder name.'),
              }]}
            >
              <Input placeholder={t('Folder name')} />
            </Form.Item>
          </Form>
        ),
      });
    };

    return [
      {
        key: 'q',
        label: (
          <Typography.Link onClick={handleRenameFolder}>
            {t('Rename')}
          </Typography.Link>
        ),
        icon: <EditOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: '2',
        danger: true,
        label: (
          <Typography.Link onClick={handleDeleteFolder}>
            {t('Delete')}
          </Typography.Link>
        ),
        icon: <DeleteOutlined />,
      },
    ];
  };

  const fileAvatar = (file) => {
    const extension = fileExtension(file.file_name);

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 36, marginRight: 10 }}>
          <FileIcon
            labelUppercase
            extension={extension}
            {...defaultStyles[extension]}
          />
        </div>
      </div>
    );
  };

  const fileMenuItems = (file) => {
    const handleDeleteFile = () => {
      setModalConfig({
        open: true,
        title: t('Delete file'),
        okText: t('Delete'),
        okButtonProps: { danger: true },
        onCancel: () => {
          setModalConfig({});
        },
        onOk: async () => {
          setModalConfirmLoading(true);

          const ok = await del(`/v1/tdlib/file/${file.file_id}`, authHeaders);
          if (ok) {
            dispatch(fileDeleted(file.file_id));
          }

          setModalConfirmLoading(false);
          setModalConfig({});
        },
        body: <p>{t(`Are you sure you want to delete ${file.file_name}?`)}</p>,
      });
    };

    const handleRenameFile = () => {
      form.resetFields();

      setModalConfig({
        open: true,
        title: t('Rename file'),
        okText: t('Rename'),
        okButtonProps: { type: 'primary' },
        onCancel: () => {
          setModalConfig({});
        },
        onOk: async () => {
          form
            .validateFields()
            .then(async (values) => {
              setModalConfirmLoading(true);

              const renamedFile = await put(`/v1/tdlib/file/${file.file_id}`, values, authHeaders);
              if (renamedFile) {
                dispatch(fileRenamed(renamedFile));
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
              name="file_name"
              initialValue={file.file_name}
              rules={[{
                required: true,
                message: t('Please input the file name.'),
              }]}
            >
              <Input placeholder={t('File name')} />
            </Form.Item>
          </Form>
        ),
      });
    };

    return [
      {
        key: '1',
        label: (
          <Typography.Link
            href={`${cfg.apiBaseUrl}/v1/tdlib/download/${file.file_id}?secret=${file.file_token}`}
            download={file.file_name}
          >
            {t('Download')}
          </Typography.Link>
        ),
        icon: <DownloadOutlined />,
      },
      {
        key: '2',
        label: (
          <Typography.Link onClick={handleRenameFile}>
            {t('Rename')}
          </Typography.Link>
        ),
        icon: <EditOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: '3',
        danger: true,
        label: (
          <Typography.Link onClick={handleDeleteFile}>
            {t('Delete')}
          </Typography.Link>
        ),
        icon: <DeleteOutlined />,
      },
    ];
  };

  const listItem = (item) => {
    if (item.folder_id) {
      return (
        <List.Item key={`folder_${item.folder_id}`}>
          <List.Item.Meta
            style={{ display: 'flex', alignItems: 'center' }}
            avatar={folderAvatar(item)}
            title={(
              <Typography.Link
                ellipsis
                style={{ paddingRight: 15 }}
                onClick={() => {
                  setSearchParams({ parentId: item.folder_id });
                }}
              >
                {item.folder_name}
              </Typography.Link>
            )}
            description={(
              <div>
                <span>
                  {`${t('Modified')} ${humanReadableDate(item.updated_at)}`}
                </span>
              </div>
            )}
          />
          <div>
            <Dropdown
              type="text"
              trigger="click"
              menu={{ items: folderMenuItems(item) }}
            >
              <EllipsisOutlined style={{ fontSize: 20 }} />
            </Dropdown>
          </div>
        </List.Item>
      );
    }
    if (item.file_id) {
      return (
        <List.Item key={`file_${item.file_id}`}>
          <List.Item.Meta
            style={{ display: 'flex', alignItems: 'center' }}
            avatar={fileAvatar(item)}
            title={(
              <Typography.Text
                ellipsis
                style={{ paddingRight: 15 }}
              >
                {item.file_name}
              </Typography.Text>
            )}
            description={(
              <div>
                <span>
                  {`${t('Modified')} ${humanReadableDate(item.updated_at)}`}
                </span>
              </div>
            )}
          />
          <div>
            <Dropdown
              type="text"
              trigger="click"
              menu={{ items: fileMenuItems(item) }}
            >
              <EllipsisOutlined style={{ fontSize: 20 }} />
            </Dropdown>
          </div>
        </List.Item>
      );
    }

    return null;
  };

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <InfiniteScroll
          dataLength={details.folders.length + details.files.length}
          next={() => { dispatch(fetchDataAsync(parentId)); }}
          hasMore={!details.folderListEnd || !details.filesListEnd}
          loader={details.loading ? (
            <Skeleton
              active
              paragraph={{ rows: 1 }}
              avatar={{ shape: 'square' }}
              style={{ display: 'flex', alignItems: 'center', padding: '0px 24px' }}
            />
          ) : null}
          scrollableTarget="scrollableDiv"
        >
          <List
            header={breadcrumb}
            dataSource={dataSource}
            renderItem={(item) => listItem(item)}
            locale={details.loading ? ({
              emptyText: <span />,
            }) : ({
              emptyText: <Result
                icon={<FolderOpenOutlined />}
                title={t('No files or folders yet')}
                subTitle={t('Click + to create folders or upload files')}
              />,
            })}
          />
        </InfiniteScroll>
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
      </Col>
    </Row>
  );
}

export default FilesView;
