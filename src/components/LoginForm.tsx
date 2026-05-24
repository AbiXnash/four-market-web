import { useState } from "react";
import { login } from "../api/auth/auth";
import type { LoginRequest } from "../types/login";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const request: LoginRequest = {
      email, password
    };

    try {
      const response = await login(request);
      console.log(response.data);

    } catch (err) {
      console.log("Login failed", err);
    }
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="login-email"> Email </label>

      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="Enter email"
        required
      />

      <br />

      <label htmlFor="login-password"> Password </label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        placeholder="Enter password"
        required
      />

      <br />

      <button type="submit"> Login </button>

    </form>
  );
};
