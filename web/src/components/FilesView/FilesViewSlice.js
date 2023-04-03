/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, getAuthHeaders } from '../../api';
import config from '../../config';
import {
  sendEvent, FILE_EVENTS, RENAME_FILE, RENAME_FOLDER,
  MOVE_FILE, MOVE_FOLDER, DELETE_FILE, DELETE_FOLDER,
  CREATE_FOLDER, UPLOAD_FILE,
} from '../../analytics';

const initialState = {
  parentId: null,
  loading: false,
  files: [],
  filesOffset: 0,
  filesListEnd: false,
  folders: [],
  foldersOffset: 0,
  folderListEnd: false,
};

export const fetchDataAsync = createAsyncThunk(
  'filesViewTableDetails/fetchDataAsync',
  async (parentId, thunkAPI) => {
    const authHeaders = getAuthHeaders();

    const states = thunkAPI.getState();
    const details = states.filesViewTableDetails;
    const payload = {
      files: details.files,
      filesOffset: details.filesOffset,
      filesListEnd: details.filesListEnd,
      folders: details.folders,
      foldersOffset: details.foldersOffset,
      folderListEnd: details.folderListEnd,
    };

    let files = [];
    let folders = [];

    if (!details.folderListEnd) {
      let url = `/v1/tdlib/folders?offset=${details.foldersOffset}&limit=${config.listLoadLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      folders = await get(url, authHeaders);
      if (!folders) {
        return payload;
      }

      payload.foldersOffset += folders.length;
      payload.folders = payload.folders.concat(folders);
    }

    if (folders.length < config.listLoadLimit) {
      payload.folderListEnd = true;

      const filesLimit = config.listLoadLimit - folders.length;

      let url = `/v1/tdlib/files?offset=${details.filesOffset}&limit=${filesLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      files = await get(url, authHeaders);
      if (!files) {
        return payload;
      }

      payload.filesOffset += files.length;
      payload.files = payload.files.concat(files);

      if (files.length < filesLimit) {
        payload.filesListEnd = true;
      }
    }

    return payload;
  },
);

export const filesViewTableSlice = createSlice({
  name: 'filesViewTableDetails',
  initialState,
  reducers: {
    resetState: (state, action) => {
      state.parentId = action.payload;
      state.loading = initialState.loading;
      state.files = initialState.files;
      state.filesOffset = initialState.filesOffset;
      state.filesListEnd = initialState.filesListEnd;
      state.folders = initialState.folders;
      state.foldersOffset = initialState.foldersOffset;
      state.folderListEnd = initialState.folderListEnd;
    },
    fileUploaded: (state, action) => {
      const parentId = state.parentId ? parseInt(state.parentId, 10) : null;
      if (parentId === action.payload.parent_id) {
        state.filesOffset += 1;
        state.files = [action.payload].concat(state.files);
      }
      sendEvent(FILE_EVENTS, UPLOAD_FILE);
    },
    fileRenamed: (state, action) => {
      state.files = state.files.map((file) => (
        file.file_id === action.payload.file_id ? action.payload : file
      ));
      sendEvent(FILE_EVENTS, RENAME_FILE);
    },
    fileMoved: (state, action) => {
      const parentId = state.parentId ? parseInt(state.parentId, 10) : null;
      if (parentId !== action.payload.parent_id) {
        state.filesOffset -= 1;
        state.files = state.files.filter((file) => file.file_id !== action.payload.file_id);
      }
      sendEvent(FILE_EVENTS, MOVE_FILE);
    },
    fileDeleted: (state, action) => {
      state.filesOffset -= 1;
      state.files = state.files.filter((file) => file.file_id !== action.payload);
      sendEvent(FILE_EVENTS, DELETE_FILE);
    },
    folderCreated: (state, action) => {
      state.foldersOffset += 1;
      state.folders = [action.payload].concat(state.folders);
      sendEvent(FILE_EVENTS, CREATE_FOLDER);
    },
    folderRenamed: (state, action) => {
      state.folders = state.folders.map((folder) => (
        folder.folder_id === action.payload.folder_id ? action.payload : folder
      ));
      sendEvent(FILE_EVENTS, RENAME_FOLDER);
    },
    folderMoved: (state, action) => {
      const parentId = state.parentId ? parseInt(state.parentId, 10) : null;
      if (parentId !== action.payload.parent_id) {
        state.foldersOffset -= 1;
        state.folders = state.folders.filter(
          (folder) => folder.folder_id !== action.payload.folder_id,
        );
      }
      sendEvent(FILE_EVENTS, MOVE_FOLDER);
    },
    folderDeleted: (state, action) => {
      state.foldersOffset -= 1;
      state.folders = state.folders.filter((folder) => folder.folder_id !== action.payload);
      sendEvent(FILE_EVENTS, DELETE_FOLDER);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.files;
        state.filesOffset = action.payload.filesOffset;
        state.filesListEnd = action.payload.filesListEnd;
        state.folders = action.payload.folders;
        state.foldersOffset = action.payload.foldersOffset;
        state.folderListEnd = action.payload.folderListEnd;
      });
  },
});

export const selectDetails = (state) => state.filesViewTableDetails;
export const {
  resetState, fileUploaded, fileRenamed, fileMoved, fileDeleted,
  folderCreated, folderRenamed, folderMoved, folderDeleted,
} = filesViewTableSlice.actions;
export default filesViewTableSlice.reducer;
