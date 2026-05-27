import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Credentials, AuthState } from '../types/auth.types';
import { MockAuthStrategy } from '../services/MockAuthService';

interface AuthContextValue extends AuthState {
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authStrategy = useMemo(() => new MockAuthStrategy(), []);
  
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
    setUser(result.user || null);
  }, [authStrategy]);
  
  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await authStrategy.register(name, email, password);
    setUser(result.user || null);
  }, [authStrategy]);
  
  const logout = useCallback(async () => {
    await authStrategy.logout();
    setUser(null);
  }, [authStrategy]);
  
  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
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
