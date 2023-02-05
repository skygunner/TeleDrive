import { message } from "antd";
import axios from "axios";

const unknownError = new Error("Something went wrong! Please try again later.");

const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const responseData = (resp) => {
  if (resp.data?.status === "SUCCESS") {
    return resp.data.data;
  }

  if (resp.data?.details?.length > 0) {
    throw new Error(resp.data.details[0]);
  }

  throw unknownError;
};

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    const detailsLength = error.response?.data?.details?.length;
    if (detailsLength > 0) {
      for (var i = 0; i < detailsLength; i++) {
        message.error(error.response.data.details[i]);
      }
    } else {
      console.error(error);
      message.error(unknownError.message);
    }
  } else {
    console.error(error);
    message.error(unknownError.message);
  }
};

export const storeUserCredential = (jwtObject) => {
  const jwtObjectStr = JSON.stringify({
    jwt_token: jwtObject.jwt_token,
    expire_at: jwtObject.expire_at,
  });

  localStorage.setItem("jwt_object", jwtObjectStr);
};

export const removeUserCredential = () => {
  localStorage.removeItem("jwt_object");
};

export const isUserLoggedIn = () => {
  const jwtObjectStr = localStorage.getItem("jwt_object");
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
    const jwtObjectStr = localStorage.getItem("jwt_object");
    const jwtObject = JSON.parse(jwtObjectStr);
    return { Authorization: "Bearer " + jwtObject.jwt_token };
  }
  return {};
};

export const post = async (url, data, headers = {}) => {
  try {
    return responseData(await baseAPI.post(url, data, { headers: headers }));
  } catch (error) {
    handleError(error);
  }
};

export const get = async (url, headers = {}) => {
  try {
    return responseData(await baseAPI.get(url, { headers: headers }));
  } catch (error) {
    handleError(error);
  }
};

export const del = async (url, headers = {}) => {
  try {
    return responseData(await baseAPI.delete(url, { headers: headers }));
  } catch (error) {
    handleError(error);
  }
};
