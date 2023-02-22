import React from 'react';
import { message, Alert } from 'antd';

export const humanReadableSize = (size, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(size) < thresh) {
    return `${size} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  let calculatedSize = size;

  do {
    calculatedSize /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(calculatedSize) * r) / r >= thresh
    && u < units.length - 1
  );

  return `${calculatedSize.toFixed(dp)} ${units[u]}`;
};

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

export const alertError = (description) => {
  message.open({
    duration: 5,
    content: <Alert
      showIcon
      closable
      type="error"
      message="Error"
      description={description}
    />,
  });
};

export const isTouchScreen = () => 'ontouchstart' in window || window.navigator.msMaxTouchPoints;
