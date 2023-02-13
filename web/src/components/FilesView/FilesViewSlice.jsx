/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

export const filesViewTableSlice = createSlice({
  name: 'filesViewTable',
  initialState: {
    loading: false,
    foldersOffset: 0,
    folderListEnd: false,
    filesOffset: 0,
    dataSource: [],
  },
  reducers: {
    fileUploaded: (state, action) => {
      state.foldersOffset += action.payload;
    },
  },
});

export const selectDetails = (state) => state.filesViewTable.value;
export const { fileUploaded } = filesViewTableSlice.actions;
export default filesViewTableSlice.reducer;
