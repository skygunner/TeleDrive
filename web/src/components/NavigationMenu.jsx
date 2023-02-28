import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
  LockOutlined,
  CustomerServiceOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import {
  Avatar, Button, Col, Divider, Drawer, Menu, Row, Typography,
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
  }, [location.pathname]);

  // https://ant.design/components/layout#breakpoint-width
  const mediaQueryMatch = useMediaQuery(
    { query: '(min-width: 768px)' },
    null,
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
    {
      key: '/privacy',
      label: t('Privacy'),
      icon: <LockOutlined />,
      onClick: () => {
        navigate('/privacy');
        closeDrawer();
      },
    },
    {
      key: '/support',
      label: t('Support'),
      icon: <CustomerServiceOutlined />,
      onClick: () => {
        navigate('/support');
        closeDrawer();
      },
    },
  ];

  if (isLoggedIn) {
    mainMenuItems.push({
      key: '/files',
      label: t('My Files'),
      icon: <CloudOutlined />,
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
          alt={user ? `${user.first_name} ${user.last_name}` : null}
          size="default"
          icon={<UserOutlined />}
          src={user ? user.photo_url : null}
        />
      ),
      onClick: async () => {
        await post('/v1/auth/signOut', {}, authHeaders);
        setUser();
        removeUserCredential();
        navigate('/', { replace: true });
        closeDrawer();
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

  return (
    <div style={{
      top: 0,
      zIndex: 1,
      width: '100%',
      position: 'sticky',
      backgroundColor: '#ffffff',
    }}
    >
      <Row align="middle">
        <Col offset={1} span={useDrawer ? 22 : 15}>
          {useDrawer ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button tabIndex={-1} style={{ border: 0, boxShadow: 'none' }} onClick={openDrawer}>
                  <MenuOutlined />
                </Button>
                <Avatar alt="TeleDrive" src={`${process.env.PUBLIC_URL}/logo192.png`} />
                <p style={{ marginLeft: 10 }}>
                  <Typography.Text strong>TeleDrive</Typography.Text>
                </p>
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
                      alt={user ? `${user.first_name} ${user.last_name}` : 'TeleDrive'}
                      src={user ? user.photo_url : `${process.env.PUBLIC_URL}/logo192.png`}
                    />
                    <p style={{ marginLeft: 10, maxWidth: 185 }}>
                      <Typography.Text
                        strong
                        ellipsis
                        tabIndex={-1}
                        style={{ paddingRight: 15 }}
                      >
                        {user ? `${user.first_name} ${user.last_name}` : 'TeleDrive'}
                      </Typography.Text>
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
                  style={{ fontWeight: 'bold', justifyContent: 'left', border: 0 }}
                  mode="vertical"
                  selectedKeys={[location.pathname]}
                  items={mainMenuItems.concat(userMenuItems)}
                  overflowedIndicator={false}
                  tabIndex={-1}
                />
              </Drawer>
              <Divider style={{ margin: 0 }} type="horizontal" />
            </>
          ) : (
            <Menu
              style={{ fontWeight: 'bold', justifyContent: 'left' }}
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={mainMenuItems}
              overflowedIndicator={false}
              tabIndex={-1}
            />
          )}
        </Col>
        {!useDrawer ? (
          <Col span={7}>
            <Menu
              style={{ fontWeight: 'bold', justifyContent: 'right' }}
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={userMenuItems}
              overflowedIndicator={false}
              tabIndex={-1}
            />
          </Col>
        ) : null}
      </Row>
    </div>
  );
}

export default NavigationMenu;
