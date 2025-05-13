import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema (kept from original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Threat schema
export const threats = pgTable("threats", {
  id: text("id").primaryKey(),
  severity: text("severity").notNull(),
  type: text("type").notNull(),
  target: text("target").notNull(),
  namespace: text("namespace").notNull(),
  detectedAt: text("detected_at").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  podName: text("pod_name").notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  createdAt: true,
});

export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Threat = typeof threats.$inferSelect;

// Vulnerability schema
export const vulnerabilities = pgTable("vulnerabilities", {
  id: text("id").primaryKey(),
  cveId: text("cve_id").notNull(),
  title: text("title").notNull(),
  score: real("score").notNull(),
  severity: text("severity").notNull(),
  affectedResources: text("affected_resources").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).omit({
  id: true,
  createdAt: true,
});

export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type VulnerabilityType = typeof vulnerabilities.$inferSelect;

// Security recommendation schema
export const recommendations = pgTable("recommendations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  severity: text("severity").notNull(),
  description: text("description").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type RecommendationType = typeof recommendations.$inferSelect;

// Attack simulation schema
export const simulations = pgTable("simulations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  difficulty: text("difficulty").notNull(),
  targets: jsonb("targets").notNull().$type<string[]>(),
  status: text("status").notNull(),
  steps: jsonb("steps").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type SimulationType = typeof simulations.$inferSelect;

// Simulation results schema
export const simulationResults = pgTable("simulation_results", {
  id: text("id").primaryKey(),
  simulationId: text("simulation_id").notNull().references(() => simulations.id),
  simulationName: text("simulation_name").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull(),
  detectionSuccess: boolean("detection_success").notNull(),
  detectionTime: text("detection_time").notNull(),
  steps: jsonb("steps").notNull(),
  summary: jsonb("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const simulationResultsRelations = relations(simulationResults, ({ one }) => ({
  simulation: one(simulations, {
    fields: [simulationResults.simulationId],
    references: [simulations.id],
  }),
}));

// Response action schema
export const responseActions = pgTable("response_actions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  automated: boolean("automated").notNull(),
  enabled: boolean("enabled").notNull(),
  lastExecuted: text("last_executed"),
  target: text("target").notNull(),
  applicableThreats: jsonb("applicable_threats").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResponseActionSchema = createInsertSchema(responseActions).omit({
  id: true,
  createdAt: true,
});

export type InsertResponseAction = z.infer<typeof insertResponseActionSchema>;
export type ResponseActionType = typeof responseActions.$inferSelect;

// Action history schema
export const actionHistory = pgTable("action_history", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  threat: text("threat").notNull(),
  result: text("result").notNull(),
  timestamp: text("timestamp").notNull(),
  user: text("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// KPI data schema for Dashboard 
export const kpiData = pgTable("kpi_data", {
  id: serial("id").primaryKey(),
  securityScore: integer("security_score").notNull(),
  activeThreatTotal: integer("active_threat_total").notNull(),
  activeThreatChange: integer("active_threat_change").notNull(),
  activeThreatCritical: integer("active_threat_critical").notNull(),
  activeThreatHigh: integer("active_threat_high").notNull(),
  activeThreatMedium: integer("active_threat_medium").notNull(),
  activeThreatLow: integer("active_threat_low").notNull(),
  vulnerableContainersAffected: integer("vulnerable_containers_affected").notNull(),
  vulnerableContainersTotal: integer("vulnerable_containers_total").notNull(),
  compliancePercentage: integer("compliance_percentage").notNull(),
  complianceChange: integer("compliance_change").notNull(),
  compliancePciDss: boolean("compliance_pci_dss").notNull(),
  complianceGdpr: boolean("compliance_gdpr").notNull(),
  complianceHipaa: boolean("compliance_hipaa").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Threat activity chart data schema
export const threatActivity = pgTable("threat_activity", {
  id: serial("id").primaryKey(), 
  time: text("time").notNull(),
  critical: integer("critical").notNull(),
  high: integer("high").notNull(),
  medium: integer("medium").notNull(),
  low: integer("low").notNull(),
  range: text("range").notNull(), // 'hourly', 'daily', 'weekly'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cluster topology data schema
export const topologyNodes = pgTable("topology_nodes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  namespace: text("namespace").notNull(),
  severity: text("severity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topologyLinks = pgTable("topology_links", {
  id: serial("id").primaryKey(),
  source: text("source").notNull().references(() => topologyNodes.id),
  target: text("target").notNull().references(() => topologyNodes.id),
  suspicious: boolean("suspicious").notNull(),
  traffic: boolean("traffic").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const topologyStats = pgTable("topology_stats", {
  id: serial("id").primaryKey(),
  nodes: integer("nodes").notNull(),
  pods: integer("pods").notNull(),
  services: integer("services").notNull(),
  podConnections: integer("pod_connections").notNull(),
  suspiciousConnections: integer("suspicious_connections").notNull(),
  threatCount: integer("threat_count").notNull(),
  namespace: text("namespace"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Threat heatmap data schema
export const threatHeatmap = pgTable("threat_heatmap", {
  id: serial("id").primaryKey(),
  day: integer("day").notNull(),
  week: integer("week").notNull(),
  threats: integer("threats").notNull(),
  intensity: real("intensity").notNull(),
  severity: text("severity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// KPI data schema
export interface KPIData {
  securityScore: number;
  activeThreats: {
    total: number;
    change: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  vulnerableContainers: {
    affected: number;
    total: number;
  };
  complianceStatus: {
    percentage: number;
    change: number;
    pciDss: boolean;
    gdpr: boolean;
    hipaa: boolean;
  };
}

// Threat activity data schema
export interface ThreatActivityData {
  chartData: {
    time: string;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }[];
}

// Cluster topology data schema
export interface ClusterTopology {
  nodes: {
    id: string;
    name: string;
    type: string;
    namespace: string;
    severity: string;
  }[];
  links: {
    source: string;
    target: string;
    suspicious: boolean;
    traffic?: boolean;
  }[];
  stats: {
    nodes: number;
    pods: number;
    services: number;
    podConnections: number;
    suspiciousConnections: number;
    threatCount: number;
  };
}

// Threat heatmap data schema
export interface ThreatHeatmapData {
  heatmapData: {
    day: number;
    week: number;
    threats: number;
    intensity: number;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
  }[];
}

// Vulnerability schema
export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  score: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedResources: string;
}

// Security recommendation schema
export interface SecurityRecommendation {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  estimatedTime: string;
  action: string;
}

// Attack simulation schema
export interface AttackSimulation {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'high' | 'medium' | 'low';
  targets: string[];
  status: 'ready' | 'running' | 'failed';
  steps: string[];
}

// Response action schema
export interface ResponseAction {
  id: string;
  name: string;
  description: string;
  automated: boolean;
  enabled: boolean;
  lastExecuted: string;
  target: string;
  applicableThreats: string[];
}
