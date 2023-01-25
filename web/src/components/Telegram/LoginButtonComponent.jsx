import { useNavigate } from "react-router-dom";
import TelegramLoginButton from "react-telegram-login";

import { post, storeUserCredential } from "../../api/utils";

const LoginButton = () => {
  const navigate = useNavigate();

  const onTelegramResponse = async (data) => {
    const resp = await post("/v1/auth/signIn", data);
    if (resp) {
      storeUserCredential(resp);
      navigate("/files", { replace: true });
    }
  };

  const styles = {
    marginTop: 10,
  };

  return (
    <div style={styles}>
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
};

export default LoginButton;
