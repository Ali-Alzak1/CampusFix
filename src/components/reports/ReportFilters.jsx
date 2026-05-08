import { useEffect, useState } from 'react';
import { lookupsApi } from '../../api/lookupsApi.js';
import { facilitiesApi } from '../../api/facilitiesApi.js';
import './reports.css';

const EMPTY = { search: '', status_id: '', priority_id: '', category_id: '', facility_id: '', open_only: false };

export default function ReportFilters({ value, onChange, onReset }) {
  const [opts, setOpts] = useState({ statuses: [], priorities: [], categories: [], facilities: [] });

  useEffect(() => {
    Promise.all([
      lookupsApi.getStatuses(),
      lookupsApi.getPriorities(),
      lookupsApi.getCategories(),
      facilitiesApi.list()
    ]).then(([statuses, priorities, categories, facilities]) =>
      setOpts({ statuses, priorities, categories, facilities })
    );
  }, []);

  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="filters-bar">
      <input
        className="input filters-search"
        type="search"
        placeholder="Search title or description…"
        value={value.search}
        onChange={(e) => set({ search: e.target.value })}
      />

      <select className="select" value={value.status_id} onChange={(e) => set({ status_id: e.target.value })}>
        <option value="">All statuses</option>
        {opts.statuses.map((s) => (
          <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
        ))}
      </select>

      <select className="select" value={value.priority_id} onChange={(e) => set({ priority_id: e.target.value })}>
        <option value="">All priorities</option>
        {opts.priorities.map((p) => (
          <option key={p.priority_id} value={p.priority_id}>{p.level_name}</option>
        ))}
      </select>

      <select className="select" value={value.category_id} onChange={(e) => set({ category_id: e.target.value })}>
        <option value="">All categories</option>
        {opts.categories.map((c) => (
          <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
        ))}
      </select>

      <select className="select" value={value.facility_id} onChange={(e) => set({ facility_id: e.target.value })}>
        <option value="">All facilities</option>
        {opts.facilities.map((f) => (
          <option key={f.facility_id} value={f.facility_id}>{f.name}</option>
        ))}
      </select>

      <label className="filters-checkbox">
        <input
          type="checkbox"
          checked={value.open_only}
          onChange={(e) => set({ open_only: e.target.checked })}
        />
        Open only
      </label>

      <button type="button" className="btn btn--ghost btn--sm" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export const EMPTY_FILTERS = EMPTY;
