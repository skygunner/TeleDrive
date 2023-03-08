import React, { useEffect, useState } from 'react';
import {
  Modal, Input, Tooltip, Button, theme, Dropdown, Typography, Spin,
} from 'antd';
import { CopyOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders, get } from '../api';

const { useToken } = theme;

function FileShareModal({ file, close }) {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const { token } = useToken();

  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState();
  const [selectedItem, setSelectedItem] = useState(0);

  const items = [
    {
      key: '1',
      label: (
        <Typography.Link tabIndex={-1} onClick={() => { setSelectedItem(0); }}>
          {t('1 day')}
        </Typography.Link>
      ),
    },
    {
      key: '3',
      label: (
        <Typography.Link tabIndex={-1} onClick={() => { setSelectedItem(1); }}>
          {t('3 day')}
        </Typography.Link>
      ),
    },
    {
      key: '5',
      label: (
        <Typography.Link tabIndex={-1} onClick={() => { setSelectedItem(2); }}>
          {t('5 day')}
        </Typography.Link>
      ),
    },
    {
      key: '7',
      label: (
        <Typography.Link tabIndex={-1} onClick={() => { setSelectedItem(3); }}>
          {t('1 week')}
        </Typography.Link>
      ),
    },
    {
      key: '30',
      label: (
        <Typography.Link tabIndex={-1} onClick={() => { setSelectedItem(4); }}>
          {t('1 month')}
        </Typography.Link>
      ),
    },
  ];

  const getShareableLink = async (index) => {
    setLoading(true);

    const expireInHours = parseInt(items[index].key, 10) * 24;
    const data = await get(`/v1/tdlib/file/${file.file_id}/share?expire_in_hours=${expireInHours}`, authHeaders);
    if (data) {
      const { protocol, host } = window.location;
      const generatedShareLink = `${protocol}://${host}/file/download/${data.share_token}`;
      setShareLink(generatedShareLink);
    }

    setLoading(false);
  };

  useEffect(() => {
    getShareableLink(selectedItem);
  }, [selectedItem]);

  return (
    <Modal
      open
      title={t('Share {{ fileName }}', { fileName: file.file_name })}
      okText={t('Done')}
      okButtonProps={{ type: 'primary' }}
      onOk={() => { close(); }}
      onCancel={() => { close(); }}
    >
      <div style={{ marginTop: 20 }}>
        <Spin spinning={loading}>
          <Input.Group
            compact
            style={{ display: 'flex' }}
          >
            <Input readOnly value={shareLink} />
            <Tooltip title={t('Copy')}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => {
                  window.navigator.clipboard.writeText(shareLink);
                }}
              />
            </Tooltip>
          </Input.Group>
        </Spin>
        <div
          style={{
            display: 'flex',
            padding: '0px 10px',
            color: token.colorTextSecondary,
          }}
        >
          <p style={{ marginRight: 5 }}>
            {t('People with this link can download your file for')}
          </p>
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultSelectedKeys: ['1'],
            }}
            type="text"
            trigger="click"
          >
            <p>
              {items[selectedItem].label}
              <DownOutlined style={{ color: token.colorPrimary, marginLeft: 3 }} />
            </p>
          </Dropdown>
        </div>
      </div>
    </Modal>
  );
}

export default FileShareModal;
