import React from 'react';
import { Download, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KPISection from '@/components/dashboard/KPISection';
import ThreatActivityChart from '@/components/dashboard/ThreatActivityChart';
import ClusterTopologyMap from '@/components/dashboard/ClusterTopologyMap';
import LatestThreatsTable from '@/components/dashboard/LatestThreatsTable';
import ThreatHeatmap from '@/components/dashboard/ThreatHeatmap';
import TopVulnerabilities from '@/components/dashboard/TopVulnerabilities';
import SecurityRecommendations from '@/components/dashboard/SecurityRecommendations';
import QuickActions from '@/components/dashboard/QuickActions';

const Dashboard: React.FC = () => {
  const handleExport = () => {
    console.log('Exporting data');
  };

  const handleRefresh = () => {
    console.log('Refreshing data');
  };

  const handleSecurityScan = () => {
    console.log('Running security scan');
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Kubernetes Security Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border-none"
            onClick={handleExport}
            size="sm"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border-none"
            onClick={handleRefresh}
            size="sm"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Refresh
          </Button>
          <Button
            className="flex items-center px-3 py-1.5 bg-primary hover:bg-primary-dark"
            onClick={handleSecurityScan}
            size="sm"
          >
            <ShieldAlert className="mr-1.5 h-4 w-4" />
            Run Security Scan
          </Button>
        </div>
      </div>

      <KPISection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <ThreatActivityChart />
          <ClusterTopologyMap />
          <LatestThreatsTable />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <ThreatHeatmap />
          <TopVulnerabilities />
          <SecurityRecommendations />
          <QuickActions />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
