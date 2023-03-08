import { Result, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import React, { useEffect, useState } from 'react';
import { get } from '../api';
import cfg from '../config';

function DownloadPage() {
  const { shareToken } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();

  const fetchDownloadToken = async () => {
    setLoading(true);

    const file = await get(`/v1/tdlib/file/${shareToken}/shared`, {}, false);
    if (file) {
      setResult(
        <Result
          status="success"
          title={t('Good news, you can download your file')}
          extra={[
            <Button
              key="download"
              type="primary"
              onClick={() => {
                const a = document.createElement('a');
                a.href = `${cfg.apiBaseUrl}/v1/tdlib/download?secret=${file.file_token}`;
                a.download = file.file_name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
            >
              {t('Download')}
            </Button>,
          ]}
        />,
      );
    } else {
      setResult(
        <Result
          status="error"
          title={t('Failed to prepare the download link')}
          subTitle={t('The file you are looking for does not exist, or the link expired')}
          extra={[
            <Button key="retry" onClick={() => fetchDownloadToken()}>
              {t('Retry')}
            </Button>,
          ]}
        />,
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDownloadToken();
  }, []);

  return loading ? (
    <Result
      icon={<LoadingOutlined />}
      title={t('Wait for the download link to be ready…')}
      extra={<Button disabled type="primary">{t('Download')}</Button>}
    />
  ) : result;
}

export default DownloadPage;
