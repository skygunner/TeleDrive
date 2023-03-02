import React from 'react';
import { Result } from 'antd';
import { FrownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

function OfflinePage() {
  const { t } = useTranslation();

  return (
    <Result
      icon={<FrownOutlined />}
      title={t('Offline')}
      subTitle={t('You are offline!')}
    />
  );
}

export default OfflinePage;
