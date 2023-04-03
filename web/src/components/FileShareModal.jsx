import React, { useEffect, useState } from 'react';
import {
  Modal, Input, Tooltip, Button, theme, Spin, Typography, Dropdown,
} from 'antd';
import { CopyOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders, get } from '../api';
import { alertInfo } from '../utils';
import { sendEvent, FILE_EVENTS, SHARE_FILE } from '../analytics';

const { useToken } = theme;

function FileShareModal({ file, close }) {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const { token } = useToken();

  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState();
  const [expiryIndex, setExpiryIndex] = useState(0);

  const availableExpiries = [
    { key: '1', label: t('1 day') },
    { key: '3', label: t('3 days') },
    { key: '5', label: t('5 days') },
    { key: '7', label: t('1 week') },
    { key: '30', label: t('1 month') },
  ];

  const getShareableLink = async (index) => {
    setLoading(true);

    const expireInHours = parseInt(availableExpiries[index].key, 10) * 24;
    const data = await get(`/v1/tdlib/file/${file.file_id}/share?expire_in_hours=${expireInHours}`, authHeaders);
    if (data) {
      const { protocol, host } = window.location;
      const generatedShareLink = `${protocol}//${host}/file/download/${data.share_token}`;
      setShareLink(generatedShareLink);
      sendEvent(FILE_EVENTS, SHARE_FILE);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (file) {
      getShareableLink(expiryIndex);
    }
  }, [expiryIndex, file]);

  if (!file) {
    // Avoid unnecessary render
    return <Modal />;
  }

  const dropdownItems = availableExpiries.map((expiry, index) => ({
    key: expiry.key,
    label: (
      <Typography.Link tabIndex={-1} onClick={() => { setExpiryIndex(index); }}>
        {expiry.label}
      </Typography.Link>
    ),
  }));

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
                style={{ padding: '0px 10px', alignItems: 'center' }}
                onClick={() => {
                  window.navigator.clipboard.writeText(shareLink);
                  alertInfo(t('Link copied to clipboard.'));
                }}
              >
                <CopyOutlined />
              </Button>
            </Tooltip>
          </Input.Group>
        </Spin>
        <div
          style={{
            marginTop: 20,
            marginBottom: 25,
            padding: '0px 10px',
            color: token.colorTextSecondary,
          }}
        >
          {t('People with this link can download your file for ')}
          <Dropdown
            menu={{
              selectable: true,
              items: dropdownItems,
              defaultSelectedKeys: [expiryIndex],
            }}
            type="text"
            trigger="click"
          >
            <span>
              {dropdownItems[expiryIndex].label}
              <DownOutlined style={{ color: token.colorPrimary, marginLeft: 3 }} />
            </span>
          </Dropdown>
        </div>
      </div>
    </Modal>
  );
}

export default FileShareModal;
