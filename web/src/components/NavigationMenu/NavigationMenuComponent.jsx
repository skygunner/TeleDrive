import {
  FileOutlined,
  HomeOutlined,
  LoginOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Menu, Row } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  get,
  getAuthHeaders,
  isUserLoggedIn,
  post,
  removeUserCredential,
} from "../../api/utils";

const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isUserLoggedIn();
  const [photoUrl, setPhotoUrl] = useState(null);

  const syncPhotoUrl = async () => {
    if (isLoggedIn) {
      const user = await get("/v1/user", getAuthHeaders());
      if (user && user.photo_url) {
        setPhotoUrl(user.photo_url);
      }
    }
  };

  useEffect(syncPhotoUrl);

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
      icon: (
        <Avatar
          style={{ justifyContent: "center", verticalAlign: "middle" }}
          size="default"
          icon={<UserOutlined />}
          src={photoUrl}
        />
      ),
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
    <Row align="middle">
      <Col span={1}></Col>
      <Col span={13}>
        <Menu
          style={{ ...styles, justifyContent: "left" }}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={mainMenuItems}
          overflowedIndicator={false}
        />
      </Col>
      <Col span={9}>
        <Menu
          style={{ ...styles, justifyContent: "right" }}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={userMenuItems}
          overflowedIndicator={false}
        />
      </Col>
      <Col span={1}></Col>
    </Row>
  );
};

export default NavigationMenu;
