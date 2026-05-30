import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, User, Lock, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await register(name, username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f9fb] to-[#e0e3e5] dark:from-[#0a0a15] dark:to-[#1a1a2e]">
      <div className="max-w-md w-full bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl p-8 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-scale-in">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-[#191c1e] dark:text-white">TransMind DSS</h1>
            <p className="text-sm text-[#5d3f3c] dark:text-gray-400 mt-2">Sistema de Soporte a Decisiones - TransMilenio Bogotá</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-[#3EA32A]/10 dark:bg-[#015EB0]/20 hover:bg-[#3EA32A]/20 dark:hover:bg-[#015EB0]/30 transition-all duration-300"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun className="w-5 h-5 text-[#191c1e] dark:text-white" /> : <Moon className="w-5 h-5 text-[#191c1e]" />}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#d1fae5] dark:bg-green-900/20 border-2 border-[#3EA32A] dark:border-green-600 text-[#065f46] dark:text-green-200 px-4 py-3 rounded-xl font-semibold">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#3EA32A]" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#3EA32A]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu nombre"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#3EA32A]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#3EA32A]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#3EA32A]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#3EA32A]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#191c1e] dark:text-white mb-2 uppercase tracking-wide">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#3EA32A]" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#3EA32A]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3EA32A] focus:border-[#3EA32A] bg-[#f7f9fb] dark:bg-[#121212] text-[#191c1e] dark:text-white font-semibold transition-all duration-300 hover:border-[#3EA32A]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3EA32A] to-[#2E7A1F] dark:from-[#015EB0] dark:to-[#3EA32A] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold shadow-lg"
          >
            Registrarse
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-[#5d3f3c] dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-[#3EA32A] dark:text-[#3EA32A] font-bold hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
