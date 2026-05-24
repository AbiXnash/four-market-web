import { api } from "../../config/axios";
import type { LoginRequest } from "../../types/login";

export const login = (request: LoginRequest) => {
  return api.post("auth/login", request)
}
