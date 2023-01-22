import React from "react";

import FileUploader from "./../../components/FileUploader/FileUploaderComponent";
import LoginButton from "./../../components/Telegram/LoginButtonComponent";

const HomePage = () => {
  return (
    <>
      <LoginButton />
      <FileUploader multiple />
    </>
  );
};

export default HomePage;
