import { db } from './db';
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
} from '@/lib/mockData';

import {
  threats,
  vulnerabilities as vulnerabilitiesTable,
  recommendations as recommendationsTable,
  simulations,
  simulationResults,
  responseActions as responseActionsTable,
  actionHistory as actionHistoryTable,
  kpiData as kpiDataTable,
  threatActivity,
  topologyNodes,
  topologyLinks,
  topologyStats,
  threatHeatmap
} from '@shared/schema';

// Seed all data from mock data to database
async function seed() {
  console.log('Seeding database...');

  try {
    // Seed KPI data
    console.log('Seeding KPI data...');
    await db.insert(kpiDataTable).values({
      securityScore: kpiData.securityScore,
      activeThreatTotal: kpiData.activeThreats.total,
      activeThreatChange: kpiData.activeThreats.change,
      activeThreatCritical: kpiData.activeThreats.critical,
      activeThreatHigh: kpiData.activeThreats.high,
      activeThreatMedium: kpiData.activeThreats.medium,
      activeThreatLow: kpiData.activeThreats.low,
      vulnerableContainersAffected: kpiData.vulnerableContainers.affected,
      vulnerableContainersTotal: kpiData.vulnerableContainers.total,
      compliancePercentage: kpiData.complianceStatus.percentage,
      complianceChange: kpiData.complianceStatus.change,
      compliancePciDss: kpiData.complianceStatus.pciDss,
      complianceGdpr: kpiData.complianceStatus.gdpr,
      complianceHipaa: kpiData.complianceStatus.hipaa
    });

    // Seed threat activity data
    console.log('Seeding threat activity data...');
    const hourlyData = generateThreatActivityData('hourly');
    const dailyData = generateThreatActivityData('daily');
    const weeklyData = generateThreatActivityData('weekly');

    // Insert hourly data
    await db.insert(threatActivity).values(
      hourlyData.chartData.map(item => ({
        time: item.time,
        critical: item.critical,
        high: item.high,
        medium: item.medium,
        low: item.low,
        range: 'hourly'
      }))
    );

    // Insert daily data
    await db.insert(threatActivity).values(
      dailyData.chartData.map(item => ({
        time: item.time,
        critical: item.critical,
        high: item.high,
        medium: item.medium,
        low: item.low,
        range: 'daily'
      }))
    );

    // Insert weekly data
    await db.insert(threatActivity).values(
      weeklyData.chartData.map(item => ({
        time: item.time,
        critical: item.critical,
        high: item.high,
        medium: item.medium,
        low: item.low,
        range: 'weekly'
      }))
    );

    // Seed topology data
    console.log('Seeding topology data...');
    
    // Insert nodes
    await db.insert(topologyNodes).values(
      topologyData.nodes.map(node => ({
        id: node.id,
        name: node.name,
        type: node.type,
        namespace: node.namespace,
        severity: node.severity
      }))
    );

    // Insert links
    await db.insert(topologyLinks).values(
      topologyData.links.map(link => ({
        source: link.source,
        target: link.target,
        suspicious: link.suspicious,
        traffic: link.traffic || false
      }))
    );

    // Insert stats
    await db.insert(topologyStats).values({
      nodes: topologyData.stats.nodes,
      pods: topologyData.stats.pods,
      services: topologyData.stats.services,
      podConnections: topologyData.stats.podConnections,
      suspiciousConnections: topologyData.stats.suspiciousConnections,
      threatCount: topologyData.stats.threatCount,
      namespace: null // This is the global stats
    });

    // Seed heatmap data
    console.log('Seeding heatmap data...');
    await db.insert(threatHeatmap).values(
      heatmapData.heatmapData.map(item => ({
        day: item.day,
        week: item.week,
        threats: item.threats,
        intensity: item.intensity,
        severity: item.severity
      }))
    );

    // Seed vulnerabilities
    console.log('Seeding vulnerabilities...');
    await db.insert(vulnerabilitiesTable).values(
      vulnerabilities.map(vuln => ({
        id: vuln.id,
        cveId: vuln.cveId,
        title: vuln.title,
        score: vuln.score,
        severity: vuln.severity,
        affectedResources: vuln.affectedResources
      }))
    );

    // Seed recommendations
    console.log('Seeding recommendations...');
    await db.insert(recommendationsTable).values(
      recommendations.map(rec => ({
        id: rec.id,
        title: rec.title,
        severity: rec.severity,
        description: rec.description,
        estimatedTime: rec.estimatedTime,
        action: rec.action
      }))
    );

    // Seed threats
    console.log('Seeding threats...');
    const generatedThreats = generateThreats(1, 20).threats;
    await db.insert(threats).values(
      generatedThreats.map(threat => ({
        id: threat.id,
        severity: threat.severity,
        type: threat.type,
        target: threat.target,
        namespace: threat.namespace,
        detectedAt: threat.detectedAt,
        status: threat.status,
        description: threat.description,
        podName: threat.podName,
        details: threat.details
      }))
    );

    // Seed simulations
    console.log('Seeding simulations...');
    await db.insert(simulations).values(
      attackSimulations.map(sim => ({
        id: sim.id,
        name: sim.name,
        description: sim.description,
        duration: sim.duration,
        difficulty: sim.difficulty,
        targets: sim.targets,
        status: sim.status,
        steps: sim.steps
      }))
    );

    // Seed simulation results - this would be expanded with actual simulation results
    console.log('Seeding simulation results...');
    await db.insert(simulationResults).values([
      {
        id: 'sim-result-1',
        simulationId: 'sim-1',
        simulationName: 'Container Escape Attack',
        startTime: '2023-07-15 09:12:34',
        endTime: '2023-07-15 09:18:22',
        status: 'completed',
        detectionSuccess: true,
        detectionTime: '00:02:48',
        steps: [
          { name: 'Exploit container vulnerability', status: 'completed', detected: true },
          { name: 'Escape to host system', status: 'completed', detected: true },
          { name: 'Lateral movement', status: 'completed', detected: false },
          { name: 'Data exfiltration attempt', status: 'completed', detected: true }
        ],
        summary: {
          threatsDetected: 3,
          totalThreats: 4,
          meanTimeToDetect: '00:03:12',
          successRate: 75
        }
      },
      {
        id: 'sim-result-2',
        simulationId: 'sim-2',
        simulationName: 'Credential Theft',
        startTime: '2023-07-12 14:22:54',
        endTime: '2023-07-12 14:28:02',
        status: 'completed',
        detectionSuccess: true,
        detectionTime: '00:01:58',
        steps: [
          { name: 'Pod compromise', status: 'completed', detected: true },
          { name: 'Secret access attempt', status: 'completed', detected: true },
          { name: 'Token extraction', status: 'completed', detected: true },
          { name: 'API server access', status: 'completed', detected: true }
        ],
        summary: {
          threatsDetected: 4,
          totalThreats: 4,
          meanTimeToDetect: '00:02:05',
          successRate: 100
        }
      }
    ]);

    // Seed response actions
    console.log('Seeding response actions...');
    await db.insert(responseActionsTable).values(
      responseActions.map(action => ({
        id: action.id,
        name: action.name,
        description: action.description,
        automated: action.automated,
        enabled: action.enabled,
        lastExecuted: action.lastExecuted,
        target: action.target,
        applicableThreats: action.applicableThreats
      }))
    );

    // Seed action history
    console.log('Seeding action history...');
    await db.insert(actionHistoryTable).values(
      actionHistory.map(history => ({
        id: history.id,
        action: history.action,
        target: history.target,
        threat: history.threat,
        result: history.result,
        timestamp: history.timestamp,
        user: history.user
      }))
    );

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the database pool
    await db.end?.();
  }
}

// Run the seed function
seed().catch(console.error);