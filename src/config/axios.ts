import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.X_BACKEND_BASE_URL +
    import.meta.env.X_API_VERSION,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    "X-Client-Name": "ABX_CLIENT",
  },
});
