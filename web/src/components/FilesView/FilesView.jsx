import {
  DeleteOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderTwoTone,
} from '@ant-design/icons';
import {
  Col, Dropdown, Modal, Row, Space, Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectDetails, fetchDataAsync, fileDeleted, folderDeleted,
} from './FilesViewSlice';

import { del, getAuthHeaders } from '../../api';
import cfg from '../../config';
import { fileExtension, humanReadableDate, humanReadableSize } from '../../utils';

function FilesView() {
  const parentId = null; // Query string
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();

  const details = useSelector(selectDetails);
  const dispatch = useDispatch();

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

  useEffect(() => {
    // https://github.com/ant-design/ant-design/issues/5904#issuecomment-660817725
    const table = document.querySelector('.files-view-table .ant-table-body');
    if (table) {
      table.addEventListener('scroll', async () => {
        const percent = (table.scrollTop / (table.scrollHeight - table.clientHeight)) * 100;
        if (percent >= 100) {
          dispatch(fetchDataAsync(parentId));
        }
      });
    }

    window.addEventListener('resize', () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    });

    dispatch(fetchDataAsync(parentId));
  }, []);

  const rowName = (row) => {
    if (row.type === 'file') {
      const extension = fileExtension(row.file_name);

      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 36, marginRight: 10 }}>
            <FileIcon
              labelUppercase
              extension={extension}
              {...defaultStyles[extension]}
            />
          </div>
          <span>{row.file_name}</span>
        </div>
      );
    }
    if (row.type === 'folder') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 36, marginRight: 10 }}>
            <FolderTwoTone style={{ fontSize: 38, padding: '6px 0' }} />
          </div>
          <a>{row.folder_name}</a>
        </div>
      );
    }

    return undefined;
  };

  const rowSize = (row) => {
    if (row.type === 'file') {
      return humanReadableSize(row.file_size, true);
    }
    if (row.type === 'folder') {
      return '-';
    }

    return undefined;
  };

  const getFileActionItems = (file) => {
    const handleDeleteFile = () => {
      setModalConfig({
        title: t(`Delete ${file.file_name}`),
        description: t(`Are you sure you want to delete ${file.file_name}?`),
        open: true,
        onOk: async () => {
          setModalConfig({ ...modalConfig, confirmLoading: true });
          const ok = await del(`/v1/tdlib/file/${file.file_id}`, authHeaders);
          if (ok) {
            dispatch(fileDeleted(file.file_id));
          }
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
          const ok = await del(`/v1/tdlib/folder/${folder.folder_id}`, authHeaders);
          if (ok) {
            dispatch(folderDeleted(folder.folder_id));
          }
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

  const rowActions = (row) => {
    let items = [];

    if (row.type === 'file') {
      items = getFileActionItems(row);
    }
    if (row.type === 'folder') {
      items = getFolderActionItems(row);
    }

    return (
      <Dropdown menu={{ items }}>
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
    );
  };

  const rowKey = (row) => {
    if (row.rowData.type === 'file') {
      return row.rowData.file_id;
    }
    if (row.rowData.type === 'folder') {
      return row.rowData.folder_id;
    }

    return undefined;
  };

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

  const dataSource = details.data.map((row) => ({
    rowData: row,
    name: rowName(row),
    size: rowSize(row),
    last_modified: humanReadableDate(row.updated_at),
    actions: rowActions(row),
  }));

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Table
          className="files-view-table"
          columns={columns}
          rowKey={rowKey}
          loading={details.loading}
          dataSource={dataSource}
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
