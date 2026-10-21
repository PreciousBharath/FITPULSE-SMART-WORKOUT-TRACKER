import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Sun, Moon, Monitor, Sparkles, Coffee, Settings, User, Bell, Search } from 'lucide-react';
import { APP } from '../config.js';
import { useAuth } from '../auth.jsx';
import { useTheme } from '../theme.jsx';

const THEME_ICON = { light: Sun, dark: Moon, midnight: Sparkles, sepia: Coffee, system: Monitor };

export default function Layout({ notifications = [], onSearch, headerExtra }) {
  const { user, logout } = useAuth();
  const { prefs, cycle } = useTheme();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
    setBell(false);
  }, [loc.pathname]);
  const ThemeIcon = THEME_ICON[prefs.theme] || Monitor;
  const items = APP.nav.filter((n) => !n.role || n.role === user?.role || user?.role === 'admin');

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-logo">{APP.logo}</span>
          <div>
            <strong>{APP.name}</strong>
            <small>{APP.short}</small>
          </div>
        </div>
        <nav>
          {items.map((n, i) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="nav-item" style={{ animationDelay: i * 35 + 'ms' }}>
              <n.icon size={18} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <NavLink to="/profile" className="nav-item">
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/settings" className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button
            className="nav-item"
            onClick={() => {
              logout();
              nav('/login');
            }}
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={20} />
          </button>
          {onSearch ? (
            <form
              className="search"
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(q, nav);
              }}
            >
              <Search size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={APP.searchPlaceholder || 'Search…'} />
            </form>
          ) : (
            <div className="grow" />
          )}
          {headerExtra}
          <div className="bell-wrap">
            <button className="icon-btn" onClick={() => setBell((b) => !b)} aria-label="Notifications">
              <Bell size={18} />
              {notifications.length > 0 && <span className="dot">{notifications.length}</span>}
            </button>
            {bell && (
              <div className="dropdown card fade-up">
                <strong>Notifications</strong>
                {notifications.length === 0 && <p className="muted small">You're all caught up 🎉</p>}
                {notifications.slice(0, 6).map((n, i) => (
                  <div key={i} className="note">
                    <span>{n.icon || '🔔'}</span>
                    <div>
                      <div>{n.text}</div>
                      {n.time && <small className="muted">{n.time}</small>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={cycle} title={`Theme: ${prefs.theme}`} aria-label="Switch theme">
            <ThemeIcon size={18} />
          </button>
          <NavLink to="/profile" className="avatar" title={user?.name}>
            {user?.avatar || user?.name?.[0]}
          </NavLink>
        </header>
        <div className="content" key={loc.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
