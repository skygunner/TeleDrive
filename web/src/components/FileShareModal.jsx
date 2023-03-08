import React, { useEffect, useState } from 'react';
import {
  Modal, Input, Tooltip, Button, theme, Spin, Select,
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders, get } from '../api';
import { alertInfo } from '../utils';

const { useToken } = theme;

function FileShareModal({ file, close }) {
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();
  const { token } = useToken();

  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState();
  const [expireInDays, setExpireInDays] = useState('1');

  const getShareableLink = async (expiry) => {
    setLoading(true);

    const expireInHours = parseInt(expiry, 10) * 24;
    const data = await get(`/v1/tdlib/file/${file.file_id}/share?expire_in_hours=${expireInHours}`, authHeaders);
    if (data) {
      const { protocol, host } = window.location;
      const generatedShareLink = `${protocol}//${host}/file/download/${data.share_token}`;
      setShareLink(generatedShareLink);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (file) {
      getShareableLink(expireInDays);
    }
  }, [expireInDays, file]);

  if (!file) {
    // Avoid unnecessary render
    return <Modal />;
  }

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
            marginTop: 10,
            padding: '0px 10px',
            color: token.colorTextSecondary,
          }}
        >
          {t('People with this link can download your file for')}
          <Select
            bordered={false}
            defaultValue={expireInDays}
            style={{
              width: 95, marginLeft: -5, color: token.colorPrimary,
            }}
            onChange={(expiry) => setExpireInDays(expiry)}
          >
            <Select.Option value="1">{t('1 day')}</Select.Option>
            <Select.Option value="3">{t('3 days')}</Select.Option>
            <Select.Option value="5">{t('5 days')}</Select.Option>
            <Select.Option value="7">{t('1 week')}</Select.Option>
            <Select.Option value="30">{t('1 month')}</Select.Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}

export default FileShareModal;
