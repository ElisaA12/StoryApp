
// Timeline & Relationship Graph
const { useState } = React;

// ─── TIMELINE ───────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
  { id: 1, year: 'Year 0',    label: 'The Shattering',       type: 'world',     color: '#c8917e', desc: 'The Veil tears. Veilfire spreads across Ironmere.', arc: null },
  { id: 2, year: 'Year 9',    label: 'Lyra orphaned',        type: 'character',  color: '#e8c87a', desc: 'Veilfire takes her parents. Lyra survives alone.', arc: 'Lyra' },
  { id: 3, year: 'Year 10',   label: 'Hollow Court founded', type: 'faction',   color: '#9b7ec8', desc: 'Edren Mourne establishes the Archivists.', arc: null },
  { id: 4, year: 'Year 15',   label: 'Lyra recruited',       type: 'character',  color: '#e8c87a', desc: 'Edren discovers Lyra and brings her to the Court.', arc: 'Lyra' },
  { id: 5, year: 'Year 18',   label: 'The Ember Awakens',    type: 'magic',     color: '#c9a055', desc: 'Lyra channels Veilfire for the first time. Nearly dies.', arc: 'Lyra' },
  { id: 6, year: 'Year 20',   label: 'Lyra leaves the Court',type: 'character',  color: '#e8c87a', desc: 'She escapes with nothing. The Court is not happy.', arc: 'Lyra' },
  { id: 7, year: 'Year 21',   label: 'The Crown surfaces',   type: 'world',     color: '#c8917e', desc: 'Rumors of the Ashen Crown reach Ironmere.', arc: null },
  { id: 8, year: 'Year 24',   label: 'Chapter I begins',     type: 'story',     color: '#6b9fd4', desc: 'Present day. Lyra arrives in Ironmere.', arc: 'Lyra' },
];

const SUB_PLOTS = [
  { id: 'main', label: 'Main Plot', color: '#c9a055' },
  { id: 'lyra', label: "Lyra's Arc", color: '#e8c87a' },
  { id: 'edren', label: "Edren's Arc", color: '#6b9fd4' },
];

