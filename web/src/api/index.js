import axios from 'axios';
import cfg from '../config';
import { alertError } from '../utils';
import i18n from '../i18n';

const unknownError = new Error(i18n.t('Something went wrong! Please try again later.'));

const baseAPI = axios.create({ baseURL: cfg.apiBaseUrl });

const responseData = (resp) => {
  if (resp.data?.status === 'SUCCESS') {
    return resp.data.data;
  }

  if (resp.data?.details?.length > 0) {
    throw new Error(resp.data.details[0]);
  }

  throw unknownError;
};

const handleError = (error, alert) => {
  if (!alert) {
    return;
  }

  if (axios.isAxiosError(error)) {
    const detailsLength = error.response?.data?.details?.length;
    if (detailsLength > 0) {
      error.response.data.details.forEach((detail) => {
        alertError(detail);
      });
    } else {
      alertError(unknownError.message);
    }
  } else {
    alertError(unknownError.message);
  }
};

export const storeUserCredential = (jwtObject) => {
  const jwtObjectStr = JSON.stringify({
    jwt_token: jwtObject.jwt_token,
    expire_at: jwtObject.expire_at,
  });

  try {
    localStorage.setItem('jwt_object', jwtObjectStr);
  } catch (error) {
    alertError(i18n.t("Failed to store user credentials in the browser's local storage!"));
  }
};

export const removeUserCredential = () => {
  localStorage.removeItem('jwt_object');
};

export const isUserLoggedIn = () => {
  const jwtObjectStr = localStorage.getItem('jwt_object');
  if (jwtObjectStr) {
    const jwtObject = JSON.parse(jwtObjectStr);
    if (jwtObject.expire_at > Math.floor(Date.now() / 1000)) {
      return true;
    }
  }
  return false;
};

export const getAuthHeaders = () => {
  if (isUserLoggedIn()) {
    const jwtObjectStr = localStorage.getItem('jwt_object');
    const jwtObject = JSON.parse(jwtObjectStr);
    return { Authorization: `Bearer ${jwtObject.jwt_token}` };
  }
  return {};
};

export const post = async (url, data, headers = {}, alert = true) => {
  try {
    return responseData(await baseAPI.post(url, data, { headers }));
  } catch (error) {
    handleError(error, alert);
    return null;
  }
};

export const get = async (url, headers = {}, alert = true) => {
  try {
    return responseData(await baseAPI.get(url, { headers }));
  } catch (error) {
    handleError(error, alert);
    return null;
  }
};

export const put = async (url, data, headers = {}, alert = true) => {
  try {
    return responseData(await baseAPI.put(url, data, { headers }));
  } catch (error) {
    handleError(error, alert);
    return null;
  }
};

export const del = async (url, headers = {}, alert = true) => {
  try {
    return responseData(await baseAPI.delete(url, { headers }));
  } catch (error) {
    handleError(error, alert);
    return null;
  }
};
