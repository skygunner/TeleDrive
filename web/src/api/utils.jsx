import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const responseData = (resp) => {
  if (resp.data?.status === "SUCCESS") {
    return resp.data.data;
  }

  if (resp.data?.details?.length > 0) {
    throw new Error(resp.data.details[0]);
  }

  throw new Error("Something went wrong!");
};

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.details?.length > 0) {
      for (var i = 0; i < error.response.data.details.length; i++) {
        console.error(error.response.data.details[i]);
      }
    } else {
      console.log("Something went wrong!");
      console.error(error);
    }
  } else {
    console.error(error);
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
    return responseData(await api.post(url, data, { headers: headers }));
  } catch (error) {
    handleError(error);
  }
};
