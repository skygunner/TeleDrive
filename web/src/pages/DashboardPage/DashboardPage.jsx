import { Navigate } from "react-router-dom";

import { isUserLoggedIn } from "../../api/utils";
import FileUploader from "../../components/FileUploader/FileUploaderComponent";

const DashboardPage = () => {
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <FileUploader />;
};

export default DashboardPage;
