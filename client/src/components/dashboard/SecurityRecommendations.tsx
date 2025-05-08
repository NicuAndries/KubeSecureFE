import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ListChecks } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  estimatedTime: string;
  action: string;
}

const SecurityRecommendations: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/recommendations'],
    refetchInterval: 3600000, // Refetch every hour
  });

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-alert-critical text-alert-critical';
      case 'high': return 'border-alert-high text-alert-high';
      case 'medium': return 'border-alert-medium text-alert-medium';
      case 'low': return 'border-alert-low text-alert-low';
      default: return 'border-gray-700 text-gray-300';
    }
  };

  const getActionButton = (action: string, severity: string) => {
    const isCritical = severity === 'critical';
    const className = isCritical 
      ? 'text-xs text-white bg-alert-critical px-2 py-1 rounded hover:bg-alert-critical/80' 
      : 'text-xs text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-600';
    
    return (
      <Button 
        size="sm" 
        variant={isCritical ? "destructive" : "secondary"}
        className={className}
      >
        {action}
      </Button>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-bgdark-card animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Security Recommendations</h2>
            <div className="w-24 h-6 bg-gray-700 rounded-full"></div>
          </div>
          
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border-l-4 border-gray-700 bg-gray-800 rounded-r-lg h-24"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recommendations: Recommendation[] = data?.recommendations || [];
  const pendingCount = data?.pendingCount || 6;

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Security Recommendations</h2>
          <div className="text-xs bg-gray-800 rounded-full px-2 py-1">
            <span className="text-alert-low font-medium">{pendingCount}</span> pending actions
          </div>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`p-3 border-l-4 ${getSeverityClass(rec.severity)} bg-gray-800 rounded-r-lg`}>
              <div className="flex justify-between">
                <h3 className="font-medium">{rec.title}</h3>
                <span className={`text-xs text-alert-${rec.severity}`}>
                  {rec.severity.charAt(0).toUpperCase() + rec.severity.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
              <div className="mt-2 flex justify-between">
                <span className="text-xs text-gray-400">Estimated time: {rec.estimatedTime}</span>
                {getActionButton(rec.action, rec.severity)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="secondary" 
            className="w-full py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityRecommendations;
