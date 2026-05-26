"use client";

import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";

export function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blocked, setBlocked] = useState(false);

  const handleContinue = useCallback(() => {
    setBlocked(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    const channel = new BroadcastChannel("tab-guard");
    const tabId = crypto.randomUUID();

    channel.postMessage({ type: "hello", tabId });

    channel.onmessage = (e) => {
      if (e.data.type === "hello" && e.data.tabId !== tabId) {
        if (tabId < e.data.tabId) {
          setBlocked(true);
        }
      }
    };

    window.addEventListener("beforeunload", () => channel.close());

    return () => {
      channel.close();
    };
  }, []);

  if (blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <svg
              className="h-7 w-7 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-semibold text-slate-100">
            Duplicate Tab Detected
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-slate-400">
            This application can only be used in a single tab at a time. Please
            close this tab and continue in the original one.
          </p>
          <button
            onClick={handleContinue}
            className="inline-flex h-9 items-center justify-center rounded-md bg-slate-100 px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
          >
            Continue here
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
