import { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, PieChart, Pie, Cell } from 'recharts';
import { useStore, dk } from '../store.jsx';
import { useToast } from '../toast.jsx';
import { Ring } from '../components/ui.jsx';

export default function Body() {
  const s = useStore();
  const toast = useToast();
  const last = s.weights.at(-1)?.kg || 75;
  const [kg, setKg] = useState(last);
  const [goal, setGoal] = useState('maintain');
  const { height, age, sex, activity } = s.body;
  const bmi = last / Math.pow(height / 100, 2);
  const bmiCat = bmi < 18.5 ? ['Underweight', 'info'] : bmi < 25 ? ['Healthy', 'good'] : bmi < 30 ? ['Overweight', 'warn'] : ['Obese', 'bad'];
  const bmr = Math.round(10 * last + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161));
  const tdee = Math.round(bmr * activity);
  const target = goal === 'cut' ? tdee - 450 : goal === 'bulk' ? tdee + 300 : tdee;
  const protein = Math.round(last * (goal === 'cut' ? 2.2 : 1.8));
  const fat = Math.round((target * 0.27) / 9);
  const carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4));
  const macros = [{ n: 'Protein', v: protein * 4, g: protein, c: '#e11d48' }, { n: 'Carbs', v: carbs * 4, g: carbs, c: '#f59e0b' }, { n: 'Fat', v: fat * 9, g: fat, c: '#06b6d4' }];
  const data = s.weights.map((w) => ({ d: new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), kg: w.kg }));
  const change = s.weights.length > 1 ? (last - s.weights[0].kg).toFixed(1) : 0;
  const water = s.water[dk()] || 0;
  return (
    <div className="page">
      <div><h1>Body & nutrition</h1><p className="muted">Track your weight, understand your numbers and fuel your training.</p></div>
      <div className="grid two">
        <div className="card fade-up">
          <div className="row between"><h3>Weight trend</h3><span className={`badge ${change <= 0 ? 'good' : 'warn'}`}>{change > 0 ? '+' : ''}{change} kg overall</span></div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={data}>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.45} /><stop offset="100%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="d" stroke="var(--muted)" fontSize={11} />
              <YAxis stroke="var(--muted)" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} unit=" kg" />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} />
              <ReferenceLine y={s.goals.target} stroke="var(--good)" strokeDasharray="6 4" label={{ value: `Goal ${s.goals.target} kg`, fill: 'var(--good)', fontSize: 11, position: 'insideTopRight' }} />
              <Area dataKey="kg" type="monotone" stroke="var(--accent)" strokeWidth={2.5} fill="url(#wg)" />
            </AreaChart>
          </ResponsiveContainer>
          <form className="row nowrap mt" onSubmit={(e) => { e.preventDefault(); s.logWeight(+kg); toast('Weight logged ⚖️'); }}>
            <input type="number" step="0.1" min="30" max="250" value={kg} onChange={(e) => setKg(e.target.value)} />
            <button className="btn primary">Log today</button>
          </form>
        </div>
        <div className="card fade-up">
          <h3>Your numbers</h3>
          <div className="body-grid">
            <div><small>Height (cm)</small><input type="number" value={height} onChange={(e) => s.setBody({ height: +e.target.value })} /></div>
            <div><small>Age</small><input type="number" value={age} onChange={(e) => s.setBody({ age: +e.target.value })} /></div>
            <div><small>Sex</small><select value={sex} onChange={(e) => s.setBody({ sex: e.target.value })}><option value="male">Male</option><option value="female">Female</option></select></div>
            <div><small>Activity</small><select value={activity} onChange={(e) => s.setBody({ activity: +e.target.value })}><option value={1.2}>Sedentary</option><option value={1.375}>Light</option><option value={1.55}>Moderate</option><option value={1.725}>Very active</option></select></div>
            <div><small>Goal weight (kg)</small><input type="number" value={s.goals.target} onChange={(e) => s.setGoals({ target: +e.target.value })} /></div>
          </div>
          <div className="nums">
            <div><small>BMI</small><strong>{bmi.toFixed(1)}</strong><span className={`badge ${bmiCat[1]}`}>{bmiCat[0]}</span></div>
            <div><small>BMR</small><strong>{bmr}</strong><span className="muted small">kcal/day</span></div>
            <div><small>TDEE</small><strong>{tdee}</strong><span className="muted small">kcal/day</span></div>
          </div>
          <div className="bmi-scale"><i style={{ left: `${Math.min(98, Math.max(2, ((bmi - 15) / 20) * 100))}%` }} /></div>
        </div>
      </div>
      <div className="grid two">
        <div className="card fade-up">
          <div className="row between">
            <h3>Daily macros</h3>
            <div className="seg" style={{ width: 280 }}>{[['cut', 'Lose fat'], ['maintain', 'Maintain'], ['bulk', 'Build muscle']].map(([k, l]) => <button key={k} className={goal === k ? 'active' : ''} onClick={() => setGoal(k)}>{l}</button>)}</div>
          </div>
          <div className="macro-wrap">
            <ResponsiveContainer width={200} height={200}>
              <PieChart><Pie data={macros} dataKey="v" innerRadius={60} outerRadius={90} paddingAngle={3}>{macros.map((m) => <Cell key={m.n} fill={m.c} />)}</Pie></PieChart>
            </ResponsiveContainer>
            <div className="macro-list">
              <div className="macro-total"><strong>{target}</strong> kcal / day</div>
              {macros.map((m) => <div key={m.n} className="row between"><span><i style={{ background: m.c }} /> {m.n}</span><strong>{m.g} g</strong></div>)}
            </div>
          </div>
        </div>
        <div className="card fade-up water-card">
          <Ring value={water} max={s.goals.water} label={`${(water / 1000).toFixed(2)} L`} sub={`of ${s.goals.water / 1000} L`} size={150} stroke={14} />
          <div>
            <h3>💧 Hydration</h3>
            <p className="muted small">Aim for ~35 ml per kg of body weight — about {Math.round(last * 35 / 100) / 10} L for you.</p>
            <div className="row">
              {[150, 250, 500].map((ml) => <button key={ml} className="btn soft sm" onClick={() => { s.addWater(ml); toast(`+${ml} ml 💧`); }}>+{ml} ml</button>)}
              <button className="btn ghost sm" onClick={() => s.addWater(-250)}>Undo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
