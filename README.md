# CampusFix — Frontend (Phase 4)

Web UI for the CampusFix campus maintenance reporting system, built for ICS 321 (KFUPM, Spring 252).

This is a **React + Vite** single-page application that mirrors the SQL schema from Phase 3. It currently runs against a **mock API** so the UI is fully usable without a database — the swap to a real Postgres backend is a one-file change per resource (see *Connecting a real backend* below).

---

## Running the project

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`). The dev server hot-reloads on save.

To produce a production build:

```bash
npm run build
npm run preview
```

---

## Folder structure

```
src/
├── api/            ← All data access lives here. Each file targets one entity.
│   ├── seedData.js       ← Mirrors 02_insert_data.sql exactly.
│   ├── reportsApi.js     ← list / getById / create
│   ├── analyticsApi.js   ← Equivalents of verification queries Q3, Q4, Q5, Q8, Q9, Q11, Q12
│   ├── facilitiesApi.js
│   ├── usersApi.js
│   ├── lookupsApi.js     ← Status, priority, category, unit, facility-type lookups
│   └── client.js         ← delay() + ok() helpers used by every mock call
│
├── components/     ← One folder per concern; one file per component.
│   ├── layout/     ← AppLayout, Sidebar, PageHeader
│   ├── ui/         ← Button, Card, Badge, PriorityBadge, StatusBadge, Field, Spinner, EmptyState
│   ├── dashboard/  ← StatCard, SummaryStrip, UrgentQueue, SlaBreaches, StatusBreakdown,
│   │               TopFacilities, ResolutionVsSla
│   ├── reports/    ← ReportsTable, ReportFilters, ReportSummary, StatusTimeline,
│   │               AssignmentPanel, NewReportForm
│   └── staff/      ← StaffWorkloadTable
│
├── pages/          ← One per route. Pages own data-fetching; components are pure.
│   ├── DashboardPage.jsx
│   ├── ReportsPage.jsx
│   ├── ReportDetailPage.jsx
│   ├── NewReportPage.jsx
│   └── StaffPage.jsx
│
├── hooks/useAsync.js   ← Tiny fetch hook → { data, loading, error, refetch }
├── utils/format.js     ← Date, time-ago, hours, role formatting
├── styles/             ← theme.css (design tokens) + globals.css (resets, helpers)
├── App.jsx             ← Routes
└── main.jsx            ← Entry point
```

### Routes

| Path | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Summary stats + urgent queue + analytics charts |
| `/reports` | All Reports | Filterable table of every report |
| `/reports/new` | New Report | Submission form |
| `/reports/:id` | Report Detail | Summary, status history, assignments |
| `/staff` | Staff Workload | Open vs completed per maintenance staff |

---

## Architectural choices

**Single responsibility per component.** Pages compose; components render. Pages own `useAsync` calls and pass plain props down. No component fetches data directly except where it owns its own dropdown options (e.g. `NewReportForm`).

**Mock API mirrors the real shape.** Every function in `src/api/*.js` returns a Promise. Field names match the SQL schema exactly (`report_id`, `submitted_at`, `priority_id`, etc.) so when a real backend is wired in, components don't change.

**CSS variables for theming.** All brand colors and sizing live in `src/styles/theme.css`. Tweaking the palette is a single-file change. Brand colors come from the project spec: `#2FA084`, `#EEEEEE`, `#FFD93D`.

**Typography.** Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono. Loaded from Google Fonts via `index.html`. Aligns with KFUPM's restrained academic identity without copying it.

**Pure-CSS bar charts.** No charting library. The bar charts on the dashboard and the staff load indicator are flexbox + width %. Keeps the bundle small and the styles consistent with everything else.

---

## Connecting a real backend

When the Postgres/pgAdmin instance is ready, only `src/api/*.js` needs to change. Replace each `ok(...)` return with a `fetch()` call against the corresponding endpoint and parse the JSON. The component tree and pages stay untouched.

For example, `reportsApi.list()` becomes:

```js
list: async () => {
  const res = await fetch('/api/reports');
  if (!res.ok) throw new Error('Failed to load reports');
  return res.json();
}
```

The expected JSON shape for each endpoint is whatever the existing mock returns. `expandReport()` in `reportsApi.js` shows the join shape the UI expects (priority, status, category, facility, submitter all expanded inline). The backend can either return that shape directly via SQL joins, or return raw rows and let the API layer expand them — both are fine because this layer is the only place that needs to know.

---

## Notes

- Submitting a new report mutates the in-memory mock store, so it persists across navigation but resets on reload. This is intentional for the demo phase.
- Analytics calculations match the SQL verification queries 1-to-1; cross-checking the dashboard against `03_verify_queries.sql` should produce identical numbers.
- All status, priority, category, and facility data comes from the same seed file, so the lookups dropdowns and the joined display values can never go out of sync.
