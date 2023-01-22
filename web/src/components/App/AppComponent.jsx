import React from "react";

import FileUploader from "./../FileUploader/FileUploaderComponent";
import LoginButton from "./../Telegram/LoginButtonComponent";
import { AppContainer } from "./AppStyles";

const App = () => {
  return (
    <>
      <AppContainer>
        <LoginButton />
        <FileUploader multiple />
      </AppContainer>
    </>
  );
};

export default App;
