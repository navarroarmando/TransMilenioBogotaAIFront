import type { Credentials, AuthResult } from '../types/auth.types';

export interface AuthStrategy {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}
