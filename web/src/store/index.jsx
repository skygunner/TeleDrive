import { configureStore } from '@reduxjs/toolkit';
import filesViewTableReducer from '../components/FilesView/FilesViewSlice';

export default configureStore({
  reducer: {
    filesViewTableDetails: filesViewTableReducer,
  },
});
