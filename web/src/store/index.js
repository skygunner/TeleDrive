import { configureStore } from '@reduxjs/toolkit';
import filesViewTableReducer from '../components/FilesView/FilesViewSlice';
import fileUploadListReducer from '../components/FileUpload/FileUploadSlice';

export default configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: {
    filesViewTableDetails: filesViewTableReducer,
    fileUploadList: fileUploadListReducer,
  },
});
