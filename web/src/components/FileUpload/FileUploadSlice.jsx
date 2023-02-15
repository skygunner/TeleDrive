/* eslint-disable no-param-reassign */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import md5 from 'md5';

import { fileUploaded } from '../FilesView/FilesViewSlice';
import { getAuthHeaders, post } from '../../api';

export const uploadAsync = createAsyncThunk(
  'fileUploadList/upload',
  async (uploadOptions, thunkAPI) => {
    const {
      parentId, onSuccess, onError, onProgress, file,
    } = uploadOptions;

    const { dispatch } = thunkAPI;
    const authHeaders = getAuthHeaders();

    const buffer = await file.arrayBuffer();
    const binaryArray = new Uint8Array(buffer);

    const partSize = 512 * 1024;
    const fileName = file.name;
    const fileSize = file.size;
    const totalParts = Math.floor((fileSize + partSize - 1) / partSize);
    const md5Checksum = md5(binaryArray);

    const headers = {
      ...authHeaders,
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    };

    const uploadPart = async (filePart, fileId) => {
      let url = `/v1/tdlib/upload?file_size=${fileSize}&total_parts=${totalParts}&file_part=${filePart}&md5_checksum=${md5Checksum}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }
      if (fileId) {
        url += `&file_id=${fileId}`;
      }

      const start = (filePart - 1) * partSize;
      const end = start + partSize;
      const data = file.slice(start, end);

      const fileInfo = await post(url, data, headers);
      if (fileInfo) {
        onProgress({ percent: Math.floor((filePart / totalParts) * 100) });
        if (filePart === totalParts) {
          dispatch(fileUploaded(fileInfo));
          onSuccess('OK');
        } else {
          await uploadPart(filePart + 1, fileInfo.file_id);
        }
      } else {
        const err = new Error(`${fileName} upload failed.`);
        onError({ err });
      }
    };

    await uploadPart(1);
  },
);

export const fileUploadSlice = createSlice({
  name: 'fileUploadList',
  initialState: {
    files: [],
  },
  reducers: {},
});

export const selectFiles = (state) => state.fileUploadList;
// export const {} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
