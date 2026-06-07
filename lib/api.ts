import "./env";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_ROUTE,
  headers: {
    "Content-Type": "application/json",
    "Client-App": "4M",
  }
});

export default api;

