import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Trash, 
  Plus, 
  RefreshCw, 
  BrainCircuit, 
  ShieldAlert,
  Webhook,
  Mail,
  AlertCircle,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Configuration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ml-models');

  const { data: mlModelsData, isLoading: mlModelsLoading } = useQuery({
    queryKey: ['/api/config/ml-models'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/config/detection-rules'],
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const handleTrainModel = (modelId: string) => {
    console.log(`Training model ${modelId}`);
  };

  const handleToggleRule = (ruleId: string, currentState: boolean) => {
    console.log(`Toggle rule ${ruleId} to ${!currentState}`);
  };

  const renderMLModels = () => {
    if (mlModelsLoading) {
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

    const models = mlModelsData?.models || [];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model: any) => (
          <Card key={model.id} className="bg-bgdark-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge variant={
                  model.status === 'active' ? 'low' : 
                  model.status === 'training' ? 'medium' : 
                  'contained'
                }>
                  {model.status}
                </Badge>
              </div>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="font-medium">{model.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last trained:</span>
                  <span className="font-medium">{model.lastTrained}</span>
                </div>
                {model.accuracy !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy:</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline"
                size="sm"
                className="bg-gray-700 hover:bg-gray-600 border-none"
                disabled={model.status === 'training'}
              >
                <Settings className="mr-2 h-3 w-3" />
                Configure
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={() => handleTrainModel(model.id)}
                disabled={model.status === 'training'}
              >
                <RefreshCw className={`mr-2 h-3 w-3 ${model.status === 'training' ? 'animate-spin' : ''}`} />
                {model.status === 'training' ? 'Training...' : 'Train Model'}
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card className="bg-gray-800/50 border-dashed border-2 border-gray-700 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-800/80 transition-colors">
          <Plus className="h-12 w-12 text-gray-500 mb-3" />
          <p className="text-gray-400 text-center">Add New Model</p>
        </Card>
      </div>
    );
  };

  const renderDetectionRules = () => {
    if (rulesLoading) {
      return (
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-800 rounded-lg h-20"></div>
          ))}
        </div>
      );
    }

    const rules = rulesData?.rules || [];

    return (
      <div className="space-y-4">
        {rules.map((rule: any) => (
          <div key={rule.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{rule.name}</h3>
                  <Badge 
                    variant={
                      rule.severity === 'critical' ? 'critical' :
                      rule.severity === 'high' ? 'high' :
                      rule.severity === 'medium' ? 'medium' :
                      'low'
                    } 
                    className="ml-2"
                  >
                    {rule.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <Switch 
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id, rule.enabled)}
                />
                <div className="text-xs text-gray-500 mt-1">Created: {rule.createdAt}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="p-4 bg-gray-800/50 border-dashed border-2 border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800/80 transition-colors">
          <Plus className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-400">Add New Detection Rule</p>
        </div>
      </div>
    );
  };

  const renderIntegrations = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-bgdark-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Webhook className="h-5 w-5 mr-2" />
              Webhook Notifications
            </CardTitle>
            <CardDescription>
              Configure webhooks to send alerts to external systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-4">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://example.com/webhook" 
                    className="bg-gray-800 border-gray-700"
                    defaultValue="https://slack.com/api/hooks/T01234/B01234"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="webhook-type">Type</Label>
                  <Select defaultValue="slack">
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select webhook type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label>Alert Severity Levels</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="critical-alerts" defaultChecked />
                    <Label htmlFor="critical-alerts" className="text-sm">Critical</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="high-alerts" defaultChecked />
                    <Label htmlFor="high-alerts" className="text-sm">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="medium-alerts" defaultChecked />
                    <Label htmlFor="medium-alerts" className="text-sm">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="low-alerts" />
                    <Label htmlFor="low-alerts" className="text-sm">Low</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
            <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 border-none">
              <Trash className="mr-2 h-4 w-4" />
              Remove
            </Button>
            <Button variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save Webhook
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-bgdark-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure email alerts for security events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-from">From Email</Label>
                  <Input 
                    id="email-from" 
                    placeholder="securityalerts@example.com" 
                    className="bg-gray-800 border-gray-700"
                    defaultValue="kubernetes-security@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email-to">Recipient Email</Label>
                  <Input 
                    id="email-to" 
                    placeholder="security-team@example.com" 
                    className="bg-gray-800 border-gray-700"
                    defaultValue="security-team@company.com,admin@company.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label>Schedule</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="realtime-alerts" defaultChecked />
                    <Label htmlFor="realtime-alerts" className="text-sm">Realtime (critical only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="daily-digest" defaultChecked />
                    <Label htmlFor="daily-digest" className="text-sm">Daily Digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="weekly-report" defaultChecked />
                    <Label htmlFor="weekly-report" className="text-sm">Weekly Report</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t border-gray-700 pt-4">
            <Button variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save Email Configuration
            </Button>
          </CardFooter>
        </Card>
        
        <div className="p-4 bg-gray-800/50 border-dashed border-2 border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800/80 transition-colors min-h-[100px]">
          <Plus className="h-5 w-5 text-gray-500 mr-2" />
          <p className="text-gray-400">Add New Integration</p>
        </div>
      </div>
    );
  };

  const renderAutomatedResponse = () => {
    return (
      <div className="space-y-4">
        <Card className="bg-bgdark-card">
          <CardHeader>
            <CardTitle>Automated Response Settings</CardTitle>
            <CardDescription>
              Configure how the system responds automatically to threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Automated Response</h3>
                  <p className="text-sm text-gray-400">Allow the system to automatically respond to security threats</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Response Level</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="radio"
                        name="notification"
                        id="notification"
                        className="h-4 w-4 text-primary rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="notification" className="font-medium">Notification Only</label>
                      <p className="text-sm text-gray-400">
                        Only send notifications without taking automated actions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="radio"
                        name="notification"
                        id="moderate"
                        className="h-4 w-4 text-primary rounded"
                        defaultChecked
                      />
                    </div>
                    <div>
                      <label htmlFor="moderate" className="font-medium">Moderate</label>
                      <p className="text-sm text-gray-400">
                        Take non-disruptive actions (network isolation, token rotation) automatically
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        type="radio"
                        name="notification"
                        id="aggressive"
                        className="h-4 w-4 text-primary rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="aggressive" className="font-medium">Aggressive</label>
                      <p className="text-sm text-gray-400">
                        Take all necessary actions including pod termination and node quarantine
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Approval Requirements</h3>
                <Select defaultValue="critical">
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select approval level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No approval required</SelectItem>
                    <SelectItem value="critical">Only for critical actions</SelectItem>
                    <SelectItem value="high">For high and critical actions</SelectItem>
                    <SelectItem value="all">Required for all actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t border-gray-700 pt-4">
            <Button variant="default">
              <Save className="mr-2 h-4 w-4" />
              Save Response Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-bgdark-card">
          <CardHeader>
            <CardTitle>Response Actions Whitelist</CardTitle>
            <CardDescription>
              Define components that should never be affected by automated response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="namespaces">
                <AccordionTrigger>Protected Namespaces</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>kube-system</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>monitoring</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex">
                      <Input placeholder="Add namespace" className="bg-gray-800 border-gray-700" />
                      <Button variant="default" className="ml-2">Add</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="services">
                <AccordionTrigger>Critical Services</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>kube-dns (kube-system)</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>payment-service (default)</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>database-primary (default)</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex">
                      <Input placeholder="Add service" className="bg-gray-800 border-gray-700" />
                      <Button variant="default" className="ml-2">Add</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="nodes">
                <AccordionTrigger>Protected Nodes</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-gray-800 rounded-md">
                      <span>master-node-01</span>
                      <Button variant="outline" size="sm" className="h-7 bg-gray-700 hover:bg-gray-600 border-none">
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex">
                      <Input placeholder="Add node" className="bg-gray-800 border-gray-700" />
                      <Button variant="default" className="ml-2">Add</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Settings className="mr-3 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Configuration</h1>
        </div>
      </div>

      <Tabs defaultValue="ml-models" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:max-w-xl grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="ml-models" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" />
            ML Models
          </TabsTrigger>
          <TabsTrigger value="detection-rules" className="flex items-center">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Detection Rules
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Webhook className="mr-2 h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="automated-response" className="flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            Automated Response
          </TabsTrigger>
        </TabsList>
        
        <Card className="bg-bgdark-card">
          <CardContent className="p-6">
            <TabsContent value="ml-models" className="mt-0">
              {renderMLModels()}
            </TabsContent>
            
            <TabsContent value="detection-rules" className="mt-0">
              {renderDetectionRules()}
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-0">
              {renderIntegrations()}
            </TabsContent>
            
            <TabsContent value="automated-response" className="mt-0">
              {renderAutomatedResponse()}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
};

export default Configuration;
