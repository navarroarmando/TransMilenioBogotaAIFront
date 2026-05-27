import { useState } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
};
