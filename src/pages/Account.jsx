import { useState } from 'react';
import { Sun, Moon, Monitor, Sparkles, Coffee, RotateCcw, Trash2 } from 'lucide-react';
import { APP } from '../config.js';
import { useAuth, passwordStrength } from '../auth.jsx';
import { useTheme, ACCENTS } from '../theme.jsx';
import { useToast } from '../toast.jsx';

const THEME_OPTS = [
  { v: 'light', l: 'Light', I: Sun },
  { v: 'dark', l: 'Dark', I: Moon },
  { v: 'midnight', l: 'Midnight', I: Sparkles },
  { v: 'sepia', l: 'Sepia', I: Coffee },
  { v: 'system', l: 'System', I: Monitor },
];

export function Settings() {
  const { prefs, set, reset } = useTheme();
  const toast = useToast();
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="muted">Make {APP.name} look and feel the way you like.</p>
        </div>
        <button className="btn soft" onClick={() => { reset(); toast('Appearance reset'); }}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <div className="grid two">
        <div className="card fade-up">
          <h3>Theme</h3>
          <div className="theme-grid">
            {THEME_OPTS.map(({ v, l, I }) => (
              <button key={v} className={`theme-tile t-${v} ${prefs.theme === v ? 'active' : ''}`} onClick={() => set({ theme: v })}>
                <div className="theme-preview">
                  <span />
                  <span />
                  <span />
                </div>
                <I size={16} /> {l}
              </button>
            ))}
          </div>
          <h3 className="mt">Accent colour</h3>
          <div className="swatches">
            {Object.entries(ACCENTS).map(([k, c]) => (
              <button key={k} title={k} className={`swatch ${prefs.accent === k ? 'active' : ''}`} style={{ background: c }} onClick={() => set({ accent: k })} />
            ))}
          </div>
        </div>
        <div className="card fade-up" style={{ animationDelay: '80ms' }}>
          <h3>Layout & motion</h3>
          <label>Corner radius: {prefs.radius}px</label>
          <input type="range" min="0" max="24" value={prefs.radius} onChange={(e) => set({ radius: +e.target.value })} />
          <label className="switch-row">
            <span>
              Compact mode <small className="muted">Tighter spacing, more on screen</small>
            </span>
            <input type="checkbox" className="switch" checked={prefs.compact} onChange={(e) => set({ compact: e.target.checked })} />
          </label>
          <label className="switch-row">
            <span>
              Reduce motion <small className="muted">Turns off animations</small>
            </span>
            <input type="checkbox" className="switch" checked={prefs.reduceMotion} onChange={(e) => set({ reduceMotion: e.target.checked })} />
          </label>
          <div className="preview-box">
            <button className="btn primary">Primary</button>
            <button className="btn soft">Soft</button>
            <span className="badge">Badge</span>
          </div>
        </div>
      </div>
      <div className="card danger-zone fade-up" style={{ animationDelay: '160ms' }}>
        <div>
          <h3>Clear local data</h3>
          <p className="muted small">Removes everything {APP.name} stored in this browser (accounts, activity, preferences).</p>
        </div>
        <button
          className="btn danger"
          onClick={() => {
            if (!confirm('Delete all local data for this app?')) return;
            Object.keys(localStorage).filter((k) => k.startsWith(APP.key + ':')).forEach((k) => localStorage.removeItem(k));
            location.href = '/';
          }}
        >
          <Trash2 size={16} /> Clear data
        </button>
      </div>
    </div>
  );
}

const AVATARS = ['😎', '🙂', '🦊', '🐼', '🦁', '🐯', '🚀', '🌟', '🎧', '🧑‍💻', '👩‍🎨', '🏄'];

export function Profile({ stats = [] }) {
  const { user, updateProfile, changePassword } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', city: user.city || '', bio: user.bio || '' });
  const [pw, setPw] = useState({ old: '', nw: '' });
  const st = passwordStrength(pw.nw);
  return (
    <div className="page">
      <div className="profile-hero card fade-up">
        <div className="avatar xl">{user.avatar}</div>
        <div>
          <h1>{user.name}</h1>
          <p className="muted">
            {user.email} · <span className="badge">{user.role}</span> · Joined {new Date(user.joined).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
          <div className="avatar-pick">
            {AVATARS.map((a) => (
              <button key={a} className={user.avatar === a ? 'active' : ''} onClick={() => updateProfile({ avatar: a })}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="grid stats">
          {stats.map((s) => (
            <div key={s.label} className="card mini-stat pop">
              <strong>{s.value}</strong>
              <small className="muted">{s.label}</small>
            </div>
          ))}
        </div>
      )}
      <div className="grid two">
        <form
          className="card form fade-up"
          onSubmit={(e) => {
            e.preventDefault();
            updateProfile(f);
            toast('Profile saved');
          }}
        >
          <h3>Personal details</h3>
          <label>Name</label>
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required />
          <label>Phone</label>
          <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+91" />
          <label>City</label>
          <input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          <label>Bio</label>
          <textarea rows={3} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
          <button className="btn primary">Save changes</button>
        </form>
        <form
          className="card form fade-up"
          style={{ animationDelay: '80ms' }}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await changePassword(pw.old, pw.nw);
              setPw({ old: '', nw: '' });
              toast('Password updated 🔒');
            } catch (ex) {
              toast(ex.message, 'error');
            }
          }}
        >
          <h3>Change password</h3>
          <label>Current password</label>
          <input type="password" value={pw.old} onChange={(e) => setPw({ ...pw, old: e.target.value })} required />
          <label>New password</label>
          <input type="password" value={pw.nw} onChange={(e) => setPw({ ...pw, nw: e.target.value })} required />
          <div className="strength">
            <div className="progress">
              <div className={`progress-bar s${st.score}`} style={{ width: st.pct + '%' }} />
            </div>
            <small>{pw.nw ? st.label : ' '}</small>
          </div>
          <button className="btn primary">Update password</button>
        </form>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="page center fade-up" style={{ paddingTop: 80 }}>
      <div style={{ fontSize: 72 }}>🧭</div>
      <h1>Page not found</h1>
      <p className="muted">The page you're looking for wandered off.</p>
      <a className="btn primary" href="/">
        Go home
      </a>
    </div>
  );
}
