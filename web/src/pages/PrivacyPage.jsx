import React from 'react';
import { Button, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import config from '../config';

const { useToken } = theme;

function PrivacyPage() {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <div
      id="ppms_cm_privacy_settings"
      style={{
        textAlign: 'left',
        margin: config.pageMargin,
        fontSize: token.fontSize,
        color: token.colorTextSecondary,
      }}
    >
      <h1 style={{ color: token.colorText }}>
        {t('Privacy')}
      </h1>
      <p style={{ margin: '20px 0px' }}>
        {t('We collect and process your data on this site to better understand how it is used. We always ask you for consent to do that. You can change your privacy settings here.')}
      </p>
      <Button id="ppms_cm_privacy_settings_button">
        {t('Manage settings')}
      </Button>
    </div>
  );
}

export default PrivacyPage;
