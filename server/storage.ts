import { 
  users, 
  threats,
  vulnerabilities,
  recommendations,
  simulations,
  simulationResults,
  responseActions,
  actionHistory,
  kpiData as kpiDataTable,
  threatActivity,
  topologyNodes,
  topologyLinks,
  topologyStats,
  threatHeatmap,
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
  vulnerabilities as mockVulnerabilities,
  recommendations as mockRecommendations,
  attackSimulations,
  responseActions as mockResponseActions,
  actionHistory as mockActionHistory,
  generateThreats,
  mlModels,
  detectionRules
} from "@/lib/mockData";
import { db } from "./db";
import { eq, inArray, and, or, like, isNull, desc, sql } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Dashboard methods
  async getDashboardKPI(): Promise<KPIData> {
    try {
      const [kpiEntry] = await db.select().from(kpiDataTable).orderBy(desc(kpiDataTable.updatedAt)).limit(1);
      
      if (!kpiEntry) {
        throw new Error("No KPI data found");
      }
      
      return {
        securityScore: kpiEntry.securityScore,
        activeThreats: {
          total: kpiEntry.activeThreatTotal,
          change: kpiEntry.activeThreatChange,
          critical: kpiEntry.activeThreatCritical,
          high: kpiEntry.activeThreatHigh,
          medium: kpiEntry.activeThreatMedium,
          low: kpiEntry.activeThreatLow
        },
        vulnerableContainers: {
          affected: kpiEntry.vulnerableContainersAffected,
          total: kpiEntry.vulnerableContainersTotal
        },
        complianceStatus: {
          percentage: kpiEntry.compliancePercentage,
          change: kpiEntry.complianceChange,
          pciDss: kpiEntry.compliancePciDss,
          gdpr: kpiEntry.complianceGdpr,
          hipaa: kpiEntry.complianceHipaa
        }
      };
    } catch (error) {
      console.error("Error getting KPI data:", error);
      return kpiData;
    }
  }

  async getThreatActivity(range: string): Promise<ThreatActivityData> {
    try {
      // Get threat activity data for the specified range
      const activityData = await db.select().from(threatActivity)
        .where(eq(threatActivity.range, range))
        .orderBy(threatActivity.id);
      
      if (activityData.length === 0) {
        throw new Error(`No threat activity data found for range: ${range}`);
      }
      
      return {
        chartData: activityData.map(item => ({
          time: item.time,
          critical: item.critical,
          high: item.high,
          medium: item.medium,
          low: item.low
        }))
      };
    } catch (error) {
      console.error(`Error getting threat activity data for range ${range}:`, error);
      return generateThreatActivityData(range as 'hourly' | 'daily' | 'weekly');
    }
  }

  async getClusterTopology(namespace?: string): Promise<ClusterTopology> {
    try {
      // Get nodes
      let nodesQuery = db.select().from(topologyNodes);
      if (namespace && namespace !== 'all') {
        nodesQuery = nodesQuery.where(eq(topologyNodes.namespace, namespace));
      }
      const nodes = await nodesQuery;
      
      // Get node IDs for filtering links
      const nodeIds = nodes.map(n => n.id);
      
      // Get links between these nodes
      const links = await db.select().from(topologyLinks)
        .where(
          and(
            inArray(topologyLinks.source, nodeIds),
            inArray(topologyLinks.target, nodeIds)
          )
        );
      
      // Get stats
      let statsQuery = db.select().from(topologyStats);
      if (namespace && namespace !== 'all') {
        statsQuery = statsQuery.where(eq(topologyStats.namespace, namespace));
      } else {
        statsQuery = statsQuery.where(isNull(topologyStats.namespace));
      }
      const [stats] = await statsQuery;
      
      if (!stats) {
        throw new Error("No topology stats found");
      }
      
      return {
        nodes: nodes.map(n => ({
          id: n.id,
          name: n.name,
          type: n.type,
          namespace: n.namespace,
          severity: n.severity
        })),
        links: links.map(l => ({
          source: l.source,
          target: l.target,
          suspicious: l.suspicious,
          traffic: l.traffic
        })),
        stats: {
          nodes: stats.nodes,
          pods: stats.pods,
          services: stats.services,
          podConnections: stats.podConnections,
          suspiciousConnections: stats.suspiciousConnections,
          threatCount: stats.threatCount
        }
      };
    } catch (error) {
      console.error("Error getting cluster topology:", error);
      
      if (namespace && namespace !== 'all') {
        // Filter topology data by namespace
        const filteredNodes = topologyData.nodes.filter(node => node.namespace === namespace);
        const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
        
        const filteredLinks = topologyData.links.filter(link => {
          const sourceNode = topologyData.nodes.find(n => n.id === link.source);
          const targetNode = topologyData.nodes.find(n => n.id === link.target);
          
          return sourceNode && targetNode && 
                filteredNodeIds.has(sourceNode.id) && 
                filteredNodeIds.has(targetNode.id);
        });
        
        return {
          nodes: filteredNodes,
          links: filteredLinks,
          stats: {
            ...topologyData.stats,
            nodes: filteredNodes.filter(n => n.type === 'node').length,
            pods: filteredNodes.filter(n => n.type === 'pod').length,
            services: filteredNodes.filter(n => n.type === 'service').length,
            podConnections: filteredLinks.length,
            suspiciousConnections: filteredLinks.filter(l => l.suspicious).length,
            threatCount: filteredNodes.filter(n => n.severity !== 'none').length
          }
        };
      }
      
      return topologyData;
    }
  }

  async getThreatHeatmap(): Promise<ThreatHeatmapData> {
    try {
      const heatmapData = await db.select().from(threatHeatmap);
      
      if (heatmapData.length === 0) {
        throw new Error("No threat heatmap data found");
      }
      
      return {
        heatmapData: heatmapData.map(item => ({
          day: item.day,
          week: item.week,
          threats: item.threats,
          intensity: item.intensity,
          severity: item.severity as 'critical' | 'high' | 'medium' | 'low' | 'none'
        }))
      };
    } catch (error) {
      console.error("Error getting threat heatmap:", error);
      return heatmapData;
    }
  }

  async getTopVulnerabilities(limit: number = 3): Promise<Vulnerability[]> {
    try {
      const vulnData = await db.select().from(vulnerabilities)
        .orderBy(desc(vulnerabilities.score))
        .limit(limit);
      
      if (!vulnData || vulnData.length === 0) {
        throw new Error("No vulnerabilities found");
      }
      
      return vulnData.map(v => ({
        id: v.id,
        cveId: v.cveId,
        title: v.title,
        score: v.score,
        severity: v.severity as 'critical' | 'high' | 'medium' | 'low',
        affectedResources: v.affectedResources
      }));
    } catch (error) {
      console.error("Error getting top vulnerabilities:", error);
      return mockVulnerabilities.slice(0, limit);
    }
  }

  async getSecurityRecommendations(limit: number = 3): Promise<{
    recommendations: SecurityRecommendation[];
    pendingCount: number;
  }> {
    try {
      const recsData = await db.select().from(recommendations).limit(limit);
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(recommendations);
      
      if (recsData.length === 0) {
        throw new Error("No security recommendations found");
      }
      
      return {
        recommendations: recsData.map(r => ({
          id: r.id,
          title: r.title,
          severity: r.severity as 'critical' | 'high' | 'medium' | 'low',
          description: r.description,
          estimatedTime: r.estimatedTime,
          action: r.action
        })),
        pendingCount: Number(count) - recsData.length
      };
    } catch (error) {
      console.error("Error getting security recommendations:", error);
      return {
        recommendations: mockRecommendations.slice(0, limit),
        pendingCount: mockRecommendations.length - limit
      };
    }
  }

  async getThreats(page: number, pageSize: number, filters?: {
    search?: string;
    status?: string;
    severity?: string;
  }): Promise<{ threats: Threat[]; total: number }> {
    try {
      // Build query with filters
      let query = db.select().from(threats);
      
      if (filters) {
        if (filters.status) {
          query = query.where(eq(threats.status, filters.status));
        }
        
        if (filters.severity) {
          query = query.where(eq(threats.severity, filters.severity));
        }
        
        if (filters.search) {
          query = query.where(
            or(
              like(threats.type, `%${filters.search}%`),
              like(threats.target, `%${filters.search}%`),
              like(threats.namespace, `%${filters.search}%`),
              like(threats.description, `%${filters.search}%`)
            )
          );
        }
      }
      
      // Get total count for pagination
      const [{ count }] = await db.select({ count: sql`count(*)` }).from(threats);
      
      // Apply pagination
      const offset = (page - 1) * pageSize;
      const threatsData = await query
        .orderBy(desc(threats.detectedAt))
        .limit(pageSize)
        .offset(offset);
      
      return {
        threats: threatsData,
        total: Number(count)
      };
    } catch (error) {
      console.error("Error getting threats:", error);
      return generateThreats(page, pageSize, filters);
    }
  }

  async getAttackSimulations(): Promise<{
    simulations: AttackSimulation[];
    stats: {
      totalScenarios: number;
      totalRuns: number;
      detectionRate: number;
    };
  }> {
    try {
      const simulationsData = await db.select().from(simulations);
      
      // Get count of simulation runs
      const [{ runCount }] = await db.select({ 
        runCount: sql`count(*)`
      }).from(simulationResults);
      
      // Get detection rate - successful detections / total runs
      const [{ successCount }] = await db.select({ 
        successCount: sql`count(*)`
      }).from(simulationResults)
        .where(eq(simulationResults.detectionSuccess, true));
      
      const totalRuns = Number(runCount);
      const totalSuccess = Number(successCount);
      const detectionRate = totalRuns > 0 ? Math.round((totalSuccess / totalRuns) * 100) : 0;
      
      if (simulationsData.length === 0) {
        throw new Error("No attack simulations found");
      }
      
      return {
        simulations: simulationsData,
        stats: {
          totalScenarios: simulationsData.length,
          totalRuns: totalRuns,
          detectionRate: detectionRate
        }
      };
    } catch (error) {
      console.error("Error getting attack simulations:", error);
      return {
        simulations: attackSimulations,
        stats: {
          totalScenarios: attackSimulations.length,
          totalRuns: 24,
          detectionRate: 78,
        }
      };
    }
  }

  async getSimulationResults(): Promise<{
    results: any[];
  }> {
    try {
      const resultsData = await db.select().from(simulationResults);
      
      if (resultsData.length === 0) {
        throw new Error("No simulation results found");
      }
      
      return {
        results: resultsData
      };
    } catch (error) {
      console.error("Error getting simulation results:", error);
      return {
        results: [
          {
            id: "sim-result-1",
            simulationId: "sim-1",
            simulationName: "Container Escape Attack",
            startTime: "2023-07-15 09:12:34",
            endTime: "2023-07-15 09:18:22",
            status: "completed",
            detectionSuccess: true,
            detectionTime: "00:02:48",
            steps: [
              { name: "Exploit container vulnerability", status: "completed", detected: true },
              { name: "Escape to host system", status: "completed", detected: true },
              { name: "Lateral movement", status: "completed", detected: false },
              { name: "Data exfiltration attempt", status: "completed", detected: true },
            ],
            summary: {
              threatsDetected: 3,
              totalThreats: 4,
              meanTimeToDetect: "00:03:12",
              successRate: 75,
            }
          },
          // Other simulation results...
        ]
      };
    }
  }

  async getResponseActions(): Promise<{
    actions: ResponseAction[];
    stats: {
      total: number;
      automated: number;
      actionsToday: number;
      pendingThreats: number;
    };
  }> {
    try {
      const actionsData = await db.select().from(responseActions);
      
      if (actionsData.length === 0) {
        throw new Error("No response actions found");
      }
      
      // Count automated actions
      const automated = actionsData.filter(a => a.automated && a.enabled).length;
      
      // Count actions executed today
      const today = new Date().toISOString().split('T')[0];
      const [{ actionsToday }] = await db.select({ 
        actionsToday: sql`count(*)`
      }).from(actionHistory)
        .where(like(actionHistory.timestamp, `${today}%`));
      
      // Count pending threats
      const [{ pendingThreats }] = await db.select({ 
        pendingThreats: sql`count(*)`
      }).from(threats)
        .where(
          not(
            inArray(
              threats.status, 
              ['resolved', 'remediation']
            )
          )
        );
      
      return {
        actions: actionsData.map(a => ({
          id: a.id,
          name: a.name,
          description: a.description,
          automated: a.automated,
          enabled: a.enabled,
          lastExecuted: a.lastExecuted || 'Never',
          target: a.target,
          applicableThreats: a.applicableThreats
        })),
        stats: {
          total: actionsData.length,
          automated: automated,
          actionsToday: Number(actionsToday),
          pendingThreats: Number(pendingThreats)
        }
      };
    } catch (error) {
      console.error("Error getting response actions:", error);
      return {
        actions: mockResponseActions,
        stats: {
          total: mockResponseActions.length,
          automated: mockResponseActions.filter(a => a.automated).length,
          actionsToday: 8,
          pendingThreats: 4
        }
      };
    }
  }

  async getActionHistory(): Promise<{
    history: any[];
  }> {
    try {
      const historyData = await db.select().from(actionHistory)
        .orderBy(desc(actionHistory.timestamp))
        .limit(20);
      
      if (historyData.length === 0) {
        throw new Error("No action history found");
      }
      
      return {
        history: historyData
      };
    } catch (error) {
      console.error("Error getting action history:", error);
      return {
        history: mockActionHistory
      };
    }
  }

  async getMLModels(): Promise<{
    models: any[];
  }> {
    try {
      // ML Models are not stored in the database yet, so we return the mock data
      return {
        models: mlModels
      };
    } catch (error) {
      console.error("Error getting ML models:", error);
      return {
        models: mlModels
      };
    }
  }

  async getDetectionRules(): Promise<{
    rules: any[];
  }> {
    try {
      // Detection rules are not stored in the database yet, so we return the mock data
      return {
        rules: detectionRules
      };
    } catch (error) {
      console.error("Error getting detection rules:", error);
      return {
        rules: detectionRules
      };
    }
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
