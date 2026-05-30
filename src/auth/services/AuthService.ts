import type { Credentials, AuthResult } from '../types/auth.types';

export interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  register(name: string, username: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}
