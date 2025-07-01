export interface LoginRequest {
  userId: string;
  password: string;
}

export interface RegisterRequest {
  userId: string;
  password: string;
  email: string;
}