import React, { useState } from "react";

import { isUserLoggedIn } from "../../api/utils";
import FileUploader from "./../../components/FileUploader/FileUploaderComponent";
import LoginButton from "./../../components/Telegram/LoginButtonComponent";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());

  const onUserLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <FileUploader />
      ) : (
        <LoginButton onUserLogin={onUserLogin} />
      )}
    </>
  );
};

export default HomePage;
