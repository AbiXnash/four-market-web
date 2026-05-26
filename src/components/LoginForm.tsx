"use client";

import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      toast.success("Login Successful.", { position: "top-right" });
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

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Left: Branding */}
      <div className="hidden flex-1 flex-col items-center justify-center gap-10 bg-gradient-to-br from-primary/[0.04] to-primary/[0.08] p-12 lg:flex">
        {/* Decorative subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
        <div className="relative flex flex-col items-center gap-5">
          <svg viewBox="0 0 120 120" className="size-28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="120" height="120" rx="32" fill="oklch(0.17 0.03 260)"/>
            <rect x="0.5" y="0.5" width="119" height="119" rx="31.5" stroke="var(--primary)" strokeOpacity="0.25"/>
            <path d="M22 88 C30 60, 55 35, 98 28" stroke="var(--primary)" strokeOpacity="0.08" strokeWidth="18" strokeLinecap="round" fill="none"/>
            <path d="M18 96 C28 65, 58 38, 102 30" stroke="var(--primary)" strokeOpacity="0.2" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <line x1="52" y1="36" x2="52" y2="84" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
            <path d="M52 36 Q44 60 30 72" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
            <line x1="28" y1="72" x2="57" y2="72" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
            <line x1="62" y1="44" x2="62" y2="84" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round"/>
            <path d="M62 44 Q71 66 80 44" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" fill="none"/>
            <line x1="80" y1="44" x2="80" y2="84" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round"/>
            <path d="M28 90 Q60 98 92 90" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
          </svg>
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold tracking-tight text-primary" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 900 }}>
                4
              </span>
              <span className="text-3xl font-light tracking-tight text-foreground/80">
                market
              </span>
            </div>
            <svg width="200" height="12" viewBox="0 0 200 12" className="mx-auto mt-1" fill="none">
              <path d="M10 8 Q100 1 190 8" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
            </svg>
            <span className="mt-3 block text-[10px] font-medium uppercase tracking-[4px] text-muted-foreground/60">
              Your marketplace platform
            </span>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-primary/[0.03] p-6">
        {/* Decorative corner accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-primary/[0.02] blur-3xl" />
        <Card className="relative w-full max-w-sm border-primary/5 shadow-2xl shadow-primary/10">
          <CardHeader className="relative pb-6 pt-8 after:pointer-events-none after:absolute after:inset-x-6 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent">
            {/* Mobile logo */}
            <div className="mb-4 flex flex-col items-center gap-2 lg:hidden">
              <svg viewBox="0 0 120 120" className="size-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" rx="32" fill="oklch(0.17 0.03 260)"/>
                <rect x="0.5" y="0.5" width="119" height="119" rx="31.5" stroke="oklch(0.6 0.15 265)" strokeOpacity="0.25"/>
                <path d="M22 88 C30 60, 55 35, 98 28" stroke="oklch(0.6 0.15 265)" strokeOpacity="0.08" strokeWidth="18" strokeLinecap="round" fill="none"/>
                <path d="M18 96 C28 65, 58 38, 102 30" stroke="oklch(0.6 0.15 265)" strokeOpacity="0.2" strokeWidth="8" strokeLinecap="round" fill="none"/>
                <line x1="52" y1="36" x2="52" y2="84" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
                <path d="M52 36 Q44 60 30 72" stroke="white" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                <line x1="28" y1="72" x2="57" y2="72" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
                <line x1="62" y1="44" x2="62" y2="84" stroke="oklch(0.6 0.15 265)" strokeWidth="5" strokeLinecap="round"/>
                <path d="M62 44 Q71 66 80 44" stroke="oklch(0.6 0.15 265)" strokeWidth="5" strokeLinecap="round" fill="none"/>
                <line x1="80" y1="44" x2="80" y2="84" stroke="oklch(0.6 0.15 265)" strokeWidth="5" strokeLinecap="round"/>
                <path d="M28 90 Q60 98 92 90" stroke="oklch(0.6 0.15 265)" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.5"/>
              </svg>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-2xl font-bold tracking-tight text-primary" style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontWeight: 900 }}>
                    4
                  </span>
                  <span className="text-lg font-light tracking-tight text-foreground/80">
                    market
                  </span>
                </div>
                <svg width="140" height="10" viewBox="0 0 140 10" className="mx-auto mt-0.5" fill="none">
                  <path d="M7 6 Q70 1 133 6" stroke="var(--primary)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <CardTitle className="text-center text-xl">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-5">
          {/* Email */}
          <div className="relative space-y-2">
            <Label htmlFor="email" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Email
            </Label>
            <div className="relative">
              <Input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"
                className={cn(
                  "pr-9",
                  emailMeta.touched && emailMeta.state === "valid" && "border-green-600 focus-visible:border-green-600 focus-visible:ring-green-200",
                  emailMeta.touched && emailMeta.state === "error" && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                )}
                onChange={(e) => updateEmail(e.target.value, true)}
                onFocus={() => {
                  if (emailMeta.touched && emailMeta.state === "error") {
                    setEmailMeta((prev) => ({ ...prev, showCallout: true }));
                    setPwMeta((prev) => ({ ...prev, showCallout: false }));
                  }
                }}
                onBlur={() => updateEmail(email, false)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                {emailMeta.state === "valid" && (
                  <Check className="size-4 text-green-600" />
                )}
                {emailMeta.state === "error" && (
                  <AlertTriangle className="size-4 text-destructive" />
                )}
                {emailMeta.state === "idle" && (
                  <Mail className="size-4 text-muted-foreground" />
                )}
              </span>
              {emailMeta.showCallout && emailErr && (
                <div
                  role="alert"
                  className="absolute left-0 top-[calc(100%+6px)] z-10 flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-3 py-2 text-xs text-destructive shadow-sm"
                >
                  <CalloutArrow />
                  <AlertTriangle className="size-3.5 shrink-0" />
                  {emailErr}
                </div>
              )}
            </div>
          </div>

        {/* Password */}
        <div className="relative space-y-2">
          <Label htmlFor="password" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              ref={pwRef}
              id="password"
              type={pwVisible ? "text" : "password"}
              value={password}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(
                "pr-9",
                pwMeta.touched && pwMeta.state === "valid" && "border-green-600 focus-visible:border-green-600 focus-visible:ring-green-200",
                pwMeta.touched && pwMeta.state === "error" && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
              )}
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
              tabIndex={-1}
              onClick={() => setPwVisible((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={pwVisible ? "Hide password" : "Show password"}
            >
              {pwVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            {pwMeta.showCallout && pwErr && (
              <div
                role="alert"
                className="absolute left-0 top-[calc(100%+6px)] z-10 flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-3 py-2 text-xs text-destructive shadow-sm"
              >
                <CalloutArrow />
                <AlertTriangle className="size-3.5 shrink-0" />
                {pwErr}
              </div>
            )}
          </div>
        </div>

          <Button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="mt-6 w-full shadow-sm"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Forgot password?
            </a>
          </div>
        </CardContent>
          </Card>
        </div>
      </div>
    );
}

function CalloutArrow() {
  return (
    <span
      className="pointer-events-none absolute -top-1 left-4 size-2 rotate-45 border-l border-t border-destructive/30 bg-card"
      aria-hidden
    />
  );
}
