// This file contains mock data for development purposes
// In production, this would be replaced with real data from the Kubernetes API

import { 
  Threat, 
  ClusterTopology, 
  KPIData, 
  ThreatHeatmapData, 
  ThreatActivityData,
  Vulnerability,
  SecurityRecommendation,
  AttackSimulation,
  ResponseAction
} from "@shared/schema";

// KPI data for the dashboard
export const kpiData: KPIData = {
  securityScore: 72,
  activeThreats: {
    total: 12,
    change: 4,
    critical: 4,
    high: 7,
    medium: 1,
    low: 0
  },
  vulnerableContainers: {
    affected: 23,
    total: 142
  },
  complianceStatus: {
    percentage: 86,
    change: 2,
    pciDss: true,
    gdpr: true,
    hipaa: false
  }
};

// Threat activity chart data
export const generateThreatActivityData = (range: 'hourly' | 'daily' | 'weekly'): ThreatActivityData => {
  let chartData = [];
  let timeLabel = '';
  let dataPoints = 24;

  if (range === 'hourly') {
    timeLabel = 'hour';
    dataPoints = 24;
  } else if (range === 'daily') {
    timeLabel = 'day';
    dataPoints = 7;
  } else {
    timeLabel = 'week';
    dataPoints = 12;
  }

  for (let i = 0; i < dataPoints; i++) {
    chartData.push({
      time: `${timeLabel} ${i+1}`,
      critical: Math.floor(Math.random() * 4),
      high: Math.floor(Math.random() * 7),
      medium: Math.floor(Math.random() * 10),
      low: Math.floor(Math.random() * 15)
    });
  }

  return { chartData };
};

// Cluster topology data
export const topologyData: ClusterTopology = {
  nodes: [
    // Kubernetes nodes
    { id: 'node-1', name: 'worker-1', type: 'node', namespace: 'default', severity: 'none' },
    { id: 'node-2', name: 'worker-2', type: 'node', namespace: 'default', severity: 'none' },
    { id: 'node-3', name: 'worker-3', type: 'node', namespace: 'default', severity: 'high' },
    
    // Pods - default namespace
    { id: 'pod-1', name: 'api-server-pod', type: 'pod', namespace: 'kube-system', severity: 'critical' },
    { id: 'pod-2', name: 'payment-service', type: 'pod', namespace: 'default', severity: 'high' },
    { id: 'pod-3', name: 'frontend-service', type: 'pod', namespace: 'default', severity: 'medium' },
    { id: 'pod-4', name: 'database-primary', type: 'pod', namespace: 'default', severity: 'none' },
    { id: 'pod-5', name: 'database-replica', type: 'pod', namespace: 'default', severity: 'none' },
    
    // Pods - monitoring namespace
    { id: 'pod-6', name: 'logging-agent', type: 'pod', namespace: 'monitoring', severity: 'high' },
    { id: 'pod-7', name: 'prometheus', type: 'pod', namespace: 'monitoring', severity: 'none' },
    { id: 'pod-8', name: 'grafana', type: 'pod', namespace: 'monitoring', severity: 'low' },
    
    // Pods - storage namespace
    { id: 'pod-9', name: 'backup-service', type: 'pod', namespace: 'storage', severity: 'low' },
    
    // Services
    { id: 'svc-1', name: 'api-service', type: 'service', namespace: 'default', severity: 'none' },
    { id: 'svc-2', name: 'payment-service', type: 'service', namespace: 'default', severity: 'high' },
    { id: 'svc-3', name: 'frontend-service', type: 'service', namespace: 'default', severity: 'none' },
    { id: 'svc-4', name: 'database', type: 'service', namespace: 'default', severity: 'none' },
    { id: 'svc-5', name: 'monitoring', type: 'service', namespace: 'monitoring', severity: 'none' }
  ],
  links: [
    // Node to pod connections
    { source: 'node-1', target: 'pod-1', suspicious: false },
    { source: 'node-1', target: 'pod-2', suspicious: true, traffic: true },
    { source: 'node-1', target: 'pod-3', suspicious: false },
    { source: 'node-2', target: 'pod-4', suspicious: false },
    { source: 'node-2', target: 'pod-5', suspicious: false },
    { source: 'node-3', target: 'pod-6', suspicious: true, traffic: true },
    { source: 'node-3', target: 'pod-7', suspicious: false },
    { source: 'node-3', target: 'pod-8', suspicious: false },
    { source: 'node-3', target: 'pod-9', suspicious: false },
    
    // Pod to service connections
    { source: 'pod-2', target: 'svc-2', suspicious: true, traffic: true },
    { source: 'pod-3', target: 'svc-3', suspicious: false },
    { source: 'pod-4', target: 'svc-4', suspicious: false },
    { source: 'pod-5', target: 'svc-4', suspicious: false },
    { source: 'pod-6', target: 'svc-5', suspicious: false },
    { source: 'pod-7', target: 'svc-5', suspicious: false },
    { source: 'pod-8', target: 'svc-5', suspicious: false },
    
    // Pod to pod connections
    { source: 'pod-1', target: 'pod-2', suspicious: true, traffic: true },
    { source: 'pod-2', target: 'pod-4', suspicious: false, traffic: true },
    { source: 'pod-3', target: 'pod-2', suspicious: false },
    { source: 'pod-3', target: 'pod-4', suspicious: false },
    { source: 'pod-6', target: 'pod-1', suspicious: true, traffic: true },
    { source: 'pod-6', target: 'pod-2', suspicious: false },
    { source: 'pod-6', target: 'pod-3', suspicious: false },
    { source: 'pod-6', target: 'pod-4', suspicious: false },
    { source: 'pod-7', target: 'pod-6', suspicious: false }
  ],
  stats: {
    nodes: 3,
    pods: 9,
    services: 5,
    podConnections: 847,
    suspiciousConnections: 6,
    threatCount: 12
  }
};

