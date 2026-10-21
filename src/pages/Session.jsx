import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Plus, Trash2, Timer, X, Trophy, Flag, Search } from 'lucide-react';
import { useStore, e1rm, sessionVolume } from '../store.jsx';
import { useToast } from '../toast.jsx';
import { EXERCISES, PROGRAMS, ex } from '../data.js';
import { Modal, Ring, confetti } from '../components/ui.jsx';

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const QUICK = [
  { name: 'Quick upper body', icon: '💪', list: ['push-ups', 'lat-pulldown', 'lateral-raise', 'hammer-curl', 'tricep-pushdown'] },
  { name: 'Leg day blast', icon: '🦵', list: ['back-squat', 'walking-lunges', 'leg-curl', 'standing-calf-raise'] },
  { name: '20-min HIIT', icon: '⚡', list: ['burpees', 'mountain-climbers', 'jump-rope', 'kettlebell-swing'] },
];

function ExercisePicker({ onPick, exclude = [] }) {
  const [q, setQ] = useState('');
  const list = EXERCISES.filter((e) => !exclude.includes(e.id) && `${e.name} ${e.muscle} ${e.equip}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="form">
      <div className="input-icon"><Search size={16} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercise or muscle" /></div>
      <div className="pick-list">
        {list.map((e) => (
          <button key={e.id} className="pick" onClick={() => onPick(e.id)}>
            <strong>{e.name}</strong><small className="muted">{e.muscle} · {e.equip}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Session() {
  const s = useStore();
  const toast = useToast();
  const [now, setNow] = useState(Date.now());
  const [rest, setRest] = useState(null);
  const [restLen, setRestLen] = useState(90);
  const [adding, setAdding] = useState(false);
  const [summary, setSummary] = useState(null);
  const [custom, setCustom] = useState([]);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (rest == null) return;
    if (rest <= 0) {
      setRest(null);
      toast('Rest over — next set! 💥', 'info');
      try { navigator.vibrate?.(300); } catch { /* ignore */ }
      return;
    }
    const t = setTimeout(() => setRest(rest - 1), 1000);
    return () => clearTimeout(t);
  }, [rest, toast]);

  const a = s.active;
  if (summary)
    return (
      <div className="page">
        <div className="card summary pop">
          <div className="center">
            <div className="trophy">🏆</div>
            <h1>Workout complete!</h1>
            <p className="muted">{summary.name} · {new Date(summary.date).toLocaleString('en-IN', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="grid stats">
            <div className="card mini-stat"><strong>{summary.duration} min</strong><small className="muted">Duration</small></div>
            <div className="card mini-stat"><strong>{sessionVolume(summary).toLocaleString('en-IN')} kg</strong><small className="muted">Volume</small></div>
            <div className="card mini-stat"><strong>{summary.entries.reduce((t, e) => t + e.sets.length, 0)}</strong><small className="muted">Sets</small></div>
            <div className="card mini-stat"><strong>{summary.kcal}</strong><small className="muted">kcal</small></div>
          </div>
          {summary.newPRs.length > 0 && (
            <div className="pr-banner">
              <Trophy size={18} /> New personal records: {summary.newPRs.map((id) => ex(id)?.name).join(', ')}
            </div>
          )}
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link className="btn primary" to="/history">View history</Link>
            <button className="btn ghost" onClick={() => setSummary(null)}>Done</button>
          </div>
        </div>
      </div>
    );

  if (!a)
    return (
      <div className="page">
        <div><h1>Start a workout</h1><p className="muted">Pick a program day, a quick template or build your own.</p></div>
        <h3>From your programs</h3>
        <div className="grid three stagger">
          {PROGRAMS.flatMap((p) => p.days.map((d) => ({ p, d }))).slice(0, 9).map(({ p, d }) => (
            <button key={p.id + d.name} className="card start-card hover" onClick={() => s.startSession(`${d.name} day`, d.list)}>
              <span className="sc-icon" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }}>{p.icon}</span>
              <div><strong>{d.name}</strong><small className="muted">{p.name} · {d.list.length} exercises</small></div>
            </button>
          ))}
        </div>
        <h3>Quick templates</h3>
        <div className="grid three stagger">
          {QUICK.map((t) => (
            <button key={t.name} className="card start-card hover" onClick={() => s.startSession(t.name, t.list)}>
              <span className="sc-icon">{t.icon}</span>
              <div><strong>{t.name}</strong><small className="muted">{t.list.map((id) => ex(id).name).join(' · ')}</small></div>
            </button>
          ))}
        </div>
        <div className="card fade-up">
          <div className="row between"><h3>Build your own</h3><button className="btn sm soft" onClick={() => setPicking(true)}><Plus size={14} /> Add exercise</button></div>
          <div className="row">{custom.map((id) => <span key={id} className="chip">{ex(id).name} <X size={12} onClick={() => setCustom(custom.filter((x) => x !== id))} style={{ cursor: 'pointer' }} /></span>)}</div>
          {custom.length > 0 && <button className="btn primary mt" onClick={() => s.startSession('Custom workout', custom)}>Start custom workout ({custom.length})</button>}
        </div>
        <Modal open={picking} onClose={() => setPicking(false)} title="Add exercise">
          <ExercisePicker exclude={custom} onPick={(id) => { setCustom([...custom, id]); setPicking(false); }} />
        </Modal>
      </div>
    );

  const elapsed = Math.floor((now - a.startedAt) / 1000);
  const setsDone = a.entries.reduce((t, e) => t + e.sets.filter((x) => x.done).length, 0);
  const setsTotal = a.entries.reduce((t, e) => t + e.sets.length, 0);
  const vol = sessionVolume(a);
  const upd = (ei, si, patch) => s.updateActive((x) => ({ ...x, entries: x.entries.map((e, i) => (i === ei ? { ...e, sets: e.sets.map((st, j) => (j === si ? { ...st, ...patch } : st)) } : e)) }));

  return (
    <div className="page">
      <div className="session-head card fade-up">
        <div>
          <small className="muted">In progress</small>
          <h2>{a.name}</h2>
        </div>
        <div className="sh-stats">
          <div><small>Time</small><strong className="mono">{fmt(elapsed)}</strong></div>
          <div><small>Sets</small><strong>{setsDone}/{setsTotal}</strong></div>
          <div><small>Volume</small><strong>{vol.toLocaleString('en-IN')} kg</strong></div>
        </div>
        <div className="row">
          <button className="btn ghost" onClick={() => { if (confirm('Discard this workout?')) s.discardActive(); }}><Trash2 size={16} /> Discard</button>
          <button className="btn primary" disabled={!setsDone} onClick={() => { const d = s.finishActive(); setSummary(d); confetti(); }}><Flag size={16} /> Finish</button>
        </div>
      </div>
      <div className="progress-strip"><div style={{ width: (setsDone / Math.max(1, setsTotal)) * 100 + '%' }} /></div>
      <div className="entries stagger">
        {a.entries.map((e, ei) => {
          const x = ex(e.exId);
          const pr = s.prs[e.exId];
          return (
            <div key={e.exId + ei} className="card entry">
              <div className="row between">
                <div>
                  <strong>{x.name}</strong>
                  <div className="muted small">{x.muscle} · {x.equip}{pr && ` · PR ${pr.w} kg × ${pr.r} (e1RM ${Math.round(pr.e1rm)} kg)`}</div>
                </div>
                <button className="icon-btn" onClick={() => s.updateActive((y) => ({ ...y, entries: y.entries.filter((_, i) => i !== ei) }))}><X size={16} /></button>
              </div>
              <div className="set-table">
                <div className="set-row head"><span>Set</span><span>{x.type === 'time' ? 'Seconds' : 'kg'}</span><span>{x.type === 'time' ? '' : 'Reps'}</span><span /></div>
                {e.sets.map((st, si) => {
                  const isPR = st.done && st.w && e1rm(st.w, st.r) > (pr?.e1rm || 0);
                  return (
                    <div key={si} className={`set-row ${st.done ? 'done' : ''}`}>
                      <span className="set-no">{si + 1}{isPR && <span className="pr-tag">PR</span>}</span>
                      {x.type === 'time' ? (
                        <input type="number" min="0" value={st.sec} onChange={(ev) => upd(ei, si, { sec: +ev.target.value })} />
                      ) : (
                        <input type="number" min="0" step="2.5" value={st.w} onChange={(ev) => upd(ei, si, { w: +ev.target.value })} disabled={x.type === 'reps'} placeholder="BW" />
                      )}
                      {x.type === 'time' ? <span /> : <input type="number" min="0" value={st.r} onChange={(ev) => upd(ei, si, { r: +ev.target.value })} />}
                      <button
                        className={`check-btn ${st.done ? 'on' : ''}`}
                        onClick={() => {
                          upd(ei, si, { done: !st.done });
                          if (!st.done) setRest(restLen);
                        }}
                        aria-label="Complete set"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button className="btn sm ghost" onClick={() => s.updateActive((y) => ({ ...y, entries: y.entries.map((en, i) => (i === ei ? { ...en, sets: [...en.sets, { ...en.sets.at(-1), done: false }] } : en)) }))}><Plus size={14} /> Add set</button>
            </div>
          );
        })}
      </div>
      <button className="btn soft block" onClick={() => setAdding(true)}><Plus size={16} /> Add exercise</button>
      <div className="rest-pref muted small row"><Timer size={14} /> Rest timer: {[60, 90, 120, 180].map((r) => <button key={r} className={`chip ${restLen === r ? 'active' : ''}`} onClick={() => setRestLen(r)}>{r}s</button>)}</div>

      {rest != null && (
        <div className="rest-overlay pop">
          <Ring value={rest} max={restLen} label={fmt(rest)} sub="rest" size={150} stroke={12} />
          <div className="row">
            <button className="btn sm ghost" onClick={() => setRest(Math.max(1, rest - 15))}>−15s</button>
            <button className="btn sm ghost" onClick={() => setRest(rest + 15)}>+15s</button>
            <button className="btn sm primary" onClick={() => setRest(null)}>Skip</button>
          </div>
        </div>
      )}
      <Modal open={adding} onClose={() => setAdding(false)} title="Add exercise">
        <ExercisePicker exclude={a.entries.map((e) => e.exId)} onPick={(id) => { s.updateActive((y) => ({ ...y, entries: [...y.entries, { exId: id, sets: [0, 1, 2].map(() => ({ w: s.prs[id]?.w || 20, r: 10, sec: 45, done: false })) }] })); setAdding(false); }} />
      </Modal>
    </div>
  );
}
