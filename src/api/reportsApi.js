import { ok } from './client.js';
import {
  reports,
  users,
  facilities,
  facility_types,
  issue_categories,
  priority_levels,
  report_statuses,
  status_logs,
  assignments,
  maintenance_units
} from './seedData.js';

/** Mirror of Q2: joined report row used everywhere a "report" is shown. */
function expandReport(r) {
  const u  = users.find((x) => x.user_id === r.user_id);
  const f  = facilities.find((x) => x.facility_id === r.facility_id);
  const ft = f && facility_types.find((x) => x.type_id === f.type_id);
  const c  = issue_categories.find((x) => x.category_id === r.category_id);
  const p  = priority_levels.find((x) => x.priority_id === r.priority_id);
  const s  = report_statuses.find((x) => x.status_id === r.status_id);

  return {
    ...r,
    submitter:      u  ? { user_id: u.user_id, name: u.name, role: u.role, kfupm_id: u.kfupm_id } : null,
    facility:       f  ? { facility_id: f.facility_id, name: f.name, building_name: f.building_name, area_description: f.area_description, type_name: ft?.type_name } : null,
    category:       c  ? { category_id: c.category_id, category_name: c.category_name, default_unit_id: c.default_unit_id } : null,
    priority:       p  ? { priority_id: p.priority_id, level_name: p.level_name, rank: p.rank, sla_hours: p.sla_hours, color_code: p.color_code } : null,
    status:         s  ? { status_id: s.status_id, status_name: s.status_name, sort_order: s.sort_order } : null
  };
}

function nowSql() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function isStaffRole(role) {
  return role === 'maintenance_staff' || role === 'admin';
}

function expandLog(l) {
  const user = users.find((u) => u.user_id === l.changed_by);
  const oldS = l.old_status_id ? report_statuses.find((s) => s.status_id === l.old_status_id) : null;
  const newS = report_statuses.find((s) => s.status_id === l.new_status_id);
  return {
    ...l,
    changed_by_user: user ? { user_id: user.user_id, name: user.name, role: user.role } : null,
    old_status: oldS ? { status_id: oldS.status_id, status_name: oldS.status_name } : null,
    new_status: newS ? { status_id: newS.status_id, status_name: newS.status_name } : null
  };
}

function expandAssignment(a) {
  const staff = users.find((u) => u.user_id === a.staff_id);
  const unit  = staff ? maintenance_units.find((m) => m.unit_id === staff.unit_id) : null;
  return {
    ...a,
    staff: staff ? { user_id: staff.user_id, name: staff.name, role: staff.role } : null,
    unit:  unit  ? { unit_id: unit.unit_id, unit_name: unit.unit_name } : null
  };
}

export const reportsApi = {
  list: () =>
    ok(
      [...reports]
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
        .map(expandReport)
    ),

  getById: async (id) => {
    const r = reports.find((x) => x.report_id === Number(id));
    if (!r) return null;
    const expanded = expandReport(r);
    const logs = status_logs
      .filter((l) => l.report_id === r.report_id)
      .sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at))
      .map(expandLog);
    const asg = assignments
      .filter((a) => a.report_id === r.report_id)
      .sort((a, b) => new Date(a.assigned_at) - new Date(b.assigned_at))
      .map(expandAssignment);
    return ok({ ...expanded, status_logs: logs, assignments: asg });
  },

  /**
   * Creates a new report locally. Status is forced to "Submitted" (id=1)
   * and timestamps to "now", matching how the DB would behave on INSERT.
   */
  create: async (input) => {
    const next_id = Math.max(...reports.map((r) => r.report_id)) + 1;
    const now = nowSql();
    const newRow = {
      report_id: next_id,
      user_id:    Number(input.user_id),
      facility_id:Number(input.facility_id),
      category_id:Number(input.category_id),
      priority_id:Number(input.priority_id),
      status_id:  1,
      title:      input.title,
      description:input.description ?? null,
      submitted_at: now,
      updated_at:   now,
      resolved_at:  null
    };
    reports.unshift(newRow);
    return ok(expandReport(newRow));
  },

  updateStatus: async (reportId, input) => {
    const id = Number(reportId);
    const report = reports.find((r) => r.report_id === id);
    if (!report) {
      throw new Error('Report not found.');
    }

    const newStatusId = Number(input.status_id);
    const nextStatus = report_statuses.find((s) => s.status_id === newStatusId);
    if (!nextStatus) {
      throw new Error('Invalid status.');
    }
    if (report.status_id === newStatusId) {
      throw new Error('Report is already in this status.');
    }

    const actor = users.find((u) => u.user_id === Number(input.changed_by));
    if (!actor || !isStaffRole(actor.role)) {
      throw new Error('Only staff can update report status.');
    }

    const category = issue_categories.find((c) => c.category_id === report.category_id);
    const requiredUnitId = category?.default_unit_id ?? null;
    const actorCanHandle =
      actor.role === 'admin' ||
      (actor.role === 'maintenance_staff' && requiredUnitId !== null && actor.unit_id === requiredUnitId);
    if (!actorCanHandle) {
      throw new Error('This report belongs to another maintenance unit.');
    }

    const oldStatusId = report.status_id;
    const now = nowSql();
    report.status_id = newStatusId;
    report.updated_at = now;
    report.resolved_at = newStatusId === 4 || newStatusId === 5 ? now : null;

    // Track responsibility: first status action by a staff member creates assignment.
    let assignment = assignments
      .filter((a) => a.report_id === id && a.staff_id === actor.user_id)
      .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))[0];
    if (!assignment) {
      const nextAssignmentId = assignments.length ? Math.max(...assignments.map((a) => a.assignment_id)) + 1 : 1;
      assignment = {
        assignment_id: nextAssignmentId,
        report_id: id,
        staff_id: actor.user_id,
        assigned_at: now,
        completed_at: null,
        resolution_notes: null
      };
      assignments.push(assignment);
    }

    // Closing transitions complete the acting staff's current assignment.
    if ([4, 5, 6].includes(newStatusId) && !assignment.completed_at) {
      assignment.completed_at = now;
      assignment.resolution_notes = input.note?.trim() || assignment.resolution_notes || null;
    }

    const nextLogId = status_logs.length ? Math.max(...status_logs.map((l) => l.log_id)) + 1 : 1;
    status_logs.push({
      log_id: nextLogId,
      report_id: id,
      changed_by: Number(input.changed_by),
      old_status_id: oldStatusId,
      new_status_id: newStatusId,
      changed_at: now,
      note: input.note?.trim() || null
    });

    return ok(expandReport(report));
  }
};