// Threats data
export const generateThreats = (page: number, pageSize: number, filters?: {
  search?: string,
  status?: string,
  severity?: string
}): { threats: Threat[], total: number } => {
  const allThreats: Threat[] = [
    {
      id: 'threat-1',
      severity: 'critical',
      type: 'Privilege Escalation',
      target: 'api-server-pod',
      namespace: 'kube-system',
      detectedAt: '5 min ago',
      status: 'active',
      description: 'Detected attempt to escalate privileges from a pod in the kube-system namespace. The attack targeted the Kubernetes API server with multiple privilege escalation attempts.',
      podName: 'api-server-pod-8f7d9c5b7-x2j4z',
      details: {
        sourceIp: '192.168.1.142',
        attemptCount: 8,
        affectedServices: ['kube-apiserver', 'etcd']
      }
    },
    {
      id: 'threat-2',
      severity: 'high',
      type: 'Suspicious Network Activity',
      target: 'payment-service',
      namespace: 'default',
      detectedAt: '18 min ago',
      status: 'investigating',
      description: 'Unusual outbound network traffic detected from payment service pod to an unknown external IP address. Possible data exfiltration attempt.',
      podName: 'payment-service-5d8b9f6c4-t3r7m',
      details: {
        sourceIp: '203.0.113.42',
        affectedServices: ['payment-api', 'payment-processor']
      }
    },
    {
      id: 'threat-3',
      severity: 'high',
      type: 'Container Escape Attempt',
      target: 'logging-agent',
      namespace: 'monitoring',
      detectedAt: '42 min ago',
      status: 'contained',
      description: 'Detected attempt to escape container boundaries from logging agent pod. Process attempted to mount sensitive host paths.',
      podName: 'logging-agent-7c6d8b9f5-p4j2k',
      details: {
        attemptCount: 3,
        affectedServices: ['logging-system']
      }
    },
    {
      id: 'threat-4',
      severity: 'medium',
      type: 'Vulnerable Package',
      target: 'frontend-service',
      namespace: 'default',
      detectedAt: '1h 15m ago',
      status: 'remediation',
      description: 'Frontend service container using vulnerable npm package. CVE-2023-45901 can lead to remote code execution via malicious API requests.',
      podName: 'frontend-service-6f9d7c8b5-z8g5h',
      details: {
        cve: 'CVE-2023-45901',
        affectedServices: ['user-interface']
      }
    },
    {
      id: 'threat-5',
      severity: 'low',
      type: 'Excessive Permissions',
      target: 'backup-service',
      namespace: 'storage',
      detectedAt: '2h 30m ago',
      status: 'resolved',
      description: 'Backup service pod has excessive permissions in the storage namespace. Pod has write access to all PVCs when only read is required.',
      podName: 'backup-service-9c8b7d6f5-q1w2e',
      details: {
        affectedServices: ['backup-manager', 'storage-controller']
      }
    },
    {
      id: 'threat-6',
      severity: 'critical',
      type: 'Malware Detected',
      target: 'worker-node-03',
      namespace: 'kube-system',
      detectedAt: '10 min ago',
      status: 'active',
      description: 'Cryptomining malware detected on worker node. Malicious process consuming excessive CPU resources and attempting to spread to other nodes.',
      podName: 'N/A (Host System)',
      details: {
        sourceIp: '198.51.100.23',
        affectedServices: ['kubelet', 'container-runtime']
      }
    },
    {
      id: 'threat-7',
      severity: 'high',
      type: 'Unauthorized API Access',
      target: 'kube-apiserver',
      namespace: 'kube-system',
      detectedAt: '35 min ago',
      status: 'investigating',
      description: 'Multiple failed authentication attempts to the Kubernetes API server from unauthorized IP address. Potential brute force attack.',
      podName: 'kube-apiserver-ip-10-0-1-20',
      details: {
        sourceIp: '198.51.100.75',
        attemptCount: 156,
        affectedServices: ['kube-apiserver']
      }
    },
    {
      id: 'threat-8',
      severity: 'medium',
      type: 'Insecure Configuration',
      target: 'database-primary',
      namespace: 'default',
      detectedAt: '3h 10m ago',
      status: 'remediation',
      description: 'Database pod running with root privileges and lacks security context constraints. Could lead to privilege escalation if compromised.',
      podName: 'database-primary-7d8c9f6b5-x4z7v',
      details: {
        affectedServices: ['postgres-db']
      }
    },
    {
      id: 'threat-9',
      severity: 'low',
      type: 'Secret Mounted as Environment Variable',
      target: 'payment-processor',
      namespace: 'default',
      detectedAt: '5h 20m ago',
      status: 'resolved',
      description: 'Detected sensitive authentication key mounted as plain environment variable instead of using Kubernetes secrets properly.',
      podName: 'payment-processor-6b7c8d9f5-t6y7u',
      details: {
        affectedServices: ['payment-gateway']
      }
    },
    {
      id: 'threat-10',
      severity: 'critical',
      type: 'Data Exfiltration',
      target: 'database-replica',
      namespace: 'default',
      detectedAt: '27 min ago',
      status: 'active',
      description: 'Large volume of data being transferred from database replica to external IP. Traffic pattern indicates unauthorized data exfiltration.',
      podName: 'database-replica-8f9g7h6j5-n8m9b',
      details: {
        sourceIp: '203.0.113.128',
        affectedServices: ['postgres-replica', 'data-service']
      }
    }
  ];
  
  // Apply filters if provided
  let filteredThreats = [...allThreats];
  
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredThreats = filteredThreats.filter(threat => 
        threat.type.toLowerCase().includes(searchLower) ||
        threat.target.toLowerCase().includes(searchLower) ||
        threat.namespace.toLowerCase().includes(searchLower) ||
        threat.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredThreats = filteredThreats.filter(threat => threat.status === filters.status);
    }
    
    if (filters.severity && filters.severity !== 'all') {
      filteredThreats = filteredThreats.filter(threat => threat.severity === filters.severity);
    }
  }
  
  // Calculate total before pagination
  const total = filteredThreats.length;
  
  // Apply pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedThreats = filteredThreats.slice(start, end);
  
  return {
    threats: paginatedThreats,
    total
  };
};

