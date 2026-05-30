/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Shield, HelpCircle, Code, Lock, Server, AlertOctagon } from 'lucide-react';

export default function EducationHub() {
  const [activeTab, setActiveTab] = useState<'syn' | 'vulnerabilities' | 'disclaimer'>('syn');

  return (
    <div className="bg-[#0a0f1d] border border-cyan-900/40 rounded-xl p-5 shadow-xl">
      <div className="flex items-center space-x-2.5 border-b border-cyan-900/20 pb-3 mb-4">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-mono tracking-wider font-semibold text-white uppercase">
          CYBERSECURITY RESOURCE LAB
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 border-b border-cyan-900/20 pb-2 mb-4">
        {[
          { id: 'syn', label: 'SYN Handshakes' },
          { id: 'vulnerabilities', label: 'Fingerprint Theory' },
          { id: 'disclaimer', label: 'Legal & Ethics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 font-mono text-[10px] tracking-wider rounded uppercase transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-bold'
                : 'text-cyan-800 hover:text-cyan-400 hover:bg-[#02040a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="text-xs text-cyan-100 leading-relaxed space-y-3 font-mono">
        {activeTab === 'syn' && (
          <div className="space-y-3">
            <div className="flex items-start space-x-2 bg-[#02040a] p-2.5 rounded border border-cyan-900/40">
              <Code className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">TCP SYN-Scan Mechanism:</span>
                <p className="text-[11px] text-cyan-700 mt-0.5 leading-relaxed">
                  Often called "Half-Open Scanning". The client transmits a packet with the SYN flag enabled. If the port is open, the target replies with SYN-ACK. Instead of completing the 3-way handshake with an ACK, the scanner terminates the query with a RST (Reset) packet. This limits resource usage and logging footprint on legacy systems.
                </p>
              </div>
            </div>

            <div className="border border-cyan-900/30 bg-[#02040a] p-3 rounded text-[10px] space-y-2">
              <span className="text-white font-bold block">The 3-Way Handshake Protocol:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-cyan-800 font-bold">
                <div className="p-1 bg-[#05070f] border border-cyan-900/20 rounded">
                  <div className="text-cyan-400">1. Client</div>
                  <div className="text-[9px] mt-0.5">&gt;&gt; SYN &gt;&gt;</div>
                </div>
                <div className="p-1 bg-[#05070f] border border-cyan-900/20 rounded">
                  <div className="text-emerald-400">2. Server</div>
                  <div className="text-[9px] mt-0.5">&lt;&lt; SYN-ACK &lt;&lt;</div>
                </div>
                <div className="p-1 bg-[#05070f] border border-cyan-900/20 rounded">
                  <div className="text-cyan-400">3. Client</div>
                  <div className="text-[9px] mt-0.5">&gt;&gt; RST &gt;&gt;</div>
                </div>
              </div>
              <p className="text-cyan-800 text-[10px] leading-relaxed">
                By sending Rest (RST) instead of ACK, the connection scanner prevents host systems from establishing active sockets, rendering it fast and distinct.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-3">
            <div className="flex items-start space-x-2 bg-[#02040a] p-2.5 rounded border border-cyan-900/40">
              <Server className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block">What is Banner Grabbing?</span>
                <p className="text-[11px] text-cyan-705 mt-0.5 leading-relaxed">
                  When a port is discovered open, the scanner connects to read the raw initial string (the "banner") transmitted by the application (e.g. Apache version, SSH, vSFTPD). Attackers and auditing analysts use these banners to search active CVE databases for outdated software vulnerability footprints.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-cyan-500 bg-[#02040a] p-2.5 rounded text-[10px] space-y-1">
              <span className="font-bold text-white block">Defense Recommendations:</span>
              <p className="text-cyan-700">&bull; <strong className="text-cyan-400">Mask Banners:</strong> Disable version numbers in webserver config headers (e.g. ServerTokens ProductOnly).</p>
              <p className="text-cyan-700">&bull; <strong className="text-cyan-400">Enforce Key Auth:</strong> Replace password authentication with SSH private-keys on port 22.</p>
              <p className="text-cyan-700">&bull; <strong className="text-cyan-400">Restrict DB Exposure:</strong> Bind relational databases like standard PostgreSQL/Postgres to loopback interfaces (localhost, 127.0.0.1) instead of public IP subnets.</p>
            </div>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-3">
            <div className="flex items-start space-x-2 bg-rose-950/20 p-3 rounded border border-rose-500/20 text-rose-300">
              <AlertOctagon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-extrabold block text-rose-400">CYBER ETHICS MANDATORY DISCLOSURE:</span>
                <p className="text-[11px] leading-relaxed mt-1 text-cyan-700">
                  Port scanning without permission constitutes unlawful unauthorized reconnaissance globally under policies like the Computer Fraud and Abuse Act (CFAA) in the USA or similar directives worldwide. 
                </p>
                <p className="text-[11px] leading-relaxed mt-2 text-cyan-700">
                  This platform (PortScannerX) is custom-engineered purely as an isolated cybersecurity education lab tool. Always analyze within authorized subnets or sandbox environments.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
