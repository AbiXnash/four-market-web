"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { subscribe, getStatus } from "./client-api";

const AppStatusContext = createContext<"online" | "offline">("online");

export function AppStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"online" | "offline">(getStatus);

  useEffect(() => subscribe(setStatus), []);

  return (
    <AppStatusContext.Provider value={status}>
      {children}
    </AppStatusContext.Provider>
  );
}

export function useAppStatus() {
  return useContext(AppStatusContext);
}
