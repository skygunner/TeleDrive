import React from 'react';
import { message, Alert } from 'antd';
import { FolderTwoTone } from '@ant-design/icons';
import i18n from '../i18n';

export const humanReadableDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const fileExtension = (fileName) => {
  const split = fileName.split('.');
  if (split.length > 1) {
    return split.pop();
  }

  return '';
};

export const folderAvatar = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ maxWidth: 36, marginRight: 10 }}>
      <FolderTwoTone style={{ fontSize: 38, padding: '6px 0' }} />
    </div>
  </div>
);

export const alertError = (description) => {
  message.open({
    duration: 5,
    content: <Alert
      showIcon
      closable
      type="error"
      message={i18n.t('Error')}
      description={description}
    />,
  });
};
