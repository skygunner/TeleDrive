import { configureStore } from '@reduxjs/toolkit';
import filesViewTableReducer from '../components/FilesView/FilesViewSlice';
import fileUploaderListReducer from '../components/FileUploader/FileUploaderSlice';
import moveEntityModalReducer from '../components/MoveEntityModal/MoveEntityModalSlice';

export default configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    filesViewTableDetails: filesViewTableReducer,
    fileUploaderList: fileUploaderListReducer,
    moveEntityModalDetails: moveEntityModalReducer,
  },
});
