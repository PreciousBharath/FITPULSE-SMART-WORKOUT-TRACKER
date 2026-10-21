import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { APP } from './config.js';
import { load, save, remove } from './storage.js';

const AuthCtx = createContext(null);

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const newSalt = () => [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');

export function passwordStrength(pw = '') {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  return { score: s, label: labels[s], pct: (s / 5) * 100 };
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => load('users', []));
  const [session, setSession] = useState(() => load('session', null) || sessionGet());
  const user = users.find((u) => u.email === session?.email) || null;

  useEffect(() => save('users', users), [users]);

  // Seed the demo account once
  useEffect(() => {
    (async () => {
      if (users.some((u) => u.email === APP.demo.email)) return;
      const salt = newSalt();
      const hash = await sha256(salt + APP.demo.password);
      setUsers((us) => [
        ...us,
        { name: APP.demo.name, email: APP.demo.email, salt, hash, role: APP.demo.role || 'member', joined: new Date().toISOString(), avatar: '😎', phone: '', city: 'Bengaluru' },
      ]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sessionGet() {
    try {
      return JSON.parse(sessionStorage.getItem(APP.key + ':session'));
    } catch {
      return null;
    }
  }

  async function register({ name, email, password, role }) {
    email = email.trim().toLowerCase();
    if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists');
    if (passwordStrength(password).score < 3) throw new Error('Please choose a stronger password');
    const salt = newSalt();
    const hash = await sha256(salt + password);
    const u = { name: name.trim(), email, salt, hash, role: role || 'member', joined: new Date().toISOString(), avatar: '🙂', phone: '', city: '' };
    setUsers((us) => [...us, u]);
    startSession(email, true);
    return u;
  }

  async function login(email, password, remember = true) {
    email = email.trim().toLowerCase();
    const u = users.find((x) => x.email === email);
    if (!u) throw new Error('No account found for this email');
    if ((await sha256(u.salt + password)) !== u.hash) throw new Error('Incorrect password');
    startSession(email, remember);
    return u;
  }

  function startSession(email, remember) {
    const s = { email, at: Date.now() };
    setSession(s);
    if (remember) save('session', s);
    else {
      remove('session');
      try {
        sessionStorage.setItem(APP.key + ':session', JSON.stringify(s));
      } catch {
        /* ignore */
      }
    }
  }

  function logout() {
    setSession(null);
    remove('session');
    try {
      sessionStorage.removeItem(APP.key + ':session');
    } catch {
      /* ignore */
    }
  }

  function updateProfile(patch) {
    setUsers((us) => us.map((u) => (u.email === user.email ? { ...u, ...patch } : u)));
  }

  async function changePassword(oldPw, newPw) {
    if ((await sha256(user.salt + oldPw)) !== user.hash) throw new Error('Current password is incorrect');
    if (passwordStrength(newPw).score < 3) throw new Error('New password is too weak');
    const salt = newSalt();
    const hash = await sha256(salt + newPw);
    updateProfile({ salt, hash });
  }

  return (
    <AuthCtx.Provider value={{ user, register, login, logout, updateProfile, changePassword }}>{children}</AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

export function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}
