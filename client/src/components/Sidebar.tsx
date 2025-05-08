import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  ChartBarStacked, 
  ShieldCheck, 
  Sword, 
  Settings as SettingsIcon,
  Info
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  
  const navItems = [
    { path: '/', label: 'Overview', icon: <LayoutDashboard className="mr-3 h-4 w-4" /> },
    { path: '/threats', label: 'Threat Management', icon: <AlertTriangle className="mr-3 h-4 w-4" /> },
    { path: '/topology', label: 'Cluster Topology', icon: <ChartBarStacked className="mr-3 h-4 w-4" /> },
    { path: '/response', label: 'Response Actions', icon: <ShieldCheck className="mr-3 h-4 w-4" /> },
    { path: '/simulation', label: 'Attack Simulation', icon: <Sword className="mr-3 h-4 w-4" /> },
    { path: '/configuration', label: 'Configuration', icon: <SettingsIcon className="mr-3 h-4 w-4" /> }
  ];

  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState('1h');
  const [severityFilters, setSeverityFilters] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true
  });

  const handleSeverityChange = (severity: keyof typeof severityFilters) => {
    setSeverityFilters({
      ...severityFilters,
      [severity]: !severityFilters[severity]
    });
  };

  return (
    <div className="w-56 bg-bgdark-lighter hidden md:block">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-400 uppercase text-xs tracking-wider">Dashboard Views</h3>
        </div>
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`sidebar-link flex items-center pl-3 pr-4 py-2 text-sm rounded-md ${
                    location === item.path 
                      ? 'active bg-primary/20 border-l-3 border-primary text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 mb-4">
          <h3 className="font-medium text-gray-400 uppercase text-xs tracking-wider">Filters</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm text-gray-400 mb-1">Namespace</Label>
            <Select value={namespaceFilter} onValueChange={setNamespaceFilter}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select namespace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All namespaces</SelectItem>
                <SelectItem value="default">default</SelectItem>
                <SelectItem value="kube-system">kube-system</SelectItem>
                <SelectItem value="monitoring">monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm text-gray-400 mb-1">Time Range</Label>
            <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last 1 hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm text-gray-400 mb-1">Severity</Label>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="critical" 
                  checked={severityFilters.critical}
                  onCheckedChange={() => handleSeverityChange('critical')}
                  className="data-[state=checked]:bg-alert-critical data-[state=checked]:border-alert-critical"
                />
                <label htmlFor="critical" className="text-xs cursor-pointer">Critical</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="high" 
                  checked={severityFilters.high}
                  onCheckedChange={() => handleSeverityChange('high')}
                  className="data-[state=checked]:bg-alert-high data-[state=checked]:border-alert-high"
                />
                <label htmlFor="high" className="text-xs cursor-pointer">High</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medium" 
                  checked={severityFilters.medium}
                  onCheckedChange={() => handleSeverityChange('medium')}
                  className="data-[state=checked]:bg-alert-medium data-[state=checked]:border-alert-medium"
                />
                <label htmlFor="medium" className="text-xs cursor-pointer">Medium</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="low" 
                  checked={severityFilters.low}
                  onCheckedChange={() => handleSeverityChange('low')}
                  className="data-[state=checked]:bg-alert-low data-[state=checked]:border-alert-low"
                />
                <label htmlFor="low" className="text-xs cursor-pointer">Low</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
