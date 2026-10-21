import { CHALLENGES, FRIENDS } from '../data.js';
import { useStore, dk } from '../store.jsx';
import { useAuth } from '../auth.jsx';
import { useToast } from '../toast.jsx';
import { Progress } from '../components/ui.jsx';

export default function Challenges() {
  const s = useStore();
  const { user } = useAuth();
  const toast = useToast();
  const weekSteps = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return s.steps[dk(d)] || 0; }).reduce((a, b) => a + b, 0);
  const val = {
    steps: weekSteps,
    workouts: s.sessions.filter((x) => x.date.slice(0, 7) === dk().slice(0, 7)).length,
    water: Object.values(s.water).filter((v) => v >= 2500).length,
    plank: Math.max(0, ...s.sessions.flatMap((x) => x.entries.filter((e) => e.exId === 'plank').flatMap((e) => e.sets.map((st) => st.sec || 0)))),
  };
  const board = [...FRIENDS.map(([n, a, v]) => ({ n, a, v })), { n: user.name.split(' ')[0] + ' (you)', a: user.avatar, v: weekSteps, me: true }].sort((a, b) => b.v - a.v);
  return (
    <div className="page">
      <div><h1>Challenges ⚔️</h1><p className="muted">Join a challenge, compete with friends, stay accountable.</p></div>
      <div className="grid two stagger">
        {CHALLENGES.map((c) => {
          const joined = s.joined.includes(c.id);
          const v = val[c.id];
          const pct = Math.min(100, Math.round((v / c.goal) * 100));
          return (
            <div key={c.id} className={`card challenge hover ${joined ? 'joined' : ''}`} style={{ '--cc': c.color }}>
              <div className="row between">
                <span className="ch-icon">{c.icon}</span>
                {joined ? <span className="badge good">Joined</span> : <span className="badge">{c.days} days</span>}
              </div>
              <h3>{c.name}</h3>
              {joined ? (
                <>
                  <Progress value={v} max={c.goal} />
                  <div className="row between small"><span>{v.toLocaleString('en-IN')} / {c.goal.toLocaleString('en-IN')} {c.unit}</span><strong>{pct}%</strong></div>
                  {pct >= 100 && <div className="alert info">🏅 Challenge complete — badge unlocked!</div>}
                </>
              ) : <p className="muted small">{1200 + c.goal % 900} people are taking part.</p>}
              <button className={`btn ${joined ? 'ghost' : 'primary'} sm`} onClick={() => { s.join(c.id); toast(joined ? 'Left challenge' : 'Challenge accepted! 🔥', joined ? 'info' : 'success'); }}>{joined ? 'Leave' : 'Join challenge'}</button>
            </div>
          );
        })}
      </div>
      <div className="card fade-up">
        <h3>👟 Friends leaderboard — steps this week</h3>
        {board.map((b, i) => (
          <div key={b.n} className={`lb-row ${b.me ? 'me' : ''}`}>
            <span className="lb-rank">{['🥇', '🥈', '🥉'][i] || `#${i + 1}`}</span>
            <span className="lb-av">{b.a}</span>
            <strong style={{ flex: 1 }}>{b.n}</strong>
            <div className="lb-bar"><div style={{ width: (b.v / board[0].v) * 100 + '%' }} /></div>
            <strong>{b.v.toLocaleString('en-IN')}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
