import { useNavigate } from 'react-router-dom';
import TelegramLoginButton from 'react-telegram-login';
import { Row, Col } from 'antd';

import React from 'react';
import { post, storeUserCredential } from '../api';
import cfg from '../config';

function LoginButton() {
  const navigate = useNavigate();

  const onTelegramResponse = async (data) => {
    const userCredential = await post('/v1/auth/signIn', data);
    if (userCredential) {
      storeUserCredential(userCredential);
      navigate('/files', { replace: true });
      window.location.reload(true); // NavigationMenu issue
    }
  };

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TelegramLoginButton
            botName={cfg.telegramBotName}
            dataOnauth={onTelegramResponse}
            buttonSize="large"
            requestAccess="write"
            usePic="true"
            lang="en"
          />
        </div>
      </Col>
    </Row>
  );
}

export default LoginButton;
