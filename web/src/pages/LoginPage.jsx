import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../api";
import LoginButton from "../components/LoginButton";

const LoginPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace={true} />;
  }

  return <LoginButton />;
};

export default LoginPage;
