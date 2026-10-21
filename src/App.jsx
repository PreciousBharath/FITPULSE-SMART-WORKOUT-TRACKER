import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { Protected, useAuth } from './auth.jsx';
import { StoreProvider, useStore } from './store.jsx';
import Layout from './components/Layout.jsx';
import { Login, Register } from './pages/Auth.jsx';
import { Settings, Profile, NotFound } from './pages/Account.jsx';
import Today from './pages/Today.jsx';
import Session from './pages/Session.jsx';
import Exercises from './pages/Exercises.jsx';
import Programs from './pages/Programs.jsx';
import History from './pages/History.jsx';
import Body from './pages/Body.jsx';
import Challenges from './pages/Challenges.jsx';

function Shell() {
  const s = useStore();
  const notes = [
    ...(s.active ? [{ icon: '⏱️', text: `Workout “${s.active.name}” is still running` }] : []),
    { icon: '🔥', text: `${s.streak}-day streak — train today to keep it` },
    { icon: '💧', text: 'Drink a glass of water' },
  ];
  return (
    <Layout
      notifications={notes}
      onSearch={(q, nav) => nav(`/exercises?q=${encodeURIComponent(q)}`)}
      headerExtra={s.active ? <Link to="/session" className="badge live-pill"><Timer size={13} /> Live workout</Link> : <span className="badge">🔥 {s.streak} days</span>}
    />
  );
}

function ProfilePage() {
  const s = useStore();
  return <Profile stats={[{ label: 'Workouts', value: s.sessions.length }, { label: 'PRs', value: Object.keys(s.prs).length }, { label: 'Day streak', value: s.streak }]} />;
}

export default function App() {
  const { user } = useAuth();
  return (
    <StoreProvider>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route element={<Protected><Shell /></Protected>}>
          <Route index element={<Today />} />
          <Route path="session" element={<Session />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="programs" element={<Programs />} />
          <Route path="history" element={<History />} />
          <Route path="body" element={<Body />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </StoreProvider>
  );
}
