# PortScannerX - Enterprise Security Operations Command Deck & Port Intelligence Platform

Welcome to **PortScannerX**, an engineering-grade, highly interactive Security Operations Center (SOC) visual intelligence portal. Engineered specifically for security professionals, network administrators, and cybersecurity educators, this platform combines real-time network port reconnaissance, a live-updating monospaced console log feed, and a multi-variant local expert security threat analysis engine to simulate and evaluate target exposures.

---

## 🌟 Key Product Capabilities & Advanced Systems

### 1. High-Precision Local Port Scanning Engine
- **Flexible Scope Selection**: Run high-speed scanning across common vectors:
  - **Fast Scan**: Tests the top 15 critical internet services (SSH, FTP, HTTP, database access).
  - **Full Audit**: Scans the top 100 enterprise enterprise listener services.
  - **Custom Bounds**: Targets specific network bands (e.g., standard `1 - 1024` privileged pools).
- **Target Resolution**: Seamless host resolution from fully-qualified domain names (FQDN) or raw IPv4 ranges.
- **Probing Diagnostics**: Captures precise response round-trip-time (RTT) latencies to map network topology performance.

### 2. Multi-Aesthetic Recon Radar Sweeper
- **Tactile Color HUD Palette Selector**: Allows visual personnel to toggle between multiple customized SOC monitoring visual environments:
  - 🌐 **Cyber Cyan**: Sleek, high-contrast cloud terminal theme (Default).
  - 📟 **Matrix Green**: Retro phosphor classic green console look with 1ms tactical sweep.
  - 🌆 **Neon Violet**: Cyberpunk/Synthwave operational layout.
  - ☢️ **Fallout Amber**: Heavy high-consequence industrial alert amber shielding.
  - 🚨 **Crimson Threat**: High-urgency penetration response and zero-day triage protocol.
- **Micro-animations**: Staggered SVG ping rings and active sweep vectors calculated in 60 FPS real-time.

### 3. Local Expert Security Threat Intelligence Engine
- **True Network Containment Compliance**: Replaced external API reliance with an offline-first, high-fidelity security diagnostic architecture.
- **Zero-Latency Evaluation**: Discovers protocol flaws, insecure plaintext transmissions (FTP, Telnet), legacied DB interfaces (MySQL, Postgres), and generates real-time actionable security reports in under 1ms.
- **Dynamic Threat Profiling**: Calculates a strict Attack Surface Index (0-100 Scorecard) alongside categorical exposure matrices (Critical, High, Medium, Low status alerts).

### 4. Interactive Logging Terminal
- **Dynamic Grepping**: Search session state logs in real time using the built-in regex-ready lookup filter.
- **Telemetry Streams**: Visualizes full TCP socket lifecycles, SYN/ACK handshake responses, connection resets, and port timeout drops as they execute.
- **Auto-Scroll Locks**: Retained log position state for easy forensic inspections.

### 5. Multi-format Compliance Reporting
- **Data Collections**: Persists recent scan logs across Express JSON database backends and browser-level local storage caches.
- **Exporters**: Downloads sanitized reports into professional raw CSV formats, static JSON logs, or a high-contrast printable Security Audit Brief (PDF) with professional vector rendering.

---

## 🛠️ Technology Stack & Dependencies

- **Frontend Core**: React 19, TypeScript 5, Vite, Tailwind CSS.
- **Visual Graphics**: Framer Motion (via `motion/react` for seamless transition vectors) and Recharts (for historic threat trends and latency distribution plots).
- **Icons**: Lucide Icons exclusively.
- **Backend Services**: Node.js core, Express.js.
- **Compiler Pipeline**: Esbuild for server bundlings, Vite static files compilation for assets deployment.

---

## 📂 System Architecture Blueprint

```text
├── server.ts                 # Full-stack Node.js Express server & scan handlers
├── data/
│   └── scans.json            # Dynamic JSON flat-file storage for historical logs
├── src/
│   ├── main.tsx              # React SPA primary launch file
│   ├── App.tsx               # Primary UI layout & state orchestrator
│   ├── index.css             # Tailwind styling and typography imports
│   ├── types.ts              # Global type definitions and contract schemas
│   └── components/
│       ├── RadarScanner.tsx  # Interactive SVG radar with adjustable theme palettes
│       ├── TerminalView.tsx  # Scroll-locked monospaced log console
│       ├── ScanControl.tsx   # Scanning controls & parameters cockpit
│       ├── ThreatIntel.tsx   # Attack Surface indicators and Remediation roadmap
│       ├── ReportPanel.tsx   # PDF Brief and CSV file export triggers
│       ├── AnalyticsPanel.tsx# Recharts historical vulnerability visualizations
│       └── EducationHub.tsx  # Port Textbook and protocol cheat sheet guides
├── metadata.json             # Applet descriptor config
└── package.json              # Project scripting and external library matrix
```

---

## 🚀 Installation & Local Execution

### 1. System Requirements
Ensure that you have **Node.js LTS (v18 or higher)** installed in your terminal.

### 2. Live Setup
Clone or unpack the repository into your preferred folder, then run the installer:
```bash
# Install required npm modules
npm install
```

### 3. Running in Development Mode
To boot the full-stack system with hot rebuilding and direct Vite live middleware bindings:
```bash
# Power up development server instances (Port 3000)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Compiling and Bundling for Production
To bundle the frontend single-page-app assets and compile the Express server into a standalone, ultra-performing CommonJS module:
```bash
# Build React components & compile server.ts via esbuild
npm run build

# Start the compiled release bundle
npm run start
```

---

## ⚖️ Legal & Ethical Usage Guidelines

**Disclaimer**: PortScannerX is a dual-use software application meant exclusively for educational, instructional, administrative, and authorized auditing operations.

1. **Explicit Permission Required**: Scanning third-party remote endpoints without explicit, legal stakeholder authorization is strictly illegal and violates the Computer Fraud and Abuse Act (CFAA), the General Data Protection Regulation (GDPR), and local cybersecurity statutes worldwide.
2. **Authorized Constraints**: Always configure scans to target loopbacks (`localhost`, `127.0.0.1`) or personal test endpoints.
3. **Usage Liability**: The developers and distributors of PortScannerX take zero liability for improper diagnostic usage, unauthorized scanning activities, or legal repercussions arising from actions taken outside defined compliance frameworks.
