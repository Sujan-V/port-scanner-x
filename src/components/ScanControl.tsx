/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, Activity, HelpCircle, Laptop, Landmark, Globe, Hammer } from 'lucide-react';

interface ScanControlProps {
  onStartScan: (target: string, scanType: 'fast' | 'full' | 'custom', customRange?: string) => void;
  isScanning: boolean;
}

const PRESET_LABS = [
  {
    name: 'Secure Web Core',
    target: 'cloud-server.local',
    type: 'fast',
    desc: 'Demonstrates baseline TLS parameters (HTTP/HTTPS, secure SSH). Low hazard surface.',
    icon: Globe,
    color: 'border-cyan-900/30 hover:border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/10'
  },
  {
    name: 'IoT Dev Sandbox',
    target: 'iot-sandbox.local',
    type: 'fast',
    desc: 'Simulated home automation cluster with common open database structures and legacy HTTP.',
    icon: Laptop,
    color: 'border-cyan-900/30 hover:border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/10'
  },
  {
    name: 'Legacy SCADA node',
    target: 'scada-vulnerable.local',
    type: 'full',
    desc: 'Legacy enterprise stack running plain Telnet, anonymous FTP folders, and unprotected caching.',
    icon: Landmark,
    color: 'border-cyan-900/30 hover:border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/10'
  }
];

export default function ScanControl({ onStartScan, isScanning }: ScanControlProps) {
  const [target, setTarget] = useState('cloud-server.local');
  const [scanType, setScanType] = useState<'fast' | 'full' | 'custom'>('fast');
  const [customRange, setCustomRange] = useState('20-100');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = target.trim();
    if (!trimmed) {
      setError('Please enter a target to analyze.');
      return;
    }

    // Basic target validator (either alphanumeric characters plus hyphens & dots, or a valid IP structure)
    const hostRegex = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,11}$/;
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    const localHostRegex = /^(localhost|127\.0\.0\.1|.*\.local)$/i;

    if (!hostRegex.test(trimmed) && !ipRegex.test(trimmed) && !localHostRegex.test(trimmed)) {
      setError('Invalid destination format. Provide an IP, domain suffix or .local dev system.');
      return;
    }

    if (scanType === 'custom') {
      const parts = customRange.split('-');
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      if (isNaN(p1) || isNaN(p2) || p1 < 1 || p2 > 65535 || p1 > p2) {
        setError('Custom port ranges must fit standard port constraints: 1-65535 (e.g. 21-443).');
        return;
      }
    }

    onStartScan(trimmed, scanType, customRange);
  };

  const selectPreset = (lab: typeof PRESET_LABS[0]) => {
    setTarget(lab.target);
    setScanType(lab.type as any);
    if (lab.type === 'custom') {
      setCustomRange('20-100');
    }
    setError('');
  };

  return (
    <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-5 shadow-xl">
      <div className="flex items-center space-x-2.5 border-b border-cyan-900/20 pb-3 mb-4">
        <Network className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-mono tracking-wider font-semibold text-white">
          PROBE CONFIGURATION HUB
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination Target IP */}
        <div>
          <label className="block text-xs font-mono text-cyan-700 mb-1.5 uppercase tracking-wide">
            Network Target Destination
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. localhost, 192.168.1.1, cloud-server.local"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
              className="w-full bg-[#02040a] border border-cyan-900/50 text-cyan-100 placeholder-cyan-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50 transition-all font-semibold"
            />
          </div>
          {error && <p className="text-[10px] text-rose-500 font-mono mt-1">&gt; ERROR: {error}</p>}
        </div>

        {/* Scan Type Options */}
        <div>
          <label className="block text-xs font-mono text-cyan-700 mb-1.5 uppercase tracking-wide">
            Analysis Mode Selection
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'fast', label: 'Fast Probe', desc: 'Top 15 index ports' },
              { id: 'full', label: 'Full Audit', desc: 'Top 100 enterprise scope' },
              { id: 'custom', label: 'Custom Range', desc: 'Define socket range' }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                disabled={isScanning}
                onClick={() => setScanType(mode.id as any)}
                className={`py-2 px-1 text-center rounded-lg border font-mono transition-all disabled:opacity-50 ${
                  scanType === mode.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 text-xs shadow-md shadow-cyan-950/40 font-bold'
                    : 'bg-[#02040a] border-cyan-900/40 hover:bg-cyan-950/10 text-cyan-700 text-xs'
                }`}
              >
                <div>{mode.label}</div>
                <div className="text-[9px] text-cyan-800 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Port Range Selection */}
        {scanType === 'custom' && (
          <div className="bg-[#02040a]/60 border border-cyan-900/40 p-3 rounded-lg duration-100">
            <label className="block text-[10px] font-mono text-cyan-600 mb-1 uppercase tracking-wider">
              Port range values (Format: start-end)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="20-80"
                value={customRange}
                onChange={(e) => setCustomRange(e.target.value)}
                disabled={isScanning}
                className="w-full bg-[#02040a] border border-cyan-900/50 text-cyan-200 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 disabled:opacity-50"
              />
              <span className="text-[10px] text-cyan-800 font-mono whitespace-nowrap">
                Max span = 100 ports
              </span>
            </div>
          </div>
        )}

        {/* Scan Button Trigger */}
        <button
          type="submit"
          disabled={isScanning}
          className={`w-full py-2.5 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-2 ${
            isScanning
              ? 'bg-[#02040a] border-cyan-900/20 text-cyan-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-950 to-[#0a0f1d] border border-cyan-500/35 text-cyan-300 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
          }`}
        >
          {isScanning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-cyan-400" />
              <span>ACTIVE_RECON_RUNNING...</span>
            </>
          ) : (
            <>
              <Network className="w-4 h-4 text-cyan-400" />
              <span>LAUNCH SECURITY SCAN</span>
            </>
          )}
        </button>
      </form>

      {/* Cyber training scenario presets */}
      <div className="mt-5 border-t border-cyan-900/20 pt-4">
        <div className="flex items-center space-x-1 mb-2.5">
          <Hammer className="w-3.5 h-3.5 text-cyan-700" />
          <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-wider font-semibold">
            Authorized Labs & Testbeds
          </span>
        </div>
        
        <div className="space-y-2">
          {PRESET_LABS.map((lab) => {
            const IconComponent = lab.icon;
            return (
              <button
                key={lab.name}
                type="button"
                disabled={isScanning}
                onClick={() => selectPreset(lab)}
                className={`w-full text-left p-2 border rounded-lg transition-all flex items-start space-x-2.5 ${lab.color} disabled:opacity-40`}
              >
                <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-tight text-white">{lab.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#02040a]/60 border border-cyan-900/80 rounded uppercase text-cyan-400 font-semibold">
                      {lab.target}
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-800 font-sans tracking-tight leading-3.5 mt-0.5">
                    {lab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
