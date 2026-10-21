import { useNavigate } from 'react-router-dom';
import { Check, Play, CalendarDays } from 'lucide-react';
import { PROGRAMS, ex } from '../data.js';
import { useStore } from '../store.jsx';
import { useToast } from '../toast.jsx';
import { Progress, confetti } from '../components/ui.jsx';

export default function Programs() {
  const s = useStore();
  const toast = useToast();
  const nav = useNavigate();
  const active = PROGRAMS.find((p) => p.id === s.program?.id);
  const doneSince = active ? s.sessions.filter((x) => new Date(x.date) >= new Date(s.program.startedAt)).length : 0;
  const total = active ? active.weeks * active.perWeek : 1;
  const week = active ? Math.min(active.weeks, Math.floor((Date.now() - new Date(s.program.startedAt)) / (7 * 86400000)) + 1) : 0;
  return (
    <div className="page">
      <div><h1>Programs</h1><p className="muted">Structured plans that tell you exactly what to do each day.</p></div>
      {active && (
        <div className="card active-prog fade-up" style={{ '--g1': active.grad[0], '--g2': active.grad[1] }}>
          <div className="ap-left">
            <small>Current program</small>
            <h2>{active.icon} {active.name}</h2>
            <p>Week {week} of {active.weeks} · {doneSince}/{total} sessions</p>
            <Progress value={doneSince} max={total} />
          </div>
          <div className="week-plan">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const train = active.perWeek >= 6 ? i < 6 : active.perWeek === 4 ? [0, 1, 3, 4].includes(i) : [0, 2, 4].includes(i);
              return <span key={i} className={train ? 'on' : ''}><b>{d}</b>{train ? active.days[i % active.days.length].name.split(' ')[0] : 'Rest'}</span>;
            })}
          </div>
        </div>
      )}
      <div className="grid two stagger">
        {PROGRAMS.map((p) => {
          const on = s.program?.id === p.id;
          return (
            <div key={p.id} className={`card prog hover ${on ? 'on' : ''}`}>
              <div className="prog-cover" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }}>
                <span>{p.icon}</span>
                <div><h3>{p.name}</h3><small>{p.goal}</small></div>
              </div>
              <p className="muted">{p.desc}</p>
              <div className="row small"><span className="badge">{p.level}</span><span className="badge info"><CalendarDays size={12} /> {p.weeks} weeks</span><span className="badge warn">{p.perWeek}×/week</span></div>
              <div className="prog-days">
                {p.days.map((d) => (
                  <div key={d.name}>
                    <strong>{d.name}</strong>
                    <small className="muted">{d.list.map((id) => ex(id)?.name).join(' · ')}</small>
                  </div>
                ))}
              </div>
              <div className="row">
                {on ? (
                  <button className="btn good" onClick={() => { s.enroll(null); toast('Program ended', 'info'); }}><Check size={16} /> Enrolled — end program</button>
                ) : (
                  <button className="btn primary" onClick={() => { s.enroll(p.id); confetti(50); toast(`Started ${p.name} 💪`); }}>Start program</button>
                )}
                <button className="btn ghost" onClick={() => { s.startSession(`${p.days[0].name} day`, p.days[0].list); nav('/session'); }}><Play size={16} /> Try day 1</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
