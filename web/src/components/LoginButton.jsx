import React from 'react';
import { useNavigate } from 'react-router-dom';
import TelegramLoginButton from 'react-telegram-login';

import { post, storeUserCredential } from '../api';
import cfg from '../config';

function LoginButton() {
  const navigate = useNavigate();

  const onTelegramResponse = async (data) => {
    const userCredential = await post('/v1/auth/signIn', data);
    if (userCredential) {
      storeUserCredential(userCredential);
      navigate('/files', { replace: true });
    }
  };

  return (
    <div
      style={{
        marginTop: 30,
        display: 'flex',
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
  );
}

export default LoginButton;
