import "./App.css";
import TelegramLoginButton from "react-telegram-login";
import { post } from "./api";

const onTelegramResponse = async (data) => {
  const resp = await post("/v1/auth/signIn/", data);
  if (resp) {
    localStorage.setItem("jwt_token", {
      token: resp.jwt_token,
      expire_at: resp.expire_at,
    });
  }
};

function App() {
  return (
    <div className="App">
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

export default App;
