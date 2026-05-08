import { useEffect, useState } from 'react';
import Field from '../ui/Field.jsx';
import Button from '../ui/Button.jsx';
import { lookupsApi } from '../../api/lookupsApi.js';
import { facilitiesApi } from '../../api/facilitiesApi.js';

const INITIAL = {
  facility_id: '',
  category_id: '',
  priority_id: '',
  title: '',
  description: ''
};

export default function NewReportForm({ onSubmit, submitting, currentUser }) {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [opts, setOpts]       = useState({ facilities: [], categories: [], priorities: [] });

  useEffect(() => {
    Promise.all([
      facilitiesApi.list(),
      lookupsApi.getCategories(),
      lookupsApi.getPriorities()
    ]).then(([facilities, categories, priorities]) =>
      setOpts({ facilities, categories, priorities })
    );
  }, []);

  // When category changes, suggest its default priority (only if user hasn't picked one yet)
  useEffect(() => {
    if (!form.category_id) return;
    const c = opts.categories.find((x) => x.category_id === Number(form.category_id));
    if (c && !form.priority_id) {
      setForm((f) => ({ ...f, priority_id: String(c.default_priority_id) }));
    }
  }, [form.category_id, opts.categories]); // eslint-disable-line

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!currentUser?.user_id) e.form = 'You must be signed in to submit a report.';
    if (!form.facility_id) e.facility_id = 'Facility is required.';
    if (!form.category_id) e.category_id = 'Category is required.';
    if (!form.priority_id) e.priority_id = 'Priority is required.';
    if (!form.title.trim()) e.title      = 'Title is required.';
    else if (form.title.length > 200) e.title = 'Title must be 200 characters or less.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, user_id: currentUser.user_id });
  };

  return (
    <form className="report-form" onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="form-error-banner">{errors.form}</div>}
      <div className="submitter-card">
        <p className="text-tiny">Signed-in user</p>
        <p className="submitter-name">{currentUser?.name}</p>
        <p className="text-small text-muted">User ID: {currentUser?.user_id}</p>
        <p className="text-small text-muted">KFUPM ID: {currentUser?.kfupm_id}</p>
        {(currentUser?.role === 'maintenance_staff' || currentUser?.role === 'admin') && (
          <p className="text-small text-muted">Staff ID: {currentUser?.staff_id}</p>
        )}
      </div>

      <div className="report-form-row">
        <Field label="Facility" htmlFor="facility_id" required error={errors.facility_id}>
          <select id="facility_id" className="select" value={form.facility_id} onChange={(e) => set('facility_id', e.target.value)}>
            <option value="">Select facility…</option>
            {opts.facilities.map((f) => (
              <option key={f.facility_id} value={f.facility_id}>
                {f.name} — {f.building_name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category" htmlFor="category_id" required error={errors.category_id} hint="Determines which unit handles the report.">
          <select id="category_id" className="select" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
            <option value="">Select category…</option>
            {opts.categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Priority" htmlFor="priority_id" required error={errors.priority_id} hint="Auto-suggested from the category. Adjust if needed.">
        <select id="priority_id" className="select" value={form.priority_id} onChange={(e) => set('priority_id', e.target.value)}>
          <option value="">Select priority…</option>
          {opts.priorities.map((p) => (
            <option key={p.priority_id} value={p.priority_id}>
              {p.level_name} (SLA: {p.sla_hours}h)
            </option>
          ))}
        </select>
      </Field>

      <Field label="Title" htmlFor="title" required error={errors.title} hint="Short summary, max 200 characters.">
        <input id="title" className="input" type="text" maxLength={200}
               value={form.title} onChange={(e) => set('title', e.target.value)}
               placeholder="e.g. AC not cooling in Lecture Hall A" />
      </Field>

      <Field label="Description" htmlFor="description" hint="Optional details: when, where, what's happening.">
        <textarea id="description" className="textarea" rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Add any helpful context…" />
      </Field>

      <div className="report-form-actions">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
}
