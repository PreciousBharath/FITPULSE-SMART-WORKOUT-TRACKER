// Stylised front/back body map — click a muscle group to filter
const REGIONS = {
  front: [
    { m: 'Shoulders', d: 'M58 62 q-14 4 -16 20 l12 4 q4 -14 12 -16z M122 62 q14 4 16 20 l-12 4 q-4 -14 -12 -16z' },
    { m: 'Chest', d: 'M66 66 h22 v26 q-14 4 -24 -4z M92 66 h22 l2 22 q-10 8 -24 4z' },
    { m: 'Biceps', d: 'M42 88 l12 4 l-4 30 l-12 -4z M138 88 l-12 4 l4 30 l12 -4z' },
    { m: 'Core', d: 'M70 96 h40 v52 q-20 8 -40 0z' },
    { m: 'Quads', d: 'M68 156 h20 l-2 64 h-16z M92 156 h20 l-2 64 h-16z' },
    { m: 'Calves', d: 'M70 226 h14 l-2 46 h-10z M96 226 h14 l-2 46 h-10z' },
  ],
  back: [
    { m: 'Shoulders', d: 'M58 62 q-14 4 -16 20 l12 4 q4 -14 12 -16z M122 62 q14 4 16 20 l-12 4 q-4 -14 -12 -16z' },
    { m: 'Back', d: 'M66 64 h48 l-4 60 q-20 8 -40 0z' },
    { m: 'Triceps', d: 'M42 88 l12 4 l-4 30 l-12 -4z M138 88 l-12 4 l4 30 l12 -4z' },
    { m: 'Glutes', d: 'M68 130 h44 v26 q-22 10 -44 0z' },
    { m: 'Hamstrings', d: 'M68 160 h20 l-2 60 h-16z M92 160 h20 l-2 60 h-16z' },
    { m: 'Calves', d: 'M70 226 h14 l-2 46 h-10z M96 226 h14 l-2 46 h-10z' },
  ],
};

export default function BodyMap({ value, onChange, heat = {} }) {
  return (
    <div className="bodymap">
      {['front', 'back'].map((side) => (
        <div key={side} className="bm-side">
          <svg viewBox="0 0 180 280">
            <circle cx="90" cy="34" r="20" className="bm-base" />
            <path d="M60 58 h60 q22 4 24 30 l-8 40 l-8 -2 l2 -30 l-6 8 v52 l-2 70 l-4 50 h-14 l-4 -64 l-4 64 h-14 l-4 -50 l-2 -70 v-52 l-6 -8 l2 30 l-8 2 l-8 -40 q2 -26 24 -30z" className="bm-base" />
            {REGIONS[side].map((r) => (
              <path
                key={r.m + side}
                d={r.d}
                className={`bm-region ${value === r.m ? 'active' : ''}`}
                style={{ '--heat': heat[r.m] || 0 }}
                onClick={() => onChange(value === r.m ? '' : r.m)}
              >
                <title>{r.m}</title>
              </path>
            ))}
          </svg>
          <small>{side}</small>
        </div>
      ))}
    </div>
  );
}
