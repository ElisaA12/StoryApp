
// Timeline & Relationship Graph — store-driven, full CRUD
const { useState, useCallback } = React;

const TYPE_COLORS = {
  world: '#c8917e', character: '#e8c87a', faction: '#9b7ec8',
  magic: '#c9a055', story: '#6b9fd4',
};

// ── Event modal ───────────────────────────────────────────────────────────────
function EventModal({ existing, onClose }) {
  const characters = useStore(d => d.characters);
  const blank = { year: '', label: '', type: 'story', desc: '', arc: '' };
  const [form, setForm] = useState(existing ? { ...existing } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.label.trim() || !form.year.trim()) return;
    if (existing) { Store.updateTimelineEvent(existing.id, form); }
    else { Store.addTimelineEvent({ ...form, id: genId(), color: TYPE_COLORS[form.type] || '#c9a055' }); }
    onClose();
  };

  const inputStyle = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f0e8d5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div><label style={labelStyle}>Year / Date *</label><input style={inputStyle} value={form.year} onChange={e => set('year', e.target.value)} placeholder="Year 24" autoFocus /></div>
        <div><label style={labelStyle}>Type</label>
          <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
            {Object.keys(TYPE_COLORS).map(t => <option key={t} value={t} style={{ background: '#07070e', textTransform: 'capitalize' }}>{t}</option>)}
          </select>
        </div>
      </div>
      <div><label style={labelStyle}>Event Title *</label><input style={inputStyle} value={form.label} onChange={e => set('label', e.target.value)} placeholder="The Crown surfaces" /></div>
      <div><label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.5' }} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="What happened…" />
      </div>
      <div><label style={labelStyle}>Character Arc (optional)</label>
        <select style={inputStyle} value={form.arc || ''} onChange={e => set('arc', e.target.value)}>
          <option value="">— none —</option>
          {characters.map(c => <option key={c.id} value={c.name} style={{ background: '#07070e' }}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
        <button onClick={onClose} style={{ ..._cancelBtn }}>Cancel</button>
        <button onClick={save} style={{ ..._saveBtn }}>Save Event</button>
      </div>
    </div>
  );
}

