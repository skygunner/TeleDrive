import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderTwoTone,
  EllipsisOutlined,
} from '@ant-design/icons';
import {
  Col, Dropdown, Modal, Row, List, Skeleton, Divider,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  const dispatch = useDispatch();

  const details = useSelector(selectDetails);
  const dataSource = details.folders.concat(details.files);

  const defaultModalConfig = {
    title: '',
    open: false,
    onOk: () => {},
    confirmLoading: false,
    onCancel: () => {},
    okButtonProps: {},
    okText: '',
    boxy: '',
  };
  const [modalConfig, setModalConfig] = useState(defaultModalConfig);

  useEffect(() => {
    dispatch(fetchDataAsync(parentId));
  }, []);

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
        title: t(`Delete ${folder.folder_name}`),
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
        okButtonProps: { danger: true },
        okText: t('Yes'),
        body: <p>{t(`Are you sure you want to delete ${folder.folder_name}?`)}</p>,
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
        title: t(`Delete ${file.file_name}`),
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
        okButtonProps: { danger: true },
        okText: t('Yes'),
        body: <p>{t(`Are you sure you want to delete ${file.file_name}?`)}</p>,
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

  const listItem = (item) => {
    if (item.folder_id) {
      return (
        <List.Item key={`folder_${item.folder_id}`}>
          <List.Item.Meta
            style={{ display: 'flex', alignItems: 'center' }}
            avatar={folderAvatar(item)}
            title={(
              <a href={`/files?parentId=${item.folder_id}`}>
                {item.folder_name}
              </a>
            )}
            description={(
              <div>
                <span>
                  {t('Folder')}
                </span>
                <br />
                <span>
                  {`${t('Modified')} ${humanReadableDate(item.updated_at)}`}
                </span>
              </div>
            )}
          />
          <div>
            <Dropdown.Button
              type="text"
              trigger="click"
              menu={{ items: folderMenuItems(item) }}
              icon={<EllipsisOutlined style={{ fontSize: 20 }} />}
            />
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
            title={item.file_name}
            description={(
              <div>
                <span>
                  {t('File')}
                  {' '}
                  {`${humanReadableSize(item.file_size)}`}
                </span>
                <br />
                <span>
                  {`${t('Modified')} ${humanReadableDate(item.updated_at)}`}
                </span>
              </div>
            )}
          />
          <div>
            <Dropdown.Button
              type="text"
              trigger="click"
              menu={{ items: fileMenuItems(item) }}
              icon={<EllipsisOutlined style={{ fontSize: 20 }} />}
            />
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
          loader={(
            <Skeleton
              active
              paragraph={{ rows: 2 }}
              avatar={{ shape: 'square' }}
              style={{ display: 'flex', alignItems: 'center' }}
            />
          )}
          scrollableTarget="scrollableDiv"
        >
          <Divider style={{ borderBlockStart: '0px transparent' }} orientation="left" orientationMargin={15}>{t('Folders / Files')}</Divider>
          {dataSource.length !== 0 || !details.loading
            ? (
              <List
                dataSource={dataSource}
                renderItem={(item) => listItem(item)}
              />
            )
            : (
              <Skeleton
                active
                paragraph={{ rows: 2 }}
                avatar={{ shape: 'square' }}
                style={{ display: 'flex', alignItems: 'center' }}
              />
            )}
        </InfiniteScroll>
        <Modal
          title={modalConfig.title}
          open={modalConfig.open}
          onOk={modalConfig.onOk}
          confirmLoading={modalConfig.confirmLoading}
          onCancel={modalConfig.onCancel}
          okButtonProps={modalConfig.okButtonProps}
          okText={modalConfig.okText}
        >
          {modalConfig.body}
        </Modal>
      </Col>
    </Row>
  );
}

export default FilesView;
