import { 
  users, 
  type User, 
  type InsertUser,
  type Threat,
  type KPIData,
  type ThreatActivityData,
  type ClusterTopology,
  type ThreatHeatmapData,
  type Vulnerability,
  type SecurityRecommendation,
  type AttackSimulation,
  type ResponseAction
} from "@shared/schema";
import { 
  kpiData, 
  generateThreatActivityData, 
  topologyData, 
  heatmapData, 
  vulnerabilities,
  recommendations,
  attackSimulations,
  responseActions,
  actionHistory,
  generateThreats,
  mlModels,
  detectionRules
} from "@/lib/mockData";

// Storage interface for all CRUD operations
export interface IStorage {
  // User methods (kept from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dashboard methods
  getDashboardKPI(): Promise<KPIData>;
  getThreatActivity(range: string): Promise<ThreatActivityData>;
  getClusterTopology(namespace?: string): Promise<ClusterTopology>;
  getThreatHeatmap(): Promise<ThreatHeatmapData>;
  getTopVulnerabilities(limit?: number): Promise<Vulnerability[]>;
  getSecurityRecommendations(limit?: number): Promise<{
    recommendations: SecurityRecommendation[];
    pendingCount: number;
  }>;

  // Threat methods
  getThreats(page: number, pageSize: number, filters?: {
    search?: string;
    status?: string;
    severity?: string;
  }): Promise<{ threats: Threat[]; total: number }>;

  // Simulation methods
  getAttackSimulations(): Promise<{
    simulations: AttackSimulation[];
    stats: {
      totalScenarios: number;
      totalRuns: number;
      detectionRate: number;
    };
  }>;

  getSimulationResults(): Promise<{
    results: any[];
  }>;

  // Response methods
  getResponseActions(): Promise<{
    actions: ResponseAction[];
    stats: {
      total: number;
      automated: number;
      actionsToday: number;
      pendingThreats: number;
    };
  }>;

  getActionHistory(): Promise<{
    history: any[];
  }>;

  // Configuration methods
  getMLModels(): Promise<{
    models: any[];
  }>;

