import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const ThreatActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/threat-activity', timeRange],
    refetchInterval: 60000, // Refetch every minute
  });

  const handleRangeChange = (range: typeof timeRange) => {
    setTimeRange(range);
  };

  if (isLoading) {
    return (
      <Card className="bg-bgdark-card h-80 animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Threat Activity</h2>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-700 rounded-md"></div>
              <div className="h-8 w-16 bg-gray-700 rounded-md"></div>
              <div className="h-8 w-16 bg-gray-700 rounded-md"></div>
            </div>
          </div>
          <div className="h-56 bg-gray-800/50 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Threat Activity (Last 24h)</h2>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === 'hourly' ? 'default' : 'secondary'} 
              className={timeRange === 'hourly' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-gray-700 hover:bg-gray-600'}
              size="sm"
              onClick={() => handleRangeChange('hourly')}
            >
              Hourly
            </Button>
            <Button 
              variant={timeRange === 'daily' ? 'default' : 'secondary'} 
              className={timeRange === 'daily' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-gray-700 hover:bg-gray-600'}
              size="sm"
              onClick={() => handleRangeChange('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={timeRange === 'weekly' ? 'default' : 'secondary'} 
              className={timeRange === 'weekly' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-gray-700 hover:bg-gray-600'}
              size="sm"
              onClick={() => handleRangeChange('weekly')}
            >
              Weekly
            </Button>
          </div>
        </div>
        
        <div className="chart-container h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.chartData || []}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#4B5563' }}
                labelStyle={{ color: '#E5E7EB' }} 
              />
              <Area 
                type="monotone" 
                dataKey="critical" 
                name="Critical" 
                stackId="1"
                stroke="#EF4444" 
                fillOpacity={1} 
                fill="url(#colorCritical)" 
              />
              <Area 
                type="monotone" 
                dataKey="high" 
                name="High" 
                stackId="1"
                stroke="#F97316" 
                fillOpacity={1} 
                fill="url(#colorHigh)" 
              />
              <Area 
                type="monotone" 
                dataKey="medium" 
                name="Medium" 
                stackId="1"
                stroke="#FACC15" 
                fillOpacity={1} 
                fill="url(#colorMedium)" 
              />
              <Area 
                type="monotone" 
                dataKey="low" 
                name="Low" 
                stackId="1"
                stroke="#22C55E" 
                fillOpacity={1} 
                fill="url(#colorLow)" 
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-alert-critical mr-2"></span>
            <span>Critical</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-alert-high mr-2"></span>
            <span>High</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-alert-medium mr-2"></span>
            <span>Medium</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-alert-low mr-2"></span>
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatActivityChart;
