import React, { useEffect, useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { Breadcrumb as AntBreadcrumb, Button, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { get, getAuthHeaders } from '../api';

const { useToken } = theme;

function Breadcrumb({
  folderId, setFolderId, style, modal,
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
    <div
      style={{
        marginLeft: 14,
        color: token.colorText,
        ...style,
      }}
    >
      {modal ? (
        <div
          style={{
            height: 24,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {items.length > 1
            ? (
              <Button
                style={{
                  border: 0,
                  padding: 0,
                  margin: 0,
                  marginRight: 10,
                  display: 'flex',
                  boxShadow: 'none',
                  alignItems: 'center',
                }}
                onClick={() => {
                  setFolderId(items[items.length - 2].folder_id);
                }}
              >
                <LeftOutlined style={{ fontSize: 20 }} />
              </Button>
            )
            : null}
          {items.length > 1 ? items[items.length - 1].folder_name : t('My Drive')}
        </div>
      )
        : (
          <AntBreadcrumb separator=">">
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
        )}
    </div>
  );
}

export default Breadcrumb;
