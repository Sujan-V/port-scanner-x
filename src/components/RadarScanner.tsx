/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Activity } from 'lucide-react';

interface ThemeConfig {
  id: string;
  name: string;
  pillColor: string;
  headerText: string;
  statusBadge: string;
  cardBorder: string;
  telemetryTitle: string;
  ringBorderDash: string;
  ringBorderNormal: string;
  gridLines: string;
  radialGridColor: string;
  sweepColor: string;
  sweepGlow: string;
  glowStart: string;
  glowEnd: string;
  sweepGradStop1: string;
  sweepGradStop2: string;
  centerDotColor: string;
  blipRing: string;
  blipDot: string;
  blipText: string;
  standbyIcon: string;
}

const THEMES: Record<string, ThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    pillColor: 'bg-cyan-500',
    headerText: 'text-cyan-400',
    statusBadge: 'bg-cyan-950/80 border-cyan-800 text-cyan-400',
    cardBorder: 'border-cyan-900/30',
    telemetryTitle: 'text-cyan-400',
    ringBorderDash: 'border-cyan-500/10',
    ringBorderNormal: 'border-cyan-900/30',
    gridLines: 'bg-cyan-900/20',
    radialGridColor: 'rgba(6, 182, 212, 0.04)',
    sweepColor: '#22d3ee',
    sweepGlow: '#06b6d4',
    glowStart: '#0891b2',
    glowEnd: '#09333f',
    sweepGradStop1: '#06b6d4',
    sweepGradStop2: '#0891b2',
    centerDotColor: '#22d3ee',
    blipRing: '#22c55e',
    blipDot: '#22c55e',
    blipText: '#4ade80',
    standbyIcon: 'text-cyan-400/40',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Green',
    pillColor: 'bg-emerald-500',
    headerText: 'text-emerald-450',
    statusBadge: 'bg-emerald-950/80 border-emerald-800 text-emerald-450',
    cardBorder: 'border-emerald-900/35',
    telemetryTitle: 'text-emerald-450',
    ringBorderDash: 'border-emerald-500/10',
    ringBorderNormal: 'border-emerald-900/35',
    gridLines: 'bg-emerald-900/20',
    radialGridColor: 'rgba(16, 185, 129, 0.04)',
    sweepColor: '#3dfc58',
    sweepGlow: '#10b981',
    glowStart: '#059669',
    glowEnd: '#022c22',
    sweepGradStop1: '#10b981',
    sweepGradStop2: '#047857',
    centerDotColor: '#3dfc58',
    blipRing: '#3dfc58',
    blipDot: '#10b981',
    blipText: '#3dfc58',
    standbyIcon: 'text-emerald-450/40',
  },
  violet: {
    id: 'violet',
    name: 'Neon Violet',
    pillColor: 'bg-fuchsia-500',
    headerText: 'text-fuchsia-400',
    statusBadge: 'bg-fuchsia-950/80 border-fuchsia-800 text-fuchsia-400',
    cardBorder: 'border-fuchsia-900/30',
    telemetryTitle: 'text-fuchsia-400',
    ringBorderDash: 'border-fuchsia-500/10',
    ringBorderNormal: 'border-fuchsia-900/35',
    gridLines: 'bg-fuchsia-900/20',
    radialGridColor: 'rgba(217, 70, 239, 0.04)',
    sweepColor: '#f472b6',
    sweepGlow: '#c084fc',
    glowStart: '#8b5cf6',
    glowEnd: '#3b0764',
    sweepGradStop1: '#a855f7',
    sweepGradStop2: '#7c3aed',
    centerDotColor: '#f472b6',
    blipRing: '#f472b6',
    blipDot: '#db2777',
    blipText: '#f472b6',
    standbyIcon: 'text-fuchsia-400/40',
  },
  amber: {
    id: 'amber',
    name: 'Fallout Amber',
    pillColor: 'bg-amber-500',
    headerText: 'text-amber-400',
    statusBadge: 'bg-amber-950/80 border-amber-800 text-amber-400',
    cardBorder: 'border-amber-900/35',
    telemetryTitle: 'text-amber-400',
    ringBorderDash: 'border-amber-500/10',
    ringBorderNormal: 'border-amber-900/35',
    gridLines: 'bg-amber-900/20',
    radialGridColor: 'rgba(245, 158, 11, 0.04)',
    sweepColor: '#fbbf24',
    sweepGlow: '#d97706',
    glowStart: '#b45309',
    glowEnd: '#451a03',
    sweepGradStop1: '#f59e0b',
    sweepGradStop2: '#b45309',
    centerDotColor: '#fbbf24',
    blipRing: '#fbbf24',
    blipDot: '#d97706',
    blipText: '#fbbf24',
    standbyIcon: 'text-amber-400/40',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Threat',
    pillColor: 'bg-rose-500',
    headerText: 'text-rose-450',
    statusBadge: 'bg-rose-950/85 border-rose-800 text-rose-400',
    cardBorder: 'border-rose-900/35',
    telemetryTitle: 'text-rose-450',
    ringBorderDash: 'border-rose-500/10',
    ringBorderNormal: 'border-rose-900/35',
    gridLines: 'bg-rose-900/20',
    radialGridColor: 'rgba(239, 68, 68, 0.04)',
    sweepColor: '#f87171',
    sweepGlow: '#ef4444',
    glowStart: '#dc2626',
    glowEnd: '#450a0a',
    sweepGradStop1: '#ef4444',
    sweepGradStop2: '#991b1b',
    centerDotColor: '#f87171',
    blipRing: '#f87171',
    blipDot: '#dc2626',
    blipText: '#f87171',
    standbyIcon: 'text-rose-450/40',
  },
};

