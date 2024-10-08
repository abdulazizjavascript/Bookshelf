import axios from "axios";
import { toast } from "react-hot-toast";
import md5 from "md5";

const request = axios.create({
  baseURL: "https://no23.lavina.tech",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  const { method, url, data } = config;

  if (url !== "signup") {
    const { key, secret } = JSON.parse(localStorage.getItem("user") as string);

    const sign =
      method?.toUpperCase() +
      "/" +
      url +
      (data ? JSON.stringify(data) : "") +
      secret;

    config.headers.key = key;
    config.headers.sign = md5(sign);
  }

  return config;
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default request;
