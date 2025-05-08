import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
