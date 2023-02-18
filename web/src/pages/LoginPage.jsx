import React from 'react';
import { Navigate } from 'react-router-dom';

import { isUserLoggedIn } from '../api';
import LoginButton from '../components/LoginButton';

function LoginPage() {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace />;
  }

  return (
    <LoginButton />
  );
}

export default LoginPage;
