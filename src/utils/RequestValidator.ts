import { AuthError } from "@/errors/AuthError";
import type { LoginResponse } from "@/types/login";

export const loginValidator = (response: LoginResponse) => {
  console.log("hello")
  console.log(response)

  if (!response.username) {
    throw new AuthError("Username missing", "INVALID_USER");
  }

  if (!response.userId) {
    throw new AuthError("User ID missing", "INVALID_USER");
  }

  if (!response.jwtToken?.accessToken) {
    throw new AuthError("Access token missing", "ACCESS_TOKEN_MISSING");
  }

  if (!response.jwtToken?.refreshToken) {
    throw new AuthError("Refresh token missing", "REFRESH_TOKEN_MISSING");
  }

  return response;
};
