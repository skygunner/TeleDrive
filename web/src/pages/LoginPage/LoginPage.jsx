import React from "react";
import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../../api/utils";
import LoginButton from "../../components/Telegram/LoginButtonComponent";

const LoginPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <LoginButton />;
};

export default LoginPage;
