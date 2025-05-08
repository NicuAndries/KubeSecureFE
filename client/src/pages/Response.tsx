import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Shield, 
  History, 
  PlayCircle, 
  StopCircle, 
  Download, 
  RefreshCw, 
  PlusCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { ResponseAction } from '@shared/schema';

const Response: React.FC = () => {
  const [activeTab, setActiveTab] = useState('actions');

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['/api/response'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['/api/response/history'],
    refetchInterval: 60000, // Refetch every minute
  });

  const handleAutomationToggle = (actionId: string, currentState: boolean) => {
    console.log(`Toggle automation for ${actionId} to ${!currentState}`);
  };

  const handleExecuteAction = (actionId: string) => {
    console.log(`Execute action ${actionId}`);
  };

  const renderResponseActions = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
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

    const actions = responseData?.actions || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action: ResponseAction) => (
          <Card key={action.id} className="bg-bgdark-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{action.name}</CardTitle>
                <Badge variant={action.automated ? "info" : "contained"}>
                  {action.automated ? 'Automated' : 'Manual'}
                </Badge>
              </div>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="font-medium capitalize">{action.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last executed:</span>
                  <span className="font-medium">{action.lastExecuted || 'Never'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Applicable threats:</span>
                  <span className="font-medium">{action.applicableThreats.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`automation-${action.id}`}
                  checked={action.enabled && action.automated}
                  onCheckedChange={() => handleAutomationToggle(action.id, action.enabled && action.automated)}
                  disabled={!action.automated}
                />
                <label 
                  htmlFor={`automation-${action.id}`}
                  className={`text-sm ${!action.automated ? 'text-gray-500' : ''}`}
                >
                  {action.enabled && action.automated ? 'Enabled' : 'Disabled'}
                </label>
              </div>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleExecuteAction(action.id)}
                disabled={!action.enabled}
              >
                Execute
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-800/80 transition-colors">
          <PlusCircle className="h-12 w-12 text-gray-500 mb-3" />
          <p className="text-gray-400 text-center">Create Custom Response Action</p>
        </Card>
      </div>
    );
  };

  const renderActionHistory = () => {
    if (historyLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg h-20"></div>
          ))}
        </div>
      );
    }

    const history = historyData?.history || [];

    return (
      <div className="space-y-4">
        {history.map((item: any) => (
          <div key={item.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{item.action}</h3>
                  <Badge 
                    variant={item.result === 'success' ? 'low' : 'critical'} 
                    className="ml-2"
                  >
                    {item.result === 'success' ? 'Success' : 'Failed'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Target: <span className="font-mono">{item.target}</span> | Threat: {item.threat}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="mr-2 h-4 w-4" />
                  {item.timestamp}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.result === 'success' ? 
                    <span className="flex items-center"><CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> by {item.user}</span> :
                    <span className="flex items-center"><XCircle className="h-3 w-3 mr-1 text-red-500" /> by {item.user}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Response Actions</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 border-none"
            size="sm"
          >
            <Download className="mr-1.5 h-4 w-4" />
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-center">Actions Available</h3>
            <div className="text-2xl font-bold">{responseData?.stats?.total || 6}</div>
          </CardContent>
        </Card>

        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-alert-low/20 flex items-center justify-center mb-2">
              <ToggleRight className="h-6 w-6 text-alert-low" />
            </div>
            <h3 className="font-medium text-center">Automated Enabled</h3>
            <div className="text-2xl font-bold">{responseData?.stats?.automated || 3}</div>
          </CardContent>
        </Card>

        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-alert-high/20 flex items-center justify-center mb-2">
              <PlayCircle className="h-6 w-6 text-alert-high" />
            </div>
            <h3 className="font-medium text-center">Actions Today</h3>
            <div className="text-2xl font-bold">{responseData?.stats?.actionsToday || 8}</div>
          </CardContent>
        </Card>

        <Card className="bg-bgdark-card">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-alert-medium/20 flex items-center justify-center mb-2">
              <ClipboardList className="h-6 w-6 text-alert-medium" />
            </div>
            <h3 className="font-medium text-center">Pending Threats</h3>
            <div className="text-2xl font-bold">{responseData?.stats?.pendingThreats || 4}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="actions" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="actions" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Response Actions
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="mr-2 h-4 w-4" />
                Action History
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'actions' && (
              <div className="flex items-center ml-auto space-x-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-respond" />
                  <label htmlFor="auto-respond" className="text-sm">Enable Automatic Response</label>
                </div>
              </div>
            )}
          </div>
          
          <Card className="bg-bgdark-card mt-4">
            <CardContent className="p-6">
              <TabsContent value="actions" className="mt-0">
                {renderResponseActions()}
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                {renderActionHistory()}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-4">Custom Rules</h2>
        <Card className="bg-bgdark-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-400">Define custom response rules to automatically react to specific threats</p>
              <Button variant="default" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Critical vulnerability response</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Automatically isolate any pod with a critical vulnerability (CVSS &gt; 9.0)
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Suspicious network activity</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Block external connections to suspicious IPs and notify security team
                    </p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Container escape remediation</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Terminate any pod showing container escape behavior and quarantine node
                    </p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Response;
