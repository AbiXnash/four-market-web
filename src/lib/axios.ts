
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? ""}${process.env.NEXT_PUBLIC_API_VERSION ?? ""}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Header": "ABX",
  },
});

let csrfToken: string | null = null;
let csrfFetching = false;

api.interceptors.request.use(async (config) => {
  if (csrfFetching || typeof window === "undefined") return config;

  const method = config.method?.toUpperCase();
  if ((method === "POST" || method === "PUT" || method === "DELETE") && !csrfToken) {
    csrfFetching = true;
    try {
      await api.get("/");
    } catch {
      // Even error responses carry X-CSRF-TOKEN header
    } finally {
      csrfFetching = false;
    }
    if (csrfToken && config.headers) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
  } else if (csrfToken && config.headers) {
    config.headers["X-XSRF-TOKEN"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const token = response.headers["x-csrf-token"];
    if (token) csrfToken = token;
    return response;
  },
  (error: AxiosError) => {
    const freshToken = error.response?.headers?.["x-csrf-token"];
    if (freshToken) csrfToken = freshToken;

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.", { position: "top-center" });
      } else {
        toast.error("Unable to reach the server. Please try later.", { position: "top-center" });
      }
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401:
        toast.error("Session expired. Please log in again.", { position: "top-center" });
        break;
      case 403:
        toast.error("You don't have permission to perform this action.", { position: "top-center" });
        break;
      case 429:
        toast.error("Too many requests. Please slow down.", { position: "top-center" });
        break;
      case 500:
        toast.error("Server error. Please try again later.", { position: "top-center" });
        break;
      default:
        toast.error("An unexpected error occurred.", { position: "top-center" });
    }

    return Promise.reject(error);
  }
);
