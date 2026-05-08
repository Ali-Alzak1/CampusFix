import { ok } from './client.js';
import {
  facility_types,
  issue_categories,
  priority_levels,
  report_statuses,
  maintenance_units
} from './seedData.js';

export const lookupsApi = {
  getFacilityTypes:   () => ok(facility_types),
  getCategories:      () => ok(issue_categories),
  getPriorities:      () => ok(priority_levels),
  getStatuses:        () => ok(report_statuses),
  getMaintenanceUnits:() => ok(maintenance_units)
};
