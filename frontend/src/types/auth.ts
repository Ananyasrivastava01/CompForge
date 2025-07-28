export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'google' | 'local';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface OAuthRequest {
  provider: 'google';
  code: string;
  redirectUri: string;
}

export interface AuthError {
  message: string;
  field?: string;
} 