import React, { useEffect, useState } from 'react';
import {
  List, Skeleton, Result, Typography,
} from 'antd';
import { FolderOpenOutlined, FolderTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import config from '../config';
import { get, getAuthHeaders } from '../api';

function MoveModalContent(props) {
  const { setMoveParentId } = props;

  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [foldersOffset, setFoldersOffset] = useState(0);
  const [folderListEnd, setFolderListEnd] = useState(false);

  // eslint-disable-next-line no-shadow
  const fetchDataAsync = (folders, foldersOffset, parentId) => {
    setLoading(true);

    let url = `/v1/tdlib/folders?offset=${foldersOffset}&limit=${config.listLoadLimit}`;
    if (parentId) {
      url += `&parent_id=${parentId}`;
    }

    get(url, authHeaders)
      .then((apiFolders) => {
        if (!apiFolders) {
          return;
        }

        setFolders(folders.concat(apiFolders));
        setFoldersOffset(foldersOffset + folders.length);
        setFolderListEnd(folders.length < config.listLoadLimit);
      });
  };

  useEffect(() => {
    setFolders([]);
    setFoldersOffset(0);
    setFolderListEnd(false);
    setMoveParentId(parentId);
    fetchDataAsync([], 0, parentId);
  }, [parentId]);

  const folderAvatar = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 36, marginRight: 10 }}>
        <FolderTwoTone style={{ fontSize: 38, padding: '6px 0' }} />
      </div>
    </div>
  );

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
            onClick={() => {
              setParentId(item.folder_id);
            }}
          >
            {item.folder_name}
          </Typography.Link>
            )}
      />
    </List.Item>
  );

  return (
    <InfiniteScroll
      dataLength={folders.length}
      next={() => { fetchDataAsync(folders, foldersOffset, parentId); }}
      hasMore={!folderListEnd}
      loader={loading ? (
        <Skeleton
          active
          avatar={{ shape: 'square' }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0px 24px',
          }}
        />
      ) : null}
      scrollableTarget="scrollableDiv"
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
  );
}

export default MoveModalContent;
