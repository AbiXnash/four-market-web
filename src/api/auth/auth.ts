import { api } from "@/config/axios";
import type { LoginRequest, LoginResponse } from "@/types/login";

export const login =
  async (request: LoginRequest) => {
    return (await api.post<LoginResponse>("auth/login", request)).data
  }
