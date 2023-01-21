import React from "react";
import TelegramLoginButton from "react-telegram-login";

import { post } from "./../../api";
import FileUpload from "./../FileUpload/FileUploadComponent";
import { AppContainer } from "./AppStyles";

const App = () => {
  const onTelegramResponse = async (data) => {
    const resp = await post("/v1/auth/signIn", data);
    if (resp) {
      localStorage.setItem("jwt_token", {
        token: resp.jwt_token,
        expire_at: resp.expire_at,
      });
    }
  };

  const uploadFilesHandler = (files) => {
    console.log(files);
  };

  return (
    <>
      <AppContainer>
        <TelegramLoginButton
          botName={process.env.REACT_APP_TELEGRAM_BOT_NAME}
          dataOnauth={onTelegramResponse}
          buttonSize="large"
          requestAccess="write"
          usePic="true"
          lang="en"
        />
        <FileUpload multiple uploadFilesHandler={uploadFilesHandler} />
      </AppContainer>
    </>
  );
};

export default App;
