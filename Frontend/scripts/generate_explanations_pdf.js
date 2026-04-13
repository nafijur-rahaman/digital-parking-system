import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'docs');
const outputFile = path.join(outputDir, 'src-codebase-explained.pdf');

const sections = [
  {
    file: 'src/main.jsx',
    points: [
      '1) High-level overview: Bootstraps the React app, mounts to #root, and applies strict mode plus router providers.',
      '2) Line-by-line: Imports React, router, CSS, and AppRoutes, then renders wrapper hierarchy using createRoot().',
      '3) Concepts: Entry point, provider pattern, StrictMode checks, and client-side routing.',
      '4) Flow: Browser loads bundle -> root mounted -> router context available -> AppRoutes chooses page.',
      '5) Dependencies: react, react-dom/client, react-router-dom, index.css, AppRoutes.',
      '6) Real-world: This is the app startup switch and navigation bootstrap.',
      '7) Interview: Main entry initializes React 18 root and top-level routing wrappers.',
      '8) Visual: root -> StrictMode -> BrowserRouter -> AppRoutes.',
    ],
  },
  {
    file: 'src/AppRoutes.jsx',
    points: [
      '1) Overview: Central route and access-control logic based on authentication and role.',
      '2) Line-by-line: Defines RoleContext, ProtectedRoutes, role-conditional route sets, and AuthProvider wrapping.',
      '3) Concepts: Protected routes, context API, conditional rendering, fallback redirects.',
      '4) Flow: Read user -> if none show login -> else render dashboard layout and allowed routes.',
      '5) Dependencies: AuthContext, DashboardLayout, LoginPage, LiveMapPage, AnalyticsPage, SuperAdminDashboard.',
      '6) Real-world: Reception desk checks identity and role before granting area access.',
      '7) Interview: Auth-gated routing with role-specific route trees and safety redirects.',
      '8) Visual: AuthProvider -> ProtectedRoutes -> role branch -> route match.',
    ],
  },
  {
    file: 'src/context/AuthContext.jsx',
    points: [
      '1) Overview: Holds login session state and exposes login/logout through context.',
      '2) Line-by-line: Defines mock USERS, creates context, provider state, login matcher, logout reset, and useAuth hook.',
      '3) Concepts: Context provider, custom hook, in-memory auth, state management.',
      '4) Flow: UI submits credentials -> login checks USERS -> setUser on success -> components react to context.',
      '5) Dependencies: React hooks only; consumed by routes and login/header components.',
      '6) Real-world: Shared sign-in register for who is currently authenticated.',
      '7) Interview: Lightweight client auth provider with mock credentials and reusable useAuth accessor.',
      '8) Visual: login() -> setUser -> provider value -> app-wide access.',
    ],
  },
  {
    file: 'src/index.css',
    points: [
      '1) Overview: Global styling theme and utility classes for glass/neon dashboard look.',
      '2) Line-by-line: Imports Tailwind, defines root CSS tokens, body defaults, and custom utility classes.',
      '3) Concepts: CSS variables, Tailwind layers, reusable utility classes, backdrop blur.',
      '4) Flow: Styles load at app start -> variables resolve -> classes used by components.',
      '5) Dependencies: Tailwind and component class usage.',
      '6) Real-world: Design system guideline for consistent app appearance.',
      '7) Interview: Theme tokens plus utility layer to standardize visual language.',
      '8) Visual: :root tokens -> body baseline -> utility classes consumed everywhere.',
    ],
  },
  {
    file: 'src/data/dashboardData.js',
    points: [
      '1) Overview: Static fixture data for stats, tabs, slots, and entry logs.',
      '2) Line-by-line: Exports named arrays with dashboard-friendly object structures.',
      '3) Concepts: Named exports, mock fixtures, array-of-objects UI contracts.',
      '4) Flow: Component imports data -> maps to cards/lists -> renders UI.',
      '5) Dependencies: None; consumed by pages/components.',
      '6) Real-world: Demo dataset before backend is connected.',
      '7) Interview: Decouples UI development from API readiness with deterministic fixtures.',
      '8) Visual: data module -> imported props -> rendered widgets.',
    ],
  },
  {
    file: 'src/components/UniParkDashboard.jsx',
    points: [
      '1) Overview: Thin wrapper that currently returns LiveMapPage.',
      '2) Line-by-line: Import page, define component, return child, export.',
      '3) Concepts: Component composition, semantic abstraction.',
      '4) Flow: Render wrapper -> delegates directly to LiveMapPage.',
      '5) Dependencies: LiveMapPage.',
      '6) Real-world: Alias entry point that can gain logic later.',
      '7) Interview: Intent-preserving wrapper used for future flexibility.',
      '8) Visual: UniParkDashboard -> LiveMapPage.',
    ],
  },
  {
    file: 'src/components/layout/DashboardLayout.jsx',
    points: [
      '1) Overview: Shared shell with header and centered main content.',
      '2) Line-by-line: Imports header, renders outer container, header, and children in main.',
      '3) Concepts: Layout component, children composition, semantic main tag.',
      '4) Flow: Parent passes children -> layout wraps consistent chrome.',
      '5) Dependencies: DashboardHeader and any child pages.',
      '6) Real-world: Common frame applied to all protected screens.',
      '7) Interview: Reusable layout reducing duplicated page scaffolding.',
      '8) Visual: wrapper -> header -> main(children).',
    ],
  },
  {
    file: 'src/components/layout/DashboardHeader.jsx',
    points: [
      '1) Overview: Role-aware top bar with nav links, search box, and profile dropdown.',
      '2) Line-by-line: Imports hooks/icons, computes nav classes, handles outside click, logout, and animated dropdown.',
      '3) Concepts: Context consumption, conditional rendering, event listener cleanup, animation states.',
      '4) Flow: Read role/user -> render allowed links -> toggle dropdown -> logout triggers navigate.',
      '5) Dependencies: RoleContext, useAuth, router, framer-motion, lucide icons.',
      '6) Real-world: Control bar showing only actions allowed for the current operator.',
      '7) Interview: Permission-aware header with resilient dropdown UX and animated transitions.',
      '8) Visual: left brand/search + right nav/profile menu.',
    ],
  },
  {
    file: 'src/components/stats/StatCard.jsx',
    points: [
      '1) Overview: Reusable animated metric card.',
      '2) Line-by-line: Defines color and bar maps, renders title/value and optional progress/trend/urgent button.',
      '3) Concepts: Prop-driven rendering, style maps, conditional sections, micro-animations.',
      '4) Flow: Receive props -> choose classes -> render card segments.',
      '5) Dependencies: framer-motion and global utility classes.',
      '6) Real-world: Dashboard KPI tile that adapts to metric type.',
      '7) Interview: Flexible stat component using map-based styling for maintainability.',
      '8) Visual: card shell -> value -> optional bar/button/trend.',
    ],
  },
  {
    file: 'src/components/stats/StatsGrid.jsx',
    points: [
      '1) Overview: Maps a stats array into a responsive card grid.',
      '2) Line-by-line: Imports StatCard, iterates stats with map, passes fields as props.',
      '3) Concepts: List rendering, React keys, responsive Tailwind grid.',
      '4) Flow: stats input -> map() -> StatCard instances.',
      '5) Dependencies: StatCard and parent data source.',
      '6) Real-world: Shelf organizer for metric tiles.',
      '7) Interview: Thin composition layer separating layout from card internals.',
      '8) Visual: stats[] -> grid -> cards.',
    ],
  },
  {
    file: 'src/components/map/ParkingSlot.jsx',
    points: [
      '1) Overview: Single parking slot tile rendered by status.',
      '2) Line-by-line: Status style map, animated container, status-specific icon/text, optional member badge.',
      '3) Concepts: Status-driven UI, conditional branches, layout-stability placeholder, motion hover.',
      '4) Flow: slot props -> class lookup -> branch render for vacant/occupied/violation.',
      '5) Dependencies: framer-motion, lucide icons, parent slot list.',
      '6) Real-world: One digital parking bay indicator.',
      '7) Interview: Reusable slot component converting operational state into visual affordance.',
      '8) Visual: status -> style/icon -> memberId badge.',
    ],
  },
  {
    file: 'src/components/map/ParkingMapPanel.jsx',
    points: [
      '1) Overview: Main map panel with lot tabs, sensor banner, and slots grid.',
      '2) Line-by-line: Tracks active tab, renders tab controls, sensor event line, legend, and ParkingSlot list.',
      '3) Concepts: Local UI state, list mapping, animated indicators, optional chaining safety.',
      '4) Flow: receive tabs/slots/event -> render controls -> map slots to components.',
      '5) Dependencies: ParkingSlot, framer-motion, lucide.',
      '6) Real-world: Control-room matrix view of current parking occupancy.',
      '7) Interview: Stateful map container with visual telemetry and slot composition.',
      '8) Visual: tabs + sensor status + slot matrix.',
    ],
  },
  {
    file: 'src/pages/LoginPage.jsx',
    points: [
      '1) Overview: Authentication page with polished UX.',
      '2) Line-by-line: Input states, submit handler, async loading simulation, login result handling, error rendering.',
      '3) Concepts: Controlled form, async submit flow, conditional UI, route navigation.',
      '4) Flow: user input -> handleSubmit -> login() -> success navigate or error message.',
      '5) Dependencies: useAuth, useNavigate, framer-motion, lucide.',
      '6) Real-world: Secure front desk for staff/admin entry.',
      '7) Interview: Role-aware login screen with feedback states and animated interactions.',
      '8) Visual: form -> validate/auth -> loading/error -> redirect.',
    ],
  },
  {
    file: 'src/pages/LiveMapPage.jsx',
    points: [
      '1) Overview: Operational page orchestrating live entries, slot allocation, and sensor feed.',
      '2) Line-by-line: Seeds slots, stores entries/slots/event state, defines vehicle entry and exit handlers.',
      '3) Concepts: State orchestration, immutable updates, derived data, callback delegation.',
      '4) Flow: event from panel -> update slots/logs/event message -> rerender map and logs.',
      '5) Dependencies: StatsGrid, ParkingMapPanel, EntryLogPanel, dashboardData fixtures.',
      '6) Real-world: Dispatch console that allocates and frees spaces in real time.',
      '7) Interview: Container page owning core business interactions for terminal operations.',
      '8) Visual: child panels consume page state and callbacks.',
    ],
  },
  {
    file: 'src/pages/AnalyticsPage.jsx',
    points: [
      '1) Overview: Placeholder analytics screen.',
      '2) Line-by-line: Static section with heading and future-note text.',
      '3) Concepts: Route scaffolding.',
      '4) Flow: route match -> static render.',
      '5) Dependencies: none.',
      '6) Real-world: Reserved area for future charts and reports.',
      '7) Interview: Minimal stub to validate navigation while feature is pending.',
      '8) Visual: simple card with title and placeholder copy.',
    ],
  },
  {
    file: 'src/pages/EnforcementPage.jsx',
    points: [
      '1) Overview: Placeholder enforcement screen.',
      '2) Line-by-line: Static section with heading and pending feature message.',
      '3) Concepts: Incremental delivery via stubs.',
      '4) Flow: render placeholder if routed.',
      '5) Dependencies: none.',
      '6) Real-world: Planned permit/violation operations workspace.',
      '7) Interview: Scaffold page prepared for future enforcement workflows.',
      '8) Visual: heading + descriptive placeholder.',
    ],
  },
  {
    file: 'src/pages/SuperAdminDashboard.jsx',
    points: [
      '1) Overview: Superadmin control center with overview, staff, and slot tabs.',
      '2) Line-by-line: Local states for tabs/forms/lists, create handlers, animated tab content and forms.',
      '3) Concepts: Tab state machine, controlled forms, local list mutation, animated presence.',
      '4) Flow: choose tab -> submit form -> append item -> immediate UI update.',
      '5) Dependencies: framer-motion, lucide icons, NavLink.',
      '6) Real-world: Admin cockpit for provisioning staff and parking resources.',
      '7) Interview: Role-specific admin module with modular, animated management panes.',
      '8) Visual: sidebar tools + main panel by active tab.',
    ],
  },
  {
    file: 'src/components/logs/EntryLogPanel.jsx',
    points: [
      '1) Overview: Gate terminal panel with entry, exit, and logs tabs.',
      '2) Line-by-line: Validates IDs, generates OTP for entry, verifies OTP for exit, renders activity log list.',
      '3) Concepts: Form validation, tabbed workflows, callback-to-parent state updates, animated tab transitions.',
      '4) Flow: operator input -> validate -> invoke parent callbacks -> reflect updated records.',
      '5) Dependencies: LogEntry, framer-motion, lucide, parent props from LiveMapPage.',
      '6) Real-world: Security desk for granting entry and processing guarded exits.',
      '7) Interview: Workflow component implementing OTP-controlled exit logic and audit visibility.',
      '8) Visual: segmented control -> forms/logs -> callback dispatch.',
    ],
  },
  {
    file: 'src/components/logs/LogEntry.jsx',
    points: [
      '1) Overview: Single activity row renderer.',
      '2) Line-by-line: Displays plate/model/gate/time and status badge with flagged highlighting.',
      '3) Concepts: Presentational component and conditional styling.',
      '4) Flow: entry props -> style branch -> row output.',
      '5) Dependencies: none.',
      '6) Real-world: One record in the gate activity feed.',
      '7) Interview: Simple reusable log row with alert-state visual treatment.',
      '8) Visual: metadata block + status badge.',
    ],
  },
];

