
// Character Sheet — store-driven, full CRUD
const { useState, useCallback, useRef } = React;

// Radar chart (unchanged math)
function RadarChart({ stats, size = 240, color = '#e8c87a' }) {
  const keys = Object.keys(stats);
  const values = keys.map(k => stats[k] / 100);
  const n = keys.length;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const labelR = size * 0.47;
  const angleFor = i => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pointFor = (i, frac) => ({ x: cx + Math.cos(angleFor(i)) * r * frac, y: cy + Math.sin(angleFor(i)) * r * frac });
  const spokes = keys.map((_, i) => { const e = pointFor(i, 1); return `M${cx},${cy} L${e.x},${e.y}`; });
  const rings = [0.25, 0.5, 0.75, 1].map(frac => { const pts = keys.map((_, i) => pointFor(i, frac)); return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'; });
  const dataPts = values.map((v, i) => pointFor(i, v));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const labels = keys.map((k, i) => { const a = angleFor(i); return { key: k, x: cx + Math.cos(a) * labelR, y: cy + Math.sin(a) * labelR, val: stats[k] }; });
  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {rings.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />)}
      {spokes.map((d, i) => <path key={i} d={d} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />)}
      <path d={dataPath} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      {dataPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />)}
      {labels.map((l, i) => (
        <g key={i}>
          <text x={l.x} y={l.y - 4} textAnchor="middle" fontSize="9" fill="rgba(240,232,213,0.5)" fontFamily="DM Sans, sans-serif">{l.key}</text>
          <text x={l.x} y={l.y + 8} textAnchor="middle" fontSize="10" fill={color} fontFamily="DM Sans, sans-serif" fontWeight="600">{l.val}</text>
        </g>
      ))}
    </svg>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'DM Sans, sans-serif' }}>{children}</div>;
}

