import {
  FileOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Drawer, Menu, Row } from "antd";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useLocation, useNavigate } from "react-router-dom";

import {
  get,
  getAuthHeaders,
  isUserLoggedIn,
  post,
  removeUserCredential,
} from "../../api/utils";

const NavigationMenu = () => {
  console.log("here");
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = isUserLoggedIn();

  const [user, setUser] = useState();
  useEffect(() => {
    if (isLoggedIn && !user) {
      get("/v1/user", getAuthHeaders()).then((user) => {
        if (user) {
          setUser(user);
        }
      });
    }
  });

  const mediaQueryMatch = useMediaQuery(
    { query: "(min-width: 576px)" },
    undefined,
    (match) => {
      setUseDrawer(!match);
    }
  );
  const [useDrawer, setUseDrawer] = useState(!mediaQueryMatch);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  let userMenuItems = [];
  let mainMenuItems = [
    {
      key: "/",
      label: "Home",
      icon: <HomeOutlined />,
      onClick: () => {
        navigate("/");
        closeDrawer();
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
        closeDrawer();
      },
    });

    userMenuItems.push({
      key: "/logout",
      label: "Logout",
      icon: useDrawer ? (
        <LogoutOutlined />
      ) : (
        <Avatar
          style={{ justifyContent: "center", verticalAlign: "middle" }}
          size="default"
          icon={<UserOutlined />}
          src={user ? user.photo_url : null}
        />
      ),
      onClick: async () => {
        const resp = await post("/v1/auth/signOut", {}, getAuthHeaders());
        if (resp) {
          navigate("/");
          setUser();
          removeUserCredential();
          closeDrawer();
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
        closeDrawer();
      },
    });
  }

  const styles = {
    fontWeight: "bold",
  };

  return (
    <Row align="middle">
      <Col span={1}></Col>
      <Col span={useDrawer ? 22 : 11}>
        {useDrawer ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button style={{ border: 0 }} onClick={openDrawer}>
                <MenuOutlined />
              </Button>
              <Avatar src={process.env.PUBLIC_URL + "/logo192.png"} />
              <p style={{ marginLeft: 10 }}>TeleDrive</p>
            </div>
            <Drawer
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: -18,
                    marginBottom: -17,
                  }}
                >
                  <Avatar
                    size="default"
                    icon={<UserOutlined />}
                    src={user ? user.photo_url : null}
                  />
                  <p style={{ marginLeft: 10 }}>
                    {user
                      ? user.first_name + " " + user.last_name
                      : "TeleDrive"}
                  </p>
                </div>
              }
              placement="left"
              onClose={closeDrawer}
              open={isDrawerOpen}
            >
              <Menu
                style={{ ...styles, justifyContent: "left" }}
                mode="vertical"
                selectedKeys={[location.pathname]}
                items={mainMenuItems.concat(userMenuItems)}
                overflowedIndicator={false}
              />
            </Drawer>
            <Divider style={{ margin: 0 }} type="horizontal" />
          </>
        ) : (
          <Menu
            style={{ ...styles, justifyContent: "left" }}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={mainMenuItems}
            overflowedIndicator={false}
          />
        )}
      </Col>
      {!useDrawer ? (
        <Col span={11}>
          <Menu
            style={{ ...styles, justifyContent: "right" }}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={userMenuItems}
            overflowedIndicator={false}
          />
        </Col>
      ) : (
        <></>
      )}
      <Col span={1}></Col>
    </Row>
  );
};

export default NavigationMenu;
