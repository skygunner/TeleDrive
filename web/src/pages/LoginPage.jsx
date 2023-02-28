import React from 'react';
import { Row, Col } from 'antd';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { isUserLoggedIn } from '../api';
import LoginButton from '../components/LoginButton';
import colors from '../styles/colors';

function LoginPage() {
  const { t } = useTranslation();

  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace />;
  }

  const topMargin = '30px 25px';
  const sectionMargin = '20px 0px';

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div
          style={{
            fontSize: 14,
            textAlign: 'left',
            margin: topMargin,
            color: colors.colorTextSecondary,
          }}
        >
          <h1 style={{ color: colors.colorText }}>
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
      </Col>
    </Row>
  );
}

export default LoginPage;
