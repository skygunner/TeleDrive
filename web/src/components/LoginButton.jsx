import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import TelegramLoginButton from 'react-telegram-login';

import { post, storeUserCredential } from '../api';
import cfg from '../config';
import { sendEvent, USER_EVENTS, TELEGRAM_LOGIN } from '../analytics';

function LoginButton() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onTelegramResponse = async (data) => {
    setLoading(true);
    const userCredential = await post('/v1/auth/signIn', data);
    if (userCredential) {
      storeUserCredential(userCredential);
      navigate('/files', { replace: true });
      sendEvent(USER_EVENTS, TELEGRAM_LOGIN);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 30 }}>
      <Spin spinning={loading}>
        <TelegramLoginButton
          botName={cfg.telegramBotName}
          dataOnauth={onTelegramResponse}
          buttonSize="large"
          requestAccess="write"
          usePic="true"
          lang="en"
        />
      </Spin>
    </div>
  );
}

export default LoginButton;
