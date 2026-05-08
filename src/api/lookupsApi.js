import { apiFetch } from './client.js';

export const lookupsApi = {
  getFacilityTypes:    () => apiFetch('/lookups/facility-types'),
  getCategories:       () => apiFetch('/lookups/categories'),
  getPriorities:       () => apiFetch('/lookups/priorities'),
  getStatuses:         () => apiFetch('/lookups/statuses'),
  getMaintenanceUnits: () => apiFetch('/lookups/maintenance-units'),
};