function TimelineView() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const typeColors = {
    world: '#c8917e', character: '#e8c87a', faction: '#9b7ec8',
    magic: '#c9a055', story: '#6b9fd4',
  };

  const filtered = activeFilter === 'all' ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter(e => e.type === activeFilter);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '11px', color: '#c9a055', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>The Ashen Crown · Chronology</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Timeline</h1>
      </div>

      {/* Sub-plot lanes header */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', padding: '14px 20px',
        display: 'flex', gap: '20px', alignItems: 'center',
      }}>
        <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tracks</span>
        {SUB_PLOTS.map(sp => (
          <div key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '2px', background: sp.color, borderRadius: '1px' }} />
            <span style={{ fontSize: '11px', color: 'rgba(240,232,213,0.5)' }}>{sp.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          {['all', 'character', 'world', 'magic', 'faction'].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '4px 10px', borderRadius: '5px', border: `1px solid ${activeFilter === f ? typeColors[f] || '#c9a055' : 'rgba(255,255,255,0.08)'}`,
              background: activeFilter === f ? `${typeColors[f] || '#c9a055'}18` : 'transparent',
              color: activeFilter === f ? (typeColors[f] || '#c9a055') : 'rgba(240,232,213,0.35)',
              fontSize: '10px', cursor: 'pointer', textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Timeline track */}
      <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '8px' }}>
        {/* Track lines */}
        <div style={{ position: 'relative', minWidth: '800px' }}>
          {/* Horizontal axis */}
          <div style={{
            position: 'absolute', top: '60px', left: '0', right: '0',
            height: '1px', background: 'rgba(255,255,255,0.06)',
          }} />

          {/* Events row */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start', padding: '0 20px' }}>
            {filtered.map((ev, i) => (
              <div key={ev.id} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer', position: 'relative',
                paddingTop: i % 2 === 0 ? '0' : '80px',
              }}
                onClick={() => setActiveEvent(activeEvent?.id === ev.id ? null : ev)}
              >
                {/* Year label */}
                <div style={{
                  fontSize: '9px', color: 'rgba(240,232,213,0.3)',
                  marginBottom: '8px', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  position: i % 2 !== 0 ? 'absolute' : 'static',
                  top: i % 2 !== 0 ? '0' : 'auto',
                }}>{ev.year}</div>

                {/* Connector line */}
                <div style={{
                  width: '1px', height: i % 2 === 0 ? '24px' : '24px',
                  background: `${ev.color}44`,
                }} />

                {/* Node */}
                <div style={{
                  width: activeEvent?.id === ev.id ? '14px' : '10px',
                  height: activeEvent?.id === ev.id ? '14px' : '10px',
                  borderRadius: '50%',
                  background: activeEvent?.id === ev.id ? ev.color : 'rgba(7,7,14,0.9)',
                  border: `2px solid ${ev.color}`,
                  transition: 'all 0.2s',
                  boxShadow: activeEvent?.id === ev.id ? `0 0 16px ${ev.color}66` : 'none',
                  zIndex: 1,
                  flexShrink: 0,
                }} />

                {/* Label below node */}
                <div style={{ width: '1px', height: '16px', background: `${ev.color}44` }} />
                <div style={{
                  fontSize: '10px', color: activeEvent?.id === ev.id ? ev.color : 'rgba(240,232,213,0.5)',
                  textAlign: 'center', maxWidth: '80px', lineHeight: '1.3',
                  transition: 'color 0.2s', fontWeight: activeEvent?.id === ev.id ? 600 : 400,
                }}>{ev.label}</div>

                {/* Type badge */}
                <div style={{
                  marginTop: '6px', fontSize: '8px', padding: '1px 5px', borderRadius: '3px',
                  background: `${ev.color}18`, color: ev.color, textTransform: 'capitalize',
                }}>{ev.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event detail */}
      {activeEvent && (
        <div style={{
          padding: '20px 24px', borderRadius: '14px',
          background: `${activeEvent.color}08`, border: `1px solid ${activeEvent.color}22`,
          display: 'flex', gap: '20px', alignItems: 'flex-start',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
            background: `${activeEvent.color}18`, border: `1px solid ${activeEvent.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: 700,
            color: activeEvent.color,
          }}>{activeEvent.year.replace('Year ', '')}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#f0e8d5', fontWeight: 600 }}>{activeEvent.label}</div>
            <div style={{ fontSize: '13px', color: 'rgba(240,232,213,0.55)', marginTop: '6px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{activeEvent.desc}</div>
          </div>
          <button onClick={() => setActiveEvent(null)} style={{
            background: 'transparent', border: 'none', color: 'rgba(240,232,213,0.3)',
            cursor: 'pointer', fontSize: '16px', padding: '4px',
          }}>×</button>
        </div>
      )}

      {/* Emotional arc bars */}
      <div>
        <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Emotional Arc — Lyra Voss</div>
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '20px',
          display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px',
        }}>
          {[18, 35, 45, 55, 40, 65, 72, 88].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${h}%`,
                background: `linear-gradient(180deg, #e8c87a88, #e8c87a22)`,
                borderRadius: '4px 4px 0 0',
                border: '1px solid #e8c87a33',
                borderBottom: 'none',
                transition: 'height 0.6s ease',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          {['Denial', '', 'Loss', '', 'Isolation', '', 'Reckoning', 'Acceptance'].map((l, i) => (
            <span key={i} style={{ fontSize: '9px', color: 'rgba(240,232,213,0.25)', textAlign: 'center', flex: 1 }}>{l}</span>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ─── RELATIONSHIP GRAPH ──────────────────────────────────────────────────────

const REL_NODES = [
  { id: 'lyra',    label: 'Lyra Voss',          x: 50, y: 45, color: '#e8c87a', role: 'Protagonist' },
  { id: 'edren',   label: 'Edren Mourne',        x: 78, y: 30, color: '#6b9fd4', role: 'Antagonist' },
  { id: 'sable',   label: 'Sable',               x: 24, y: 28, color: '#7ec89b', role: 'Ally' },
  { id: 'court',   label: 'Hollow Court',        x: 80, y: 68, color: '#9b7ec8', role: 'Faction' },
  { id: 'ferris',  label: 'Ferris',              x: 22, y: 70, color: '#c8917e', role: 'Contact' },
  { id: 'crown',   label: 'Ashen Crown',         x: 50, y: 15, color: '#c9a055', role: 'Artifact' },
];

const REL_EDGES = [
  { a: 'lyra', b: 'edren',  type: 'Nemesis',   color: '#c87e7e' },
  { a: 'lyra', b: 'sable',  type: 'Ally',       color: '#7ec89b' },
  { a: 'lyra', b: 'ferris', type: 'Contact',    color: '#c8917e' },
  { a: 'lyra', b: 'crown',  type: 'Seeks',      color: '#c9a055' },
  { a: 'edren', b: 'court', type: 'Leads',      color: '#9b7ec8' },
  { a: 'edren', b: 'crown', type: 'Seeks',      color: '#c9a055' },
  { a: 'sable', b: 'ferris',type: 'Knows',      color: '#7ec8c8' },
  { a: 'court', b: 'crown', type: 'Guards',     color: '#9b7ec8' },
];

function RelationshipGraph() {
  const [hovered, setHovered] = useState(null);
  const nodeById = Object.fromEntries(REL_NODES.map(n => [n.id, n]));

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#c9a055', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>The Ashen Crown · Network</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Relationship Graph</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', flex: 1 }}>
        {/* Graph */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '480px',
        }}>
          <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              {REL_NODES.map(n => (
                <radialGradient key={n.id} id={`rglow-${n.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={n.color} stopOpacity="0.5"/>
                  <stop offset="100%" stopColor={n.color} stopOpacity="0"/>
                </radialGradient>
              ))}
              <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill="rgba(255,255,255,0.15)" />
              </marker>
            </defs>

            {/* Edges */}
            {REL_EDGES.map((e, i) => {
              const na = nodeById[e.a], nb = nodeById[e.b];
              const isHov = hovered === e.a || hovered === e.b;
              const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
              return (
                <g key={i}>
                  <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={isHov ? e.color : 'rgba(255,255,255,0.07)'}
                    strokeWidth={isHov ? '0.6' : '0.3'}
                    markerEnd={isHov ? 'url(#arrow)' : ''}
                    style={{ transition: 'all 0.3s' }}
                  />
                  {isHov && (
                    <text x={mx} y={my - 1} textAnchor="middle" fontSize="2" fill={e.color} fontFamily="sans-serif">{e.type}</text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {REL_NODES.map(n => {
              const isHov = hovered === n.id;
              const r = 4.5;
              return (
                <g key={n.id} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle cx={n.x} cy={n.y} r={isHov ? r * 3 : r * 2} fill={`url(#rglow-${n.id})`} style={{ transition: 'r 0.3s' }} />
                  <circle cx={n.x} cy={n.y} r={isHov ? r + 1 : r}
                    fill={isHov ? n.color : 'rgba(10,10,18,0.9)'}
                    stroke={n.color} strokeWidth={n.id === 'lyra' ? '1' : '0.6'}
                    style={{ transition: 'all 0.25s' }}
                  />
                  <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                    fontSize="2.5" fill={isHov ? '#07070e' : n.color}
                    fontFamily="sans-serif" style={{ transition: 'fill 0.25s', pointerEvents: 'none' }}
                  >{n.label[0]}</text>
                  <text x={n.x} y={n.y + r + 3} textAnchor="middle"
                    fontSize="2.2" fill={isHov ? '#f0e8d5' : 'rgba(240,232,213,0.45)'}
                    fontFamily="sans-serif" style={{ pointerEvents: 'none' }}
                  >{n.label}</text>
                  {isHov && (
                    <text x={n.x} y={n.y + r + 5.5} textAnchor="middle"
                      fontSize="1.8" fill={n.color} fontFamily="sans-serif"
                      style={{ pointerEvents: 'none' }}
                    >{n.role}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Entities</div>
            {REL_NODES.map(n => (
              <div key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 0', cursor: 'pointer',
                  opacity: hovered && hovered !== n.id ? 0.4 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12px', color: '#f0e8d5' }}>{n.label}</div>
                  <div style={{ fontSize: '9px', color: 'rgba(240,232,213,0.3)' }}>{n.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Bond Types</div>
            {[...new Set(REL_EDGES.map(e => e.type))].map((type, i) => {
              const edge = REL_EDGES.find(e => e.type === type);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                  <div style={{ width: '16px', height: '1px', background: edge.color }} />
                  <span style={{ fontSize: '11px', color: 'rgba(240,232,213,0.45)' }}>{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TimelineView, RelationshipGraph });
