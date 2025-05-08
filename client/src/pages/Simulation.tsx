import React, { useState } from 'react';
import { 
  Sword, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BarChart4, 
  ShieldAlert, 
  ShieldCheck,
  HelpCircle,
  StopCircle,
  RefreshCw,
  Info,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SimulationResult {
  id: string;
  simulationId: string;
  simulationName: string;
  startTime: string;
  endTime: string;
  status: 'running' | 'completed' | 'failed';
  detectionSuccess: boolean;
  detectionTime: string;
  steps: {
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    detected: boolean;
  }[];
  summary: {
    threatsDetected: number;
    totalThreats: number;
    meanTimeToDetect: string;
    successRate: number;
  };
}

const Simulation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [runningSimulation, setRunningSimulation] = useState<string | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  const { data: simulationsData, isLoading } = useQuery({
    queryKey: ['/api/simulations'],
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: resultsData, isLoading: resultsLoading } = useQuery({
    queryKey: ['/api/simulations/results'],
    refetchInterval: 60000, // Refetch every minute
  });

  const handleRunSimulation = (simulationId: string) => {
    setRunningSimulation(simulationId);
    setSimulationProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningSimulation(null);
          // After simulation completes, open the results dialog
          setActiveSimulation(simulationId);
          setOpenDialog(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleStopSimulation = () => {
    setRunningSimulation(null);
    setSimulationProgress(0);
  };

  const handleViewResults = (simulationId: string) => {
    setActiveSimulation(simulationId);
    setOpenDialog(true);
  };

  const renderScenarios = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-bgdark-card animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="bg-gray-800 h-6 w-3/4 rounded"></CardTitle>
                <CardDescription className="bg-gray-800 h-4 w-full rounded mt-2"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 h-4 w-1/2 rounded mb-2"></div>
                <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="bg-gray-800 h-8 w-20 rounded"></div>
                <div className="bg-gray-800 h-8 w-20 rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      );
    }

    const simulations = simulationsData?.simulations || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {simulations.map((simulation: any) => (
          <Card 
            key={simulation.id} 
            className={`bg-bgdark-card ${selectedSimulation === simulation.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedSimulation(simulation.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{simulation.name}</CardTitle>
                <Badge variant="high">{simulation.difficulty}</Badge>
              </div>
              <CardDescription>{simulation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span>{simulation.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Targets:</span>
                  <span>{simulation.targets.join(', ')}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-1">Attack Steps:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    {simulation.steps.map((step: string, index: number) => (
                      <li key={index} className="list-disc list-inside">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="secondary"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600"
                onClick={() => {}}
              >
                <Info className="mr-2 h-3 w-3" />
                Details
              </Button>
              {runningSimulation === simulation.id ? (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStopSimulation()}
                >
                  <StopCircle className="mr-2 h-3 w-3" />
                  Stop
                </Button>
              ) : (
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => handleRunSimulation(simulation.id)}
                  disabled={runningSimulation !== null}
                >
                  <Play className="mr-2 h-3 w-3" />
                  Run
                </Button>
              )}
            </CardFooter>
            {runningSimulation === simulation.id && (
              <div className="px-4 pb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Running simulation...</span>
                  <span>{simulationProgress}%</span>
                </div>
                <Progress value={simulationProgress} className="h-1" />
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderResults = () => {
    if (resultsLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg h-24"></div>
          ))}
        </div>
      );
    }

    const results = resultsData?.results || [];

    return (
      <div className="space-y-4">
        {results.map((result: SimulationResult) => (
          <div key={result.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{result.simulationName}</h3>
                  <Badge 
                    variant={result.status === 'completed' ? (result.detectionSuccess ? 'low' : 'high') : result.status === 'running' ? 'medium' : 'critical'} 
                    className="ml-2"
                  >
                    {result.status === 'completed' ? (result.detectionSuccess ? 'Detected' : 'Undetected') : result.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Run on {result.startTime} • Detection time: {result.detectionTime}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 border-none"
                onClick={() => handleViewResults(result.id)}
              >
                View Results
              </Button>
            </div>
            
            <div className="mt-3 flex items-center">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Detection Rate</div>
                <div className="flex items-center">
                  <Progress 
                    value={result.summary.successRate} 
                    className="h-2 flex-1" 
                    indicatorClassName={
                      result.summary.successRate > 75 ? "bg-alert-low" :
                      result.summary.successRate > 50 ? "bg-alert-medium" : 
                      result.summary.successRate > 25 ? "bg-alert-high" : "bg-alert-critical"
                    }
                  />
                  <span className="ml-2 text-sm font-medium">{result.summary.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="p-8 text-center bg-gray-800 rounded-lg">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-gray-400">Run a simulation to see results here</p>
          </div>
        )}
      </div>
    );
  };

  const renderResultDialog = () => {
    if (!activeSimulation || !resultsData) return null;
    
    const result = resultsData.results.find((r: SimulationResult) => r.id === activeSimulation);
    if (!result) return null;

    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-bgdark-card text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center">
                <Sword className="mr-2 h-5 w-5 text-primary" />
                Simulation Results: {result.simulationName}
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Attack simulation run at {result.startTime}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div className="text-sm text-gray-400">Threats Simulated</div>
              <div className="text-xl font-bold">{result.summary.totalThreats}</div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-alert-low/20 flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5 text-alert-low" />
              </div>
              <div className="text-sm text-gray-400">Threats Detected</div>
              <div className="text-xl font-bold">{result.summary.threatsDetected}</div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-alert-medium/20 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-alert-medium" />
              </div>
              <div className="text-sm text-gray-400">Mean Time to Detect</div>
              <div className="text-xl font-bold">{result.summary.meanTimeToDetect}</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-3 flex items-center">
              <Terminal className="mr-2 h-4 w-4" />
              Simulation Steps
            </h3>
            <div className="space-y-3">
              {result.steps.map((step, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-gray-700 last:border-0">
                  <div className="flex items-center">
                    {step.status === 'completed' && (
                      <CheckCircle2 className="h-4 w-4 text-alert-low mr-2" />
                    )}
                    {step.status === 'running' && (
                      <RefreshCw className="h-4 w-4 text-alert-medium mr-2 animate-spin" />
                    )}
                    {step.status === 'failed' && (
                      <AlertCircle className="h-4 w-4 text-alert-critical mr-2" />
                    )}
                    {step.status === 'pending' && (
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm">{step.name}</span>
                  </div>
                  <Badge 
                    variant={step.detected ? 'low' : step.status === 'completed' ? 'critical' : 'default'} 
                    className="text-xs"
                  >
                    {step.detected ? 'Detected' : step.status === 'completed' ? 'Undetected' : step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-alert-high/10 border border-alert-high/30 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-alert-high mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-alert-high mb-1">Improvement suggestions</h4>
                <p className="text-sm text-gray-300">
                  Consider enabling network policy detection for better coverage of lateral movement threats. 
                  Also, update the container escape detection rules which missed some simulation steps.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
            <Button variant="default" className="bg-primary hover:bg-primary-dark">
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Sword className="mr-3 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Attack Simulation</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
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

      <Alert className="mb-6 bg-bgdark-card border-alert-high">
        <AlertTriangle className="h-4 w-4 text-alert-high" />
        <AlertTitle className="text-alert-high">Important Safety Notice</AlertTitle>
        <AlertDescription>
          Attack simulations should only be run in testing environments. Running simulations in production can trigger 
          security systems and potentially impact running services.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Sword className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-center">Simulation Scenarios</h3>
            <div className="text-2xl font-bold">{simulationsData?.stats?.totalScenarios || 5}</div>
          </CardContent>
        </Card>

        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-alert-medium/20 flex items-center justify-center mb-2">
              <Play className="h-6 w-6 text-alert-medium" />
            </div>
            <h3 className="font-medium text-center">Simulations Run</h3>
            <div className="text-2xl font-bold">{simulationsData?.stats?.totalRuns || 12}</div>
          </CardContent>
        </Card>

        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-alert-low/20 flex items-center justify-center mb-2">
              <BarChart4 className="h-6 w-6 text-alert-low" />
            </div>
            <h3 className="font-medium text-center">Detection Rate</h3>
            <div className="text-2xl font-bold">{simulationsData?.stats?.detectionRate || 78}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scenarios" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="scenarios" className="flex items-center">
            <Sword className="mr-2 h-4 w-4" />
            Simulation Scenarios
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center">
            <BarChart4 className="mr-2 h-4 w-4" />
            Simulation Results
          </TabsTrigger>
        </TabsList>
        
        <Card className="bg-bgdark-card">
          <CardContent className="p-6">
            <TabsContent value="scenarios" className="mt-0">
              {renderScenarios()}
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              {renderResults()}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {renderResultDialog()}
    </>
  );
};

export default Simulation;
