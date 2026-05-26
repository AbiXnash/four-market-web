"use client";

import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function emailError(value: string): string | null {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
  return null;
}

function passwordError(value: string): string | null {
  if (!value) return "Password is required";
  if (value.length < 8) {
    const rem = 8 - value.length;
    return `${rem} more character${rem > 1 ? "s" : ""} needed`;
  }
  return null;
}

type FieldState = "idle" | "valid" | "error";

interface FieldMeta {
  state: FieldState;
  touched: boolean;
  showCallout: boolean;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwVisible, setPwVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [emailMeta, setEmailMeta] = useState<FieldMeta>({
    state: "idle",
    touched: false,
    showCallout: false,
  });
  const [pwMeta, setPwMeta] = useState<FieldMeta>({
    state: "idle",
    touched: false,
    showCallout: false,
  });

  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const emailErr = emailError(email);
  const pwErr = passwordError(password);

  const isEmailValid = !emailErr;
  const isPwValid = !pwErr;
  const canSubmit = isEmailValid && isPwValid;

  const updateEmail = useCallback(
    (val: string, focused: boolean) => {
      setEmail(val);
      const err = emailError(val);
      const state: FieldState = !val ? "idle" : err ? "error" : "valid";
      setEmailMeta(() => ({
        touched: true,
        state,
        showCallout: focused && state === "error",
      }));
      if (focused && state === "error") {
        setPwMeta((prev) => ({ ...prev, showCallout: false }));
      }
    },
    []
  );

  const updatePw = useCallback(
    (val: string, focused: boolean) => {
      setPassword(val);
      const err = passwordError(val);
      const state: FieldState = !val ? "idle" : err ? "error" : "valid";
      setPwMeta(() => ({
        touched: true,
        state,
        showCallout: focused && state === "error",
      }));
      if (focused && state === "error") {
        setEmailMeta((prev) => ({ ...prev, showCallout: false }));
      }
    },
    []
  );

  const handleSubmit = async () => {
    setEmailMeta((prev) => ({ ...prev, touched: true }));
    setPwMeta((prev) => ({ ...prev, touched: true }));

    if (!isEmailValid) {
      setEmailMeta({ touched: true, state: "error", showCallout: true });
      setPwMeta((prev) => ({ ...prev, showCallout: false }));
      emailRef.current?.focus();
      return;
    }
    if (!isPwValid) {
      setPwMeta({ touched: true, state: "error", showCallout: true });
      pwRef.current?.focus();
      return;
    }

    setSubmitting(true);
    const startedAt = Date.now();
    try {
      await api.post("/auth/login", { email: email.trim(), password });
      // handle success: redirect, set session, etc.
    } catch {
      // Error toast is handled globally by the axios interceptor
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1000) {
        await new Promise((r) => setTimeout(r, 1000 - elapsed));
      }
      setSubmitting(false);
    }
  };

  const inputClass = (meta: FieldMeta) => {
    const base =
      "w-full h-10.5 pl-3 pr-10 text-sm bg-white dark:bg-neutral-900 " +
      "text-neutral-900 dark:text-neutral-100 outline-none transition-all " +
      "rounded-lg border ";
    if (!meta.touched || meta.state === "idle")
      return base + "border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:focus:ring-neutral-700";
    if (meta.state === "valid")
      return base + "border-green-600 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900";
    return base + "border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
        <div className="mb-7">
          <h1 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            Sign in
          </h1>
          <p className="text-sm text-neutral-500">
            Enter your credentials to continue
          </p>
        </div>

        {/* Email field */}
        <div className="relative mb-5">
          <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1.5">
            Email
          </label>
          <div className="relative">
            <input
              ref={emailRef}
              type="email"
              value={email}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass(emailMeta)}
              onChange={(e) => updateEmail(e.target.value, true)}
              onFocus={() => {
                if (emailMeta.touched && emailMeta.state === "error") {
                  setEmailMeta((prev) => ({ ...prev, showCallout: true }));
                  setPwMeta((prev) => ({ ...prev, showCallout: false }));
                }
              }}
              onBlur={() => {
                updateEmail(email, false);
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">
              {emailMeta.state === "valid" && (
                <span className="text-green-700">✓</span>
              )}
              {emailMeta.state === "error" && (
                <span className="text-red-500">!</span>
              )}
              {emailMeta.state === "idle" && (
                <span className="text-neutral-300">@</span>
              )}
            </span>

            {/* Callout */}
            {emailMeta.showCallout && emailErr && (
              <div
                role="alert"
                className="absolute left-0 top-[calc(100%+8px)] z-10 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 whitespace-nowrap"
              >
                <CalloutArrow />
                <span>⚠</span>
                {emailErr}
              </div>
            )}
          </div>
        </div>

        {/* Password field */}
        <div className="relative mb-1">
          <label className="block text-xs font-medium uppercase tracking-widest text-neutral-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              ref={pwRef}
              type={pwVisible ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              autoComplete="current-password"
              className={inputClass(pwMeta)}
              onChange={(e) => updatePw(e.target.value, true)}
              onFocus={() => {
                if (pwMeta.touched && pwMeta.state === "error") {
                  setPwMeta((prev) => ({ ...prev, showCallout: true }));
                  setEmailMeta((prev) => ({ ...prev, showCallout: false }));
                }
              }}
              onBlur={() => updatePw(password, false)}
            />
            <button
              type="button"
              onClick={() => setPwVisible((v) => !v)}
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {pwVisible ? "🙈" : "👁"}
            </button>

            {/* Callout */}
            {pwMeta.showCallout && pwErr && (
              <div
                role="alert"
                className="absolute left-0 top-[calc(100%+8px)] z-10 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 whitespace-nowrap"
              >
                <CalloutArrow />
                <span>⚠</span>
                {pwErr}
              </div>
            )}
          </div>

        </div>

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className="w-full h-10.5 mt-5 rounded-lg border border-neutral-200 dark:border-neutral-700
            text-sm font-medium text-neutral-900 dark:text-neutral-100
            bg-white dark:bg-neutral-900
            hover:bg-neutral-50 dark:hover:bg-neutral-800
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </button>

        <hr className="my-5 border-neutral-100 dark:border-neutral-800" />
        <p className="text-center text-sm text-neutral-500">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-neutral-900 dark:text-neutral-100">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}

function CalloutArrow() {
  return (
    <span
      style={{
        position: "absolute",
        top: -5,
        left: 14,
        width: 8,
        height: 8,
        background: "#fef2f2",
        borderLeft: "0.5px solid #fca5a5",
        borderTop: "0.5px solid #fca5a5",
        transform: "rotate(45deg)",
      }}
    />
  );
}
