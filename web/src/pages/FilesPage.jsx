import { Navigate } from 'react-router-dom';

import React from 'react';
import { isUserLoggedIn } from '../api';
import FileUploader from '../components/FileUploader';
import FilesView from '../components/FilesView';

function FilesPage() {
  const isLoggedIn = isUserLoggedIn();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <FileUploader />
      <FilesView />
    </>
  );
}

export default FilesPage;