// Threat heatmap data
export const heatmapData: ThreatHeatmapData = {
  heatmapData: [
    // Week 1
    { day: 0, week: 1, threats: 6, intensity: 30, severity: 'medium' },
    { day: 1, week: 1, threats: 14, intensity: 40, severity: 'high' },
    { day: 2, week: 1, threats: 3, intensity: 40, severity: 'low' },
    { day: 3, week: 1, threats: 1, intensity: 20, severity: 'low' },
    { day: 4, week: 1, threats: 9, intensity: 50, severity: 'medium' },
    { day: 5, week: 1, threats: 10, intensity: 20, severity: 'high' },
    { day: 6, week: 1, threats: 5, intensity: 30, severity: 'low' },
    
    // Week 2
    { day: 0, week: 2, threats: 2, intensity: 20, severity: 'low' },
    { day: 1, week: 2, threats: 4, intensity: 70, severity: 'low' },
    { day: 2, week: 2, threats: 7, intensity: 40, severity: 'medium' },
    { day: 3, week: 2, threats: 12, intensity: 30, severity: 'high' },
    { day: 4, week: 2, threats: 23, intensity: 60, severity: 'critical' },
    { day: 5, week: 2, threats: 8, intensity: 20, severity: 'medium' },
    { day: 6, week: 2, threats: 15, intensity: 40, severity: 'high' }
  ]
};

