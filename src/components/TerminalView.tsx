/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Copy, Search, ShieldCheck, RefreshCw, EyeOff } from 'lucide-react';
import { TerminalLogEntry } from '../types';

interface TerminalViewProps {
  logs: TerminalLogEntry[];
  isScanning: boolean;
  onClear: () => void;
}

export default function TerminalView({ logs, isScanning, onClear }: TerminalViewProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error' | 'debug'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Copy logs as plain markdown/text
  const handleCopyLogs = () => {
    const rawText = logs
      .map((l) => `[${l.timestamp.split('T')[1].substring(0, 8)}] [${l.type.toUpperCase()}] ${l.message}`)
      .join('\n');
    navigator.clipboard.writeText(rawText);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col bg-[#03050b] border border-cyan-900/50 rounded-xl overflow-hidden shadow-2xl h-[420px]">
      {/* terminal heading bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0f1d] border-b border-cyan-900/40">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-semibold tracking-wider text-slate-200">
            SECURE SHELL LOGGER &bull; PORT PROBE SESSION
          </span>
          {isScanning && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyLogs}
            className="p-1 text-cyan-800 hover:text-cyan-400 rounded transition-colors"
            title="Copy Session Stream"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClear}
            className="p-1 text-cyan-800 hover:text-rose-400 rounded transition-colors"
            title="Reset Terminal Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* filter panel */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#05070f] border-b border-cyan-900/30">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 scrollbar-none">
          {(['all', 'info', 'success', 'warning', 'error', 'debug'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2 py-0.5 text-[10px] font-mono rounded tracking-wider uppercase transition-colors ${
                filter === t
                  ? 'bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 font-bold'
                  : 'bg-[#02040a] hover:bg-slate-900 border border-cyan-900/40 text-cyan-800 hover:text-cyan-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative flex items-center w-full sm:w-44">
          <Search className="absolute left-2 w-3 h-3 text-cyan-805 pointer-events-none" />
          <input
            type="text"
            placeholder="Grep messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-7 pr-2 py-0.5 bg-[#02040a] text-cyan-100 placeholder-cyan-900/60 rounded border border-cyan-900/40 text-[10px] font-mono focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* scroll container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-5 space-y-1.5 scrollbar-thin scrollbar-thumb-cyan-950 scrollbar-track-[#03050b]"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
            <EyeOff className="w-8 h-8 opacity-30 mb-2 text-cyan-800" />
            <span>[SESSION_STREAM_EMPTY]</span>
            <span className="text-[10px] text-cyan-800 mt-1">Ready for input target scan initiation.</span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const timeStr = log.timestamp ? log.timestamp.split('T')[1]?.substring(0, 8) || '00:00:00' : '00:00:00';
            
            // compute type color styles
            let typeColor = 'text-cyan-405';
            let msgColor = 'text-cyan-100';
            if (log.type === 'success') {
              typeColor = 'text-emerald-450 glow-text-emerald font-bold';
              msgColor = 'text-emerald-300';
            } else if (log.type === 'warning') {
              typeColor = 'text-amber-450 font-bold';
              msgColor = 'text-amber-200';
            } else if (log.type === 'error') {
              typeColor = 'text-rose-450 font-bold';
              msgColor = 'text-rose-250';
            } else if (log.type === 'debug') {
              typeColor = 'text-cyan-600';
              msgColor = 'text-cyan-800';
            }

            return (
              <div key={log.id} className="hover:bg-cyan-950/20 px-1 py-0.5 rounded transition-colors flex items-start space-x-2">
                <span className="text-cyan-900 flex-shrink-0">[{timeStr}]</span>
                <span className={`font-semibold flex-shrink-0 ${typeColor}`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className={`break-all ${msgColor}`}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>

      {/* terminal footer statistics bar */}
      <div className="px-4 py-2 bg-[#0a0f1d] border-t border-cyan-900/40 text-[10px] font-mono text-cyan-800 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
          <span>PORT_SCAN_X SYSTEM CONTROLLERS STANDARD-MOD</span>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span>ROLL_SCRL</span>
          </label>
          <span>TOTAL_STREAM: {logs.length}</span>
        </div>
      </div>
    </div>
  );
}
