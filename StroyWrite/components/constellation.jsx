
// Constellation Hub — store-driven stats + live recent activity
const { useState, useEffect, useRef } = React;

const EDGES = [
  ['editor','characters'], ['editor','places'], ['editor','timeline'],
  ['editor','lore'], ['characters','relationships'], ['characters','timeline'],
  ['places','maps'], ['places','lore'], ['timeline','lore'],
  ['inspiration','editor'], ['inspiration','characters'],
  ['relationships','characters'], ['lore','inspiration'],
];

function ConstellationHub({ setActiveView }) {
  const characters   = useStore(d => d.characters);
  const chapters     = useStore(d => d.chapters);
  const mapPins      = useStore(d => d.mapPins);
  const timelineEvs  = useStore(d => d.timelineEvents);
  const encyclopedia = useStore(d => d.encyclopedia) || [];
  const recentActs   = useStore(d => d.recentActivity) || [];

  const [hovered, setHovered] = useState(null);
  const [pulse, setPulse] = useState(0);
  const svgRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => p + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const totalWords   = getTotalWordCount(chapters);
  const entryCount   = encyclopedia.reduce((sum, cat) => sum + (cat.entries || []).length, 0);

  // Build nodes dynamically with live counts
  const NODES = [
    { id: 'editor',        label: 'Manuscript',   icon: '✍', x: 50, y: 50, color: '#c9a055', count: `${chapters.length} ch`,        desc: `${totalWords.toLocaleString()} words` },
    { id: 'characters',    label: 'Characters',   icon: '◈', x: 22, y: 28, color: '#e8c87a', count: `${characters.length} profiles`,  desc: 'Character sheets' },
    { id: 'places',        label: 'Places',       icon: '◉', x: 78, y: 28, color: '#6b9fd4', count: `${mapPins.length} locations`,   desc: 'World map pins' },
    { id: 'timeline',      label: 'Timeline',     icon: '◫', x: 18, y: 72, color: '#9b7ec8', count: `${timelineEvs.length} events`,   desc: 'Chronology' },
    { id: 'lore',          label: 'Encyclopedia', icon: '◬', x: 82, y: 72, color: '#7ec89b', count: `${entryCount} entries`,         desc: `${encyclopedia.length} categories` },
    { id: 'relationships', label: 'Relationships',icon: '⬡', x: 30, y: 85, color: '#c87ec8', count: `${characters.length} nodes`,    desc: 'Relationship graph' },
    { id: 'maps',          label: 'Maps',         icon: '◭', x: 70, y: 85, color: '#c8917e', count: `${mapPins.length} pins`,        desc: 'Cartography' },
    { id: 'inspiration',   label: 'Inspiration',  icon: '✧', x: 50, y: 18, color: '#7ec8c8', count: 'Moodboard',                    desc: 'Prompts & ambient' },
  ];

  const nodeById = Object.fromEntries(NODES.map(n => [n.id, n]));

  // Recent activity: from store if available, else synthesize from data
  const recent = recentActs.length > 0 ? recentActs.slice(0, 5) : [
    ...characters.slice(0, 2).map(c => ({ icon: '◈', color: c.avatar_color || '#e8c87a', label: `${c.name} — character`, ts: Date.now() - 60000 })),
    ...chapters.slice(0, 1).map(ch => ({ icon: '✍', color: '#c9a055', label: ch.title, ts: Date.now() - 3600000 })),
    ...timelineEvs.slice(0, 1).map(e => ({ icon: '◫', color: '#9b7ec8', label: e.label, ts: Date.now() - 7200000 })),
    ...mapPins.slice(0, 1).map(p => ({ icon: '◉', color: '#6b9fd4', label: `${p.label} — map pin`, ts: Date.now() - 86400000 })),
  ].slice(0, 5);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#c9a055', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Constellation View</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 600, color: '#f0e8d5', margin: 0, lineHeight: 1.1 }}>Your World, Alive</h1>
          <p style={{ color: 'rgba(240,232,213,0.4)', fontSize: '13px', margin: '8px 0 0' }}>Click any node to navigate · Connections show narrative relationships</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <StatPill label="Words"      value={totalWords.toLocaleString()} color="#c9a055" />
          <StatPill label="Chapters"   value={chapters.length}             color="#6b9fd4" />
          <StatPill label="Characters" value={characters.length}           color="#e8c87a" />
          <StatPill label="Entities"   value={entryCount + mapPins.length + characters.length} color="#9b7ec8" />
        </div>
      </div>

      {/* Main */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', flex: 1 }}>
        {/* Constellation SVG */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '460px' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(240,232,213,1)" strokeWidth="0.5" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <svg ref={svgRef} style={{ width: '100%', height: '100%', position: 'relative' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              {NODES.map(n => (
                <radialGradient key={n.id} id={`glow-${n.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={n.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {EDGES.map(([a, b], i) => {
              const na = nodeById[a], nb = nodeById[b];
              if (!na || !nb) return null;
              const isHov = hovered === a || hovered === b;
              return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={isHov ? na.color : 'rgba(240,232,213,0.08)'} strokeWidth={isHov ? '0.4' : '0.2'}
                style={{ transition: 'all 0.3s' }} strokeDasharray={isHov ? 'none' : '1 2'} />;
            })}

            {NODES.map(n => {
              const isHov = hovered === n.id;
              const isCentral = n.id === 'editor';
              const r = isCentral ? 6 : 4;
              return (
                <g key={n.id} style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
                  onClick={() => setActiveView(n.id)}>
                  <circle cx={n.x} cy={n.y} r={isHov ? r * 3.5 : r * 2.5} fill={`url(#glow-${n.id})`} style={{ transition: 'r 0.3s' }} />
                  {isCentral && <circle cx={n.x} cy={n.y} r={r + 3 + (pulse % 2) * 0.5} fill="none" stroke="#c9a055" strokeWidth="0.3" opacity="0.3" style={{ transition: 'r 2s ease' }} />}
                  <circle cx={n.x} cy={n.y} r={isHov ? r + 0.8 : r}
                    fill={isHov ? n.color : 'rgba(7,7,14,0.9)'} stroke={n.color}
                    strokeWidth={isCentral ? '0.8' : '0.5'} style={{ transition: 'all 0.25s' }} />
                  <text x={n.x} y={n.y + 0.4} textAnchor="middle" dominantBaseline="middle"
                    fontSize={isCentral ? '3.5' : '2.5'} fill={isHov ? '#07070e' : n.color}
                    style={{ transition: 'fill 0.25s', fontFamily: 'sans-serif', pointerEvents: 'none' }}>{n.icon}</text>
                  <text x={n.x} y={n.y + r + 2.8} textAnchor="middle"
                    fontSize="2.2" fill={isHov ? '#f0e8d5' : 'rgba(240,232,213,0.5)'}
                    style={{ transition: 'fill 0.25s', fontFamily: 'sans-serif', pointerEvents: 'none' }}>{n.label}</text>
                  {isHov && <text x={n.x} y={n.y + r + 5.2} textAnchor="middle"
                    fontSize="1.8" fill={n.color} style={{ fontFamily: 'sans-serif', pointerEvents: 'none' }}>{n.count}</text>}
                </g>
              );
            })}
          </svg>

          {hovered && nodeById[hovered] && (() => {
            const n = nodeById[hovered];
            return (
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(7,7,14,0.9)', backdropFilter: 'blur(12px)', border: `1px solid ${n.color}33`, pointerEvents: 'none' }}>
                <div style={{ fontSize: '13px', color: n.color, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{n.label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.5)', marginTop: '2px' }}>{n.count} · {n.desc}</div>
              </div>
            );
          })()}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recent activity */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Recent Activity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recent.length === 0
                ? <div style={{ fontSize: '12px', color: 'rgba(240,232,213,0.2)', fontStyle: 'italic' }}>No activity yet.</div>
                : recent.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, background: `${r.color || '#c9a055'}18`, border: `1px solid ${r.color || '#c9a055'}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: r.color || '#c9a055' }}>{r.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#f0e8d5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)' }}>{r.ts ? formatTimeAgo(r.ts) : ''}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Word goal */}
          <div style={{ background: 'rgba(201,160,85,0.06)', border: '1px solid rgba(201,160,85,0.15)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Total Progress</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px', fontFamily: "'Cormorant Garamond', serif", color: '#c9a055', fontWeight: 600 }}>{totalWords.toLocaleString()}</span>
              <span style={{ fontSize: '11px', color: 'rgba(240,232,213,0.35)' }}>words written</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (totalWords / 80000) * 100)}%`, background: 'linear-gradient(90deg, #c9a055, #e8c87a)', borderRadius: '2px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', marginTop: '8px' }}>{chapters.length} chapter{chapters.length !== 1 ? 's' : ''} · {characters.length} character{characters.length !== 1 ? 's' : ''} · {timelineEvs.length} events</div>
          </div>

          {/* Quick actions */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Write Manuscript',    icon: '✍', view: 'editor',      color: '#c9a055' },
                { label: 'Add Character',       icon: '◈', view: 'characters',  color: '#e8c87a' },
                { label: 'Log Timeline Event',  icon: '◫', view: 'timeline',    color: '#9b7ec8' },
                { label: 'Add Encyclopedia Entry', icon: '◬', view: 'lore',    color: '#7ec89b' },
              ].map(a => (
                <button key={a.label} onClick={() => setActiveView(a.view)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', color: '#f0e8d5', fontSize: '12px', textAlign: 'left', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${a.color}18`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <span style={{ color: a.color }}>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.35)', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}

Object.assign(window, { ConstellationHub });