// Vulnerabilities data
export const vulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    cveId: 'CVE-2023-4567',
    title: 'Container runtime escape vulnerability',
    score: 9.8,
    severity: 'critical',
    affectedResources: '4 nodes, 17 pods'
  },
  {
    id: 'vuln-2',
    cveId: 'CVE-2023-7890',
    title: 'RBAC permissions bypass in API server',
    score: 8.4,
    severity: 'high',
    affectedResources: 'control plane components'
  },
  {
    id: 'vuln-3',
    cveId: 'CVE-2023-5432',
    title: 'Log4j vulnerability in authentication service',
    score: 7.6,
    severity: 'high',
    affectedResources: '3 pods in auth namespace'
  }
];

// Security recommendations data
export const recommendations: SecurityRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Update API Server',
    severity: 'critical',
    description: 'Current version contains privilege escalation vulnerabilities',
    estimatedTime: '15 min',
    action: 'Apply Now'
  },
  {
    id: 'rec-2',
    title: 'Enable Pod Security Policy',
    severity: 'high',
    description: 'Default namespace lacks proper security constraints',
    estimatedTime: '10 min',
    action: 'Apply'
  },
  {
    id: 'rec-3',
    title: 'Update Container Images',
    severity: 'medium',
    description: '12 containers using outdated base images with vulnerabilities',
    estimatedTime: '30 min',
    action: 'Schedule'
  }
];

