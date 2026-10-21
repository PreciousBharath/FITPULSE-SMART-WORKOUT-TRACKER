import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import { APP } from '../config.js';
import { useAuth, passwordStrength } from '../auth.jsx';
import { useToast } from '../toast.jsx';

function AuthShell({ children, title, subtitle }) {
  return (
    <div className="auth">
      <section className="auth-hero">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="auth-hero-inner fade-up">
          <div className="brand big">
            <span className="brand-logo">{APP.logo}</span>
            <strong>{APP.name}</strong>
          </div>
          <h1>{APP.tagline}</h1>
          <p>{APP.description}</p>
          <ul className="hero-points">
            {APP.heroPoints.map((p, i) => (
              <li key={p} style={{ animationDelay: 200 + i * 120 + 'ms' }}>
                <span>✓</span> {p}
              </li>
            ))}
          </ul>
          <div className="floating-cards">
            {APP.heroCards.map((c, i) => (
              <div key={i} className="float-card" style={{ animationDelay: i * 0.8 + 's' }}>
                <span>{c.icon}</span>
                <div>
                  <strong>{c.title}</strong>
                  <small>{c.sub}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card card pop">
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder = 'Password', autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-icon">
      <Lock size={16} />
      <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} required autoComplete={autoComplete} />
      <button type="button" className="icon-btn ghost" onClick={() => setShow((s) => !s)} aria-label="Toggle password">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '', remember: true });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  async function submit(e, creds) {
    e?.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const u = await login(creds?.email ?? f.email, creds?.password ?? f.password, f.remember);
      toast(`Welcome back, ${u.name.split(' ')[0]}! 👋`);
      nav(loc.state?.from || '/', { replace: true });
    } catch (ex) {
      setErr(ex.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle={`Log in to continue to ${APP.name}`}>
      <form onSubmit={submit} className={`form ${shake ? 'shake' : ''}`}>
        <label>Email</label>
        <div className="input-icon">
          <Mail size={16} />
          <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" required autoComplete="email" />
        </div>
        <label>Password</label>
        <PasswordInput value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
        <div className="row between">
          <label className="check">
            <input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} /> Remember me
          </label>
          <button type="button" className="link" onClick={() => toast('Password reset is a demo — use the demo account or register.', 'info')}>
            Forgot password?
          </button>
        </div>
        {err && <div className="alert error">{err}</div>}
        <button className="btn primary block" disabled={busy}>
          {busy ? <span className="spinner" /> : <>Log in <ArrowRight size={16} /></>}
        </button>
        <button type="button" className="btn soft block" onClick={() => submit(null, APP.demo)}>
          <Zap size={16} /> Try the demo account
        </button>
        <p className="center muted small">
          Demo: {APP.demo.email} / {APP.demo.password}
        </p>
        <p className="center">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', role: APP.roles?.[0]?.value || 'member', terms: false });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const st = passwordStrength(f.password);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    if (f.password !== f.confirm) return setErr('Passwords do not match');
    if (!f.terms) return setErr('Please accept the terms to continue');
    setBusy(true);
    try {
      await register(f);
      toast('Account created — welcome aboard! 🎉');
      nav('/', { replace: true });
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute">
      <form onSubmit={submit} className="form">
        <label>Full name</label>
        <div className="input-icon">
          <User size={16} />
          <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" required minLength={2} />
        </div>
        <label>Email</label>
        <div className="input-icon">
          <Mail size={16} />
          <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" required />
        </div>
        {APP.roles && (
          <>
            <label>I am a</label>
            <div className="seg">
              {APP.roles.map((r) => (
                <button type="button" key={r.value} className={f.role === r.value ? 'active' : ''} onClick={() => setF({ ...f, role: r.value })}>
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}
        <label>Password</label>
        <PasswordInput value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" />
        <div className="strength">
          <div className="progress">
            <div className={`progress-bar s${st.score}`} style={{ width: st.pct + '%' }} />
          </div>
          <small>{f.password ? st.label : 'Use 8+ chars with upper, lower, number & symbol'}</small>
        </div>
        <label>Confirm password</label>
        <PasswordInput value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} placeholder="Repeat password" autoComplete="new-password" />
        <label className="check">
          <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} /> I agree to the Terms & Privacy Policy
        </label>
        {err && <div className="alert error">{err}</div>}
        <button className="btn primary block" disabled={busy}>
          {busy ? <span className="spinner" /> : <>Create account <ArrowRight size={16} /></>}
        </button>
        <p className="center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
