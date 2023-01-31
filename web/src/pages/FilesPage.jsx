import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../api/utils";
import FileUploader from "../components/FileUploader";
import FilesView from "../components/FilesView";

const FilesPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <>
      <FileUploader />
      <FilesView />
    </>
  );
};

export default FilesPage;
