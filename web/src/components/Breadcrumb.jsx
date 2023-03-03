import React, { useEffect, useState } from 'react';
import { Breadcrumb as AntBreadcrumb, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { get, getAuthHeaders } from '../api';

const { useToken } = theme;

function Breadcrumb({
  folderId, setFolderId, style,
}) {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const { token } = useToken();

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!folderId) {
      setItems([{
        folder_id: null,
        folder_name: null,
      }]);
      return;
    }

    get(`/v1/tdlib/folder/${folderId}`, authHeaders)
      .then((folder) => {
        if (folder) {
          setItems(folder.breadcrumb);
        }
      });
  }, [folderId]);

  return (
    <AntBreadcrumb
      style={{
        marginLeft: 14,
        color: token.colorText,
        ...style,
      }}
      separator=">"
    >
      {items.map((item) => {
        const itemName = item.folder_id ? item.folder_name : t('My Drive');

        return (
          <AntBreadcrumb.Item
            key={item.folder_id}
            onClick={() => {
              if (item.folder_id !== folderId) {
                setFolderId(item.folder_id);
              }
            }}
          >
            {item.folder_id === folderId ? itemName : (<a tabIndex={-1}>{itemName}</a>)}
          </AntBreadcrumb.Item>
        );
      })}
    </AntBreadcrumb>
  );
}

export default Breadcrumb;
