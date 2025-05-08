import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        {sidebarOpen && <Sidebar />}
        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-background">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
