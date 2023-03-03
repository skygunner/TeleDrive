import React, { useEffect, useState } from 'react';
import {
  List, Skeleton, Result, Typography, Modal,
} from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectDetails, fetchDataAsync, changeMoveEntityModalParentId, closeMoveEntityModal,
} from './MoveEntityModalSlice';
import { fileMoved, folderMoved } from '../FilesView/FilesViewSlice';
import { put, getAuthHeaders } from '../../api';
import { humanReadableDate, folderAvatar } from '../../utils';
import Breadcrumb from '../Breadcrumb';

function MoveEntityModal() {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const details = useSelector(selectDetails);
  const {
    entity, parentId, loading, folders, folderListEnd,
  } = details;

  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (entity) {
      dispatch(fetchDataAsync(parentId));
    }
  }, [parentId, entity]);

  if (!entity) {
    // Avoid unnecessary render
    return null;
  }

  const entityType = entity.folder_id ? 'folder' : 'file';
  const entityId = entityType === 'folder' ? entity.folder_id : entity.file_id;

  const listItem = (item) => (
    <List.Item key={`folder_${item.folder_id}`}>
      <List.Item.Meta
        style={{ display: 'flex', alignItems: 'center' }}
        avatar={folderAvatar(item)}
        title={(
          <Typography.Link
            tabIndex={-1}
            style={{ paddingRight: 15 }}
            ellipsis
            onClick={() => { dispatch(changeMoveEntityModalParentId(item.folder_id)); }}
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
    </List.Item>
  );

  const handleMove = async () => {
    setConfirmLoading(true);

    const body = { ...entity, parent_id: parseInt(parentId, 10) };
    const apiEntity = await put(`/v1/tdlib/${entityType}/${entityId}`, body, authHeaders);
    if (!apiEntity) {
      return;
    }

    if (entityType === 'folder') {
      dispatch(folderMoved(apiEntity));
    } else {
      dispatch(fileMoved(apiEntity));
    }

    setConfirmLoading(false);
    dispatch(closeMoveEntityModal());
  };

  return (
    <Modal
      open
      title={(
        <Breadcrumb
          folderId={parentId}
          setFolderId={(folderId) => {
            dispatch(changeMoveEntityModalParentId(folderId));
          }}
          style={{ fontWeight: 600, fontSize: '16px' }}
        />
      )}
      okText={t('Move here')}
      okButtonProps={{ type: 'primary' }}
      confirmLoading={confirmLoading}
      onCancel={() => { dispatch(closeMoveEntityModal()); }}
      onOk={handleMove}
    >
      <InfiniteScroll
        dataLength={folders.length}
        next={() => { dispatch(fetchDataAsync(parentId)); }}
        hasMore={!folderListEnd}
        height={500}
        loader={loading ? (
          <Skeleton
            active
            paragraph={{ rows: 1 }}
            avatar={{ shape: 'square' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0px 24px',
            }}
          />
        ) : null}
      >
        <List
          dataSource={folders}
          renderItem={(item) => listItem(item)}
          locale={loading ? ({ emptyText: <span /> }) : ({
            emptyText: <Result
              icon={<FolderOpenOutlined />}
              title={t('No folders yet')}
            />,
          })}
        />
      </InfiniteScroll>
    </Modal>
  );
}

export default MoveEntityModal;
