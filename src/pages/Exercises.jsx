import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Search, Play } from 'lucide-react';
import { EXERCISES, MUSCLES } from '../data.js';
import { useStore } from '../store.jsx';
import BodyMap from '../components/BodyMap.jsx';
import { Modal, Empty } from '../components/ui.jsx';

const EQUIP = ['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell'];
const LV = { Beginner: 'good', Intermediate: 'warn', Advanced: 'bad' };
const ICON = { Chest: '🏋️', Back: '🧗', Shoulders: '🙆', Biceps: '💪', Triceps: '🦾', Core: '🧘', Quads: '🦵', Hamstrings: '🏃', Glutes: '🤸', Calves: '🦶', Cardio: '❤️' };

export default function Exercises() {
  const s = useStore();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [muscle, setMuscle] = useState('');
  const [equip, setEquip] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [open, setOpen] = useState(null);
  useEffect(() => setQ(params.get('q') || ''), [params]);

  const heat = useMemo(() => {
    const h = {};
    const recent = s.sessions.filter((x) => Date.now() - new Date(x.date) < 7 * 86400000);
    recent.forEach((x) => x.entries.forEach((e) => { const m = EXERCISES.find((z) => z.id === e.exId)?.muscle; if (m) h[m] = (h[m] || 0) + e.sets.length; }));
    const max = Math.max(1, ...Object.values(h));
    Object.keys(h).forEach((k) => (h[k] = h[k] / max));
    return h;
  }, [s.sessions]);

  const list = EXERCISES.filter((e) => (!muscle || e.muscle === muscle) && (!equip || e.equip === equip) && (!favOnly || s.favs.includes(e.id)) && `${e.name} ${e.muscle}`.toLowerCase().includes(q.toLowerCase()));
  const o = EXERCISES.find((e) => e.id === open);
  const pr = o && s.prs[o.id];

  return (
    <div className="page">
      <div><h1>Exercise library</h1><p className="muted">{EXERCISES.length} exercises · tap a muscle on the map to filter. Colour intensity = your training load this week.</p></div>
      <div className="lib-layout">
        <div className="card fade-up map-card">
          <BodyMap value={muscle} onChange={setMuscle} heat={heat} />
          <div className="chips wrap">{MUSCLES.map((m) => <button key={m} className={`chip ${muscle === m ? 'active' : ''}`} onClick={() => setMuscle(muscle === m ? '' : m)}>{ICON[m]} {m}</button>)}</div>
        </div>
        <div className="col">
          <div className="toolbar card">
            <div className="input-icon" style={{ flex: 1, minWidth: 200 }}><Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" /></div>
            <select value={equip} onChange={(e) => setEquip(e.target.value)} style={{ width: 170 }}><option value="">All equipment</option>{EQUIP.map((x) => <option key={x}>{x}</option>)}</select>
            <label className="check"><input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} /> Favourites</label>
          </div>
          {list.length ? (
            <div className="ex-grid stagger">
              {list.map((e) => (
                <div key={e.id} className="card ex-card hover" onClick={() => setOpen(e.id)}>
                  <div className="ex-icon">{ICON[e.muscle]}</div>
                  <div style={{ flex: 1 }}>
                    <strong>{e.name}</strong>
                    <div className="muted small">{e.muscle} · {e.equip}</div>
                    <span className={`badge ${LV[e.level]}`}>{e.level}</span>
                  </div>
                  <button className={`icon-btn ${s.favs.includes(e.id) ? 'on' : ''}`} onClick={(ev) => { ev.stopPropagation(); s.toggleFav(e.id); }}><Heart size={16} fill={s.favs.includes(e.id) ? 'currentColor' : 'none'} /></button>
                </div>
              ))}
            </div>
          ) : (
            <Empty icon="🤸" title="No exercises match" />
          )}
        </div>
      </div>
      <Modal open={!!o} onClose={() => setOpen(null)} title={o?.name}>
        {o && (
          <div className="form">
            <div className="ex-demo">
              <span className="ex-demo-icon">{ICON[o.muscle]}</span>
              <div className="ex-demo-bar" />
            </div>
            <div className="row"><span className="badge">{o.muscle}</span><span className="badge info">{o.equip}</span><span className={`badge ${LV[o.level]}`}>{o.level}</span><span className="badge warn">~{o.kcal} kcal/min</span></div>
            <h4>Form cues</h4>
            <ol className="cues">{o.tips.map((t) => <li key={t}>{t}</li>)}</ol>
            {pr && <div className="alert info">🏆 Your best: {pr.w} kg × {pr.r} (estimated 1RM {Math.round(pr.e1rm)} kg)</div>}
            <button className="btn primary" onClick={() => { s.startSession(o.name, [o.id]); nav('/session'); }}><Play size={16} /> Train this now</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
