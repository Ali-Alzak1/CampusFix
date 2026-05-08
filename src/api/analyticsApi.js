import { apiFetch } from './client.js';

export const analyticsApi = {
  summary:           () => apiFetch('/analytics/summary'),
  reportsByStatus:   () => apiFetch('/analytics/reports-by-status'),
  reportsByFacility: (limit) => apiFetch(`/analytics/reports-by-facility${limit ? `?limit=${limit}` : ''}`),
  reportsByCategory: () => apiFetch('/analytics/reports-by-category'),
  urgentQueue:       () => apiFetch('/analytics/urgent-queue'),
  slaBreaches:       () => apiFetch('/analytics/sla-breaches'),
  resolutionVsSla:   () => apiFetch('/analytics/resolution-vs-sla'),
  staffWorkload:     () => apiFetch('/analytics/staff-workload'),
};