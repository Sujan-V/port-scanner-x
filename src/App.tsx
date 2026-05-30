/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Terminal as TerminalIcon, 
  Activity, 
  Layers, 
  History, 
  BookOpen, 
  HelpCircle, 
  Download, 
  RefreshCw, 
  Sliders, 
  TrendingUp, 
  Layout, 
  AlertTriangle,
  Flame,
  Bot,
  CheckSquare
} from 'lucide-react';

import RadarScanner from './components/RadarScanner';
import TerminalView from './components/TerminalView';
import ScanControl from './components/ScanControl';
import ThreatIntel from './components/ThreatIntel';
import AnalyticsPanel from './components/AnalyticsPanel';
import HistoryList from './components/HistoryList';
import EducationHub from './components/EducationHub';

import { ScanReport, TerminalLogEntry, AISecurityReport } from './types';

export default function App() {
  const [activeTab, setActiveTab2] = useState<'dashboard' | 'analytics' | 'education'>('dashboard');
  
  // Scans history state
  const [history, setHistory] = useState<ScanReport[]>([]);
  const [activeReport, setActiveReport] = useState<ScanReport | null>(null);
  
  // Real-time Scan monitoring states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentLogs, setCurrentLogs] = useState<TerminalLogEntry[]>([]);
  const [activeSearchTarget, setActiveSearchTarget] = useState('cloud-server.local');
  const [detectedPortsList, setDetectedPortsList] = useState<number[]>([]);

  // AI Insights generation state
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Initialize and load scan history from backend (JSON persistence integration) or fall back to localStorage
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        if (data.length > 0) {
          // Set latest scan as default active view
          setActiveReport(data[0]);
          if (data[0].aiReport) {
            setAiInsights(data[0].aiReport);
          }
        }
      } else {
        // LocalStorage fallback
        const localData = localStorage.getItem('portscannerx_local_history');
        if (localData) {
          const parsed = JSON.parse(localData);
          setHistory(parsed);
          if (parsed.length > 0) {
            setActiveReport(parsed[0]);
            if (parsed[0].aiReport) setAiInsights(parsed[0].aiReport);
          }
        }
      }
    } catch (err) {
      console.warn('Backend history sync unavailable. Reverting to local cache stream:', err);
      const localData = localStorage.getItem('portscannerx_local_history');
      if (localData) {
        const parsed = JSON.parse(localData);
        setHistory(parsed);
        if (parsed.length > 0) {
          setActiveReport(parsed[0]);
          if (parsed[0].aiReport) setAiInsights(parsed[0].aiReport);
        }
      }
    }
  };

  // Launch the scanning sweep orchestration
  const startNetworkScan = async (target: string, scanType: 'fast' | 'full' | 'custom', customRange?: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setDetectedPortsList([]);
    setAiInsights(null);
    setActiveSearchTarget(target);

    // Formulate a clean bootstrap logging timeline
    const bootLogs: TerminalLogEntry[] = [
      {
        id: 'boot-1',
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `[Core Engine] Launching reconnaissance probe on: ${target}`
      },
      {
        id: 'boot-2',
        timestamp: new Date().toISOString(),
        type: 'info',
        message: `[Probe Conf] Scan Mode: ${scanType.toUpperCase()} | Range: ${scanType === 'custom' ? customRange : 'Top Ports Index'}`
      }
    ];

    setCurrentLogs(bootLogs);

    // API Post target to the backend server
    try {
      // Trigger backend scanning resolver
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, scanType, customRange, saveToBackend: true })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server scanning process declined.');
      }

      const scanResult: ScanReport & { logs: TerminalLogEntry[] } = await res.json();

      // Trigger standard progressive visual sweep animation for realism
      let currentProgress = 0;
      const totalSteps = scanResult.logs.length;
      const stepDuration = Math.max(12, Math.floor(1800 / totalSteps)); // total scan duration around 1.8s

      const timer = setInterval(() => {
        currentProgress += Math.floor(100 / totalSteps) + 1;
        const progressPercentage = Math.min(100, currentProgress);
        
        setScanProgress(progressPercentage);

        // Fetch corresponding logging slice
        const logUnitsCount = Math.floor((progressPercentage / 100) * totalSteps);
        const slice = scanResult.logs.slice(0, logUnitsCount);
        
        // Accumulate active detected open ports to render live on the Radar sweep
        const openPortsGrabbedSoFar = slice
          .filter(log => log.message.includes('discovered OPEN'))
          .map(log => {
            const matches = log.message.match(/Port (\d+)\/TCP/);
            return matches ? parseInt(matches[1], 10) : null;
          })
          .filter((p): p is number => p !== null);

        setDetectedPortsList(Array.from(new Set(openPortsGrabbedSoFar)));
        setCurrentLogs(slice);

        if (progressPercentage >= 100) {
          clearInterval(timer);
          setIsScanning(false);
          setActiveReport(scanResult);
          
          // Prepend to frontend history state
          setHistory(prev => {
            const val = [scanResult, ...prev];
            localStorage.setItem('portscannerx_local_history', JSON.stringify(val));
            return val;
          });

          // Prompt automatically or provide baseline local insight
          if (scanResult.ports.some(p => p.status === 'open')) {
            generateServerAIReport(scanResult);
          }
        }
      }, stepDuration);

    } catch (err: any) {
      console.error('Scan deployment failed: ', err);
      setCurrentLogs(prev => [
        ...prev,
        {
          id: 'err-1',
          timestamp: new Date().toISOString(),
          type: 'error',
          message: `[!] PROCESS EXCEPTION ABORTED: ${err.message}`
        }
      ]);
      setIsScanning(false);
    }
  };

  // Generate complete threat insights report via Gemini or fallback rule-based analyzer
  const generateServerAIReport = async (reportItem: ScanReport) => {
    setLoadingAI(true);
    try {
      const openPorts = reportItem.ports.filter(p => p.status === 'open');
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: reportItem.target,
          openPorts,
          riskLevel: reportItem.riskLevel,
          exposureScore: reportItem.exposureScore
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data);
        
        // Append AI report into standard history and active states
        setActiveReport(prev => prev && prev.id === reportItem.id ? { ...prev, aiReport: data } : prev);
        setHistory(prev => {
          const updated = prev.map(s => s.id === reportItem.id ? { ...s, aiReport: data } : s);
          localStorage.setItem('portscannerx_local_history', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('AI compilation error. Preserving static heuristics:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  // Selected a historical audit scan from list
  const selectReportFromHistory = (report: ScanReport) => {
    setActiveReport(report);
    setActiveSearchTarget(report.target);
    if (report.aiReport) {
      setAiInsights(report.aiReport);
    } else {
      setAiInsights(null);
    }
  };

  // Remove a scan record from list
  const deleteScanRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Remote delete failed, clearing cache only:', err);
    }

    setHistory(prev => {
      const filtered = prev.filter(s => s.id !== id);
      localStorage.setItem('portscannerx_local_history', JSON.stringify(filtered));
      if (activeReport?.id === id) {
        if (filtered.length > 0) {
          setActiveReport(filtered[0]);
          setAiInsights(filtered[0].aiReport || null);
        } else {
          setActiveReport(null);
          setAiInsights(null);
        }
      }
      return filtered;
    });
  };

  // Purge standard database ledger
  const clearSessionHistory = async () => {
    if (!window.confirm('Wipe and clear PortScannerX scanning logs database? This is irreversible.')) {
      return;
    }
    try {
      await fetch('/api/history', { method: 'DELETE' });
    } catch (err) {
      console.warn('Remote wipe history failed:', err);
    }

    setHistory([]);
    setActiveReport(null);
    setAiInsights(null);
    localStorage.removeItem('portscannerx_local_history');
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-cyan-400 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-400">
      {/* Background Neon Cyber Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. Header Toolbar Panel */}
      <header className="h-16 border-b border-cyan-900/50 bg-[#05070f] flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] rotate-45">
            <div className="w-4 h-4 bg-[#02040a] rotate-45"></div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase font-mono leading-none">
              PortScanner<span className="text-cyan-400 font-extrabold">X</span>
            </h1>
            <span className="px-2 py-0.5 text-[9px] border border-cyan-800 rounded bg-cyan-950/30 text-cyan-500 uppercase tracking-tighter">
              v4.2.0 Stable
            </span>
          </div>
        </div>

        {/* Top-level section menus */}
        <nav className="flex space-x-1.5 font-mono text-[11px] tracking-wide uppercase">
          {[
            { id: 'dashboard', label: 'SOC Dashboard', icon: Layout },
            { id: 'analytics', label: 'Exposure Maps', icon: TrendingUp },
            { id: 'education', label: 'RECON Theory', icon: BookOpen }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab2(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg uppercase transition-all duration-150 ${
                  isSelected
                    ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-transparent border border-transparent text-cyan-800 hover:text-cyan-400 hover:border-cyan-900/20'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 z-10 relative space-y-6">
        
        {/* Banner Ethics Disclaimer Prompt */}
        <div className="bg-[#0a0f1d] border border-cyan-900/40 p-3 rounded-lg flex items-center space-x-3 text-cyan-500 font-mono text-[10px] uppercase leading-relaxed shadow-[0_0_10px_rgba(6,182,212,0.05)]">
          <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
          <p className="flex-1">
            AUTHORIZED AUDITING RANGE DISCLOSURE: PortScannerX is built specifically for educational, network diagnostic, and defensive system audits. Scanning of remote public frameworks without prior mutual agreement is highly prohibited.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              {/* Left Column: configuration controls & Scan history */}
              <div className="lg:col-span-4 space-y-5">
                <ScanControl 
                  onStartScan={startNetworkScan} 
                  isScanning={isScanning} 
                />
                <HistoryList 
                  history={history} 
                  selectedId={activeReport?.id || null} 
                  onSelectScan={selectReportFromHistory} 
                  onDeleteScan={deleteScanRecord}
                  onClearHistory={clearSessionHistory} 
                />
              </div>

              {/* Center Column: Radar screen & live text console logs */}
              <div className="lg:col-span-4 space-y-5">
                {/* Visual core radar */}
                <RadarScanner 
                  isScanning={isScanning} 
                  progress={scanProgress}
                  openPortsCount={activeReport ? activeReport.ports.filter(p => p.status === 'open').length : 0}
                  detectedPorts={isScanning ? detectedPortsList : (activeReport ? activeReport.ports.filter(p => p.status === 'open').map(p => p.port) : [])}
                  target={activeSearchTarget}
                />

                {/* monspaced streaming logs terminal */}
                <TerminalView 
                  logs={currentLogs} 
                  isScanning={isScanning}
                  onClear={() => setCurrentLogs([])}
                />
              </div>

              {/* Right Column: exposure summary, detected ports & report downloads */}
              <div className="lg:col-span-4">
                <ThreatIntel 
                  report={activeReport} 
                  aiReport={aiInsights} 
                  loadingAI={loadingAI}
                  onGenerateAI={() => activeReport && generateServerAIReport(activeReport)} 
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-mono font-bold tracking-wider text-slate-100 uppercase">
                    ACTIVE THREAT MAPS & VISUAL ANALYTICS
                  </h2>
                  <p className="text-[11px] text-cyan-700 font-mono mt-1">
                    Systemically evaluates aggregate vulnerabilities, common listener ports, and latency statistics.
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-cyan-900/40 text-xs font-mono text-cyan-500">
                  TOTAL SCAN ARCHIVES: {history.length}
                </div>
              </div>

              <AnalyticsPanel history={history} />
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5"
            >
              <div className="lg:col-span-8">
                <EducationHub />
              </div>
              
              {/* Simple side telemetry info */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-[#0a0f1d] border border-cyan-900/40 p-4 rounded-xl font-mono text-xs space-y-3 shadow-md">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold border-b border-cyan-900/20 pb-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>SYSTEM_CALIBRATORS</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Node Environment</span>
                      <span className="text-cyan-100">Express + React</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Intelligence Core</span>
                      <span className="text-cyan-100">Gemini 3.5 Flash</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Telemetry Version</span>
                      <span className="text-cyan-100">4.2.0-STABLE</span>
                    </div>
                    <div className="flex justify-between border-t border-cyan-900/20 pt-2 text-[10px]">
                      <span className="text-cyan-700">Security Bind</span>
                      <span className="text-emerald-400 glow-text-emerald font-bold">ACTIVE - SSL Wraps</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0f1d] border border-cyan-900/40 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-cyan-453 space-y-2 shadow-md">
                  <div className="flex items-center space-x-2 text-cyan-400 font-black">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span>DEFENSIVE REMEDIATION CHECKS</span>
                  </div>
                  <ul className="space-y-1.5 text-cyan-100/70">
                    <li>&bull; Audit active system boundaries weekly.</li>
                    <li>&bull; Rotate default ports on DB instances.</li>
                    <li>&bull; Decomission unauthenticated NoSQL nodes.</li>
                    <li>&bull; Restrict public address routing pools.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. Footer Control Bar */}
      <footer className="h-8 bg-[#05070f] border-t border-cyan-900/50 flex items-center px-6 justify-between text-[10px] text-cyan-800 shrink-0 uppercase tracking-widest font-mono z-40 relative select-none">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            <span>NODE: PORT_ENGINE_ON</span>
          </div>
          <span className="hidden md:inline">CPU_LOAD: 12.4%</span>
          <span className="hidden md:inline">MEMORY: 512MB / 2.0GB</span>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-cyan-700 hidden sm:inline">SECURE_CHANNEL: AES-256-GCM</div>
          <div className="text-cyan-600">sujanv05@gmail.com</div>
          <div className="text-white font-bold">SESSION_ID: PX-8849-01</div>
        </div>
      </footer>
    </div>
  );
}
