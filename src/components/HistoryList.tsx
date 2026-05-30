/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Trash2, Shield, Search, Download, RefreshCw, FileText } from 'lucide-react';
import { ScanReport } from '../types';

interface HistoryListProps {
  history: ScanReport[];
  selectedId: string | null;
  onSelectScan: (report: ScanReport) => void;
  onDeleteScan: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
}

export default function HistoryList({
  history,
  selectedId,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
}: HistoryListProps) {
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter((s) => {
    return s.target.toLowerCase().includes(search.toLowerCase()) || 
           s.riskLevel.toLowerCase().includes(search.toLowerCase()) ||
           s.scanType.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-4 shadow-xl flex flex-col h-[420px]">
      <div className="flex items-center justify-between border-b border-cyan-900/20 pb-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
            RECON HISTORIC ARCHIVES
          </h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] text-rose-400 hover:text-rose-300 transition-colors font-mono uppercase flex items-center space-x-1"
            title="Wipe audit ledger"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Purge</span>
          </button>
        )}
      </div>

      {/* Target Filtering input */}
      <div className="relative mb-3 flex-shrink-0">
        <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-cyan-700 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter target IP/Lab..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-2.5 py-1.5 bg-[#02040a] border border-cyan-900/40 text-cyan-100 placeholder-cyan-800 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
      </div>

      {/* Scans Scroll Box */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-cyan-800 font-mono text-xs flex flex-col items-center justify-center h-full">
            <History className="w-10 h-10 text-cyan-950 mb-2" />
            <span>[NO SESSION LOGS FOUND]</span>
            <span className="text-[10px] text-cyan-800 mt-1 max-w-[150px] leading-relaxed">
              No previous secure scan archives recorded.
            </span>
          </div>
        ) : (
          filteredHistory.map((report) => {
            const isSelected = selectedId === report.id;
            
            // Risk colors and indicators
            let riskBadge = 'border-emerald-500/10 text-emerald-400 bg-emerald-950/20';
            if (report.riskLevel === 'Medium') riskBadge = 'border-amber-500/10 text-amber-300 bg-amber-950/20';
            else if (report.riskLevel === 'High') riskBadge = 'border-orange-500/10 text-orange-400 bg-orange-950/20';
            else if (report.riskLevel === 'Critical') riskBadge = 'border-rose-500/10 text-rose-400 bg-rose-950/20';

            const activeDate = report.timestamp ? new Date(report.timestamp) : new Date();
            const timeStr = activeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateStr = activeDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' });

            return (
              <div
                key={report.id}
                onClick={() => onSelectScan(report)}
                className={`group relative p-2.5 border rounded-lg transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#02040a] border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                    : 'bg-transparent border-cyan-900/20 hover:border-cyan-500/30 hover:bg-[#02040a]/40'
                }`}
              >
                {/* Left meta */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-100 truncate block">
                      {report.target}
                    </span>
                    <span className="text-[8px] font-mono px-1 py-0.1 bg-[#05070f] border border-cyan-900/60 text-cyan-500 uppercase rounded">
                      {report.scanType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-700">
                    <span className="text-[9px]">
                      {dateStr} &bull; {timeStr}
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border rounded-md uppercase ${riskBadge}`}>
                    {report.riskLevel}
                  </span>
                  
                  {/* Trash delete single scan */}
                  <button
                    onClick={(e) => onDeleteScan(report.id, e)}
                    className="p-1 opacity-20 sm:scale-90 group-hover:opacity-100 hover:opacity-100 text-rose-500 hover:text-rose-400 rounded transition-opacity"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* bottom overview banner */}
      <div className="mt-3 pt-2 border-t border-cyan-900/20 text-[9px] font-mono text-cyan-800 flex items-center justify-between flex-shrink-0">
        <span>ARCHIVES: {history.length} ITEMS</span>
        <span>JSON_STORAGE ACTIVE</span>
      </div>
    </div>
  );
}
