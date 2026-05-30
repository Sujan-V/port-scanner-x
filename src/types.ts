/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PortStatus = 'open' | 'closed' | 'filtered';

export interface PortScanResult {
  port: number;
  protocol: 'TCP' | 'UDP';
  status: PortStatus;
  service: string;
  banner?: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  remediation?: string;
}

export interface ScanSummary {
  totalScanned: number;
  openCount: number;
  closedCount: number;
  filteredCount: number;
}

export interface AISecurityReport {
  summary: string;
  vulnerabilityCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  threatIndexDetails: string;
  remediationRoadmap: string[];
  isRealTimeAI?: boolean;
}

export interface ScanReport {
  id: string;
  target: string;
  scanType: 'fast' | 'full' | 'custom';
  portsConfig: string;
  timestamp: string;
  durationMs: number;
  isSimulated: boolean;
  exposureScore: number; // 0 to 100
  riskLevel: RiskLevel;
  ports: PortScanResult[];
  summary: ScanSummary;
  aiReport?: AISecurityReport;
  notes?: string;
}

export interface SystemMetrics {
  totalScansPerformed: number;
  averageScanDuration: number;
  riskDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  commonPorts: { port: number; service: string; count: number }[];
  scannedHostsCount: number;
}

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'debug';
  message: string;
}