// ── Timeline view ─────────────────────────────────────────────────────────────
function TimelineView() {
  const events = useStore(d => d.timelineEvents);
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all' ? events : events.filter(e => e.type === activeFilter);

  const openAdd = () => window.openModal(<EventModal onClose={() => window.closeModal()} />);
  const openEdit = ev => window.openModal(<EventModal existing={ev} onClose={() => window.closeModal()} />);
  const deleteEv = ev => { if (confirm(`Delete "${ev.label}"?`)) { Store.deleteTimelineEvent(ev.id); if (activeEvent?.id === ev.id) setActiveEvent(null); } };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#c9a055', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Chronology</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Timeline</h1>
        </div>
        <button onClick={openAdd} style={{ padding: '9px 16px', borderRadius: '8px', background: 'rgba(201,160,85,0.15)', border: '1px solid rgba(201,160,85,0.3)', color: 'var(--gold)', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}>+ Add Event</button>
      </div>

      {/* Filter bar */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 18px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: '4px' }}>Filter</span>
        {['all', ...Object.keys(TYPE_COLORS)].map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            padding: '4px 10px', borderRadius: '5px',
            border: `1px solid ${activeFilter === f ? (TYPE_COLORS[f] || '#c9a055') : 'rgba(255,255,255,0.08)'}`,
            background: activeFilter === f ? `${TYPE_COLORS[f] || '#c9a055'}18` : 'transparent',
            color: activeFilter === f ? (TYPE_COLORS[f] || '#c9a055') : 'rgba(240,232,213,0.35)',
            fontSize: '10px', cursor: 'pointer', textTransform: 'capitalize',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(240,232,213,0.25)' }}>{filtered.length} events</span>
      </div>

      {/* Timeline track */}
      {filtered.length === 0
        ? <div style={{ textAlign: 'center', color: 'rgba(240,232,213,0.25)', fontSize: '13px', padding: '40px 0', fontStyle: 'italic' }}>No events yet. Add one above.</div>
        : (
          <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ position: 'relative', minWidth: `${Math.max(800, filtered.length * 110)}px` }}>
              <div style={{ position: 'absolute', top: '68px', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', padding: '0 20px' }}>
                {filtered.map((ev, i) => {
                  const color = ev.color || TYPE_COLORS[ev.type] || '#c9a055';
                  const isActive = activeEvent?.id === ev.id;
                  return (
                    <div key={ev.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative', paddingTop: i % 2 === 0 ? '0' : '80px', minWidth: '90px' }}
                      onClick={() => setActiveEvent(isActive ? null : ev)}>
                      <div style={{ fontSize: '9px', color: 'rgba(240,232,213,0.3)', marginBottom: '8px', letterSpacing: '0.05em', whiteSpace: 'nowrap', position: i % 2 !== 0 ? 'absolute' : 'static', top: i % 2 !== 0 ? '0' : 'auto' }}>{ev.year}</div>
                      <div style={{ width: '1px', height: '24px', background: `${color}44` }} />
                      <div style={{ width: isActive ? '14px' : '10px', height: isActive ? '14px' : '10px', borderRadius: '50%', background: isActive ? color : 'rgba(7,7,14,0.9)', border: `2px solid ${color}`, transition: 'all 0.2s', boxShadow: isActive ? `0 0 16px ${color}66` : 'none', zIndex: 1, flexShrink: 0 }} />
                      <div style={{ width: '1px', height: '16px', background: `${color}44` }} />
                      <div style={{ fontSize: '10px', color: isActive ? color : 'rgba(240,232,213,0.5)', textAlign: 'center', maxWidth: '80px', lineHeight: '1.3', transition: 'color 0.2s', fontWeight: isActive ? 600 : 400 }}>{ev.label}</div>
                      <div style={{ marginTop: '6px', fontSize: '8px', padding: '1px 5px', borderRadius: '3px', background: `${color}18`, color, textTransform: 'capitalize' }}>{ev.type}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      }

      {/* Event detail */}
      {activeEvent && (
        <div style={{ padding: '20px 24px', borderRadius: '14px', background: `${activeEvent.color || '#c9a055'}08`, border: `1px solid ${activeEvent.color || '#c9a055'}22`, display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0, background: `${activeEvent.color || '#c9a055'}18`, border: `1px solid ${activeEvent.color || '#c9a055'}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '11px', fontWeight: 700, color: activeEvent.color || '#c9a055', textAlign: 'center' }}>{activeEvent.year}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#f0e8d5', fontWeight: 600 }}>{activeEvent.label}</div>
            {activeEvent.desc && <div style={{ fontSize: '13px', color: 'rgba(240,232,213,0.55)', marginTop: '6px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>{activeEvent.desc}</div>}
            {activeEvent.arc && <div style={{ marginTop: '8px', fontSize: '10px', color: 'rgba(240,232,213,0.3)' }}>Arc: {activeEvent.arc}</div>}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button onClick={() => openEdit(activeEvent)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,232,213,0.6)', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => deleteEv(activeEvent)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(200,120,100,0.3)', background: 'rgba(200,120,100,0.08)', color: 'rgba(200,120,100,0.7)', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setActiveEvent(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(240,232,213,0.3)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>×</button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── Relationship Graph — built dynamically from store characters ───────────────
function RelationshipGraph() {
  const characters = useStore(d => d.characters);
  const [hovered, setHovered] = useState(null);

  // Build nodes from characters, arranging in a circle
  const nodes = characters.map((c, i) => {
    const angle = (i / characters.length) * 2 * Math.PI - Math.PI / 2;
    const r = characters.length <= 1 ? 0 : 35;
    return {
      id: c.id,
      label: c.name,
      x: 50 + Math.cos(angle) * r,
      y: 50 + Math.sin(angle) * r,
      color: c.avatar_color || '#e8c87a',
      role: c.role || c.status || 'Character',
      initial: c.name[0],
    };
  });

  // Build edges from character.relationships fields
  const edges = [];
  characters.forEach(c => {
    (c.relationships || []).forEach(rel => {
      const target = characters.find(x => x.name === rel.name);
      if (target) {
        edges.push({ a: c.id, b: target.id, type: rel.type, color: rel.color || '#c9a055' });
      }
    });
  });

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Unique bond types for legend
  const bondTypes = [...new Map(edges.map(e => [e.type, e])).values()];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#c9a055', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Character Network</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Relationship Graph</h1>
      </div>

      {characters.length === 0
        ? <div style={{ textAlign: 'center', color: 'rgba(240,232,213,0.25)', fontSize: '13px', padding: '60px 0', fontStyle: 'italic' }}>No characters yet. Create some in Characters view.</div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', flex: 1 }}>
            {/* Graph */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '480px' }}>
              <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {nodes.map(n => (
                    <radialGradient key={n.id} id={`rglow-${n.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={n.color} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                    </radialGradient>
                  ))}
                  <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                    <path d="M0,0 L4,2 L0,4 Z" fill="rgba(255,255,255,0.15)" />
                  </marker>
                </defs>

                {/* Edges */}
                {edges.map((e, i) => {
                  const na = nodeById[e.a], nb = nodeById[e.b];
                  if (!na || !nb) return null;
                  const isHov = hovered === e.a || hovered === e.b;
                  const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
                  return (
                    <g key={i}>
                      <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                        stroke={isHov ? e.color : 'rgba(255,255,255,0.07)'}
                        strokeWidth={isHov ? '0.6' : '0.3'}
                        markerEnd={isHov ? 'url(#arrow)' : ''}
                        style={{ transition: 'all 0.3s' }} />
                      {isHov && <text x={mx} y={my - 1} textAnchor="middle" fontSize="2" fill={e.color} fontFamily="sans-serif">{e.type}</text>}
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map(n => {
                  const isHov = hovered === n.id;
                  const r = 4.5;
                  return (
                    <g key={n.id} style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHovered(n.id)}
                      onMouseLeave={() => setHovered(null)}>
                      <circle cx={n.x} cy={n.y} r={isHov ? r * 3 : r * 2} fill={`url(#rglow-${n.id})`} style={{ transition: 'r 0.3s' }} />
                      <circle cx={n.x} cy={n.y} r={isHov ? r + 1 : r}
                        fill={isHov ? n.color : 'rgba(10,10,18,0.9)'}
                        stroke={n.color} strokeWidth="0.7"
                        style={{ transition: 'all 0.25s' }} />
                      <text x={n.x} y={n.y + 0.5} textAnchor="middle" dominantBaseline="middle"
                        fontSize="2.5" fill={isHov ? '#07070e' : n.color}
                        fontFamily="sans-serif" style={{ transition: 'fill 0.25s', pointerEvents: 'none' }}>{n.initial}</text>
                      <text x={n.x} y={n.y + r + 3} textAnchor="middle"
                        fontSize="2.2" fill={isHov ? '#f0e8d5' : 'rgba(240,232,213,0.45)'}
                        fontFamily="sans-serif" style={{ pointerEvents: 'none' }}>{n.label}</text>
                      {isHov && <text x={n.x} y={n.y + r + 5.5} textAnchor="middle"
                        fontSize="1.8" fill={n.color} fontFamily="sans-serif"
                        style={{ pointerEvents: 'none' }}>{n.role}</text>}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Characters</div>
                {nodes.map(n => (
                  <div key={n.id}
                    onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', cursor: 'pointer', opacity: hovered && hovered !== n.id ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#f0e8d5' }}>{n.label}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(240,232,213,0.3)' }}>{n.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              {bondTypes.length > 0 && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Bond Types</div>
                  {bondTypes.map((e, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                      <div style={{ width: '16px', height: '1px', background: e.color }} />
                      <span style={{ fontSize: '11px', color: 'rgba(240,232,213,0.45)' }}>{e.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }
    </div>
  );
}

Object.assign(window, { TimelineView, RelationshipGraph });