interface RadarScannerProps {
  isScanning: boolean;
  progress: number;
  openPortsCount: number;
  detectedPorts: number[];
  target: string;
}

export default function RadarScanner({
  isScanning,
  progress,
  openPortsCount,
  detectedPorts,
  target,
}: RadarScannerProps) {
  const [angle, setAngle] = useState(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('cyan');

  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 3) % 360);
    }, 16);

    return () => clearInterval(interval);
  }, [isScanning]);

  const theme = THEMES[selectedThemeId] || THEMES.cyan;

  // Map open ports to coordinate points for visual flare
  const getPortCoordinates = (port: number, idx: number) => {
    const radius = 25 + (port % 60); // distribute across circles
    const theta = (port * 17 + idx * 45) % 360;
    const rad = (theta * Math.PI) / 180;
    const x = 100 + radius * Math.cos(rad);
    const y = 100 + radius * Math.sin(rad);
    return { x, y };
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 bg-[#05070f] border ${theme.cardBorder} rounded-xl shadow-lg shadow-cyan-950/20 backdrop-blur-md`}>
      {/* Absolute Header Overlay */}
      <div className={`absolute top-3 left-4 flex items-center space-x-2 text-xs font-mono tracking-wider ${theme.headerText}`}>
        <Activity className={`w-3.5 h-3.5 ${isScanning ? 'animate-pulse' : ''}`} />
        <span>RECON_RADAR_MAP_v2</span>
      </div>

      <div className="absolute top-3 right-4">
        <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${theme.statusBadge}`}>
          {isScanning ? 'PROBE_ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Outer Glow Shield Frame */}
      <div className="relative w-72 h-72 flex items-center justify-center mt-4">
        {/* Radar Rings Container */}
        <div className={`absolute inset-0 border-2 border-dashed ${theme.ringBorderDash} rounded-full animate-[spin_120s_linear_infinite]`} />
        <div className={`absolute w-[85%] h-[85%] border ${theme.ringBorderNormal} rounded-full`} />
        <div className={`absolute w-[60%] h-[60%] border ${theme.ringBorderNormal} rounded-full`} />
        <div className={`absolute w-[35%] h-[35%] border ${theme.ringBorderNormal} opacity-40 rounded-full`} />
        
        {/* XY Grid Overlay */}
        <div className={`absolute top-0 bottom-0 left-1/2 w-[1px] ${theme.gridLines}`} />
        <div className={`absolute left-0 right-0 top-1/2 h-[1px] ${theme.gridLines}`} />

        {/* The SVG sweeping and markers */}
        <svg className="w-full h-full relative" viewBox="0 0 200 200">
          {/* Radial Angle Markers */}
          <line x1="100" y1="100" x2="170" y2="30" stroke={theme.radialGridColor} strokeWidth="1" />
          <line x1="100" y1="100" x2="30" y2="30" stroke={theme.radialGridColor} strokeWidth="1" />
          <line x1="100" y1="100" x2="30" y2="170" stroke={theme.radialGridColor} strokeWidth="1" />
          <line x1="100" y1="100" x2="170" y2="170" stroke={theme.radialGridColor} strokeWidth="1" />

          {/* Sweep Beam */}
          {isScanning && (
            <g transform={`rotate(${angle} 100 100)`}>
              {/* Main Sweep Line */}
              <line 
                x1="100" 
                y1="100" 
                x2="100" 
                y2="10" 
                stroke={theme.sweepColor} 
                strokeWidth="1.5" 
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0px 0px 4px ${theme.sweepGlow})` }}
              />
              {/* Fade out tail - polygon */}
              <path
                d="M100,100 L100,10 A90,90 0 0,1 155,42 Z"
                fill={`url(#radarSweepGrad-${theme.id})`}
                opacity="0.35"
              />
            </g>
          )}

          {/* Gradients */}
          <defs>
            <radialGradient id={`centerGlow-${theme.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme.glowStart} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.glowEnd} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`radarSweepGrad-${theme.id}`} x1="1" y1="0.1" x2="0.5" y2="0.6">
              <stop offset="0%" stopColor={theme.sweepGradStop1} stopOpacity="0.8" />
              <stop offset="40%" stopColor={theme.sweepGradStop2} stopOpacity="0.3" />
              <stop offset="100%" stopColor={theme.sweepGradStop1} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Center visual hub */}
          <circle cx="100" cy="100" r="90" fill={`url(#centerGlow-${theme.id})`} />
          <circle cx="100" cy="100" r="3" fill={theme.centerDotColor} className="animate-pulse" />

          {/* Discovered open ports blips */}
          {detectedPorts.map((port, idx) => {
            const { x, y } = getPortCoordinates(port, idx);
            return (
              <g key={`port-blip-${port}`}>
                {/* Ping rings */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r="6" 
                  fill="none" 
                  stroke={theme.blipRing} 
                  strokeWidth="0.75" 
                  className="animate-ping" 
                  opacity="0.6" 
                  style={{ animationDuration: '2.5s' }} 
                />
                {/* Central open port blip */}
                <circle cx={x} cy={y} r="3" fill={theme.blipDot} />
                <text 
                  x={x + 5} 
                  y={y + 3} 
                  fill={theme.blipText} 
                  fontSize="5" 
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  :{port}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Display details in center if standby */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none w-full h-full">
            <Shield className={`w-10 h-10 ${theme.standbyIcon} mb-2`} />
            <span className={`text-xs font-mono opacity-80 uppercase ${theme.headerText}`}>System Ready</span>
            {target && (
              <span className={`text-[10px] font-mono opacity-50 truncate max-w-[125px] mt-1 ${theme.headerText}`}>
                {target}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mini telemetry stats underneath */}
      <div className={`w-full mt-5 grid grid-cols-3 gap-2 border-t ${theme.cardBorder} pt-4 font-mono text-center`}>
        <div>
          <div className="text-[10px] text-slate-500">SWEEP</div>
          <div className={`text-sm font-semibold ${theme.telemetryTitle}`}>
            {isScanning ? `${progress}%` : progress === 100 ? '100%' : '0%'}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">LSTN</div>
          <div className="text-sm font-semibold text-emerald-450">
            {openPortsCount}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500">THREATS</div>
          <div className="text-sm font-semibold text-rose-500">
            {detectedPorts.filter(p => [21, 23, 6379, 27017].includes(p)).length}
          </div>
        </div>
      </div>

      {/* Visual Theme Selector Toolbar */}
      <div className={`w-full mt-4 pt-3 border-t ${theme.cardBorder} flex items-center justify-between`}>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">SOC Aesthetic:</span>
        <div className="flex items-center space-x-2">
          {Object.values(THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedThemeId(t.id)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all border ${
                selectedThemeId === t.id 
                  ? 'ring-2 ring-cyan-400 scale-125 border-white' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-110'
              } ${t.pillColor}`}
              title={t.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
