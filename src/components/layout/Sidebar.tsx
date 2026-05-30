import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Settings, 
  BarChart3, 
  History, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/data-management', label: 'Gestión de Datos', icon: <Database className="w-5 h-5" /> },
  { path: '/optimization', label: 'Motor de Optimización', icon: <Settings className="w-5 h-5" /> },
  { path: '/results', label: 'Resultados', icon: <BarChart3 className="w-5 h-5" /> },
  { path: '/history', label: 'Historial', icon: <History className="w-5 h-5" /> },
  { path: '/reports', label: 'Informes', icon: <FileText className="w-5 h-5" /> },
];

interface SidebarPresenterProps {
  currentPath: string;
  navItems: NavItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarPresenter = ({ currentPath, navItems, isCollapsed, onToggle }: SidebarPresenterProps) => {
  return (
    <aside 
      className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out shadow-xl fixed left-0 top-0 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-[#0f172a] dark:bg-[#1a3a5c]`}
    >
      <div className="p-4 border-b border-[#3EA32A]/20 dark:border-[#015EB0]/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-white dark:text-gray-100">TransMind DSS</h1>
            <p className="text-sm text-gray-200 dark:text-gray-300 mt-1">TransMilenio Bogotá</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[#3EA32A]/30 dark:hover:bg-[#015EB0]/20 transition-colors text-white dark:text-gray-200"
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#3EA32A] text-white shadow-lg transform scale-105' 
                      : 'text-gray-200 dark:text-gray-300 hover:bg-[#3EA32A]/20 dark:hover:bg-[#015EB0]/30'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  {item.icon}
                  {!isCollapsed && <span className="font-medium animate-fade-in">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-[#3EA32A]/20 dark:border-[#015EB0]/20 animate-fade-in">
          <p className="text-xs text-gray-300 dark:text-gray-400 text-center">
            Sistema de Soporte a Decisiones
          </p>
        </div>
      )}
    </aside>
  );
};

const Sidebar = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  const location = useLocation();
  
  return (
    <SidebarPresenter 
      currentPath={location.pathname} 
      navItems={navItems}
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    />
  );
};

export default Sidebar;
