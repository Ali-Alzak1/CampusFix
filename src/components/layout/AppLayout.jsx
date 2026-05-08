import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './layout.css';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
