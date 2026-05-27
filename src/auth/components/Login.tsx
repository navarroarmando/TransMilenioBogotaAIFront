import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Credentials } from '../types/auth.types';
import { z } from 'zod';
import { Moon, Sun } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002E5E]/5 to-[#015EB0]/5 dark:from-[#0a0a15] dark:to-[#1a1a2e]">
      <div className="max-w-md w-full bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 border-2 border-[#015EB0]/10 dark:border-[#015EB0]/20 animate-scale-in">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#002E5E] to-[#015EB0] dark:from-[#015EB0] dark:to-[#3EA32A] rounded-2xl flex items-center justify-center shadow-lg">
              <h1 className="text-2xl font-bold text-white">DSS</h1>
            </div>
            <h1 className="text-3xl font-bold text-[#002E5E] dark:text-white">DSS</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Sistema de Soporte a Decisiones - TransMilenio Bogotá</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-[#015EB0]/10 dark:bg-[#015EB0]/20 hover:bg-[#015EB0]/20 dark:hover:bg-[#015EB0]/30 transition-all duration-300"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun className="w-5 h-5 text-[#002E5E] dark:text-white" /> : <Moon className="w-5 h-5 text-[#002E5E]" />}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@siva.gov"
              className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] disabled:opacity-50 bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          {validationError && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl font-semibold">
              {validationError}
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl font-semibold">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#015EB0] dark:to-[#3EA32A] text-white py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#015EB0] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold shadow-md"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-[#015EB0] dark:text-[#3EA32A] font-bold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 bg-[#F8F8F8] dark:bg-[#121212] p-4 rounded-xl">
          <p className="font-semibold">Credenciales de prueba: admin@siva.gov / admin123</p>
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
