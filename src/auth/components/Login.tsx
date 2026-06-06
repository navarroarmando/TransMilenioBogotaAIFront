import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Credentials } from '../types/auth.types';
import { z } from 'zod';
import { Moon, Sun } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuario requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

interface LoginPresenterProps {
  onSubmit: (credentials: Credentials) => void;
  isLoading: boolean;
  error: string | null;
  isDark: boolean;
  toggleTheme: () => void;
}

const LoginPresenter = ({ onSubmit, isLoading, error, isDark, toggleTheme }: LoginPresenterProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    const result = loginSchema.safeParse({ username, password });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] to-[#e0e3e5] dark:from-[#0a0a15] dark:to-[#1a1a2e]">
      <div className="max-w-md w-full bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-scale-in">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-[#191c1e] dark:text-white">TransMind DSS</h1>
            <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mt-2">Sistema de Soporte a Decisiones - TransMilenio Bogotá</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="demo"
              className="w-full px-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] disabled:opacity-50 bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          {validationError && (
            <div className="bg-[#d1fae5] dark:bg-green-900/20 border-2 border-[#3EA32A] dark:border-green-600 text-[#065f46] dark:text-green-200 px-4 py-3 rounded-xl font-semibold">
              {validationError}
            </div>
          )}
          
          {error && (
            <div className="bg-[#d1fae5] dark:bg-green-900/20 border-2 border-[#3EA32A] dark:border-green-600 text-[#065f46] dark:text-green-200 px-4 py-3 rounded-xl font-semibold">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#015EB0] dark:to-[#3EA32A] text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3EA32A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-md"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-[#5d3f3c] dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-[#3EA32A] dark:text-[#3EA32A] font-bold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm text-[#5d3f3c] dark:text-gray-400 bg-[#f7f9fb] dark:bg-[#121212] p-4 rounded-xl">
          <p className="font-semibold">Credenciales de prueba: demo / demo123</p>
        </div>
      </div>
    </div>
  );
};

const LoginContainer = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = useCallback(async (credentials: Credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);
  
  return <LoginPresenter onSubmit={handleSubmit} isLoading={isLoading} error={error} isDark={isDark} toggleTheme={toggleTheme} />;
};

export default LoginContainer;
