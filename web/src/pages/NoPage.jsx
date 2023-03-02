import { Result } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';

function NoPage() {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404 Not Found"
      subTitle={t('Sorry, the page you visited does not exist.')}
    />
  );
}

export default NoPage;
