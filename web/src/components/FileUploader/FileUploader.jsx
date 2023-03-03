import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Divider, theme } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { uploadAsync, setUploadDraggerFileList, selectFiles } from './FileUploaderSlice';

const { useToken } = theme;

function FileUploader() {
  const { t } = useTranslation();
  const { token } = useToken();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');

  // https://ant.design/components/layout#breakpoint-width
  const mediaQueryMatch = useMediaQuery(
    { query: '(min-width: 768px)' },
    null,
    (match) => {
      // eslint-disable-next-line no-use-before-define
      setUseDragger(!match);
    },
  );
  const [useDragger, setUseDragger] = useState(!mediaQueryMatch);

  const { floatButtonFileList, uploadDraggerFileList } = useSelector(selectFiles);
  const fileList = floatButtonFileList.concat(uploadDraggerFileList);

  const onStatusChange = (info) => {
    const { status } = info.file;
    if (status === 'uploading' || status === 'error' || status === 'done' || status === 'success') {
      dispatch(setUploadDraggerFileList(
        info.fileList.filter((file) => file.status === 'uploading'),
      ));
    }
  };

  const uploadFile = async (uploadOptions) => {
    dispatch(uploadAsync({ parentId, ...uploadOptions }));
  };

  return (
    <>
      {!useDragger ? (
        <Upload.Dragger
          style={{ margin: '10px 0' }}
          multiple
          onChange={onStatusChange}
          customRequest={uploadFile}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            {t('Click or drag files to this area to upload')}
          </p>
          <p className="ant-upload-hint">
            {t(
              'Support for a single or bulk upload. Strictly prohibit uploading company data or other band files',
            )}
          </p>
        </Upload.Dragger>
      ) : null}
      {fileList.length > 0
        ? (
          <div>
            <Divider
              style={{
                fontWeight: 'bold',
                fontSize: token.fontSize + 2,
                borderBlockStart: '0px transparent',
              }}
              orientation="left"
              orientationMargin={14}
            >
              {t('Uploads')}
            </Divider>
            <div style={{ margin: '0px 24px', marginBottom: 10 }}>
              <Upload fileList={fileList} />
            </div>
          </div>
        )
        : null}
    </>
  );
}

export default FileUploader;
