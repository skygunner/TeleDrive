import { Row } from "antd";
import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../api";
import LoginButton from "../components/LoginButton";

const LoginPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (isLoggedIn) {
    return <Navigate to="/files" replace={true} />;
  }

  return (
    <Row align="middle" style={{ justifyContent: "center", marginTop: 50 }}>
      <LoginButton />
    </Row>
  );
};

export default LoginPage;
