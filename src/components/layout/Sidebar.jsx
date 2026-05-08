import { NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';

const NAV = [
  { to: '/',             label: 'Dashboard',  end: true },
  { to: '/reports',      label: 'All Reports', end: true },
  { to: '/reports/new',  label: 'New Report' },
  { to: '/database',     label: 'Database',   end: true }
];

export default function Sidebar() {
  const { currentUser, isStaff, logout } = useAuth();
  const navItems = isStaff ? [...NAV, { to: '/staff', label: 'Staff Workload' }] : NAV;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark" aria-hidden="true">CF</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">CampusFix</span>
          <span className="sidebar-brand-sub">KFUPM · Facilities</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' is-active' : '')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <p className="text-tiny">{currentUser?.name}</p>
        <p className="text-small text-muted">
          {currentUser?.role === 'maintenance_staff' || currentUser?.role === 'admin'
            ? `Staff ID: ${currentUser?.staff_id ?? 'N/A'}`
            : `KFUPM ID: ${currentUser?.kfupm_id ?? 'N/A'}`}
        </p>
        <p className="text-small text-muted">User ID: {currentUser?.user_id}</p>
        <Button className="sidebar-logout" variant="secondary" size="sm" onClick={logout}>
          Sign out
        </Button>
      </footer>
    </aside>
  );
}
