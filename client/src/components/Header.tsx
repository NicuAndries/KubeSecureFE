import React from 'react';
import { useLocation, Link } from 'wouter';
import { ShieldCheck, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [location] = useLocation();
  const isMobile = useMobile();
  
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/threats', label: 'Threats' },
    { path: '/topology', label: 'Topology' },
    { path: '/response', label: 'Response' },
    { path: '/simulation', label: 'Simulation' },
    { path: '/configuration', label: 'Configuration' },
  ];

  return (
    <header className="bg-bgdark-lighter shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="text-primary flex items-center font-bold text-xl">
            <ShieldCheck className="mr-2 h-6 w-6" />
            <span>SecureK8s</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Connected to dev-cluster
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm">
            <span className="hidden sm:inline">Updated 30s ago</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium">
              AD
            </div>
          </div>
        </div>
      </div>
      <nav className="px-4 pb-2 overflow-x-auto whitespace-nowrap">
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={`px-1 py-2 border-b-2 ${location === item.path ? 'border-primary text-white font-medium' : 'border-transparent text-gray-400 hover:text-white'}`}>
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
