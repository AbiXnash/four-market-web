"use client";

import { AuthError } from "@/errors/AuthError";
import { handleLogin } from "@/handler/auth/authHandler";
import type { LoginRequest } from "@/types/login";
import { loginValidator } from "@/utils/ReqeustValidator";
import { useRef, useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginFormRef =
    useRef<HTMLFormElement>(null);

  const submit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const submitBtn = loginFormRef.current?.querySelector(
      'input[type="submit"]'
    ) as HTMLInputElement | null;

    submitBtn!.disabled = true;


    try {
      const request: LoginRequest = {
        email,
        password
      };

      const response = loginValidator(
        await handleLogin(request)
      );

      console.log("Login success", response);
    } catch (err) {

      setEmail("");
      setPassword("");

      if (err instanceof AuthError) {
        console.log(err.message);
        return;
      }

      console.error(err);
    } finally {
      loginFormRef.current?.reset();
      submitBtn!.disabled = false;
    }
  };

  return (
    <form
      ref={loginFormRef}
      onSubmit={submit}
    >
      <label htmlFor="login-email-input"> Email</label>
      <input
        id="login-email-input"
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        required
      />
      <br />

      <label htmlFor="login-password-input"> Password</label>
      <input
        id="login-password-input"
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        required
      />
      <br />
      <br />

      <input type="submit" name="Submit" />
    </form>
  );
};
