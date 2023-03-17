import React from 'react';
import { Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { RiWifiOffLine } from 'react-icons/ri';

function OfflinePage() {
  const { t } = useTranslation();

  return (
    <Result
      className="center-screen"
      icon={<RiWifiOffLine size={175} />}
      title={t('There is no internet connection')}
      subTitle={t('Your computer is offline')}
    />
  );
}

export default OfflinePage;
