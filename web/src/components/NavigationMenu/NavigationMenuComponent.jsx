import {
  FileOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Col, Menu, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { getAuthHeaders, isUserLoggedIn, post } from "../../api/utils";
import { removeUserCredential } from "../../api/utils";

const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();

  let userMenuItems = [];
  let mainMenuItems = [
    {
      key: "/",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => {
        navigate("/");
      },
    },
  ];

  if (isLoggedIn) {
    mainMenuItems.push({
      key: "/files",
      label: "Files",
      icon: <FileOutlined />,
      onClick: () => {
        navigate("/files");
      },
    });

    userMenuItems.push({
      key: "/logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: async () => {
        const resp = await post("/v1/auth/signOut", {}, getAuthHeaders());
        if (resp) {
          removeUserCredential();
          navigate("/");
        }
      },
    });
  } else {
    userMenuItems.push({
      key: "/login",
      label: "Login",
      icon: <LoginOutlined />,
      onClick: () => {
        navigate("/login");
      },
    });
  }

  const styles = {
    fontWeight: "bold",
  };

  return (
    <>
      <Row>
        <Col span={12} align="left">
          <Menu
            style={{ ...styles, justifyContent: "left" }}
            mode="horizontal"
            defaultSelectedKeys={[location.pathname]}
            items={mainMenuItems}
          />
        </Col>
        <Col span={12} align="right">
          <Menu
            style={{ ...styles, justifyContent: "right" }}
            mode="horizontal"
            defaultSelectedKeys={[location.pathname]}
            items={userMenuItems}
          />
        </Col>
      </Row>
    </>
  );
};

export default NavigationMenu;
