import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Server } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedResources: string;
}

const TopVulnerabilities: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/vulnerabilities'],
    refetchInterval: 3600000, // Refetch every hour
  });

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-alert-critical/20 text-alert-critical';
      case 'high': return 'bg-alert-high/20 text-alert-high';
      case 'medium': return 'bg-alert-medium/20 text-alert-medium';
      case 'low': return 'bg-alert-low/20 text-alert-low';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-bgdark-card animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Vulnerabilities</h2>
            <div className="w-16 h-6 bg-gray-700 rounded"></div>
          </div>
          
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded-lg h-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const vulnerabilities: Vulnerability[] = data?.vulnerabilities || [];

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Top Vulnerabilities</h2>
          <Button variant="link" className="text-sm text-primary hover:underline p-0 h-auto">
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="p-3 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{vuln.cveId}</h3>
                  <p className="text-sm text-gray-400 mt-1">{vuln.title}</p>
                </div>
                <span className={`px-2 py-1 ${getSeverityClass(vuln.severity)} rounded text-xs`}>
                  {vuln.score.toFixed(1)}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-400">
                <Server className="mr-1 h-3 w-3" />
                <span>Affected: {vuln.affectedResources}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopVulnerabilities;