// ── Add/Edit Character modal ──────────────────────────────────────────────────
function CharacterModal({ existing, onClose }) {
  const STAT_KEYS = ['Cunning', 'Resolve', 'Empathy', 'Combat', 'Magic', 'Influence'];
  const blank = { name: '', epithet: '', role: '', age: '', origin: '', faction: '', status: 'Active', bio: '', avatar_color: '#e8c87a', avatar_img: null, traits: [], stats: { Cunning: 50, Resolve: 50, Empathy: 50, Combat: 50, Magic: 50, Influence: 50 }, relationships: [], arc: [] };
  const [form, setForm] = useState(existing ? { ...existing, traits: [...(existing.traits || [])], relationships: [...(existing.relationships || [])], arc: [...(existing.arc || [])] } : blank);
  const [newTrait, setNewTrait] = useState('');
  const [newRelName, setNewRelName] = useState('');
  const [newRelType, setNewRelType] = useState('Ally');
  const [newRelColor, setNewRelColor] = useState('#7ec89b');
  const imgRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setStat = (k, v) => setForm(f => ({ ...f, stats: { ...f.stats, [k]: Number(v) } }));

  const handleImg = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('avatar_img', ev.target.result);
    reader.readAsDataURL(file);
  };

  const addTrait = () => { if (!newTrait.trim()) return; set('traits', [...form.traits, newTrait.trim()]); setNewTrait(''); };
  const removeTrait = i => set('traits', form.traits.filter((_, idx) => idx !== i));

  const addRel = () => {
    if (!newRelName.trim()) return;
    set('relationships', [...form.relationships, { name: newRelName.trim(), type: newRelType, color: newRelColor }]);
    setNewRelName(''); setNewRelType('Ally'); setNewRelColor('#7ec89b');
  };
  const removeRel = i => set('relationships', form.relationships.filter((_, idx) => idx !== i));

  const addArc = () => set('arc', [...form.arc, { act: `Act ${form.arc.length + 1}`, note: '' }]);
  const updateArc = (i, field, val) => set('arc', form.arc.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  const removeArc = i => set('arc', form.arc.filter((_, idx) => idx !== i));

  const save = () => {
    if (!form.name.trim()) return;
    const data = { ...form, age: form.age ? Number(form.age) : 0, avatar_initial: form.name.slice(0, 2).toUpperCase() };
    if (existing) { Store.updateCharacter(existing.id, data); }
    else { Store.addCharacter({ ...data, id: genId() }); }
    onClose();
  };

  const inputStyle = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f0e8d5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
      {/* Avatar + name row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: `${form.avatar_color}22`, border: `1px solid ${form.avatar_color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
            onClick={() => imgRef.current.click()}>
            {form.avatar_img
              ? <img src={form.avatar_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: form.avatar_color }}>{form.name ? form.name.slice(0, 2).toUpperCase() : '?'}</span>}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
              <span style={{ fontSize: '20px' }}>📷</span>
            </div>
          </div>
          <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImg} />
          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.35)' }}>Color</span>
            <input type="color" value={form.avatar_color} onChange={e => set('avatar_color', e.target.value)} style={{ width: '28px', height: '20px', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Character name" autoFocus /></div>
          <div><label style={labelStyle}>Epithet</label><input style={inputStyle} value={form.epithet} onChange={e => set('epithet', e.target.value)} placeholder='"The Last Ember"' /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div><label style={labelStyle}>Role</label><input style={inputStyle} value={form.role} onChange={e => set('role', e.target.value)} placeholder="Protagonist" /></div>
            <div><label style={labelStyle}>Age</label><input style={inputStyle} type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="24" /></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div><label style={labelStyle}>Origin</label><input style={inputStyle} value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="City / region" /></div>
        <div><label style={labelStyle}>Faction</label><input style={inputStyle} value={form.faction} onChange={e => set('faction', e.target.value)} placeholder="Guild, house…" /></div>
        <div><label style={labelStyle}>Status</label>
          <select style={{ ...inputStyle }} value={form.status} onChange={e => set('status', e.target.value)}>
            {['Active', 'Deceased', 'Missing', 'Unknown'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div><label style={labelStyle}>Biography</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', lineHeight: '1.5' }} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Character backstory…" />
      </div>

      {/* Stats sliders */}
      <div>
        <SectionLabel>Stats</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {STAT_KEYS.map(k => (
            <div key={k}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'rgba(240,232,213,0.5)' }}>{k}</span>
                <span style={{ fontSize: '11px', color: form.avatar_color, fontWeight: 600 }}>{form.stats[k]}</span>
              </div>
              <input type="range" min="0" max="100" value={form.stats[k]} onChange={e => setStat(k, e.target.value)}
                style={{ width: '100%', accentColor: form.avatar_color }} />
            </div>
          ))}
        </div>
      </div>

      {/* Traits */}
      <div>
        <SectionLabel>Traits</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {form.traits.map((t, i) => (
            <span key={i} style={{ padding: '4px 8px', borderRadius: '5px', background: `${form.avatar_color}15`, border: `1px solid ${form.avatar_color}30`, color: form.avatar_color, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {t}
              <span style={{ cursor: 'pointer', opacity: 0.5 }} onClick={() => removeTrait(i)}>×</span>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input style={{ ...inputStyle, flex: 1 }} value={newTrait} onChange={e => setNewTrait(e.target.value)} placeholder="Add trait…"
            onKeyDown={e => e.key === 'Enter' && addTrait()} />
          <button onClick={addTrait} style={{ padding: '8px 12px', borderRadius: '6px', background: `${form.avatar_color}20`, border: `1px solid ${form.avatar_color}40`, color: form.avatar_color, fontSize: '12px', cursor: 'pointer' }}>+</button>
        </div>
      </div>

      {/* Relationships */}
      <div>
        <SectionLabel>Relationships</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
          {form.relationships.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '7px', background: `${r.color}0a`, border: `1px solid ${r.color}22` }}>
              <input type="color" value={r.color} onChange={e => set('relationships', form.relationships.map((x, xi) => xi === i ? { ...x, color: e.target.value } : x))} style={{ width: '20px', height: '20px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '12px', color: '#f0e8d5' }}>{r.name}</span>
              <span style={{ fontSize: '10px', color: r.color }}>{r.type}</span>
              <span style={{ cursor: 'pointer', color: 'rgba(240,232,213,0.3)', fontSize: '14px' }} onClick={() => removeRel(i)}>×</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input style={{ ...inputStyle, flex: 2 }} value={newRelName} onChange={e => setNewRelName(e.target.value)} placeholder="Name…" onKeyDown={e => e.key === 'Enter' && addRel()} />
          <select style={{ ...inputStyle, flex: 1 }} value={newRelType} onChange={e => setNewRelType(e.target.value)}>
            {['Ally', 'Enemy', 'Nemesis', 'Mentor', 'Contact', 'Rival', 'Family', 'Love'].map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="color" value={newRelColor} onChange={e => setNewRelColor(e.target.value)} style={{ width: '36px', border: 'none', background: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
          <button onClick={addRel} style={{ padding: '8px 12px', borderRadius: '6px', background: `${form.avatar_color}20`, border: `1px solid ${form.avatar_color}40`, color: form.avatar_color, fontSize: '12px', cursor: 'pointer' }}>+</button>
        </div>
      </div>

      {/* Arc */}
      <div>
        <SectionLabel>Character Arc</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          {form.arc.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, width: '70px', flexShrink: 0 }} value={a.act} onChange={e => updateArc(i, 'act', e.target.value)} />
              <input style={{ ...inputStyle, flex: 1 }} value={a.note} onChange={e => updateArc(i, 'note', e.target.value)} placeholder="Beat note…" />
              <span style={{ cursor: 'pointer', color: 'rgba(240,232,213,0.3)', fontSize: '14px', flexShrink: 0 }} onClick={() => removeArc(i)}>×</span>
            </div>
          ))}
        </div>
        <button onClick={addArc} style={{ fontSize: '11px', color: 'rgba(240,232,213,0.35)', background: 'none', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', width: '100%' }}>+ Add Act Beat</button>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
        <button onClick={onClose} style={{ ..._cancelBtn }}>Cancel</button>
        <button onClick={save} style={{ ..._saveBtn }}>Save Character</button>
      </div>
    </div>
  );
}

// ── Main CharacterSheet component ────────────────────────────────────────────
function CharacterSheet({ activeView }) {
  const characters = useStore(d => d.characters);
  const [activeTab, setActiveTab] = useState('profile');
  const [activeCharId, setActiveCharId] = useState(null);

  // resolve which character to show
  let charId = activeCharId;
  if (!charId && activeView && activeView.startsWith('char-')) {
    charId = activeView.replace('char-', '');
  }
  const c = characters.find(x => x.id === charId) || characters[0] || null;

  const TABS = ['profile', 'stats', 'relationships', 'arc'];

  const openAddModal = () => window.openModal(
    <CharacterModal onClose={() => window.closeModal()} />
  );

  const openEditModal = () => { if (!c) return; window.openModal(
    <CharacterModal existing={c} onClose={() => window.closeModal()} />
  ); };

  const deleteChar = () => {
    if (!c) return;
    if (!confirm(`Delete "${c.name}"?`)) return;
    Store.deleteCharacter(c.id);
    setActiveCharId(null);
  };

  if (!c) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ fontSize: '40px', opacity: 0.2 }}>◈</div>
      <div style={{ color: 'rgba(240,232,213,0.3)', fontSize: '14px' }}>No characters yet</div>
      <button onClick={openAddModal} style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(201,160,85,0.15)', border: '1px solid rgba(201,160,85,0.3)', color: 'var(--gold)', fontSize: '13px', cursor: 'pointer' }}>+ Create Character</button>
    </div>
  );

  const color = c.avatar_color || '#e8c87a';

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Character switcher tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {characters.map(ch => (
          <button key={ch.id} onClick={() => setActiveCharId(ch.id)}
            style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11.5px', cursor: 'pointer', border: `1px solid ${(c.id === ch.id) ? (ch.avatar_color || 'var(--gold)') + '55' : 'rgba(255,255,255,0.08)'}`, background: c.id === ch.id ? `${ch.avatar_color || 'var(--gold)'}18` : 'rgba(255,255,255,0.03)', color: c.id === ch.id ? (ch.avatar_color || 'var(--gold)') : 'rgba(240,232,213,0.45)', transition: 'all 0.15s' }}>
            {ch.name}
          </button>
        ))}
        <button onClick={openAddModal}
          style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11.5px', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(240,232,213,0.25)' }}>
          + Add
        </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '28px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '16px', flexShrink: 0, background: c.avatar_img ? 'transparent' : `linear-gradient(135deg, ${color}33, ${color}11)`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 700, color, boxShadow: `0 0 40px ${color}22`, overflow: 'hidden' }}>
          {c.avatar_img ? <img src={c.avatar_img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (c.avatar_initial || c.name.slice(0, 2).toUpperCase())}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Character Profile</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>{c.name}</h1>
          {c.epithet && <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: 'rgba(240,232,213,0.45)', fontStyle: 'italic', marginTop: '2px' }}>"{c.epithet}"</div>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[c.role, c.age ? `Age ${c.age}` : null, c.origin, c.status].filter(Boolean).map(tag => (
              <span key={tag} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,232,213,0.55)' }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={openEditModal} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,232,213,0.6)', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
          <button onClick={deleteChar} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(200,120,100,0.3)', background: 'rgba(200,120,100,0.08)', color: 'rgba(200,120,100,0.7)', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 18px', border: 'none', background: 'transparent', color: activeTab === t ? '#f0e8d5' : 'rgba(240,232,213,0.35)', fontSize: '12px', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.04em', borderBottom: `2px solid ${activeTab === t ? color : 'transparent'}`, transition: 'all 0.2s', marginBottom: '-1px' }}>
            {t === 'arc' ? 'Character Arc' : t}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <SectionLabel>Biography</SectionLabel>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', lineHeight: '1.8', color: 'rgba(240,232,213,0.75)', whiteSpace: 'pre-line' }}>{c.bio || <span style={{ opacity: 0.3, fontStyle: 'italic' }}>No biography yet.</span>}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <SectionLabel>Traits</SectionLabel>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(c.traits || []).map(t => (
                  <span key={t} style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', background: `${color}12`, border: `1px solid ${color}30`, color }}>{t}</span>
                ))}
                {(!c.traits || !c.traits.length) && <span style={{ fontSize: '12px', color: 'rgba(240,232,213,0.25)', fontStyle: 'italic' }}>No traits defined</span>}
              </div>
            </div>
            <div>
              <SectionLabel>Details</SectionLabel>
              {[{ label: 'Faction', val: c.faction }, { label: 'Origin', val: c.origin }, { label: 'Status', val: c.status }].map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(240,232,213,0.35)' }}>{d.label}</span>
                  <span style={{ fontSize: '12px', color: '#f0e8d5' }}>{d.val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          <div>
            <SectionLabel>Attribute Radar</SectionLabel>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <RadarChart stats={c.stats || { Cunning: 50, Resolve: 50, Empathy: 50, Combat: 50, Magic: 50, Influence: 50 }} size={280} color={color} />
            </div>
          </div>
          <div>
            <SectionLabel>Stats Breakdown</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              {Object.entries(c.stats || {}).map(([key, val]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(240,232,213,0.55)' }}>{key}</span>
                    <span style={{ fontSize: '12px', color, fontWeight: 600 }}>{val}</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', width: `${val}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: '2px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relationships tab */}
      {activeTab === 'relationships' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {(c.relationships || []).map((r, i) => (
              <div key={i} style={{ padding: '16px', borderRadius: '12px', background: `${r.color}08`, border: `1px solid ${r.color}22`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${r.color}18`, border: `1px solid ${r.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: r.color, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", flexShrink: 0 }}>{r.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#f0e8d5', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: '10px', color: r.color, marginTop: '2px' }}>{r.type}</div>
                </div>
              </div>
            ))}
            <button onClick={openEditModal} style={{ padding: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,232,213,0.25)', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>+</span> Add Relationship
            </button>
          </div>
        </div>
      )}

      {/* Arc tab */}
      {activeTab === 'arc' && (
        <div>
          <SectionLabel>Emotional Arc</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {(c.arc || []).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0, background: `${color}${(12 + i * 12).toString(16)}`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '11px', color, textAlign: 'center' }}>{a.act}</div>
                <div style={{ flex: 1, padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#f0e8d5', marginBottom: '4px' }}>{a.note.split(' — ')[0]}</div>
                  {a.note.includes(' — ') && <div style={{ fontSize: '12px', color: 'rgba(240,232,213,0.4)', fontStyle: 'italic' }}>{a.note.split(' — ')[1]}</div>}
                </div>
              </div>
            ))}
            {(!c.arc || !c.arc.length) && <div style={{ color: 'rgba(240,232,213,0.25)', fontSize: '13px', fontStyle: 'italic' }}>No arc beats defined yet. Edit character to add some.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CharacterSheet });
