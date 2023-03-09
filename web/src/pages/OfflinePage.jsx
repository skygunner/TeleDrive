import React from 'react';
import { Result } from 'antd';
import { useTranslation } from 'react-i18next';

function OfflinePage() {
  const { t } = useTranslation();

  return (
    <Result
      status="500"
      title={t('Offline')}
      subTitle={t('You are offline!')}
    />
  );
}

export default OfflinePage;
