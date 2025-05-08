import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Info, 
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';

interface HeatmapDataPoint {
  day: number;
  week: number;
  threats: number;
  intensity: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

const ThreatHeatmap: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/heatmap'],
    refetchInterval: 3600000, // Refetch every hour
  });

  const getIntensityColor = (point: HeatmapDataPoint) => {
    switch (point.severity) {
      case 'critical': return `bg-alert-critical/${Math.min(60, point.intensity)}`;
      case 'high': return `bg-alert-high/${Math.min(60, point.intensity)}`;
      case 'medium': return `bg-alert-medium/${Math.min(60, point.intensity)}`;
      case 'low': return `bg-alert-low/${Math.min(60, point.intensity)}`;
      case 'none': return 'bg-gray-800';
      default: return 'bg-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-bgdark-card animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Threat Heatmap</h2>
            <div className="flex space-x-1">
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-xs text-center text-gray-400">{day}</div>
            ))}
          </div>
          
          <div className="space-y-4">
            {[0, 1].map((week) => (
              <div key={week} className="grid grid-cols-7 gap-1">
                {[...Array(7)].map((_, day) => (
                  <div key={day} className="aspect-square rounded bg-gray-800/50"></div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const heatmapData: HeatmapDataPoint[] = data?.heatmapData || [];
  const weeks = Array.from(new Set(heatmapData.map(point => point.week))).sort();

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Threat Heatmap</h2>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4 text-gray-400 hover:text-white" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-xs text-center text-gray-400">{day}</div>
          ))}
        </div>
        
        <div className="space-y-4">
          {weeks.map((week) => (
            <div key={week} className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, dayIndex) => {
                const point = heatmapData.find(p => p.week === week && p.day === dayIndex) || {
                  day: dayIndex,
                  week,
                  threats: 0,
                  intensity: 0,
                  severity: 'none' as const
                };
                
                return (
                  <TooltipProvider key={dayIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`aspect-square rounded ${getIntensityColor(point)}`}></div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{point.threats || 'No'} threats</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
          <div>Less</div>
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded bg-alert-low/20"></div>
            <div className="w-4 h-4 rounded bg-alert-low/60"></div>
            <div className="w-4 h-4 rounded bg-alert-medium/60"></div>
            <div className="w-4 h-4 rounded bg-alert-high/60"></div>
            <div className="w-4 h-4 rounded bg-alert-critical/60"></div>
          </div>
          <div>More</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatHeatmap;
