import {
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import {
  Col, Dropdown, Modal, Row, Space, Table,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useTranslation } from 'react-i18next';

import { del, get, getAuthHeaders } from '../../api';
import cfg from '../../config';
import { fileExtension, humanReadableDate, humanReadableSize } from '../../utils';

function FilesView() {
  const { t } = useTranslation();

  const foldersOffset = useRef(0);
  const folderListEnd = useRef(false);
  const filesOffset = useRef(0);
  const dataSource = useRef([]);

  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const defaultModalConfig = {
    title: '',
    description: '',
    open: false,
    onOk: () => {},
    confirmLoading: false,
    onCancel: () => {},
  };
  const [modalConfig, setModalConfig] = useState(defaultModalConfig);

  const limit = 20;
  const parentId = null; // Query string
  const authHeaders = getAuthHeaders();

  const getFolderActionItems = (folder) => {
    const handleDeleteFolder = () => {
      setModalConfig({
        title: t(`Delete ${folder.folder_name}`),
        description: t(
          `Are you sure you want to delete ${folder.folder_name}?`,
        ),
        open: true,
        onOk: async () => {
          setModalConfig({ ...modalConfig, confirmLoading: true });
          await del(`/v1/tdlib/folder/${folder.folder_id}`, authHeaders);
          setModalConfig(defaultModalConfig);
        },
        confirmLoading: false,
        onCancel: () => {
          setModalConfig(defaultModalConfig);
        },
      });
    };

    return [
      {
        key: 'q',
        label: <a>{t('Rename')}</a>,
        icon: <EditOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: '2',
        danger: true,
        label: (
          <a onClick={handleDeleteFolder} onKeyDown={handleDeleteFolder}>
            {t('Delete')}
          </a>
        ),
        icon: <DeleteOutlined />,
      },
    ];
  };

  const getFileActionItems = (file) => {
    const handleDeleteFile = () => {
      setModalConfig({
        title: t(`Delete ${file.file_name}`),
        description: t(`Are you sure you want to delete ${file.file_name}?`),
        open: true,
        onOk: async () => {
          setModalConfig({ ...modalConfig, confirmLoading: true });
          await del(`/v1/tdlib/file/${file.file_id}`, authHeaders);
          setModalConfig(defaultModalConfig);
        },
        confirmLoading: false,
        onCancel: () => {
          setModalConfig(defaultModalConfig);
        },
      });
    };

    return [
      {
        key: '1',
        label: (
          <a
            href={`${cfg.apiBaseUrl}/v1/tdlib/download/${file.file_id}?secret=${file.file_token}`}
            download={file.file_name}
          >
            {t('Download')}
          </a>
        ),
        icon: <DownloadOutlined />,
      },
      {
        key: '2',
        label: <a>{t('Rename')}</a>,
        icon: <EditOutlined />,
      },
      {
        type: 'divider',
      },
      {
        key: '3',
        danger: true,
        label: (
          <a onClick={handleDeleteFile} onKeyDown={handleDeleteFile}>
            {t('Delete')}
          </a>
        ),
        icon: <DeleteOutlined />,
      },
    ];
  };

  const fetchData = async () => {
    setLoading(true);

    let folders = [];
    let files = [];

    if (!folderListEnd.current) {
      let url = `/v1/tdlib/folders?offset=${foldersOffset.current}&limit=${limit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      folders = await get(url, authHeaders);
      if (folders) {
        folders = folders.map((folder) => ({
          data: folder,
          type: 'folder',
          name: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ maxWidth: 36, marginRight: 10 }}>
                <FolderOutlined style={{ fontSize: 38, padding: '6px 0' }} />
              </div>
              <a>{folder.folder_name}</a>
            </div>
          ),
          size: '-',
          last_modified: humanReadableDate(folder.updated_at),
          actions: (
            <Dropdown menu={{ items: getFolderActionItems(folder) }}>
              <a
                onClick={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
              >
                <Space>
                  {t('Actions')}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          ),
        }));
      } else {
        setLoading(false);
        return;
      }

      foldersOffset.current += folders.length;
      dataSource.current = dataSource.current.concat(folders);
    }

    if (folders.length < limit) {
      folderListEnd.current = true;
      const filesLimit = limit - folders.length;

      let url = `/v1/tdlib/files?offset=${filesOffset.current}&limit=${filesLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      files = await get(url, authHeaders);
      if (files) {
        files = files.map((file) => {
          const extension = fileExtension(file.file_name);

          return {
            data: file,
            type: 'file',
            name: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ maxWidth: 36, marginRight: 10 }}>
                  <FileIcon
                    labelUppercase
                    extension={extension}
                    {...defaultStyles[extension]}
                  />
                </div>
                <span>{file.file_name}</span>
              </div>
            ),
            size: humanReadableSize(file.file_size, true),
            last_modified: humanReadableDate(file.updated_at),
            actions: (
              <Dropdown menu={{ items: getFileActionItems(file) }}>
                <a
                  onClick={(e) => e.preventDefault()}
                  onKeyDown={(e) => e.preventDefault()}
                >
                  <Space>
                    {t('Actions')}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            ),
          };
        });
      } else {
        setLoading(false);
        return;
      }

      filesOffset.current += files.length;
      dataSource.current = dataSource.current.concat(files);
    }

    setLoading(false);
  };

  useEffect(() => {
    // https://github.com/ant-design/ant-design/issues/5904#issuecomment-660817725
    const table = document.querySelector('.files-view-table .ant-table-body');
    if (table) {
      table.addEventListener('scroll', async () => {
        const percent = (table.scrollTop / (table.scrollHeight - table.clientHeight)) * 100;
        if (percent >= 100) {
          await fetchData();
        }
      });
    }

    window.addEventListener('resize', () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    });

    fetchData();
  }, []);

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: t('Size'),
      dataIndex: 'size',
      responsive: ['md'],
      width: '20%',
    },
    {
      title: t('Last Modified'),
      dataIndex: 'last_modified',
      responsive: ['md'],
      width: '20%',
    },
    {
      title: t('Actions'),
      dataIndex: 'actions',
      width: '20%',
    },
  ];

  const rowKey = (row) => {
    if (row.type === 'file') {
      return row.data.file_id;
    }
    if (row.type === 'folder') {
      return row.data.folder_id;
    }
    return undefined;
  };

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Table
          className="files-view-table"
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          dataSource={dataSource.current}
          pagination={false}
          scroll={{
            scrollToFirstRowOnChange: false,
            y: windowSize[1],
          }}
        />
        <Modal
          title={modalConfig.title}
          open={modalConfig.open}
          onOk={modalConfig.onOk}
          confirmLoading={modalConfig.confirmLoading}
          onCancel={modalConfig.onCancel}
          okButtonProps={{ danger: true }}
          okText={t('Yes')}
        >
          <p>{modalConfig.description}</p>
        </Modal>
      </Col>
    </Row>
  );
}

export default FilesView;
