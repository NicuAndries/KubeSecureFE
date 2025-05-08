import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

interface ThreatData {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  target: string;
  namespace: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'contained' | 'remediation' | 'resolved';
}

const LatestThreatsTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/threats', { page, pageSize }],
    refetchInterval: 60000, // Refetch every minute
  });

  const threats: ThreatData[] = data?.threats || [];
  const totalThreats = data?.total || 0;
  const totalPages = Math.ceil(totalThreats / pageSize);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="critical">Active</Badge>;
      case 'investigating': return <Badge variant="high">Investigating</Badge>;
      case 'contained': return <Badge variant="contained">Contained</Badge>;
      case 'remediation': return <Badge variant="info">Remediation Available</Badge>;
      case 'resolved': return <Badge variant="contained">Resolved</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <Card className="bg-bgdark-card animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Latest Detected Threats</h2>
            <div className="w-20 h-8 bg-gray-700 rounded"></div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2 pr-4">Severity</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Target</th>
                  <th className="py-2 px-4">Detected</th>
                  <th className="py-2 pl-4">Status</th>
                  <th className="py-2 pl-4"></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-3 pr-4 w-24 bg-gray-800/50"></td>
                    <td className="py-3 px-4 w-32 bg-gray-800/50"></td>
                    <td className="py-3 px-4 w-40 bg-gray-800/50"></td>
                    <td className="py-3 px-4 w-24 bg-gray-800/50"></td>
                    <td className="py-3 pl-4 w-28 bg-gray-800/50"></td>
                    <td className="py-3 pl-4 w-8 bg-gray-800/50"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Latest Detected Threats</h2>
          <Link href="/threats">
            <a className="text-primary text-sm hover:underline flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="py-2 pr-4 font-medium">Severity</th>
                <th className="py-2 px-4 font-medium">Type</th>
                <th className="py-2 px-4 font-medium">Target</th>
                <th className="py-2 px-4 font-medium">Detected</th>
                <th className="py-2 pl-4 font-medium">Status</th>
                <th className="py-2 pl-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat) => (
                <tr key={threat.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 pr-4">
                    <span className={`inline-block w-2 h-2 rounded-full bg-alert-${threat.severity} mr-2`}></span>
                    <span className="capitalize">{threat.severity}</span>
                  </td>
                  <td className="py-3 px-4">{threat.type}</td>
                  <td className="py-3 px-4">{threat.target} ({threat.namespace})</td>
                  <td className="py-3 px-4">{threat.detectedAt}</td>
                  <td className="py-3 pl-4">
                    {getStatusBadge(threat.status)}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-400">
            Showing {Math.min(pageSize, threats.length)} of {totalThreats} threats
          </div>
          
          <div className="flex space-x-1">
            <Button 
              size="icon" 
              variant="secondary" 
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600"
              onClick={handlePrevPage}
              disabled={page === 1}
            >
              &lt;
            </Button>
            
            {[...Array(Math.min(totalPages, 3))].map((_, i) => (
              <Button
                key={i}
                size="icon"
                variant={page === i + 1 ? "default" : "secondary"}
                className={`w-8 h-8 ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                onClick={() => handlePageClick(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button 
              size="icon" 
              variant="secondary" 
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestThreatsTable;
