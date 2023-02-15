import { Navigate } from 'react-router-dom';

import React from 'react';
import { isUserLoggedIn } from '../api';
import FileUploader from '../components/FileUpload/FileUploader';
import FilesView from '../components/FilesView/FilesView';
import FloatButtonGroup from '../components/FloatButtonGroup';

function FilesPage() {
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <FileUploader />
      <FilesView />
      <FloatButtonGroup />
    </>
  );
}

export default FilesPage;
