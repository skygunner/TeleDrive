import React from 'react';
import { theme } from 'antd';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { isUserLoggedIn } from '../api';
import LoginButton from '../components/LoginButton';
import cfg from '../config';

const { useToken } = theme;

function LoginPage() {
  const { t } = useTranslation();
  const { token } = useToken();

  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace />;
  }

  const sectionMargin = '20px 0px';

  return (
    <div
      style={{
        textAlign: 'left',
        margin: cfg.pageMargin,
        fontSize: token.fontSize,
        color: token.colorTextSecondary,
      }}
    >
      <h1 style={{ color: token.colorText }}>
        {t('Login')}
      </h1>
      <div style={{ margin: sectionMargin }}>
        <p>
          {t('To log in, please click on the button below. This will redirect you to Telegram where you can authorize our website to access your account.')}
        </p>
      </div>
      <div style={{ margin: sectionMargin, marginBottom: -5 }}>
        <p>
          {t("If you do not have a Telegram account yet, you will need to create one before you can log in. Don't worry, it's quick and easy to sign up!")}
        </p>
      </div>
      <div style={{ width: 'fit-content' }}>
        <LoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
