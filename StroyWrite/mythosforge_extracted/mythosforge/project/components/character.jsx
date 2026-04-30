
// Character Sheet with Radar Chart
const { useState } = React;

const CHARACTER = {
  name: 'Lyra Voss',
  epithet: 'The Last Ember',
  role: 'Protagonist · Veilwalker',
  age: 24,
  origin: 'Ironmere Slums',
  faction: 'None (formerly: Hollow Court)',
  status: 'Active',
  avatar_initial: 'LV',
  avatar_color: '#e8c87a',
  bio: `Lyra Voss was nine years old when the Veilfire took her parents. She does not remember the shape of the flame — only the sound it made, like a voice trying to remember how to speak. She was raised in the foundling halls of Ironmere, picking pockets and running messages for the lesser smuggling guilds until an Archivist named Edren Mourne found her and recognized what she carried.\n\nShe spent six years in the Hollow Court. She left on her own terms, which is to say she left with nothing, which is the only way the Court lets you leave.`,
  stats: {
    Cunning: 88,
    Resolve: 72,
    Empathy: 65,
    Combat: 55,
    Magic: 91,
    Influence: 48,
  },
  traits: ['Pragmatic', 'Grief-hardened', 'Fiercely loyal', 'Distrustful of authority'],
  relationships: [
    { name: 'Edren Mourne', type: 'Nemesis', color: '#c8917e' },
    { name: 'Sable of Ashwood', type: 'Ally', color: '#7ec89b' },
    { name: 'The Hollow Court', type: 'Enemy', color: '#c87ec8' },
    { name: 'Ferris (smuggler)', type: 'Contact', color: '#6b9fd4' },
  ],
  arc: [
    { act: 'Act I', note: 'Denial — refuses the weight of the Ember' },
    { act: 'Act II', note: 'Reckoning — forced to use Veilfire, loses something' },
    { act: 'Act III', note: 'Acceptance — becomes what she feared' },
  ],
};

// Radar chart math
function RadarChart({ stats, size = 240, color = '#e8c87a' }) {
  const keys = Object.keys(stats);
  const values = Object.keys(stats).map(k => stats[k] / 100);
  const n = keys.length;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const labelR = size * 0.47;

  const angleFor = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pointFor = (i, frac) => ({
    x: cx + Math.cos(angleFor(i)) * r * frac,
    y: cy + Math.sin(angleFor(i)) * r * frac,
  });

  // Spokes
  const spokes = keys.map((_, i) => {
    const end = pointFor(i, 1);
    return `M${cx},${cy} L${end.x},${end.y}`;
  });

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1].map(frac => {
    const pts = keys.map((_, i) => pointFor(i, frac));
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  });

  // Data polygon
  const dataPts = values.map((v, i) => pointFor(i, v));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  // Labels
  const labels = keys.map((k, i) => {
    const angle = angleFor(i);
    const lx = cx + Math.cos(angle) * labelR;
    const ly = cy + Math.sin(angle) * labelR;
    return { key: k, x: lx, y: ly, val: stats[k] };
  });

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {/* Grid rings */}
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      ))}
      {/* Spokes */}
      {spokes.map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      ))}
      {/* Data fill */}
      <path d={dataPath} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      {/* Data points */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
      ))}
      {/* Labels */}
      {labels.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y - 4} textAnchor="middle" fontSize="9" fill="rgba(240,232,213,0.5)" fontFamily="DM Sans, sans-serif">{l.key}</text>
          <text x={l.x} y={l.y + 8} textAnchor="middle" fontSize="10" fill={color} fontFamily="DM Sans, sans-serif" fontWeight="600">{l.val}</text>
        </g>
      ))}
    </svg>
  );
}

