import React from "react";

import { isUserLoggedIn } from "../../api/utils";
import FileUploader from "./../../components/FileUploader/FileUploaderComponent";
import LoginButton from "./../../components/Telegram/LoginButtonComponent";

const HomePage = () => {
  const loggedIn = isUserLoggedIn();

  return <>{loggedIn ? <FileUploader /> : <LoginButton />}</>;
};

export default HomePage;
