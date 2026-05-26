import { login } from "@/api/auth/auth";
import type { LoginRequest } from "@/types/login";

export const handleLogin = async (request: LoginRequest) => {
  try {
    const userMeta = await login(request)
    // TODO: need to add in the session or some where

    return userMeta
  } catch (err) {
    console.log("Login failed", err);
    throw err
  }
}
