import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Filter, 
  MoreHorizontal, 
  ChevronDown,
  RefreshCw,
  FileDown,
  Search
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThreatData {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  target: string;
  namespace: string;
  detectedAt: string;
  status: 'active' | 'investigating' | 'contained' | 'remediation' | 'resolved';
  description: string;
  podName: string;
  details: {
    sourceIp?: string;
    attemptCount?: number;
    affectedServices?: string[];
    cve?: string;
  };
}

const Threats: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  
  const pageSize = 10;
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/threats', { page, pageSize, search: searchQuery, status: statusFilter, severity: severityFilter }],
    refetchInterval: 60000, // Refetch every minute
  });

  const threats: ThreatData[] = data?.threats || [];
  const totalThreats = data?.total || 0;
  const totalPages = Math.ceil(totalThreats / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const toggleThreatDetails = (id: string) => {
    setSelectedThreat(selectedThreat === id ? null : id);
  };

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

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <AlertTriangle className="mr-3 h-6 w-6 text-alert-high" />
          <h1 className="text-2xl font-bold">Threat Management</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border-none"
            size="sm"
          >
            <FileDown className="mr-1.5 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border-none"
            size="sm"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="bg-bgdark-card mb-6">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search threats..."
              className="pl-8 bg-gray-800 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="contained">Contained</SelectItem>
                  <SelectItem value="remediation">Remediation</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Severity" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-md"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="py-2 pr-4 font-medium">Severity</th>
                    <th className="py-2 px-4 font-medium">Type</th>
                    <th className="py-2 px-4 font-medium">Target</th>
                    <th className="py-2 px-4 font-medium">Namespace</th>
                    <th className="py-2 px-4 font-medium">Detected</th>
                    <th className="py-2 pl-4 font-medium">Status</th>
                    <th className="py-2 pl-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {threats.map((threat) => (
                    <React.Fragment key={threat.id}>
                      <tr 
                        className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => toggleThreatDetails(threat.id)}
                      >
                        <td className="py-3 pr-4">
                          <span className={`inline-block w-2 h-2 rounded-full bg-alert-${threat.severity} mr-2`}></span>
                          <span className="capitalize">{threat.severity}</span>
                        </td>
                        <td className="py-3 px-4">{threat.type}</td>
                        <td className="py-3 px-4">{threat.target}</td>
                        <td className="py-3 px-4">{threat.namespace}</td>
                        <td className="py-3 px-4">{threat.detectedAt}</td>
                        <td className="py-3 pl-4">
                          {getStatusBadge(threat.status)}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <ChevronDown className={`h-4 w-4 transition-transform ${
                            selectedThreat === threat.id ? 'rotate-180' : ''
                          }`} />
                        </td>
                      </tr>
                      
                      {selectedThreat === threat.id && (
                        <tr className="bg-gray-800/30">
                          <td colSpan={7} className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <h3 className="font-medium mb-2">Description</h3>
                                <p className="text-sm text-gray-300 mb-4">{threat.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h4 className="text-gray-400 mb-1">Pod</h4>
                                    <p>{threat.podName}</p>
                                  </div>
                                  {threat.details.sourceIp && (
                                    <div>
                                      <h4 className="text-gray-400 mb-1">Source IP</h4>
                                      <p>{threat.details.sourceIp}</p>
                                    </div>
                                  )}
                                  {threat.details.attemptCount && (
                                    <div>
                                      <h4 className="text-gray-400 mb-1">Attempt Count</h4>
                                      <p>{threat.details.attemptCount}</p>
                                    </div>
                                  )}
                                  {threat.details.cve && (
                                    <div>
                                      <h4 className="text-gray-400 mb-1">CVE</h4>
                                      <p>{threat.details.cve}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                {threat.details.affectedServices && (
                                  <div className="mb-4">
                                    <h3 className="font-medium mb-2">Affected Services</h3>
                                    <div className="bg-gray-700 rounded-md p-2">
                                      <ul className="list-disc list-inside text-sm">
                                        {threat.details.affectedServices.map((service, idx) => (
                                          <li key={idx} className="mb-1">{service}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                                
                                <h3 className="font-medium mb-2">Actions</h3>
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" variant="default" className="bg-primary hover:bg-primary-dark">
                                    View Details
                                  </Button>
                                  {threat.status === 'active' && (
                                    <Button size="sm" variant="destructive">
                                      Isolate Pod
                                    </Button>
                                  )}
                                  {threat.status === 'investigating' && (
                                    <Button size="sm" variant="outline" className="bg-gray-700 hover:bg-gray-600 border-none">
                                      Mark as Contained
                                    </Button>
                                  )}
                                  {threat.status === 'remediation' && (
                                    <Button size="sm" variant="outline" className="bg-alert-info/20 text-alert-info hover:bg-alert-info/30 border-none">
                                      Apply Remediation
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              
              {threats.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-400">No threats match your filters</p>
                </div>
              )}
              
              {threats.length > 0 && (
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="text-gray-400">
                    Showing {Math.min(pageSize, threats.length)} of {totalThreats} threats
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      &lt;
                    </Button>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                      <Button
                        key={i}
                        size="icon"
                        variant={page === i + 1 ? "default" : "secondary"}
                        className={`w-8 h-8 ${page === i + 1 ? 'bg-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Threats;