// Attack simulation scenarios
export const attackSimulations: AttackSimulation[] = [
  {
    id: 'sim-1',
    name: 'Container Escape',
    description: 'Attempts to escape container isolation and access host resources',
    duration: '5-10 minutes',
    difficulty: 'high',
    targets: ['container-runtime', 'kernel'],
    status: 'ready',
    steps: [
      'Initialize container with privileged flag',
      'Mount host filesystem',
      'Attempt to access sensitive host files',
      'Escalate privileges to root',
      'Create persistence mechanism'
    ]
  },
  {
    id: 'sim-2',
    name: 'Privilege Escalation',
    description: 'Attempts to gain elevated privileges within the Kubernetes cluster',
    duration: '3-5 minutes',
    difficulty: 'medium',
    targets: ['kubernetes-api', 'service-accounts'],
    status: 'ready',
    steps: [
      'Access default service account token',
      'Query API server for permissions',
      'Attempt to create privileged pod',
      'Access secrets from other namespaces',
      'Modify cluster roles'
    ]
  },
  {
    id: 'sim-3',
    name: 'Data Exfiltration',
    description: 'Attempts to extract sensitive data from cluster services',
    duration: '2-3 minutes',
    difficulty: 'low',
    targets: ['pods', 'secrets', 'configmaps'],
    status: 'ready',
    steps: [
      'Identify target services with sensitive data',
      'Access exposed endpoints without authentication',
      'Extract data from environment variables',
      'Query metadata service for secrets',
      'Establish covert channel for data extraction'
    ]
  },
  {
    id: 'sim-4',
    name: 'Lateral Movement',
    description: 'Attempts to move from one compromised container to others in the cluster',
    duration: '5-8 minutes',
    difficulty: 'medium',
    targets: ['network-policies', 'inter-pod-communication'],
    status: 'ready',
    steps: [
      'Compromise initial container',
      'Network discovery to find other services',
      'Exploit trust relationships between services',
      'Access shared volumes between pods',
      'Establish persistence across multiple pods'
    ]
  },
  {
    id: 'sim-5',
    name: 'Denial of Service',
    description: 'Attempts to disrupt cluster services through resource exhaustion',
    duration: '1-2 minutes',
    difficulty: 'low',
    targets: ['pods', 'nodes', 'api-server'],
    status: 'ready',
    steps: [
      'Identify services without resource limits',
      'Generate CPU-intensive workload',
      'Exhaust memory resources',
      'Create large number of API requests',
      'Disrupt cluster networking'
    ]
  }
];

// Response actions data
export const responseActions: ResponseAction[] = [
  {
    id: 'action-1',
    name: 'Isolate Container',
    description: 'Isolate a compromised container by restricting its network access',
    automated: true,
    enabled: true,
    lastExecuted: '2 hours ago',
    target: 'container',
    applicableThreats: ['container-escape', 'malicious-process', 'data-exfiltration']
  },
  {
    id: 'action-2',
    name: 'Block External IPs',
    description: 'Block communication with known malicious external IP addresses',
    automated: true,
    enabled: true,
    lastExecuted: '30 minutes ago',
    target: 'network',
    applicableThreats: ['command-and-control', 'data-exfiltration', 'cryptomining']
  },
  {
    id: 'action-3',
    name: 'Terminate Pod',
    description: 'Terminate a compromised pod to stop the attack',
    automated: false,
    enabled: true,
    lastExecuted: '1 day ago',
    target: 'pod',
    applicableThreats: ['privilege-escalation', 'malicious-process', 'container-escape']
  },
  {
    id: 'action-4',
    name: 'Rotate Service Account Token',
    description: 'Rotate the service account token that might have been compromised',
    automated: false,
    enabled: true,
    lastExecuted: 'Never',
    target: 'service-account',
    applicableThreats: ['credential-theft', 'privilege-escalation']
  },
  {
    id: 'action-5',
    name: 'Scale Down Deployment',
    description: 'Scale down a compromised deployment to minimize impact',
    automated: true,
    enabled: false,
    lastExecuted: '5 days ago',
    target: 'deployment',
    applicableThreats: ['denial-of-service', 'resource-hijacking']
  },
  {
    id: 'action-6',
    name: 'Apply Network Policy',
    description: 'Apply strict network policy to isolate workload',
    automated: true,
    enabled: true,
    lastExecuted: '3 hours ago',
    target: 'namespace',
    applicableThreats: ['lateral-movement', 'data-exfiltration']
  }
];

