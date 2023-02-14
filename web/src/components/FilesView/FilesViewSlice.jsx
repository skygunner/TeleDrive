/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, getAuthHeaders } from '../../api';

export const fetchDataAsync = createAsyncThunk(
  'filesViewTableDetails/fetchDataAsync',
  async (parentId, thunkAPI) => {
    const limit = 20;
    const authHeaders = getAuthHeaders();

    const states = thunkAPI.getState();
    const details = states.filesViewTableDetails;
    const payload = {
      foldersOffset: details.foldersOffset,
      folderListEnd: details.folderListEnd,
      filesOffset: details.filesOffset,
      data: details.data,
    };

    let files = [];
    let folders = [];

    if (!details.folderListEnd) {
      let url = `/v1/tdlib/folders?offset=${details.foldersOffset}&limit=${limit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      folders = await get(url, authHeaders);
      if (!folders) {
        return payload;
      }

      folders = folders.map((folder) => ({ type: 'folder', ...folder }));

      payload.foldersOffset += folders.length;
      payload.data = payload.data.concat(folders);
    }

    if (folders.length < limit) {
      payload.folderListEnd = true;
      const filesLimit = limit - folders.length;

      let url = `/v1/tdlib/files?offset=${details.filesOffset}&limit=${filesLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      files = await get(url, authHeaders);
      if (!files) {
        return payload;
      }

      files = files.map((file) => ({ type: 'file', ...file }));

      payload.filesOffset += files.length;
      payload.data = payload.data.concat(files);
    }

    return payload;
  },
);

export const filesViewTableSlice = createSlice({
  name: 'filesViewTableDetails',
  initialState: {
    loading: false,
    foldersOffset: 0,
    folderListEnd: false,
    filesOffset: 0,
    data: [],
  },
  reducers: {
    fileUploaded: (state, action) => {
      state.foldersOffset += action.payload.foldersOffset;
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
        state.foldersOffset = action.payload.foldersOffset;
        state.folderListEnd = action.payload.folderListEnd;
        state.filesOffset = action.payload.filesOffset;
        state.data = action.payload.data;
      });
  },
});

export const selectDetails = (state) => state.filesViewTableDetails;
export const { fileUploaded } = filesViewTableSlice.actions;
export default filesViewTableSlice.reducer;
