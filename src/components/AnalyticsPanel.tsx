/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, Clock, HelpCircle, Activity, LayoutGrid } from 'lucide-react';
import { ScanReport } from '../types';

interface AnalyticsPanelProps {
  history: ScanReport[];
}

export default function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  if (history.length === 0) {
    return (
      <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-8 text-center text-cyan-600 flex flex-col items-center justify-center min-h-[300px]">
        <BarChart3 className="w-12 h-12 text-cyan-950 mb-3" />
        <span className="font-mono text-xs uppercase tracking-wider">No Analytics Data Present</span>
        <p className="text-xs text-cyan-800 max-w-xs mt-1">
          Scanned topology histories are empty. Execute scans on diverse targets to formulate analytical diagrams.
        </p>
      </div>
    );
  }

  // 1. Durations vs Port-Count (Timeline latency)
  const durationData = [...history].reverse().map((scan, i) => ({
    name: `Scan #${i + 1}`,
    duration: scan.durationMs,
    openPorts: scan.summary.openCount,
    target: scan.target
  }));

  // 2. Risk Levels Pie Chart data
  const riskLevelsCount = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };
  history.forEach(scan => {
    riskLevelsCount[scan.riskLevel]++;
  });

  const riskData = [
    { name: 'Critical', value: riskLevelsCount.Critical, color: '#f43f5e' },
    { name: 'High', value: riskLevelsCount.High, color: '#f97316' },
    { name: 'Medium', value: riskLevelsCount.Medium, color: '#fbbf24' },
    { name: 'Low', value: riskLevelsCount.Low, color: '#10b981' }
  ].filter(item => item.value > 0);

  // 3. Port Category Counts
  const portCounts: Record<number, { service: string; count: number }> = {};
  history.forEach(scan => {
    scan.ports.forEach(p => {
      if (p.status === 'open') {
        if (!portCounts[p.port]) {
          portCounts[p.port] = { service: p.service.split(' ')[0], count: 0 };
        }
        portCounts[p.port].count++;
      }
    });
  });

  const portBarData = Object.entries(portCounts).map(([port, info]) => ({
    port: `:${port}`,
    frequency: info.count,
    service: info.service
  })).sort((a,b) => b.frequency - a.frequency).slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#02040a] border border-cyan-900/50 p-2.5 rounded-lg shadow-xl font-mono text-[10px] text-cyan-100">
          <p className="text-cyan-400 font-bold">{data.name || data.port || data.service}</p>
          {data.target && <p>Host: {data.target}</p>}
          {data.duration && <p>Duration: {data.duration} ms</p>}
          {data.openPorts !== undefined && <p>Open ports: {data.openPorts}</p>}
          {data.frequency && <p>Open Frequency: {data.frequency} scans</p>}
          {data.value && <p>Count: {data.value} scans</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Time duration trends */}
      <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-4 lg:col-span-2 shadow-lg">
        <div className="flex items-center justify-between border-b border-cyan-900/20 pb-2 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Scan latency & RTT performance (ms)
            </h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-800 uppercase">
            HISTORY: {history.length}
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e1e2d" opacity={0.4} />
              <XAxis dataKey="name" stroke="#0891b2" fontSize={9} tickLine={false} />
              <YAxis stroke="#0891b2" fontSize={9} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="duration" stroke="#22d3ee" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDur)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Risk Distribution Pie Chart */}
      <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-cyan-900/20 pb-2 mb-4">
          <Activity className="w-4 h-4 text-cyan-455" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
            Scan Threat Spread
          </h3>
        </div>

        {riskData.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-cyan-800 text-xs font-mono">
            [No threat matrix found]
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="h-40 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#02040a" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-cyan-805 text-[9px] uppercase font-mono">TOTAL_REPORTS</span>
                <span className="text-lg font-mono font-black text-cyan-100">{history.length}</span>
              </div>
            </div>

            {/* Legends */}
            <div className="grid grid-cols-2 gap-3 w-full border-t border-cyan-900/20 pt-3">
              {riskData.map((r, i) => (
                <div key={r.name} className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-cyan-600 block truncate">{r.name}</span>
                    <span className="text-[9px] font-mono text-cyan-800 leading-none">
                      {Math.round((r.value / history.length) * 100)}% ({r.value})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Most Common Open Ports frequency chart */}
      <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-4 lg:col-span-3 shadow-lg">
        <div className="flex items-center space-x-2 border-b border-cyan-900/20 pb-2 mb-4">
          <LayoutGrid className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
            High Exposure Frequency index
          </h3>
        </div>

        {portBarData.length === 0 ? (
          <div className="text-center py-10 text-cyan-800 text-xs font-mono">
            [No active open ports logged in history audits]
          </div>
        ) : (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#0e1e2d" opacity={0.4} />
                <XAxis dataKey="port" stroke="#0891b2" fontSize={9} />
                <YAxis stroke="#0891b2" fontSize={9} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="frequency" fill="#0891b2" radius={[4, 4, 0, 0]}>
                  {portBarData.map((entry, index) => (
                    <Cell key={`bar-cell-${index}`} fill={index === 0 ? '#06b6d4' : '#0891b2'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
