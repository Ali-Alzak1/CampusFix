import { apiFetch } from './client.js';

export const reportsApi = {
  list: () =>
    apiFetch('/reports'),

  getById: (id) =>
    apiFetch(`/reports/${id}`),

  create: (input) =>
    apiFetch('/reports', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  updateStatus: (reportId, input) =>
    apiFetch(`/reports/${reportId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
};