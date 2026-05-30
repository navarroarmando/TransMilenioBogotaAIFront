import type { Credentials, AuthResult, User } from '../types/auth.types';
import type { AuthStrategy } from './AuthService';

export class MockAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    if (credentials.username === 'admin@siva.gov' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        username: credentials.username,
        name: 'Administrador',
        city: 'TransMilenio Bogotá',
        createdAt: new Date().toISOString()
      };
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return { success: true, user, token };
    }
    
    throw new Error('Credenciales inválidas');
  }
  
  async register(_name: string, username: string, password: string): Promise<AuthResult> {
    const user: User = {
      id: Date.now().toString(),
      username,
      name: _name,
      city: 'TransMilenio Bogotá',
      createdAt: new Date().toISOString()
    };
    const token = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    return { success: true, user, token };
  }
  
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
  
  async refreshToken(): Promise<string> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No hay sesión activa');
    return token;
  }
}
