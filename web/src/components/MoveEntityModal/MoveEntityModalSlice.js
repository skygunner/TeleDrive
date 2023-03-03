/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get, getAuthHeaders } from '../../api';
import config from '../../config';

const initialState = {
  entity: null,
  parentId: null,
  loading: false,
  folders: [],
  foldersOffset: 0,
  folderListEnd: false,
};

export const fetchDataAsync = createAsyncThunk(
  'moveEntityModalDetails/fetchDataAsync',
  async (parentId, thunkAPI) => {
    const authHeaders = getAuthHeaders();

    const states = thunkAPI.getState();
    const details = states.moveEntityModalDetails;
    const payload = {
      folders: details.folders,
      foldersOffset: details.foldersOffset,
      folderListEnd: details.folderListEnd,
    };

    let url = `/v1/tdlib/folders?offset=${details.foldersOffset}&limit=${config.listLoadLimit}`;
    if (parentId) {
      url += `&parent_id=${parentId}`;
    }

    const folders = await get(url, authHeaders);
    if (!folders) {
      return payload;
    }

    payload.foldersOffset += folders.length;
    payload.folders = payload.folders.concat(folders)
      .filter((folder) => folder.folder_id !== details.entity.folder_id);
    payload.folderListEnd = folders.length < config.listLoadLimit;

    return payload;
  },
);

export const moveEntityModalSlice = createSlice({
  name: 'moveEntityModalDetails',
  initialState,
  reducers: {
    openMoveEntityModal: (state, action) => {
      state.entity = action.payload;
      state.parentId = initialState.parentId;
      state.loading = initialState.loading;
      state.folders = initialState.folders;
      state.foldersOffset = initialState.foldersOffset;
      state.folderListEnd = initialState.folderListEnd;
    },
    changeMoveEntityModalParentId: (state, action) => {
      state.parentId = action.payload;
      state.folders = initialState.folders;
      state.foldersOffset = initialState.foldersOffset;
      state.folderListEnd = initialState.folderListEnd;
    },
    closeMoveEntityModal: (state) => {
      state.entity = initialState.entity;
      state.parentId = initialState.parentId;
      state.loading = initialState.loading;
      state.folders = initialState.folders;
      state.foldersOffset = initialState.foldersOffset;
      state.folderListEnd = initialState.folderListEnd;
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
        state.folders = action.payload.folders;
        state.foldersOffset = action.payload.foldersOffset;
        state.folderListEnd = action.payload.folderListEnd;
      });
  },
});

export const selectDetails = (state) => state.moveEntityModalDetails;
export const {
  openMoveEntityModal, changeMoveEntityModalParentId, closeMoveEntityModal,
} = moveEntityModalSlice.actions;
export default moveEntityModalSlice.reducer;
