import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronLeft, ChevronRight, Trash2, Trophy, Download } from 'lucide-react';
import { useStore, dk, sessionVolume, e1rm } from '../store.jsx';
import { ex } from '../data.js';
import { Empty, Modal } from '../components/ui.jsx';
import { useToast } from '../toast.jsx';

export default function History() {
  const s = useStore();
  const toast = useToast();
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [open, setOpen] = useState(null);
  const prIds = Object.keys(s.prs);
  const [lift, setLift] = useState(prIds.includes('bench-press') ? 'bench-press' : prIds[0]);
  const days = new Map();
  s.sessions.forEach((x) => days.set(dk(x.date), [...(days.get(dk(x.date)) || []), x]));
  const first = new Date(month);
  const startPad = (first.getDay() + 6) % 7;
  const nDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: nDays }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const progress = s.sessions.filter((x) => x.entries.some((e) => e.exId === lift)).map((x) => {
    const e = x.entries.find((y) => y.exId === lift);
    return { d: new Date(x.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), e1rm: Math.round(Math.max(...e.sets.map((st) => e1rm(st.w, st.r)))), top: Math.max(...e.sets.map((st) => st.w)) };
  });
  const sel = s.sessions.find((x) => x.id === open);
  function exportCsv() {
    const rows = [['date', 'workout', 'exercise', 'set', 'weight_kg', 'reps']];
    s.sessions.forEach((x) => x.entries.forEach((e) => e.sets.forEach((st, i) => rows.push([dk(x.date), x.name, ex(e.exId)?.name, i + 1, st.w, st.r]))));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' }));
    a.download = 'fitpulse-history.csv';
    a.click();
    toast('Exported CSV');
  }
  return (
    <div className="page">
      <div className="page-head">
        <div><h1>History & PRs</h1><p className="muted">{s.sessions.length} workouts logged · {Math.round(s.sessions.reduce((a, x) => a + sessionVolume(x), 0) / 1000).toLocaleString('en-IN')} tonnes lifted</p></div>
        <button className="btn soft" onClick={exportCsv}><Download size={16} /> Export CSV</button>
      </div>
      <div className="grid two">
        <div className="card fade-up">
          <div className="row between">
            <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={18} /></button>
            <h3 style={{ margin: 0 }}>{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3>
            <button className="icon-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={18} /></button>
          </div>
          <div className="cal-grid">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <b key={d}>{d}</b>)}
            {cells.map((d, i) => {
              if (!d) return <span key={i} />;
              const ss = days.get(dk(d)) || [];
              const isToday = dk(d) === dk();
              return (
                <button key={i} className={`cal-cell ${ss.length ? 'has' : ''} ${isToday ? 'today' : ''}`} onClick={() => ss[0] && setOpen(ss[0].id)} title={ss.map((x) => x.name).join(', ')}>
                  {d.getDate()}
                  {ss.length > 0 && <i />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="card fade-up">
          <div className="row between">
            <h3>Strength progress</h3>
            <select value={lift} onChange={(e) => setLift(e.target.value)} style={{ width: 200 }}>{prIds.map((id) => <option key={id} value={id}>{ex(id)?.name}</option>)}</select>
          </div>
          {progress.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted)" fontSize={11} />
                <YAxis stroke="var(--muted)" fontSize={11} unit=" kg" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} />
                <Line dataKey="e1rm" name="Est. 1RM" stroke="var(--accent)" strokeWidth={3} dot={{ r: 3 }} type="monotone" />
                <Line dataKey="top" name="Top set" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 4" dot={false} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          ) : <Empty icon="📈" title="Log a weighted lift to see progress" />}
        </div>
      </div>
      <div className="card table-wrap fade-up">
        <h3><Trophy size={16} /> Personal records</h3>
        {prIds.length ? (
          <table>
            <thead><tr><th>Exercise</th><th>Best set</th><th>Est. 1RM</th><th>Achieved</th></tr></thead>
            <tbody>
              {Object.entries(s.prs).sort((a, b) => b[1].e1rm - a[1].e1rm).map(([id, p]) => (
                <tr key={id}><td><strong>{ex(id)?.name}</strong></td><td>{p.w} kg × {p.r}</td><td><span className="badge warn">{Math.round(p.e1rm)} kg</span></td><td className="muted">{new Date(p.date).toLocaleDateString('en-IN')}</td></tr>
              ))}
            </tbody>
          </table>
        ) : <p className="muted">No PRs yet.</p>}
      </div>
      <div className="card fade-up">
        <h3>Recent workouts</h3>
        {[...s.sessions].reverse().slice(0, 10).map((x) => (
          <button key={x.id} className="hist-row" onClick={() => setOpen(x.id)}>
            <span className="hist-date"><b>{new Date(x.date).getDate()}</b><small>{new Date(x.date).toLocaleDateString('en-IN', { month: 'short' })}</small></span>
            <div style={{ flex: 1 }}><strong>{x.name}</strong><div className="muted small">{x.entries.length} exercises · {x.duration} min · {x.kcal} kcal</div></div>
            <strong>{sessionVolume(x).toLocaleString('en-IN')} kg</strong>
            {x.newPRs?.length > 0 && <span className="badge warn">🏆 {x.newPRs.length} PR</span>}
          </button>
        ))}
      </div>
      <Modal open={!!sel} onClose={() => setOpen(null)} title={sel?.name}>
        {sel && (
          <div className="form">
            <p className="muted">{new Date(sel.date).toLocaleString('en-IN')} · {sel.duration} min · {sel.kcal} kcal · {sessionVolume(sel).toLocaleString('en-IN')} kg</p>
            {sel.entries.map((e) => (
              <div key={e.exId} className="sel-ex">
                <strong>{ex(e.exId)?.name}</strong>
                <div className="row">{e.sets.map((st, i) => <span key={i} className="chip">{st.w ? `${st.w}kg × ${st.r}` : st.sec ? `${st.sec}s` : `${st.r} reps`}</span>)}</div>
              </div>
            ))}
            <button className="btn danger sm" onClick={() => { s.deleteSession(sel.id); setOpen(null); toast('Workout deleted', 'info'); }}><Trash2 size={14} /> Delete workout</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
