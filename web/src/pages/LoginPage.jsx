import { Row } from 'antd';
import { Navigate } from 'react-router-dom';

import React from 'react';
import { isUserLoggedIn } from '../api';
import LoginButton from '../components/LoginButton';

function LoginPage() {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace />;
  }

  return (
    <Row align="middle" style={{ justifyContent: 'center', marginTop: 50 }}>
      <LoginButton />
    </Row>
  );
}

export default LoginPage;
