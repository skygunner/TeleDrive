import ReactGA from 'react-ga4';
import config from '../config';

export const USER_EVENTS = 'user_events';
export const TELEGRAM_LOGIN = 'telegram_login';

export const FILE_EVENTS = 'file_events';
export const UPLOAD_FILE = 'upload_file';
export const CREATE_FOLDER = 'create_folder';
export const DELETE_FILE = 'delete_file';
export const DELETE_FOLDER = 'delete_folder';
export const RENAME_FILE = 'rename_file';
export const RENAME_FOLDER = 'rename_folder';
export const MOVE_FILE = 'move_file';
export const MOVE_FOLDER = 'move_folder';
export const SHARE_FILE = 'share_file';

export const sendEvent = (category, action) => {
  if (config.googleAnalyticsId) {
    ReactGA.event({ category, action });
  }
};

export const sendEventWithValue = (category, action, value) => {
  if (config.googleAnalyticsId) {
    ReactGA.event({
      category, action, value,
    });
  }
};
