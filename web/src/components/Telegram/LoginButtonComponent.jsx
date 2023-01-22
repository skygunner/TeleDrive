import TelegramLoginButton from "react-telegram-login";

import { post } from "../../api/utils";

const LoginButton = () => {
  const onTelegramResponse = async (data) => {
    const resp = await post("/v1/auth/signIn", data);
    if (resp) {
      localStorage.setItem("jwt_token", {
        token: resp.jwt_token,
        expire_at: resp.expire_at,
      });
    }
  };

  return (
    <>
      <TelegramLoginButton
        botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
        dataOnauth={onTelegramResponse}
        buttonSize="large"
        requestAccess="write"
        usePic="true"
        lang="en"
      />
    </>
  );
};

export default LoginButton;
