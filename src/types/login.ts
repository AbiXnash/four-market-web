export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  status: number
  statusMessage: string
  token: token
}

interface token {
  accessToken: string,
  refreshToken: string,
}
