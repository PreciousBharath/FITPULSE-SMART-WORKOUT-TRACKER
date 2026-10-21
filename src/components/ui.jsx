import { useEffect, useRef, useState } from 'react';
import { X, Star } from 'lucide-react';

export function Modal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ icon: Icon, label, value, sub, tone = 'accent', delay = 0 }) {
  return (
    <div className="card stat pop" style={{ animationDelay: `${delay}ms` }}>
      <div className={`stat-icon tone-${tone}`}>{Icon && <Icon size={20} />}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          <CountUp value={value} />
        </div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

/** Animates numbers inside a string/number value, e.g. "₹12,400" or 87 */
export function CountUp({ value, duration = 900 }) {
  const str = String(value);
  const m = str.match(/-?[\d,]+(\.\d+)?/);
  const [shown, setShown] = useState(m ? str.replace(m[0], '0') : str);
  const raf = useRef();
  useEffect(() => {
    if (!m || document.documentElement.classList.contains('reduce-motion')) {
      setShown(str);
      return;
    }
    const target = parseFloat(m[0].replace(/,/g, ''));
    const decimals = m[1] ? m[1].length - 1 : 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      const v = (target * e).toFixed(decimals);
      const fmt = m[0].includes(',') ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : v;
      setShown(str.replace(m[0], fmt));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str]);
  return <>{shown}</>;
}

export function Stars({ value = 0, onChange, size = 16 }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="stars" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={(hover || value) >= i - 0.25 ? 'on' : ''}
          onMouseEnter={() => onChange && setHover(i)}
          onClick={() => onChange && onChange(i)}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        />
      ))}
    </span>
  );
}

export function Empty({ icon = '✨', title, text, action }) {
  return (
    <div className="empty fade-up">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((t) => {
        const v = typeof t === 'string' ? t : t.value;
        const l = typeof t === 'string' ? t : t.label;
        return (
          <button key={v} className={`tab ${value === v ? 'active' : ''}`} onClick={() => onChange(v)}>
            {l}
          </button>
        );
      })}
    </div>
  );
}

export function Progress({ value, max = 100, tone }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress">
      <div className={`progress-bar ${tone ? 'tone-' + tone : ''}`} style={{ width: pct + '%' }} />
    </div>
  );
}

export function Ring({ value, max = 100, size = 120, stroke = 10, label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="ring-bg" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="ring-fg"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-text">
        <strong>{label}</strong>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}

export function confetti(count = 90) {
  if (document.documentElement.classList.contains('reduce-motion')) return;
  const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  const wrap = document.createElement('div');
  wrap.className = 'confetti';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 3600);
}

export function Skeleton({ h = 16, w = '100%' }) {
  return <div className="skeleton" style={{ height: h, width: w }} />;
}
