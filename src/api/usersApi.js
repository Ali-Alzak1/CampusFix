import { ok } from './client.js';
import { users, maintenance_units } from './seedData.js';

function toStaffId(user) {
  return ['maintenance_staff', 'admin'].includes(user.role) ? user.kfupm_id : null;
}

function expand(u) {
  const unit = maintenance_units.find((m) => m.unit_id === u.unit_id);
  return { ...u, unit_name: unit?.unit_name ?? null, staff_id: toStaffId(u) };
}

export const usersApi = {
  list: () => ok(users.map(expand)),
  getById: (id) => {
    const u = users.find((x) => x.user_id === Number(id));
    return ok(u ? expand(u) : null);
  },
  login: (identifier) => {
    const raw = String(identifier ?? '').trim();
    if (!raw) return ok(null);
    const user = users.find((u) =>
      String(u.user_id) === raw ||
      String(u.kfupm_id).toLowerCase() === raw.toLowerCase() ||
      String(toStaffId(u) ?? '').toLowerCase() === raw.toLowerCase()
    );
    return ok(user ? expand(user) : null);
  },
  listByRole: (role) => ok(users.filter((u) => u.role === role).map(expand)),
  listMaintenanceStaff: () =>
    ok(users.filter((u) => u.role === 'maintenance_staff').map(expand))
};
