import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../../api/utils";
import FileUploader from "../../components/FileUploader/FileUploaderComponent";

const FilesPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace={true} />;
  }

  return <FileUploader />;
};

export default FilesPage;
