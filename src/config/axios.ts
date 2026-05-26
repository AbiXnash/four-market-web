import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? ""}${process.env.NEXT_PUBLIC_API_VERSION ?? ""}`,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    "X-Client-Header": "ABX",
  },
});


// NOTE: Global request interceptor, this is only for debugging. not for production
/*
api.interceptors.request.use(
  (config) => {
    console.log(`Outgoing Request to: ${config.baseURL}/${config.url}`);
    console.log("Sending Request Headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
*/

// Global response interceptor
api.interceptors.response.use(

  // success
  (response) => {
    console.log(response)
    return response
  },

  // error
  (error: AxiosError) => {

    // Network / backend unavailable
    if (!error.response) {
      alert("Network error");
      return Promise.reject(error);
    }

    switch (error.response.status) {

      case 401:
        console.log("Unauthorized");
        // redirect login / refresh token
        break;

      case 403:
        console.log("Forbidden");
        break;

      case 404:
        console.log("Resource not found");
        break;

      case 500:
        console.log("Server error");
        break;

      default:
        console.log(
          "Unhandled error",
          error.response.data
        );
    }

    return Promise.reject(error);
  }
);
