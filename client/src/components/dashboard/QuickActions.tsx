import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  FolderCheck, 
  Lock, 
  Sword,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: 'scan',
      title: 'Run Security Scan',
      icon: <ShieldCheck className="h-6 w-6 mb-2 text-primary" />,
      color: 'text-primary',
      action: () => console.log('Running security scan')
    },
    {
      id: 'backup',
      title: 'Backup Config',
      icon: <FolderCheck className="h-6 w-6 mb-2 text-secondary" />,
      color: 'text-secondary',
      action: () => console.log('Backing up configuration')
    },
    {
      id: 'rotate',
      title: 'Rotate Secrets',
      icon: <Lock className="h-6 w-6 mb-2 text-alert-low" />,
      color: 'text-alert-low',
      action: () => console.log('Rotating secrets')
    },
    {
      id: 'test',
      title: 'Test Defenses',
      icon: <Sword className="h-6 w-6 mb-2 text-alert-high" />,
      color: 'text-alert-high',
      action: () => console.log('Testing defenses')
    }
  ];

  return (
    <Card className="bg-bgdark-card">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="p-3 bg-gray-800 hover:bg-gray-700 border-none h-auto flex flex-col items-center justify-center text-center transition-colors"
              onClick={action.action}
            >
              {action.icon}
              <span className="text-sm">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
