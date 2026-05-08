import { apiFetch } from './client.js';

export const usersApi = {
  list:    ()     => apiFetch('/users'),
  getById: (id)   => apiFetch(`/users/${id}`),
  login:   (identifier) =>
    apiFetch('/users/login', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),
  listByRole:          (role) => apiFetch(`/users?role=${role}`),
  listMaintenanceStaff: ()    => apiFetch('/users/maintenance-staff'),
};