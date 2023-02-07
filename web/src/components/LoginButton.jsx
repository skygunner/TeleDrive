import { useNavigate } from 'react-router-dom';
import TelegramLoginButton from 'react-telegram-login';

import React from 'react';
import { post, storeUserCredential } from '../api';

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
    <div style={{ marginTop: 10 }}>
      <TelegramLoginButton
        botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
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