function wrapText(line, maxChars) {
  const words = line.split(' ');
  const out = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) out.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) out.push(current);
  return out;
}

function escapePdfText(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildLines() {
  const lines = [];
  lines.push('Digital Parking System: Frontend src Explanation Pack');
  lines.push('Generated by Cursor assistant');
  lines.push('');
  lines.push('This PDF compiles the full walkthrough you requested for each src file.');
  lines.push('');

  sections.forEach((section, index) => {
    lines.push(`File ${index + 1}: ${section.file}`);
    lines.push('------------------------------------------------------------');
    for (const point of section.points) {
      for (const wrapped of wrapText(point, 95)) lines.push(wrapped);
    }
    lines.push('');
  });
  return lines;
}

function createSimplePdf(lines) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;
  const lineHeight = 14;
  const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const pages = [];
  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage));
  }

  const objects = [];
  const contentObjectIds = [];
  const pageObjectIds = [];
  const fontObjId = 3;

  // 1 Catalog, 2 Pages, 3 Font
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = ''; // filled later
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  let nextId = 4;

  pages.forEach((pageLines) => {
    const contentId = nextId++;
    const pageId = nextId++;
    contentObjectIds.push(contentId);
    pageObjectIds.push(pageId);

    const commands = ['BT', '/F1 10 Tf'];
    let y = pageHeight - margin;
    for (const raw of pageLines) {
      const text = escapePdfText(raw);
      commands.push(`1 0 0 1 ${margin} ${y} Tm (${text}) Tj`);
      y -= lineHeight;
    }
    commands.push('ET');
    const stream = commands.join('\n');
    objects[contentId] = `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      `/Resources << /Font << /F1 ${fontObjId} 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  objects[2] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] >>`;

  let pdf = '%PDF-1.4\n';
  const xref = [0];
  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue;
    xref[i] = Buffer.byteLength(pdf, 'utf8');
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  const size = objects.length;
  pdf += `xref\n0 ${size}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < size; i++) {
    const offset = (xref[i] || 0).toString().padStart(10, '0');
    pdf += `${offset} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const lines = buildLines();
const pdfData = createSimplePdf(lines);
fs.writeFileSync(outputFile, pdfData, 'binary');
console.log(`PDF generated: ${outputFile}`);
