import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <main className="flex-1 bg-white dark:bg-[#121212] p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
