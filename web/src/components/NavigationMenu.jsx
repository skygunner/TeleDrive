import {
  FileOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar, Button, Col, Divider, Drawer, Menu, Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  get,
  getAuthHeaders,
  isUserLoggedIn,
  post,
  removeUserCredential,
} from '../api';

function NavigationMenu() {
  const isLoggedIn = isUserLoggedIn();
  const authHeaders = getAuthHeaders();

  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    get('/v1/user', authHeaders).then((apiUser) => {
      if (apiUser) {
        setUser(apiUser);
      }
    });
  }, []);

  const mediaQueryMatch = useMediaQuery(
    { query: '(min-width: 576px)' },
    undefined,
    (match) => {
      // eslint-disable-next-line no-use-before-define
      setUseDrawer(!match);
    },
  );
  const [useDrawer, setUseDrawer] = useState(!mediaQueryMatch);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const userMenuItems = [];
  const mainMenuItems = [
    {
      key: '/',
      label: t('Home'),
      icon: <HomeOutlined />,
      onClick: () => {
        navigate('/');
        closeDrawer();
      },
    },
  ];

  if (isLoggedIn) {
    mainMenuItems.push({
      key: '/files',
      label: t('My Files'),
      icon: <FileOutlined />,
      onClick: () => {
        navigate('/files');
        closeDrawer();
      },
    });

    userMenuItems.push({
      key: '/logout',
      label: t('Logout'),
      icon: useDrawer ? (
        <LogoutOutlined />
      ) : (
        <Avatar
          style={{ justifyContent: 'center', verticalAlign: 'middle' }}
          size="default"
          icon={<UserOutlined />}
          src={user ? user.photo_url : null}
        />
      ),
      onClick: async () => {
        const resp = await post('/v1/auth/signOut', {}, authHeaders);
        if (resp) {
          setUser();
          removeUserCredential();
          navigate('/', { replace: true });
          closeDrawer();
        }
      },
    });
  } else {
    userMenuItems.push({
      key: '/login',
      label: t('Login'),
      icon: <LoginOutlined />,
      onClick: () => {
        navigate('/login');
        closeDrawer();
      },
    });
  }

  const menuStyles = {
    fontWeight: 'bold',
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 1, width: '100%', backgroundColor: '#ffffff',
    }}
    >
      <Row align="middle">
        <Col offset={1} span={useDrawer ? 22 : 11}>
          {useDrawer ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button style={{ border: 0 }} onClick={openDrawer}>
                  <MenuOutlined />
                </Button>
                <Avatar src={`${process.env.PUBLIC_URL}/logo192.png`} />
                <p style={{ marginLeft: 10 }}>TeleDrive</p>
              </div>
              <Drawer
                title={(
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: -18,
                      marginBottom: -18,
                    }}
                  >
                    <Avatar
                      size="default"
                      src={
                      user
                        ? user.photo_url
                        : `${process.env.PUBLIC_URL}/logo192.png`
                    }
                    />
                    <p style={{ marginLeft: 10 }}>
                      {user
                        ? `${user.first_name} ${user.last_name}`
                        : 'TeleDrive'}
                    </p>
                  </div>
              )}
                placement="left"
                onClose={closeDrawer}
                open={isDrawerOpen}
                closable={false}
                width={250}
              >
                <Menu
                  style={{ ...menuStyles, justifyContent: 'left', border: 0 }}
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
              style={{ ...menuStyles, justifyContent: 'left' }}
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
              style={{ ...menuStyles, justifyContent: 'right' }}
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={userMenuItems}
              overflowedIndicator={false}
            />
          </Col>
        ) : null}
      </Row>
    </div>
  );
}

export default NavigationMenu;
