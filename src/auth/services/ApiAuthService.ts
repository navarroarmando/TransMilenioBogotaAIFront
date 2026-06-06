import type { Credentials, AuthResult, User } from '../types/auth.types';
import type { AuthStrategy } from './AuthService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api';

export class ApiAuthStrategy implements AuthStrategy {
  async login(credentials: Credentials): Promise<AuthResult> {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      
      // Obtener información del usuario con el token
      const user = await this.getCurrentUser(data.access_token);

      // Guardar tokens en localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_refresh_token', data.refresh_token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      return { success: true, user, token: data.access_token };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al iniciar sesión' 
      };
    }
  }

  async register(name: string, username: string, password: string): Promise<AuthResult> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: `${username}@example.com`,
          full_name: name,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      // Hacer login automático después del registro
      return await this.login({ username, password });
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al registrar usuario' 
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('auth_refresh_token');
      
      if (refreshToken) {
        await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('auth_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al refrescar token');
      }

      const data = await response.json();
      
      // Guardar nuevo access token
      localStorage.setItem('auth_token', data.access_token);
      
      return data.access_token;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      // Si falla el refresh, limpiar tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      throw error;
    }
  }

  private async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_ME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuario');
      }

      const data = await response.json();
      
      // Mapear respuesta del backend a User
      return {
        id: data.id || data.username || Date.now().toString(),
        username: data.username || '',
        name: data.username || 'Usuario',
        city: 'TransMilenio Bogotá',
        createdAt: data.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      // Retornar usuario por defecto si falla
      return {
        id: Date.now().toString(),
        username: '',
        name: 'Usuario',
        city: 'TransMilenio Bogotá',
        createdAt: new Date().toISOString(),
      };
    }
  }
}
