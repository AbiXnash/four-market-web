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
        {/* Large organic flowing curves */}
        <svg className="pointer-events-none absolute inset-0 size-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400 C200 100, 400 600, 800 200" stroke="var(--primary)" strokeOpacity="0.04" strokeWidth="60" strokeLinecap="round" fill="none"/>
          <path d="M0 550 C250 300, 500 700, 800 350" stroke="var(--primary)" strokeOpacity="0.03" strokeWidth="80" strokeLinecap="round" fill="none"/>
          <path d="M0 250 C300 500, 450 100, 800 500" stroke="var(--primary)" strokeOpacity="0.025" strokeWidth="100" strokeLinecap="round" fill="none"/>
        </svg>
        <div className="relative flex flex-col items-center gap-8">
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
          </div>
          {/* Divider with dot */}
          <div className="flex items-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[4px] text-muted-foreground/60">
              Your marketplace platform
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="size-1 rounded-full bg-primary/30" />
              <span className="size-1 rounded-full bg-primary/50" />
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="size-1 rounded-full bg-primary/50" />
              <span className="size-1 rounded-full bg-primary/30" />
            </div>
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
          <div className="px-6 pb-2">
            <div className="flex items-center justify-center gap-3">
              <button type="button" className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground/60 transition-colors hover:border-primary/30 hover:text-primary">
                <svg viewBox="0 0 19 19" className="size-4" fill="currentColor"><path fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd"/></svg>
              </button>
              <button type="button" className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground/60 transition-colors hover:border-primary/30 hover:text-primary">
                <svg viewBox="0 0 16 17" className="size-4" fill="currentColor"><path d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></svg>
              </button>
              <button type="button" className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground/60 transition-colors hover:border-primary/30 hover:text-primary">
                <svg viewBox="0 0 19 19" className="size-4" fill="currentColor"><path fillRule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clipRule="evenodd"/></svg>
              </button>
            </div>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground/50">or continue with</span>
              </div>
            </div>
          </div>
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
          {/* Bottom footer */}
          <div className="absolute bottom-6 right-8 flex items-center gap-3 text-xs text-muted-foreground/50">
            <span>Made by <span className="font-medium text-muted-foreground/70">ABX</span></span>
            <span className="text-muted-foreground/30">|</span>
            <a href="/contact" className="transition-colors hover:text-primary">Contact us</a>
          </div>
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
