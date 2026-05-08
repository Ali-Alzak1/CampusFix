import { ok } from './client.js';
import {
  reports,
  users,
  facilities,
  facility_types,
  issue_categories,
  priority_levels,
  report_statuses,
  assignments,
  maintenance_units
} from './seedData.js';

const HOUR_MS = 60 * 60 * 1000;

/** Q9: report counts grouped by current status, in lifecycle order. */
function reportsByStatus() {
  return [...report_statuses]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({
      status_id: s.status_id,
      status_name: s.status_name,
      count: reports.filter((r) => r.status_id === s.status_id).length
    }));
}

/** Q3: facilities ranked by total report count. */
function reportsByFacility(limit = 6) {
  return facilities
    .map((f) => {
      const ft = facility_types.find((t) => t.type_id === f.type_id);
      return {
        facility_id: f.facility_id,
        name: f.name,
        building_name: f.building_name,
        type_name: ft?.type_name ?? null,
        total_reports: reports.filter((r) => r.facility_id === f.facility_id).length
      };
    })
    .sort((a, b) => b.total_reports - a.total_reports || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** Q4: most frequent issue categories, with default unit and priority. */
function reportsByCategory() {
  return issue_categories
    .map((c) => {
      const unit = maintenance_units.find((u) => u.unit_id === c.default_unit_id);
      const pri  = priority_levels.find((p) => p.priority_id === c.default_priority_id);
      return {
        category_id: c.category_id,
        category_name: c.category_name,
        responsible_unit: unit?.unit_name ?? null,
        default_priority: pri?.level_name ?? null,
        total_reports: reports.filter((r) => r.category_id === c.category_id).length
      };
    })
    .sort((a, b) => b.total_reports - a.total_reports);
}

/** Q12: open critical/high reports, urgent queue. */
function urgentQueue() {
  return reports
    .filter((r) => !r.resolved_at)
    .map((r) => {
      const p = priority_levels.find((pl) => pl.priority_id === r.priority_id);
      return { r, p };
    })
    .filter(({ p }) => p && p.rank <= 2)
    .sort(
      (a, b) =>
        a.p.rank - b.p.rank ||
        new Date(a.r.submitted_at) - new Date(b.r.submitted_at)
    )
    .map(({ r, p }) => {
      const u = users.find((x) => x.user_id === r.user_id);
      const f = facilities.find((x) => x.facility_id === r.facility_id);
      const s = report_statuses.find((x) => x.status_id === r.status_id);
      return {
        report_id: r.report_id,
        title: r.title,
        priority: p.level_name,
        rank: p.rank,
        submitter: u?.name ?? null,
        facility: f?.name ?? null,
        status: s?.status_name ?? null,
        submitted_at: r.submitted_at
      };
    });
}

/** Q5: open reports past their SLA. */
function slaBreaches() {
  const now = Date.now();
  return reports
    .filter((r) => !r.resolved_at)
    .map((r) => {
      const p = priority_levels.find((pl) => pl.priority_id === r.priority_id);
      const f = facilities.find((x) => x.facility_id === r.facility_id);
      const u = users.find((x) => x.user_id === r.user_id);
      const s = report_statuses.find((x) => x.status_id === r.status_id);
      const hoursOpen = (now - new Date(r.submitted_at).getTime()) / HOUR_MS;
      return {
        report_id: r.report_id,
        title: r.title,
        priority: p?.level_name,
        sla_hours: p?.sla_hours,
        hours_open: Math.round(hoursOpen),
        breached: hoursOpen > (p?.sla_hours ?? 0),
        facility: f?.name ?? null,
        submitter: u?.name ?? null,
        status: s?.status_name ?? null,
        submitted_at: r.submitted_at
      };
    })
    .filter((row) => row.breached)
    .sort((a, b) => b.hours_open - a.hours_open);
}

/** Q11: avg resolution time vs SLA per priority. */
function resolutionVsSla() {
  return [...priority_levels]
    .sort((a, b) => a.rank - b.rank)
    .map((p) => {
      const resolved = reports.filter(
        (r) => r.priority_id === p.priority_id && r.resolved_at
      );
      const avg =
        resolved.length === 0
          ? null
          : resolved.reduce(
              (sum, r) =>
                sum +
                (new Date(r.resolved_at) - new Date(r.submitted_at)) / HOUR_MS,
              0
            ) / resolved.length;
      return {
        priority_id: p.priority_id,
        level_name: p.level_name,
        sla_hours: p.sla_hours,
        resolved_reports: resolved.length,
        avg_resolution_hours: avg === null ? null : Math.round(avg * 10) / 10
      };
    });
}

/** Q8: workload per maintenance staff member. */
function staffWorkload() {
  return users
    .filter((u) => u.role === 'maintenance_staff')
    .map((u) => {
      const unit = maintenance_units.find((m) => m.unit_id === u.unit_id);
      const my = assignments.filter((a) => a.staff_id === u.user_id);
      return {
        user_id: u.user_id,
        name: u.name,
        email: u.email,
        unit_name: unit?.unit_name ?? null,
        open: my.filter((a) => !a.completed_at).length,
        completed: my.filter((a) => a.completed_at).length,
        total: my.length
      };
    })
    .sort((a, b) => b.total - a.total);
}

/** Topline counters used by dashboard hero. */
function summary() {
  const total = reports.length;
  const open = reports.filter((r) => !r.resolved_at).length;
  const resolvedThisWeek = reports.filter((r) => {
    if (!r.resolved_at) return false;
    const days = (Date.now() - new Date(r.resolved_at).getTime()) / (24 * HOUR_MS);
    return days <= 7;
  }).length;
  const breachCount = slaBreaches().length;
  return { total, open, resolvedThisWeek, breachCount };
}

export const analyticsApi = {
  summary:           () => ok(summary()),
  reportsByStatus:   () => ok(reportsByStatus()),
  reportsByFacility: (limit) => ok(reportsByFacility(limit)),
  reportsByCategory: () => ok(reportsByCategory()),
  urgentQueue:       () => ok(urgentQueue()),
  slaBreaches:       () => ok(slaBreaches()),
  resolutionVsSla:   () => ok(resolutionVsSla()),
  staffWorkload:     () => ok(staffWorkload())
};
