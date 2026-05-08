import { apiFetch } from './client.js';

export const facilitiesApi = {
  list:    ()   => apiFetch('/facilities'),
  getById: (id) => apiFetch(`/facilities/${id}`),
};