import React from 'react';
import { ArrowUp, AlertTriangle, Check, CheckCheck, FileWarning } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';

const KPISection: React.FC = () => {
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/kpi'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-bgdark-card animate-pulse">
            <CardContent className="p-4 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const securityScore = kpiData?.securityScore || 72;
  const activeThreats = kpiData?.activeThreats || {
    total: 12,
    change: 4,
    critical: 4,
    high: 7,
    medium: 1
  };
  const vulnerableContainers = kpiData?.vulnerableContainers || {
    affected: 23,
    total: 142
  };
  const complianceStatus = kpiData?.complianceStatus || {
    percentage: 86,
    change: 2,
    pciDss: true,
    gdpr: true,
    hipaa: false
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Security Score */}
      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Security Score</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold">{securityScore}</span>
                <span className="text-sm text-alert-medium ml-1">/100</span>
              </div>
            </div>
            <div className="px-2 py-1 rounded bg-alert-medium/20 text-alert-medium text-xs">
              Moderate
            </div>
          </div>
          <Progress value={securityScore} className="mt-3 h-2 bg-gray-700" indicatorClassName="bg-alert-medium" />
          <div className="mt-2 text-xs text-gray-400">
            5 critical issues to resolve
          </div>
        </CardContent>
      </Card>

      {/* Active Threats */}
      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Active Threats</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-alert-critical">{activeThreats.total}</span>
                <span className="text-alert-critical text-sm ml-2 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +{activeThreats.change}
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-alert-critical/20 text-alert-critical pulse">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Critical</div>
              <Progress value={activeThreats.critical / activeThreats.total * 100} className="h-1.5 bg-gray-700" indicatorClassName="bg-alert-critical" />
              <div className="text-xs mt-1">{activeThreats.critical}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">High</div>
              <Progress value={activeThreats.high / activeThreats.total * 100} className="h-1.5 bg-gray-700" indicatorClassName="bg-alert-high" />
              <div className="text-xs mt-1">{activeThreats.high}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Medium</div>
              <Progress value={activeThreats.medium / activeThreats.total * 100} className="h-1.5 bg-gray-700" indicatorClassName="bg-alert-medium" />
              <div className="text-xs mt-1">{activeThreats.medium}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerable Containers */}
      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Vulnerable Containers</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-alert-high">{vulnerableContainers.affected}</span>
                <span className="text-xs text-gray-400 ml-2">of {vulnerableContainers.total} total</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-alert-high/20 text-alert-high">
              <FileWarning className="h-4 w-4" />
            </div>
          </div>
          <Progress 
            value={vulnerableContainers.affected / vulnerableContainers.total * 100} 
            className="mt-3 h-2 bg-gray-700" 
            indicatorClassName="bg-alert-high" 
          />
          <div className="mt-2 text-xs flex justify-between">
            <span>{Math.round(vulnerableContainers.affected / vulnerableContainers.total * 100)}% affected</span>
            <span className="text-alert-info cursor-pointer">View details</span>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="bg-bgdark-card">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-400 text-sm font-medium">Compliance Status</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-bold text-alert-low">{complianceStatus.percentage}%</span>
                <span className="text-alert-low text-sm ml-2 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  +{complianceStatus.change}%
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-alert-low/20 text-alert-low">
              <CheckCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-xs px-2 py-1 bg-gray-700 rounded flex items-center justify-between">
              PCI DSS
              <Check className={`h-3 w-3 ${complianceStatus.pciDss ? 'text-alert-low' : 'text-alert-high'}`} />
            </div>
            <div className="text-xs px-2 py-1 bg-gray-700 rounded flex items-center justify-between">
              GDPR
              <Check className={`h-3 w-3 ${complianceStatus.gdpr ? 'text-alert-low' : 'text-alert-high'}`} />
            </div>
            <div className="text-xs px-2 py-1 bg-gray-700 rounded flex items-center justify-between">
              HIPAA
              <AlertTriangle className={`h-3 w-3 ${!complianceStatus.hipaa ? 'text-alert-high' : 'text-alert-low'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPISection;
