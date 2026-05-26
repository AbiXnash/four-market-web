export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  userId: string
  username: string
  lastLogin?: string
  jwtToken: token
}

interface token {
  accessToken: string,
  refreshToken: string,
}
