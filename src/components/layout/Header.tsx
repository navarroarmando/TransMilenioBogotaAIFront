import { useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';

interface HeaderPresenterProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const HeaderPresenter = ({ userName, userEmail, onLogout, isDark, toggleTheme }: HeaderPresenterProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-[#1a1a2e] border-b border-[#015EB0]/20 dark:border-[#015EB0]/30 px-6 py-4 flex items-center justify-between animate-fade-in transition-colors duration-300 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-[#002E5E] dark:text-gray-100">DSS TransMilenio Bogotá</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#015EB0]/10 dark:bg-[#015EB0]/20 hover:bg-[#015EB0]/20 dark:hover:bg-[#015EB0]/30 transition-all duration-200 text-[#002E5E] dark:text-gray-200"
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#002E5E] to-[#015EB0] dark:from-[#015EB0] dark:to-[#3EA32A] rounded-full flex items-center justify-center shadow-lg ring-2 ring-[#015EB0]/20 dark:ring-[#3EA32A]/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-medium text-[#002E5E] dark:text-gray-100">{userName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{userEmail}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#002E5E] dark:text-gray-300 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-xl border border-[#015EB0]/20 dark:border-[#015EB0]/30 animate-scale-in">
              <button
                onClick={() => {
                  onLogout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#015EB0]/10 dark:hover:bg-[#015EB0]/20 transition-all duration-200 text-[#002E5E] dark:text-gray-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  if (!user) return null;
  
  return (
    <HeaderPresenter 
      userName={user.name} 
      userEmail={user.email} 
      onLogout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
    />
  );
};

export default Header;
