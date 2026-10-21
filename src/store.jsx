import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth.jsx';
import { load, save, uid } from './storage.js';
import { PROGRAMS, ex } from './data.js';

const Ctx = createContext(null);
export const dk = (d = new Date()) => new Date(d).toISOString().slice(0, 10);
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
export const e1rm = (w, r) => (r ? w * (1 + r / 30) : 0);
const BASE = { 'bench-press': 60, 'overhead-press': 35, 'incline-dumbbell-press': 22, 'lateral-raise': 8, 'tricep-pushdown': 25, deadlift: 100, 'pull-ups': 0, 'barbell-row': 55, 'face-pull': 20, 'barbell-curl': 25, 'back-squat': 80, 'romanian-deadlift': 70, 'leg-press': 140, 'leg-curl': 35, 'standing-calf-raise': 60 };

export function sessionVolume(s) {
  return s.entries.reduce((a, e) => a + e.sets.filter((x) => x.done).reduce((b, x) => b + (x.w || 0) * (x.r || 0), 0), 0);
}

function seed() {
  const ppl = PROGRAMS[0];
  const sessions = [];
  let k = 0;
  for (let d = 44; d >= 1; d--) {
    if ([3, 6].includes(d % 7) && d > 7) continue;
    if (d % 11 === 0) continue;
    const day = ppl.days[k % 3];
    const prog = 1 + (44 - d) * 0.006;
    sessions.push({
      id: uid('s'),
      date: ago(d).toISOString(),
      name: `${day.name} day`,
      duration: 48 + ((d * 7) % 22),
      kcal: 320 + ((d * 13) % 160),
      entries: day.list.map((id) => ({
        exId: id,
        sets: [0, 1, 2].map((i) => ({ w: Math.round(((BASE[id] || 20) * prog) / 2.5) * 2.5, r: [10, 8, 8][i] - (i === 2 && d % 2 ? 1 : 0), done: true })),
      })),
    });
    k++;
  }
  const weights = Array.from({ length: 12 }, (_, i) => ({ date: dk(ago(77 - i * 7)), kg: +(82.4 - i * 0.42 + (i % 3 === 0 ? 0.3 : 0)).toFixed(1) }));
  const steps = {};
  const water = {};
  for (let i = 0; i < 30; i++) {
    steps[dk(ago(i))] = 5200 + ((i * 1733) % 7800);
    water[dk(ago(i))] = 1500 + ((i * 377) % 1500);
  }
  steps[dk()] = 6840;
  water[dk()] = 1250;
  return { sessions, weights, steps, water, program: { id: 'ppl', startedAt: ago(44).toISOString() }, joined: ['steps', 'workouts'] };
}

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const key = `${user?.email}:fit`;
  const empty = { sessions: [], weights: [], steps: {}, water: {}, program: null, joined: [], goals: { kcal: 600, mins: 45, steps: 10000, water: 2500, target: 75 }, body: { height: 175, age: 30, sex: 'male', activity: 1.55 }, active: null, favs: [] };
  const [st, setSt] = useState(empty);
  useEffect(() => {
    if (!user) return;
    const saved = load(key, null);
    setSt(saved || { ...empty, ...(user.email.startsWith('demo@') ? seed() : {}) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);
  useEffect(() => { if (user) save(key, st); }, [st]); // eslint-disable-line

  const prs = useMemo(() => {
    const m = {};
    [...st.sessions].reverse().forEach((s) =>
      s.entries.forEach((e) =>
        e.sets.filter((x) => x.done && x.w).forEach((x) => {
          const v = e1rm(x.w, x.r);
          if (!m[e.exId] || v > m[e.exId].e1rm) m[e.exId] = { e1rm: v, w: x.w, r: x.r, date: s.date };
        })
      )
    );
    return m;
  }, [st.sessions]);

  const today = dk();
  const todaySessions = st.sessions.filter((s) => dk(s.date) === today);
  const todayKcal = todaySessions.reduce((a, s) => a + s.kcal, 0) + Math.round((st.steps[today] || 0) * 0.04);
  const todayMins = todaySessions.reduce((a, s) => a + s.duration, 0);
  const streak = (() => {
    const days = new Set(st.sessions.map((s) => dk(s.date)));
    let n = 0;
    for (let i = 0; i < 400; i++) {
      const d = dk(ago(i));
      if (days.has(d)) n++;
      else if (i > 1) break;
    }
    return n;
  })();

  const api = {
    ...st, prs, todayKcal, todayMins, streak, todaySessions,
    startSession: (name, list) =>
      setSt((s) => ({ ...s, active: { id: uid('s'), name, startedAt: Date.now(), entries: list.map((id) => ({ exId: id, sets: [0, 1, 2].map(() => ({ w: prs[id]?.w || (ex(id)?.type === 'weight' ? 20 : 0), r: ex(id)?.type === 'time' ? 0 : 10, sec: ex(id)?.type === 'time' ? 45 : 0, done: false })) })) } })),
    updateActive: (fn) => setSt((s) => ({ ...s, active: fn(s.active) })),
    discardActive: () => setSt((s) => ({ ...s, active: null })),
    finishActive: () => {
      const a = st.active;
      if (!a) return null;
      const mins = Math.max(1, Math.round((Date.now() - a.startedAt) / 60000));
      const kcal = Math.round(a.entries.reduce((t, e) => t + (ex(e.exId)?.kcal || 5) * e.sets.filter((x) => x.done).length * 1.6, 0) + mins * 2);
      const newPRs = [];
      a.entries.forEach((e) =>
        e.sets.filter((x) => x.done && x.w).forEach((x) => {
          if (e1rm(x.w, x.r) > (prs[e.exId]?.e1rm || 0) && !newPRs.includes(e.exId)) newPRs.push(e.exId);
        })
      );
      const done = { id: a.id, date: new Date().toISOString(), name: a.name, duration: mins, kcal, entries: a.entries.map((e) => ({ ...e, sets: e.sets.filter((x) => x.done) })).filter((e) => e.sets.length), newPRs };
      setSt((s) => ({ ...s, active: null, sessions: [...s.sessions, done] }));
      return done;
    },
    deleteSession: (id) => setSt((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) })),
    logWeight: (kg) => setSt((s) => ({ ...s, weights: [...s.weights.filter((w) => w.date !== dk()), { date: dk(), kg }].sort((a, b) => a.date.localeCompare(b.date)) })),
    addWater: (ml) => setSt((s) => ({ ...s, water: { ...s.water, [dk()]: Math.max(0, (s.water[dk()] || 0) + ml) } })),
    addSteps: (n) => setSt((s) => ({ ...s, steps: { ...s.steps, [dk()]: (s.steps[dk()] || 0) + n } })),
    setGoals: (g) => setSt((s) => ({ ...s, goals: { ...s.goals, ...g } })),
    setBody: (b) => setSt((s) => ({ ...s, body: { ...s.body, ...b } })),
    enroll: (id) => setSt((s) => ({ ...s, program: id ? { id, startedAt: new Date().toISOString() } : null })),
    join: (id) => setSt((s) => ({ ...s, joined: s.joined.includes(id) ? s.joined.filter((x) => x !== id) : [...s.joined, id] })),
    toggleFav: (id) => setSt((s) => ({ ...s, favs: s.favs.includes(id) ? s.favs.filter((x) => x !== id) : [...s.favs, id] })),
  };
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
