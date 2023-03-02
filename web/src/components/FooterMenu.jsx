import React from 'react';
import { useTranslation } from 'react-i18next';
import { theme } from 'antd';

const { useToken } = theme;

function FooterMenu() {
  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <div style={{
      textAlign: 'center',
      margin: '50px 0px',
      color: token.colorTextTertiary,
    }}
    >
      {t('Copyright © 2023 teledrive.io all rights reserved.')}
    </div>
  );
}

export default FooterMenu;