// Action history data
export const actionHistory = [
  {
    id: 'history-1',
    action: 'Isolated Container',
    threat: 'Container Escape Attempt',
    target: 'logging-agent-7c6d8b9f5-p4j2k',
    timestamp: '42 minutes ago',
    user: 'system-automated',
    result: 'success'
  },
  {
    id: 'history-2',
    action: 'Blocked External IP',
    threat: 'Suspicious Network Activity',
    target: '203.0.113.42',
    timestamp: '1 hour ago',
    user: 'admin',
    result: 'success'
  },
  {
    id: 'history-3',
    action: 'Applied Network Policy',
    threat: 'Data Exfiltration',
    target: 'default namespace',
    timestamp: '3 hours ago',
    user: 'system-automated',
    result: 'success'
  },
  {
    id: 'history-4',
    action: 'Terminated Pod',
    threat: 'Malware Detected',
    target: 'infected-pod-89f67d5c4-x2j4z',
    timestamp: '5 hours ago',
    user: 'security-analyst',
    result: 'success'
  },
  {
    id: 'history-5',
    action: 'Rotated Service Account Token',
    threat: 'Credential Theft',
    target: 'api-service-account',
    timestamp: '1 day ago',
    user: 'admin',
    result: 'success'
  },
  {
    id: 'history-6',
    action: 'Failed to Apply Network Policy',
    threat: 'Lateral Movement',
    target: 'monitoring namespace',
    timestamp: '2 days ago',
    user: 'system-automated',
    result: 'failed'
  }
];

// ML Model Configuration data
export const mlModels = [
  {
    id: 'model-1',
    name: 'Anomaly Detection',
    status: 'active',
    version: '2.3.1',
    lastTrained: '2 days ago',
    accuracy: 92.7,
    description: 'Detects anomalous behavior patterns in pod resource usage and network activity'
  },
  {
    id: 'model-2',
    name: 'Network Traffic Classification',
    status: 'active',
    version: '1.7.5',
    lastTrained: '1 week ago',
    accuracy: 88.5,
    description: 'Classifies network traffic patterns to identify C&C and exfiltration attempts'
  },
  {
    id: 'model-3',
    name: 'Log Anomaly Detection',
    status: 'training',
    version: '0.9.2',
    lastTrained: 'In progress',
    accuracy: null,
    description: 'Analyzes pod and container logs to detect suspicious activity patterns'
  },
  {
    id: 'model-4',
    name: 'Privilege Escalation Detector',
    status: 'inactive',
    version: '1.2.0',
    lastTrained: '1 month ago',
    accuracy: 74.3,
    description: 'Detects attempts to gain higher privileges within the cluster'
  }
];

// Detection Rules data
export const detectionRules = [
  {
    id: 'rule-1',
    name: 'High Volume Data Transfer',
    description: 'Alerts when pods transfer unusually large amounts of data outside the cluster',
    severity: 'high',
    enabled: true,
    createdAt: '2023-10-15'
  },
  {
    id: 'rule-2',
    name: 'Container Escape Techniques',
    description: 'Detects common container escape techniques targeting the host system',
    severity: 'critical',
    enabled: true,
    createdAt: '2023-09-27'
  },
  {
    id: 'rule-3',
    name: 'Suspicious API Server Access',
    description: 'Monitors for unusual access patterns to the Kubernetes API server',
    severity: 'medium',
    enabled: true,
    createdAt: '2023-11-03'
  },
  {
    id: 'rule-4',
    name: 'Sensitive Mount Points',
    description: 'Alerts when containers mount sensitive host paths',
    severity: 'high',
    enabled: true,
    createdAt: '2023-08-19'
  },
  {
    id: 'rule-5',
    name: 'Privilege Escalation',
    description: 'Detects attempts to escalate privileges within containers',
    severity: 'critical',
    enabled: true,
    createdAt: '2023-07-12'
  },
  {
    id: 'rule-6',
    name: 'Suspicious Process Execution',
    description: 'Alerts when unusual or suspicious processes are executed in containers',
    severity: 'medium',
    enabled: false,
    createdAt: '2023-11-21'
  }
];
