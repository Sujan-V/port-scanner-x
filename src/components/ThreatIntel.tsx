/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Search,
  X,
  SlidersHorizontal,
  FileDown,
  Printer,
  Table,
  Cpu,
  Database
} from 'lucide-react';
import { ScanReport } from '../types';

interface ThreatIntelProps {
  report: ScanReport | null;
  aiReport: any | null; // AI report state
  loadingAI: boolean;
  onGenerateAI: () => void;
}

export default function ThreatIntel({
  report,
  aiReport,
  loadingAI,
  onGenerateAI,
}: ThreatIntelProps) {
  const [activeIntelTab, setActiveIntelTab] = useState<'exposure' | 'analysis' | 'compliance'>('exposure');
  const [expandedPort, setExpandedPort] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [visibleStatuses, setVisibleStatuses] = useState<Record<'open' | 'closed' | 'filtered', boolean>>({
    open: true,
    filtered: true,
    closed: false,
  });
  const [selectedSeverities, setSelectedSeverities] = useState<Record<string, boolean>>({
    info: true,
    low: true,
    medium: true,
    high: true,
    critical: true,
  });

  if (!report) {
    return (
      <div className="bg-[#0a0f1d] border border-cyan-900/45 rounded-xl p-6 text-center text-cyan-600 h-[380px] flex flex-col items-center justify-center">
        <Shield className="w-12 h-12 opacity-30 mb-3 text-cyan-400 animate-[pulse_2.5s_infinite]" />
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-extrabold block">
          Awaiting Recon Data
        </span>
        <p className="text-[11px] text-cyan-800 max-w-[270px] mt-2.5 leading-relaxed font-sans">
          Initialize an active network target probe or select a past report index in the history ledger to load system exposure scorecards and compliance reports.
        </p>
      </div>
    );
  }

  // Calculate colors based on risk
  let scoreColor = 'text-emerald-400 border-emerald-950/40 bg-emerald-950/10';
  let scoreBar = 'bg-emerald-500';
  let shieldColor = 'text-emerald-400';

  if (report.riskLevel === 'Medium') {
    scoreColor = 'text-amber-400 border-amber-950/40 bg-amber-950/10';
    scoreBar = 'bg-amber-500';
    shieldColor = 'text-amber-400';
  } else if (report.riskLevel === 'High') {
    scoreColor = 'text-orange-400 border-orange-950/40 bg-orange-950/10';
    scoreBar = 'bg-orange-500';
    shieldColor = 'text-orange-400';
  } else if (report.riskLevel === 'Critical') {
    scoreColor = 'text-rose-500 border-rose-950/40 bg-rose-950/10';
    scoreBar = 'bg-rose-500';
    shieldColor = 'text-rose-500';
  }

  // Filter ports based on active user constraints
  const displayedPorts = report.ports.filter((portInfo) => {
    // 1. Status Category filter
    if (!visibleStatuses[portInfo.status]) {
      return false;
    }

    // 2. Severity levels filter
    if (!selectedSeverities[portInfo.severity]) {
      return false;
    }

    // 3. Optional Text Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const portString = portInfo.port.toString();
      const serviceString = portInfo.service.toLowerCase();
      const bannerString = portInfo.banner ? portInfo.banner.toLowerCase() : '';
      const descString = portInfo.description ? portInfo.description.toLowerCase() : '';

      const matches = 
        portString.includes(query) ||
        serviceString.includes(query) ||
        bannerString.includes(query) ||
        descString.includes(query);

      if (!matches) return false;
    }

    return true;
  });

  const hasActiveFilters = 
    searchQuery !== '' || 
    !visibleStatuses.open || 
    !visibleStatuses.filtered ||
    visibleStatuses.closed ||
    !selectedSeverities.info ||
    !selectedSeverities.low ||
    !selectedSeverities.medium ||
    !selectedSeverities.high ||
    !selectedSeverities.critical;

  const openPorts = report.ports.filter(p => p.status === 'open');

  // CSV Generator Function
  const downloadCSV = () => {
    const headers = 'Port,Protocol,Status,Service,Banner,Severity,Vulnerability Description,Mitigation';
    const rows = report.ports.map((p) => {
      const banner = (p.banner || '').replace(/"/g, '""');
      const desc = (p.description || '').replace(/"/g, '""');
      const rem = (p.remediation || '').replace(/"/g, '""');
      return `${p.port},${p.protocol},${p.status},"${p.service}","${banner}",${p.severity},"${desc}","${rem}"`;
    });
    
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PortScannerX_Report_${report.target}_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Generator Function
  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `PortScannerX_Report_${report.target}_${report.id}.json`);
    dlAnchorElem.click();
  };

  // Printable Report Frame (Simulated PDF Trigger)
  const triggerPrintFormat = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const portsHtml = openPorts.map(p => `
      <tr style="border-bottom: 1px solid #134e5a; color: #cffafe;">
        <td style="padding: 10px; font-weight: bold; font-family: monospace; color: #22d3ee;">:${p.port}</td>
        <td style="padding: 10px; font-family: monospace;">${p.protocol}</td>
        <td style="padding: 10px;"><span style="background: #ef4444; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">${p.severity}</span></td>
        <td style="padding: 10px; font-weight: 500;">${p.service}</td>
        <td style="padding: 10px; font-size: 11px; color: #a5f3fc; font-family: monospace;">${p.banner || 'N/A'}</td>
      </tr>
    `).join('');

    const remediationHtml = aiReport ? aiReport.remediationRoadmap.map((step: string, i: number) => `
      <li style="margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: #e2e8f0;">
        <strong>[Mitigation ${i+1}]</strong> ${step}
      </li>
    `).join('') : `
      <li style="margin-bottom: 8px; color: #e2e8f0;">Decommission unused old listening networks.</li>
      <li style="margin-bottom: 8px; color: #e2e8f0;">Apply least privilege firewalls filtering port connectivity.</li>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>PortScannerX Cybersecurity Disclosure Audit - ${report.target}</title>
          <style>
            body { font-family: monospace; color: #cffafe; background-color: #02040a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0891b2; padding-bottom: 15px; margin-bottom: 30px; }
            .title { color: #22d3ee; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
            .meta-box { background: #0a0f1d; border: 1px solid #134e5a; border-radius: 8px; padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
            .risk-badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase; color: white; }
            .risk-critical { background: #f43f5e; }
            .risk-high { background: #f97316; }
            .risk-medium { background: #fbbf24; color: #78350f; }
            .risk-low { background: #10b981; }
            .section-title { font-size: 18px; border-bottom: 1px solid #134e5a; padding-bottom: 6px; margin-top: 35px; color: #22d3ee; text-transform: uppercase; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { text-align: left; background: #0a0f1d; padding: 10px; font-size: 12px; text-transform: uppercase; color: #06b6d4; }
            .disclaimer { font-size: 11px; color: #0891b2; border-top: 1px solid #134e5a; margin-top: 60px; padding-top: 15px; font-style: italic; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div style="text-align: right; margin-bottom: 20px;">
            <button onclick="window.print()" style="background: #0891b2; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; font-family: monospace;">PRINT REPORT (SAVE AS PDF)</button>
          </div>
          
          <div class="header">
            <div>
              <h1 class="title">PORTSCANNER_X NETWORK AUDIT</h1>
              <span style="font-size: 12px; font-family: monospace; color: #0891b2; font-weight: bold;">DISCLOSURE ID: ${report.id}</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; color: #0891b2; font-weight: bold; font-family: monospace;">CYBERSECURITY LABS REPORT</span>
            </div>
          </div>

          <div class="meta-box">
            <div>
              <strong>Target Host:</strong> <code style="background: #02040a; padding: 2px 4px; border-radius: 4px; border: 1px solid #134e5a; color: #22d3ee;">${report.target}</code><br>
              <strong>Scan Type:</strong> ${report.scanType.toUpperCase()} Probe<br>
              <strong>Execution Latency:</strong> ${report.durationMs} milliseconds
            </div>
            <div>
              <strong>Calculated Risk Rating:</strong> 
              <span class="risk-badge risk-${report.riskLevel.toLowerCase()}">${report.riskLevel}</span><br>
              <strong>Attack Surface Intensity Score:</strong> ${report.exposureScore}/100<br>
              <strong>Audit Timestamp:</strong> ${report.timestamp}
            </div>
          </div>

          <p style="font-size: 14px; color: #cffafe;">
            This security audit documents open listening ports on the target host <strong>${report.target}</strong>. System administrators must use these findings to close redundant ports and implement defensive firewalls inline with least-privilege paradigms.
          </p>

          <h2 class="section-title">Open Port Exposure Inventory</h2>
          ${openPorts.length === 0 ? `
            <div style="padding: 20px; text-align: center; border: 1px dashed #134e5a; border-radius: 8px; margin-top: 15px; font-family: monospace; color: #0891b2;">
              [No open port parameters detected. Excellent firewall shielding active.]
            </div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>Port</th>
                  <th>Protocol</th>
                  <th>Severity</th>
                  <th>Service Identified</th>
                  <th>Gained Banner</th>
                </tr>
              </thead>
              <tbody>
                ${portsHtml}
              </tbody>
            </table>
          `}

          <h2 class="section-title">AI Assessment & Summary</h2>
          <div style="background: #0a0f1d; border-left: 4px solid #0891b2; padding: 15px; border-radius: 4px; margin-top: 15px; border: 1px solid #134e5a; border-left-width: 4px;">
            <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: #cffafe;">
              ${aiReport ? aiReport.summary : `Vulnerability scanner logged ${openPorts.length} active entry point ports. Security administrators must inspect running technology packages for recent security exploits.`}
            </p>
          </div>

          <h2 class="section-title">Strategic Remediation Roadmap</h2>
          <ol style="padding-left: 20px; margin-top: 15px; color: #cffafe;">
            ${remediationHtml}
          </ol>

          <div class="disclaimer">
            This network reconnaissance audit was compiled purely for ethical and educational laboratories. Unauthorized scanning of concrete targets without explicit, written stakeholder permission represents a serious breach of cyber laws globally.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* 1. Risk index overview card (Uniform & Space Saving Header) */}
      <div className={`p-3 border rounded-xl ${scoreColor} backdrop-blur-md`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${shieldColor}`} />
            <div>
              <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-wider block">
                Target Exposure Rating
              </span>
              <span className="text-xs font-mono font-bold tracking-wide uppercase text-white">
                {report.riskLevel} Hazard State
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-cyan-600 block leading-none">SCOREINDEX</span>
            <span className="text-base font-mono font-extrabold tracking-tight">
              {report.exposureScore}/100
            </span>
          </div>
        </div>

        {/* Progress Bar Index */}
        <div className="w-full h-1 rounded-full bg-[#02040a] mt-2 overflow-hidden border border-cyan-900/10">
          <div className={`h-full rounded-full ${scoreBar}`} style={{ width: `${report.exposureScore}%` }} />
        </div>
      </div>

      {/* 2. Command Deck Multi-Tab Section Indicator */}
      <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-3 shadow-md flex flex-col space-y-3">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-cyan-950/80 pb-2 font-mono text-[10px] w-full bg-[#02040a]/30 p-1 rounded-lg">
          {[
            { id: 'exposure', label: '1. Exposed Nodes', icon: Table },
            { id: 'analysis', label: '2. Intel Expert', icon: Cpu },
            { id: 'compliance', label: '3. Compliance Export', icon: FileDown }
          ].map((t) => {
            const TabIcon = t.icon;
            const isActive = activeIntelTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveIntelTab(t.id as any)}
                className={`flex-1 py-1 px-1 flex items-center justify-center space-x-1 transition-all duration-150 uppercase tracking-tighter cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/50 border border-cyan-530/30 text-cyan-400 font-bold rounded shadow-sm'
                    : 'text-cyan-800 hover:text-cyan-500 hover:bg-cyan-950/10 rounded'
                }`}
              >
                <TabIcon className="w-3 h-3 text-cyan-550" />
                <span>{t.label.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Tab contents */}
        <div className="relative min-h-[300px]">
          
          {/* TAB 1: EXPOSED NODES */}
          {activeIntelTab === 'exposure' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-cyan-900/15 pb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                  Discovered Ports ({displayedPorts.length})
                </span>
                
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="px-2 py-0.5 rounded border border-cyan-500/20 text-[9px] font-mono font-bold bg-[#020400] text-cyan-400 hover:text-cyan-300 transition-all flex items-center space-x-1"
                  >
                    <Filter className="w-3.5 h-3.5 text-cyan-400" />
                    <span>REFINE</span>
                    {hasActiveFilters && (
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </button>
                  <span className="text-[9px] font-mono text-cyan-800 uppercase">
                    RTT: {report.durationMs}ms
                  </span>
                </div>
              </div>

              {displayedPorts.length === 0 ? (
                <div className="text-center py-10 text-cyan-700 font-mono text-xs flex flex-col items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-cyan-950 mb-2" />
                  <span>[Filter Active but Empty]</span>
                  <p className="text-[9px] text-cyan-900 mt-1 max-w-[200px] leading-relaxed">
                    Adjust status tags, search queries, or severity level in refinery config.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        setVisibleStatuses({ open: true, filtered: true, closed: false });
                        setSelectedSeverities({ info: true, low: true, medium: true, high: true, critical: true });
                        setSearchQuery('');
                      }}
                      className="mt-3 text-[9px] px-2 py-1 border border-cyan-900/50 text-cyan-400 hover:text-cyan-300 bg-[#02040a] rounded font-mono uppercase"
                    >
                      Clear Refinery
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto scrollbar-thin rounded-lg border border-cyan-950/30 p-1 bg-[#02040a]/20">
                  {displayedPorts.map((portInfo) => {
                    const isExpanded = expandedPort === portInfo.port;
                    let badgeColor = 'bg-[#02040a] text-cyan-500 border-cyan-900/40';
                    if (portInfo.severity === 'critical') badgeColor = 'bg-rose-950/45 text-rose-400 border-rose-500/40';
                    else if (portInfo.severity === 'high') badgeColor = 'bg-orange-950/45 text-orange-400 border-orange-500/40';
                    else if (portInfo.severity === 'medium') badgeColor = 'bg-amber-950/45 text-amber-300 border-amber-500/40';

                    return (
                      <div
                        key={`port-box-${portInfo.port}`}
                        className="bg-[#02040a] border border-cyan-900/30 rounded-lg overflow-hidden transition-all hover:border-cyan-500/35"
                      >
                        <div
                          onClick={() => setExpandedPort(isExpanded ? null : portInfo.port)}
                          className="flex items-center justify-between p-2 cursor-pointer select-none hover:bg-cyan-950/10 transition-colors"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="text-xs font-mono font-bold text-cyan-400 w-11 text-left">
                              :{portInfo.port}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded border uppercase font-mono text-cyan-200 border-cyan-900/30 truncate max-w-[100px]">
                              {portInfo.service.split(' ')[0]}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[8px] font-mono px-1 py-0.2 border rounded uppercase ${
                              portInfo.status === 'open' 
                                ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/25' 
                                : portInfo.status === 'filtered'
                                ? 'bg-amber-900/20 text-amber-400 border-amber-500/25'
                                : 'bg-[#02040a] text-cyan-850 border-cyan-900/20'
                            }`}>
                              {portInfo.status}
                            </span>
                            <span className={`text-[8px] font-mono px-1 py-0.2 border rounded uppercase ${badgeColor}`}>
                              {portInfo.severity}
                            </span>
                            {isExpanded ? <ChevronUp className="w-3 h-3 text-cyan-800" /> : <ChevronDown className="w-3 h-3 text-cyan-800" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-[#02040a] border-t border-cyan-900/20 p-2.5 text-[10px] font-mono text-cyan-500 space-y-2">
                            {portInfo.banner && (
                              <div>
                                <span className="text-[9px] text-cyan-700 block uppercase font-bold tracking-wide">
                                  Banner Signature:
                                </span>
                                <span className="text-emerald-400 whitespace-pre-wrap break-all bg-emerald-950/10 border border-emerald-900/20 px-2 py-0.5 mt-0.5 font-bold rounded inline-block w-full">
                                  {portInfo.banner}
                                </span>
                              </div>
                            )}
                            
                            <div>
                              <span className="text-[9px] text-cyan-705 block uppercase font-bold">
                                Exposure Vector details:
                              </span>
                              <p className="text-slate-200 leading-relaxed mt-0.5">
                                {portInfo.description}
                              </p>
                            </div>

                            {portInfo.remediation && (
                              <div className="border-t border-cyan-900/10 pt-1.5">
                                <span className="text-[9px] text-emerald-400/90 block uppercase font-bold">
                                  Tactical Remediation:
                                </span>
                                <p className="text-emerald-300 leading-relaxed mt-0.5 font-semibold">
                                  {portInfo.remediation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTEL EXPERT (Local Security AI Threat Analyzer) */}
          {activeIntelTab === 'analysis' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-cyan-900/15 pb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                  VULNERABILITY INTELLIGENCE ANALYZER
                </span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              </div>

              {aiReport ? (
                <div className="space-y-3">
                  {aiReport.isLocalExpertSystem && (
                    <div className="bg-emerald-950/25 border border-emerald-800/30 rounded-lg p-2 flex items-start space-x-1.5 text-[10px] font-mono leading-normal text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block uppercase tracking-wide text-[9px] text-emerald-400">
                          [SEC_LOCAL_CORE_VERIFIED]
                        </span>
                        <span>
                          Diagnostic threat scorecard calculated offline by active expert cybersecurity protocols with 0ms latency.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 bg-[#02040a] rounded-lg p-2.5 border border-cyan-900/30">
                    <span className="text-[9px] font-mono text-cyan-500 block uppercase font-bold tracking-wider border-b border-cyan-950 pb-0.5">
                      Threat Categorization Summary
                    </span>
                    <p className="text-cyan-100 font-sans text-xs leading-relaxed">
                      {aiReport.summary}
                    </p>
                  </div>

                  <div className="space-y-1 bg-[#02040a]/40 p-2.5 rounded-lg border border-cyan-900/20 max-h-[140px] overflow-y-auto scrollbar-thin">
                    <span className="text-[9px] font-mono text-amber-400 block uppercase font-bold tracking-wider">
                      Strategic Remediation Roadmap
                    </span>
                    <ul className="space-y-1 mt-1">
                      {(aiReport.remediationRoadmap || []).map((step: string, i: number) => (
                        <li key={`step-${i}`} className="text-[10px] font-mono text-cyan-750 flex items-start space-x-1.5">
                          <span className="text-cyan-450 font-bold flex-shrink-0">[{i + 1}]</span>
                          <span className="leading-relaxed text-cyan-100">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-cyan-900/10 flex items-center justify-between text-[9px] font-mono text-cyan-800">
                    <span>Engine: STATIC_EXPERT_DESK</span>
                    <button
                      onClick={onGenerateAI}
                      disabled={loadingAI}
                      className="text-[8px] px-2 py-0.5 rounded border border-cyan-900/40 text-cyan-400 hover:text-cyan-300 bg-[#02040a] transition-colors uppercase outline-none"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-cyan-800 flex flex-col items-center justify-center space-y-3 h-[240px]">
                  <p className="text-xs font-sans text-cyan-700 leading-relaxed max-w-[240px]">
                    Deploy security risk expert rules and categorization engines over discovered ports to produce detailed mitigation recommendations.
                  </p>
                  <button
                    onClick={onGenerateAI}
                    disabled={loadingAI}
                    className="px-4 py-1.5 rounded-lg border border-cyan-500/20 text-cyan-400 bg-[#02040a] hover:bg-cyan-950/20 hover:border-cyan-400 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    {loadingAI ? (
                      <>
                        <ChevronDown className="w-3.5 h-3.5 animate-spin" />
                        <span>ASSESSING...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5" />
                        <span>RUN THREAT INTEL</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPLIANCE EXPORTS */}
          {activeIntelTab === 'compliance' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-cyan-900/15 pb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                  REPORT DESIGN & DIRECT DOWNLOADS
                </span>
                <FileDown className="w-3.5 h-3.5 text-cyan-405" />
              </div>

              <div className="text-[10px] font-mono text-cyan-800 space-y-2 border border-cyan-950/50 p-2.5 rounded-lg bg-[#02040a]/40">
                <div className="flex justify-between border-b border-cyan-900/10 pb-1">
                  <span>DISCLOSURE ID</span>
                  <span className="text-cyan-100">{report.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between border-b border-cyan-900/10 pb-1">
                  <span>TARGET ADDR</span>
                  <span className="text-cyan-300 font-bold">{report.target}</span>
                </div>
                <div className="flex justify-between border-b border-cyan-900/10 pb-1">
                  <span>EXPOSURE LVL</span>
                  <span className="font-bold text-rose-450 uppercase">{report.riskLevel}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>SCAN TIMINGS</span>
                  <span className="text-cyan-100">{report.timestamp}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={triggerPrintFormat}
                  className="w-full py-2 bg-gradient-to-r from-cyan-950 to-[#0a0f1d] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PRINT REPORT (SAVE AS PDF)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={downloadJSON}
                    className="py-1.5 bg-[#02040a] border border-cyan-900/40 hover:border-cyan-400 text-cyan-600 hover:text-cyan-300 rounded-lg font-mono text-[9px] uppercase font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>JSON Log Ledger</span>
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="py-1.5 bg-[#02040a] border border-cyan-900/40 hover:border-cyan-400 text-cyan-600 hover:text-cyan-300 rounded-lg font-mono text-[9px] uppercase font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>CSV Excel Matrix</span>
                  </button>
                </div>
              </div>

              <p className="text-[9px] font-sans text-cyan-900/80 leading-relaxed text-center">
                * PDF Print format triggers an iframe bypass ready for corporate reporting frameworks.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Refinery Search & Filter Modal Dialog Overlay */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          {/* Modal Container */}
          <div className="relative w-full max-w-xs bg-[#0a0f1d] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden text-cyan-100 font-mono">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d152a] border-b border-cyan-900/30">
              <div className="flex items-center space-x-2 text-cyan-300">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-bold tracking-wider uppercase">PORT_REFINERY_CONFIG</span>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 hover:bg-cyan-950/45 rounded text-cyan-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4 text-xs">
              {/* 1. TEXT SEARCH */}
              <div className="space-y-1">
                <label className="block text-[9px] text-cyan-600 uppercase font-bold tracking-wider">
                  Text Signature Search
                </label>
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 w-3 h-3 text-cyan-800 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. Apache, SSH, Banner..."
                    className="w-full pl-8 pr-3 py-1 bg-[#02040a] border border-cyan-900/40 text-cyan-100 placeholder-cyan-900/50 rounded text-[11px] focus:outline-none focus:border-cyan-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 text-[9px] text-cyan-705 hover:text-cyan-450 uppercase font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 2. PORT STATUS TYPE FILTER */}
              <div className="space-y-1.5">
                <label className="block text-[9px] text-cyan-600 uppercase font-bold tracking-wider">
                  Port Connection Status
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['open', 'filtered', 'closed'] as const).map((status) => {
                    const isActive = visibleStatuses[status];
                    const count = report.ports.filter(p => p.status === status).length;
                    
                    let activeStyling = 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow shadow-cyan-950/50 font-bold';
                    let inactiveStyling = 'bg-[#02040a] border-cyan-900/40 text-cyan-800 hover:text-cyan-500';
                    
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          setVisibleStatuses(prev => ({ ...prev, [status]: !prev[status] }));
                        }}
                        className={`py-1.5 px-1 rounded border text-[9px] uppercase transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isActive ? activeStyling : inactiveStyling
                        }`}
                      >
                        <span className="tracking-tight">{status}</span>
                        <span className="text-[8px] opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. VULNERABILITY EXPOSURE SEVERITY */}
              <div className="space-y-1.5">
                <label className="block text-[9px] text-cyan-600 uppercase font-bold tracking-wider">
                  Trace Exposure Severity
                </label>
                <div className="flex flex-wrap gap-1">
                  {(['info', 'low', 'medium', 'high', 'critical'] as const).map((sev) => {
                    const isActive = selectedSeverities[sev];
                    let badgeStyles = 'border-cyan-900/30 text-cyan-800 hover:text-cyan-500 bg-[#02040a]';
                    if (isActive) {
                      if (sev === 'critical') badgeStyles = 'bg-rose-950/40 text-rose-400 border-rose-500/50 font-bold';
                      else if (sev === 'high') badgeStyles = 'bg-orange-950/40 text-orange-400 border-orange-500/50 font-bold';
                      else if (sev === 'medium') badgeStyles = 'bg-amber-950/40 text-amber-300 border-amber-500/50 font-bold';
                      else if (sev === 'low') badgeStyles = 'bg-cyan-950/40 text-cyan-300 border-cyan-500/50 font-bold';
                      else badgeStyles = 'bg-[#0a0f1d] text-cyan-400 border-cyan-800/40 font-bold';
                    }
                    return (
                      <button
                        key={sev}
                        onClick={() => setSelectedSeverities(prev => ({ ...prev, [sev]: !prev[sev] }))}
                        className={`px-1.5 py-0.5 text-[9px] border rounded uppercase transition-all cursor-pointer ${badgeStyles}`}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="px-4 py-2.5 bg-[#0d152a] border-t border-cyan-900/30 flex items-center justify-between">
              <button
                onClick={() => {
                  setVisibleStatuses({ open: true, filtered: true, closed: false });
                  setSelectedSeverities({ info: true, low: true, medium: true, high: true, critical: true });
                  setSearchQuery('');
                }}
                className="text-[9px] text-cyan-700 hover:text-cyan-400 cursor-pointer uppercase"
              >
                Reset tags
              </button>
              
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-3 py-1 bg-gradient-to-r from-cyan-950 to-[#0a0f1d] border border-cyan-500/35 hover:border-cyan-400 text-cyan-300 text-[10px] font-bold rounded uppercase cursor-pointer"
              >
                Apply Refine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