function CharacterSheet() {
  const [activeTab, setActiveTab] = useState('profile');
  const c = CHARACTER;
  const TABS = ['profile', 'stats', 'relationships', 'arc'];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '28px' }}>
        {/* Avatar */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '16px', flexShrink: 0,
          background: `linear-gradient(135deg, ${c.avatar_color}33, ${c.avatar_color}11)`,
          border: `1px solid ${c.avatar_color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color: c.avatar_color,
          boxShadow: `0 0 40px ${c.avatar_color}22`,
        }}>{c.avatar_initial}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: c.avatar_color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Character Profile</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>{c.name}</h1>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: 'rgba(240,232,213,0.45)', fontStyle: 'italic', marginTop: '2px' }}>"{c.epithet}"</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[c.role, `Age ${c.age}`, c.origin, c.status].map(tag => (
              <span key={tag} style={{
                fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,232,213,0.55)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,232,213,0.6)', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
          <button style={{ padding: '8px 14px', borderRadius: '8px', border: `1px solid ${c.avatar_color}44`, background: `${c.avatar_color}12`, color: c.avatar_color, fontSize: '12px', cursor: 'pointer' }}>Link to Scene</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '10px 18px', border: 'none', background: 'transparent',
            color: activeTab === t ? '#f0e8d5' : 'rgba(240,232,213,0.35)',
            fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.04em',
            borderBottom: `2px solid ${activeTab === t ? c.avatar_color : 'transparent'}`,
            transition: 'all 0.2s', marginBottom: '-1px',
          }}>
            {t === 'arc' ? 'Character Arc' : t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <SectionLabel>Biography</SectionLabel>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', lineHeight: '1.8',
              color: 'rgba(240,232,213,0.75)', whiteSpace: 'pre-line',
            }}>{c.bio}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Traits</SectionLabel>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {c.traits.map(t => (
                  <span key={t} style={{
                    padding: '5px 10px', borderRadius: '6px', fontSize: '12px',
                    background: `${c.avatar_color}12`, border: `1px solid ${c.avatar_color}30`,
                    color: c.avatar_color,
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Details</SectionLabel>
              {[
                { label: 'Faction', val: c.faction },
                { label: 'Origin', val: c.origin },
                { label: 'Status', val: c.status },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(240,232,213,0.35)' }}>{d.label}</span>
                  <span style={{ fontSize: '12px', color: '#f0e8d5' }}>{d.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          <div>
            <SectionLabel>Attribute Radar</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <RadarChart stats={c.stats} size={280} color={c.avatar_color} />
            </div>
          </div>
          <div>
            <SectionLabel>Stats Breakdown</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {Object.entries(c.stats).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(240,232,213,0.55)' }}>{key}</span>
                    <span style={{ fontSize: '12px', color: c.avatar_color, fontWeight: 600 }}>{val}</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${c.avatar_color}88, ${c.avatar_color})`, borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relationships' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {c.relationships.map((r, i) => (
            <div key={i} style={{
              padding: '16px', borderRadius: '12px',
              background: `${r.color}08`, border: `1px solid ${r.color}22`,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${r.color}18`, border: `1px solid ${r.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', color: r.color, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif",
              }}>{r.name[0]}</div>
              <div>
                <div style={{ fontSize: '14px', color: '#f0e8d5', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: '10px', color: r.color, marginTop: '2px' }}>{r.type}</div>
              </div>
            </div>
          ))}
          <button style={{
            padding: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(240,232,213,0.25)', fontSize: '12px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <span>+</span> Add Relationship
          </button>
        </div>
      )}

      {activeTab === 'arc' && (
        <div>
          <SectionLabel>Emotional Arc</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {c.arc.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0,
                  background: `${c.avatar_color}${12 + i * 12}`,
                  border: `1px solid ${c.avatar_color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '11px', color: c.avatar_color,
                  textAlign: 'center',
                }}>{a.act}</div>
                <div style={{ flex: 1, padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#f0e8d5', marginBottom: '4px' }}>{a.note.split(' — ')[0]}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(240,232,213,0.4)', fontStyle: 'italic' }}>{a.note.split(' — ')[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>
      {children}
    </div>
  );
}

Object.assign(window, { CharacterSheet });
