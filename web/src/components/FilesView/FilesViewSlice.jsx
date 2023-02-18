/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, getAuthHeaders } from '../../api';
import config from '../../config';

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
  initialState: {
    loading: false,
    files: [],
    filesOffset: 0,
    filesListEnd: false,
    folders: [],
    foldersOffset: 0,
    folderListEnd: false,
  },
  reducers: {
    fileUploaded: (state, action) => {
      state.filesOffset += 1;
      state.files = [action.payload].concat(state.files);
    },
    fileRenamed: (state, action) => {
      state.files = state.files.map((file) => (
        file.file_id === action.payload.file_id ? action.payload : file
      ));
    },
    fileDeleted: (state, action) => {
      state.filesOffset -= 1;
      state.files = state.files.filter((file) => file.file_id !== action.payload);
    },
    folderRenamed: (state, action) => {
      state.folders = state.folders.map((folder) => (
        folder.folder_id === action.payload.folder_id ? action.payload : folder
      ));
    },
    folderDeleted: (state, action) => {
      state.foldersOffset -= 1;
      state.folders = state.folders.filter((folder) => folder.folder_id !== action.payload);
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
  fileUploaded, fileRenamed, fileDeleted, folderRenamed, folderDeleted,
} = filesViewTableSlice.actions;
export default filesViewTableSlice.reducer;
