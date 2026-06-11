import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Credentials, AuthState } from '../types/auth.types';
import { ApiAuthStrategy } from '../services/ApiAuthService';

interface AuthContextValue extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  updateProfile: (data: { email?: string; full_name?: string; password?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authStrategy = useMemo(() => new ApiAuthStrategy(), []);
  
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Error cargando sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, []);
  
  const login = useCallback(async (credentials: Credentials) => {
    const result = await authStrategy.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      throw new Error(result.error || 'Error al iniciar sesión');
    }
  }, [authStrategy]);
  
  const register = useCallback(async (name: string, username: string, password: string) => {
    const result = await authStrategy.register(name, username, password);
    if (result.success && result.user) {
      setUser(result.user);
    } else {
      throw new Error(result.error || 'Error al registrar usuario');
    }
  }, [authStrategy]);
  
  const logout = useCallback(async () => {
    await authStrategy.logout();
    setUser(null);
  }, [authStrategy]);

  const updateProfile = useCallback(async (data: { email?: string; full_name?: string; password?: string }) => {
    const updatedUser = await authStrategy.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  }, [authStrategy]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateProfile
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
