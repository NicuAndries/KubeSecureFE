import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Temporarily removing WebSocket implementation to fix startup issues
  console.log('API server initialized');

  // API Routes
  
  // Dashboard KPI
  app.get("/api/dashboard/kpi", async (req: Request, res: Response) => {
    try {
      const kpiData = await storage.getDashboardKPI();
      res.json(kpiData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KPI data" });
    }
  });

  // Threat Activity Chart
  app.get("/api/dashboard/threat-activity", async (req: Request, res: Response) => {
    try {
      const range = req.query.range as string || 'hourly';
      const threatActivityData = await storage.getThreatActivity(range);
      res.json(threatActivityData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threat activity data" });
    }
  });

  // Cluster Topology
  app.get("/api/dashboard/topology", async (req: Request, res: Response) => {
    try {
      const topologyData = await storage.getClusterTopology();
      res.json(topologyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topology data" });
    }
  });

  // Topology with namespace filter
  app.get("/api/topology", async (req: Request, res: Response) => {
    try {
      const namespace = req.query.namespace as string;
      const topologyData = await storage.getClusterTopology(namespace);
      res.json(topologyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topology data" });
    }
  });

  // Threat Heatmap
  app.get("/api/dashboard/heatmap", async (req: Request, res: Response) => {
    try {
      const heatmapData = await storage.getThreatHeatmap();
      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch heatmap data" });
    }
  });

  // Top Vulnerabilities
  app.get("/api/dashboard/vulnerabilities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const vulnerabilities = await storage.getTopVulnerabilities(limit);
      res.json({ vulnerabilities });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vulnerability data" });
    }
  });

  // Security Recommendations
  app.get("/api/dashboard/recommendations", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const recommendationsData = await storage.getSecurityRecommendations(limit);
      res.json(recommendationsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations data" });
    }
  });

  // Threats
  app.get("/api/threats", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const filters = {
        search: req.query.search as string,
        status: req.query.status as string,
        severity: req.query.severity as string
      };
      
      const threatsData = await storage.getThreats(page, pageSize, filters);
      res.json(threatsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threats data" });
    }
  });

  // Attack Simulations
  app.get("/api/simulations", async (req: Request, res: Response) => {
    try {
      const simulationsData = await storage.getAttackSimulations();
      res.json(simulationsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulations data" });
    }
  });

  // Simulation Results
  app.get("/api/simulations/results", async (req: Request, res: Response) => {
    try {
      const resultsData = await storage.getSimulationResults();
      res.json(resultsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation results" });
    }
  });

  // Response Actions
  app.get("/api/response", async (req: Request, res: Response) => {
    try {
      const responseData = await storage.getResponseActions();
      res.json(responseData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch response actions" });
    }
  });

  // Action History
  app.get("/api/response/history", async (req: Request, res: Response) => {
    try {
      const historyData = await storage.getActionHistory();
      res.json(historyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch action history" });
    }
  });

  // ML Models
  app.get("/api/config/ml-models", async (req: Request, res: Response) => {
    try {
      const modelsData = await storage.getMLModels();
      res.json(modelsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ML models" });
    }
  });

  // Detection Rules
  app.get("/api/config/detection-rules", async (req: Request, res: Response) => {
    try {
      const rulesData = await storage.getDetectionRules();
      res.json(rulesData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch detection rules" });
    }
  });

  return httpServer;
}
