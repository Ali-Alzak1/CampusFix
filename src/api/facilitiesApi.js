import { ok } from './client.js';
import { facilities, facility_types } from './seedData.js';

function expand(f) {
  const type = facility_types.find((t) => t.type_id === f.type_id);
  return { ...f, type_name: type?.type_name ?? null };
}

export const facilitiesApi = {
  list: () => ok(facilities.map(expand)),
  getById: (id) => {
    const f = facilities.find((x) => x.facility_id === Number(id));
    return ok(f ? expand(f) : null);
  }
};