  getDetectionRules(): Promise<{
    rules: any[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  // User methods (kept from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Dashboard methods
  async getDashboardKPI(): Promise<KPIData> {
    return kpiData;
  }

  async getThreatActivity(range: string): Promise<ThreatActivityData> {
    return generateThreatActivityData(range as 'hourly' | 'daily' | 'weekly');
  }

  async getClusterTopology(namespace?: string): Promise<ClusterTopology> {
    if (!namespace || namespace === 'all') {
      return topologyData;
    }

    // Filter topology data by namespace
    const filteredNodes = topologyData.nodes.filter(node => 
      node.namespace === namespace || node.type === 'node'
    );
    
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    const filteredLinks = topologyData.links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );

    return {
      nodes: filteredNodes,
      links: filteredLinks,
      stats: {
        nodes: filteredNodes.filter(node => node.type === 'node').length,
        pods: filteredNodes.filter(node => node.type === 'pod').length,
        services: filteredNodes.filter(node => node.type === 'service').length,
        podConnections: filteredLinks.length,
        suspiciousConnections: filteredLinks.filter(link => link.suspicious).length,
        threatCount: filteredNodes.filter(node => node.severity !== 'none').length
      }
    };
  }

  async getThreatHeatmap(): Promise<ThreatHeatmapData> {
    return heatmapData;
  }

  async getTopVulnerabilities(limit: number = 3): Promise<Vulnerability[]> {
    return vulnerabilities.slice(0, limit);
  }

  async getSecurityRecommendations(limit: number = 3): Promise<{
    recommendations: SecurityRecommendation[];
    pendingCount: number;
  }> {
    return {
      recommendations: recommendations.slice(0, limit),
      pendingCount: 6
    };
  }

  // Threat methods
  async getThreats(page: number, pageSize: number, filters?: {
    search?: string;
    status?: string;
    severity?: string;
  }): Promise<{ threats: Threat[]; total: number }> {
    return generateThreats(page, pageSize, filters);
  }

  // Simulation methods
  async getAttackSimulations(): Promise<{
    simulations: AttackSimulation[];
    stats: {
      totalScenarios: number;
      totalRuns: number;
      detectionRate: number;
    };
  }> {
    return {
      simulations: attackSimulations,
      stats: {
        totalScenarios: attackSimulations.length,
        totalRuns: 12,
        detectionRate: 78
      }
    };
  }

  async getSimulationResults(): Promise<{
    results: any[];
  }> {
    return {
      results: [
        {
          id: 'sim-result-1',
          simulationId: 'sim-1',
          simulationName: 'Container Escape',
          startTime: '2023-06-15 14:30',
          endTime: '2023-06-15 14:37',
          status: 'completed',
          detectionSuccess: true,
          detectionTime: '45 seconds',
          steps: [
            { name: 'Initialize container with privileged flag', status: 'completed', detected: true },
            { name: 'Mount host filesystem', status: 'completed', detected: true },
            { name: 'Attempt to access sensitive host files', status: 'completed', detected: false },
            { name: 'Escalate privileges to root', status: 'completed', detected: true },
            { name: 'Create persistence mechanism', status: 'completed', detected: false }
          ],
          summary: {
            threatsDetected: 3,
            totalThreats: 5,
            meanTimeToDetect: '45 seconds',
            successRate: 60
          }
        },
        {
          id: 'sim-result-2',
          simulationId: 'sim-2',
          simulationName: 'Privilege Escalation',
          startTime: '2023-06-14 10:15',
          endTime: '2023-06-14 10:18',
          status: 'completed',
          detectionSuccess: true,
          detectionTime: '28 seconds',
          steps: [
            { name: 'Access default service account token', status: 'completed', detected: true },
            { name: 'Query API server for permissions', status: 'completed', detected: false },
            { name: 'Attempt to create privileged pod', status: 'completed', detected: true },
            { name: 'Access secrets from other namespaces', status: 'completed', detected: true },
            { name: 'Modify cluster roles', status: 'completed', detected: true }
          ],
          summary: {
            threatsDetected: 4,
            totalThreats: 5,
            meanTimeToDetect: '28 seconds',
            successRate: 80
          }
        },
        {
          id: 'sim-result-3',
          simulationId: 'sim-3',
          simulationName: 'Data Exfiltration',
          startTime: '2023-06-13 16:45',
          endTime: '2023-06-13 16:47',
          status: 'completed',
          detectionSuccess: true,
          detectionTime: '67 seconds',
          steps: [
            { name: 'Identify target services with sensitive data', status: 'completed', detected: false },
            { name: 'Access exposed endpoints without authentication', status: 'completed', detected: true },
            { name: 'Extract data from environment variables', status: 'completed', detected: false },
            { name: 'Query metadata service for secrets', status: 'completed', detected: true },
            { name: 'Establish covert channel for data extraction', status: 'completed', detected: true }
          ],
          summary: {
            threatsDetected: 3,
            totalThreats: 5,
            meanTimeToDetect: '67 seconds',
            successRate: 60
          }
        },
        {
          id: 'sim-result-4',
          simulationId: 'sim-5',
          simulationName: 'Denial of Service',
          startTime: '2023-06-10 09:30',
          endTime: '2023-06-10 09:31',
          status: 'completed',
          detectionSuccess: false,
          detectionTime: 'N/A',
          steps: [
            { name: 'Identify services without resource limits', status: 'completed', detected: false },
            { name: 'Generate CPU-intensive workload', status: 'completed', detected: false },
            { name: 'Exhaust memory resources', status: 'completed', detected: true },
            { name: 'Create large number of API requests', status: 'completed', detected: false },
            { name: 'Disrupt cluster networking', status: 'completed', detected: false }
          ],
          summary: {
            threatsDetected: 1,
            totalThreats: 5,
            meanTimeToDetect: '118 seconds',
            successRate: 20
          }
        }
      ]
    };
  }

  // Response methods
  async getResponseActions(): Promise<{
    actions: ResponseAction[];
    stats: {
      total: number;
      automated: number;
      actionsToday: number;
      pendingThreats: number;
    };
  }> {
    return {
      actions: responseActions,
      stats: {
        total: responseActions.length,
        automated: responseActions.filter(a => a.automated && a.enabled).length,
        actionsToday: 8,
        pendingThreats: 4
      }
    };
  }

  async getActionHistory(): Promise<{
    history: any[];
  }> {
    return {
      history: actionHistory
    };
  }

  // Configuration methods
  async getMLModels(): Promise<{
    models: any[];
  }> {
    return {
      models: mlModels
    };
  }

  async getDetectionRules(): Promise<{
    rules: any[];
  }> {
    return {
      rules: detectionRules
    };
  }
}

export const storage = new MemStorage();
