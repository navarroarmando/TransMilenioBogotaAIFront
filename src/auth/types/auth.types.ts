export interface User {
  id: string;
  email: string;
  name: string;
  city: string;
  createdAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
