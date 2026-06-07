import axios from "axios";

type Listener = (status: "online" | "offline") => void;

const listeners = new Set<Listener>();

let currentStatus: "online" | "offline" = "online";

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getStatus() {
  return currentStatus;
}

function notify(status: "online" | "offline") {
  if (status === currentStatus) return;
  currentStatus = status;
  listeners.forEach((fn) => fn(status));
}

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    const appStatus = response.headers["x-application-status"];
    if (appStatus === "online" || appStatus === "offline") {
      notify(appStatus);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const appStatus = error.response.headers["x-application-status"];
      if (appStatus === "offline") {
        notify("offline");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
