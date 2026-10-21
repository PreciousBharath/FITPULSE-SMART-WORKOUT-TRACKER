import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Flame, Footprints, Clock, Trophy, Play, Droplet, Plus } from 'lucide-react';
import { useAuth } from '../auth.jsx';
import { useStore, dk, sessionVolume } from '../store.jsx';
import { PROGRAMS, ex } from '../data.js';
import { Stat } from '../components/ui.jsx';
import { useToast } from '../toast.jsx';

function Rings({ rings }) {
  return (
    <svg viewBox="0 0 200 200" className="rings">
      {rings.map((r, i) => {
        const rad = 86 - i * 22;
        const c = 2 * Math.PI * rad;
        const pct = Math.min(1, r.v / r.max);
        return (
          <g key={r.label}>
            <circle cx="100" cy="100" r={rad} fill="none" stroke={r.color} strokeOpacity="0.15" strokeWidth="18" />
            <circle cx="100" cy="100" r={rad} fill="none" stroke={r.color} strokeWidth="18" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 100 100)" className="ring-anim" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Today() {
  const { user } = useAuth();
  const s = useStore();
  const toast = useToast();
  const nav = useNavigate();
  const steps = s.steps[dk()] || 0;
  const water = s.water[dk()] || 0;
  const rings = [
    { label: 'Move', v: s.todayKcal, max: s.goals.kcal, color: '#e11d48', unit: 'kcal' },
    { label: 'Exercise', v: s.todayMins, max: s.goals.mins, color: '#84cc16', unit: 'min' },
    { label: 'Steps', v: steps, max: s.goals.steps, color: '#06b6d4', unit: '' },
  ];
  const prog = PROGRAMS.find((p) => p.id === s.program?.id);
  const nextDay = prog ? prog.days[s.sessions.filter((x) => new Date(x.date) >= new Date(s.program.startedAt)).length % prog.days.length] : null;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const ss = s.sessions.filter((x) => dk(x.date) === dk(d));
    return { d: d.toLocaleDateString('en', { weekday: 'short' }), vol: Math.round(ss.reduce((a, x) => a + sessionVolume(x), 0)), today: i === 6 };
  });
  const recentPR = Object.entries(s.prs).sort((a, b) => new Date(b[1].date) - new Date(a[1].date))[0];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Let’s go, {user.name.split(' ')[0]}! ⚡</h1>
          <p className="muted">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} · {s.streak}-day streak 🔥</p>
        </div>
        {s.active ? (
          <Link className="btn primary pulse-btn" to="/session"><Play size={16} /> Resume workout</Link>
        ) : (
          nextDay && <button className="btn primary" onClick={() => { s.startSession(`${nextDay.name} day`, nextDay.list); nav('/session'); }}><Play size={16} /> Start {nextDay.name} day</button>
        )}
      </div>
      <div className="today-grid">
        <div className="card rings-card fade-up">
          <Rings rings={rings} />
          <div className="ring-legend">
            {rings.map((r) => (
              <div key={r.label}>
                <span style={{ color: r.color }}>● {r.label}</span>
                <strong>{r.v.toLocaleString('en-IN')}<small className="muted">/{r.max.toLocaleString('en-IN')} {r.unit}</small></strong>
              </div>
            ))}
            <button className="btn sm soft" onClick={() => { s.addSteps(1000); toast('+1,000 steps synced 👟'); }}><Plus size={14} /> Sync steps</button>
          </div>
        </div>
        <div className="col">
          {nextDay && (
            <div className="card plan fade-up" style={{ background: `linear-gradient(135deg, ${prog.grad[0]}, ${prog.grad[1]})` }}>
              <small>{prog.icon} {prog.name}</small>
              <h2>Up next: {nextDay.name}</h2>
              <div className="plan-list">{nextDay.list.map((id) => <span key={id}>{ex(id)?.name}</span>)}</div>
            </div>
          )}
          <div className="card water fade-up">
            <div className="row between"><strong><Droplet size={16} /> Water</strong><span className="muted small">{(water / 1000).toFixed(2)} / {s.goals.water / 1000} L</span></div>
            <div className="glasses">
              {Array.from({ length: 10 }, (_, i) => (
                <button key={i} className={`glass ${water >= (i + 1) * (s.goals.water / 10) ? 'full' : ''}`} onClick={() => s.addWater(water >= (i + 1) * (s.goals.water / 10) ? -250 : 250)} aria-label="Glass" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid stats">
        <Stat icon={Flame} label="Calories burned" value={s.todayKcal} sub="today" tone="bad" />
        <Stat icon={Footprints} label="Steps" value={steps.toLocaleString('en-IN')} tone="info" delay={60} />
        <Stat icon={Clock} label="Workouts this month" value={s.sessions.filter((x) => x.date.slice(0, 7) === dk().slice(0, 7)).length} tone="good" delay={120} />
        <Stat icon={Trophy} label="Latest PR" value={recentPR ? `${recentPR[1].w} kg` : '—'} sub={recentPR ? ex(recentPR[0])?.name : 'Log a lift to set one'} tone="warn" delay={180} />
      </div>
      <div className="card fade-up">
        <h3>Training volume — last 7 days (kg lifted)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={week}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="d" stroke="var(--muted)" fontSize={12} />
            <YAxis stroke="var(--muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} formatter={(v) => `${v.toLocaleString('en-IN')} kg`} />
            <Bar dataKey="vol" radius={[8, 8, 0, 0]}>{week.map((w, i) => <Cell key={i} fill={w.today ? 'var(--accent)' : 'color-mix(in srgb, var(--accent) 45%, transparent)'} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
