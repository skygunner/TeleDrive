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

export const post = async (url, data) => {
  try {
    return responseData(await api.post(url, data));
  } catch (error) {
    handleError(error);
  }
};
