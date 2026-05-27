import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar usuario');
    }
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
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl font-semibold">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">
              Nombre Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#015EB0]" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu nombre"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#015EB0]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu correo"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#015EB0]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#002E5E] dark:text-white mb-2 uppercase tracking-wide">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#015EB0]" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-[#015EB0]/20 dark:border-[#015EB0]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#015EB0] focus:border-[#015EB0] bg-[#F8F8F8] dark:bg-[#121212] text-[#002E5E] dark:text-white font-semibold transition-all duration-300 hover:border-[#015EB0]/40 dark:hover:border-[#015EB0]/50"
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#002E5E] to-[#015EB0] dark:from-[#015EB0] dark:to-[#3EA32A] text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold shadow-lg"
          >
            Registrarse
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-[#015EB0] dark:text-[#3EA32A] font-bold hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
