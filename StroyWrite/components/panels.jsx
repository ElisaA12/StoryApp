
// Command Menu + Inspiration Panel + Maps + Encyclopedia — store-driven, full CRUD
const { useState, useEffect, useRef, useCallback } = React;

// ─── COMMAND MENU ─────────────────────────────────────────────────────────────
function CommandMenu({ open, onClose, setActiveView }) {
  const characters  = useStore(d => d.characters);
  const chapters    = useStore(d => d.chapters);
  const mapPins     = useStore(d => d.mapPins);
  const encyclopedia = useStore(d => d.encyclopedia);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const NAV_ITEMS = [
    { id: 'dashboard',     label: 'Constellation Hub',   icon: '✦', type: 'view', color: '#c9a055' },
    { id: 'editor',        label: 'Manuscript Editor',   icon: '✍', type: 'view', color: '#c9a055' },
    { id: 'characters',    label: 'Characters',          icon: '◈', type: 'view', color: '#e8c87a' },
    { id: 'timeline',      label: 'Timeline',            icon: '◫', type: 'view', color: '#9b7ec8' },
    { id: 'relationships', label: 'Relationship Graph',  icon: '⬡', type: 'view', color: '#c87ec8' },
    { id: 'lore',          label: 'Encyclopedia',        icon: '◬', type: 'view', color: '#7ec89b' },
    { id: 'maps',          label: 'Maps',                icon: '◉', type: 'view', color: '#6b9fd4' },
    { id: 'inspiration',   label: 'Inspiration Board',   icon: '✧', type: 'view', color: '#7ec8c8' },
  ];

  const dynamicItems = [
    ...characters.map(c => ({ id: `char-${c.id}`, label: c.name, icon: '◈', type: 'character', color: c.avatar_color || '#e8c87a' })),
    ...chapters.map(ch => ({ id: ch.id, label: ch.title, icon: '✍', type: 'chapter', color: '#c9a055' })),
    ...mapPins.map(p => ({ id: `place-${p.id}`, label: p.label, icon: '◉', type: 'place', color: p.color || '#6b9fd4' })),
    ...(encyclopedia || []).flatMap(cat => (cat.entries || []).map(e => ({ id: 'lore', label: e.name, icon: '◬', type: 'lore', color: '#9b7ec8' }))),
  ];

  const ALL_ITEMS = [...NAV_ITEMS, ...dynamicItems];

  const filtered = query
    ? ALL_ITEMS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || i.type.toLowerCase().includes(query.toLowerCase()))
    : ALL_ITEMS;

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    const handler = e => {
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { if (filtered[selected]) { setActiveView(filtered[selected].id); onClose(); } }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected]);

  if (!open) return null;

  const grouped = {};
  filtered.forEach(item => { if (!grouped[item.type]) grouped[item.type] = []; grouped[item.type].push(item); });
  let globalIdx = 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }} onClick={onClose}>
      <div style={{ width: '560px', borderRadius: '16px', background: 'rgba(12,12,20,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', overflow: 'hidden', animation: 'cmdIn 0.18s cubic-bezier(0.34,1.56,0.64,1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ color: '#c9a055', fontSize: '14px' }}>⌘</span>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search characters, scenes, lore…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f0e8d5', fontSize: '15px', fontFamily: "'DM Sans', sans-serif" }} />
          <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.2)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px' }}>ESC</span>
        </div>
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px 0', scrollbarWidth: 'none' }}>
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div style={{ padding: '6px 18px 4px', fontSize: '10px', color: 'rgba(240,232,213,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{type}</div>
              {items.map(item => {
                const idx = globalIdx++;
                const isSel = idx === selected;
                return (
                  <div key={`${item.id}-${idx}`} onClick={() => { setActiveView(item.id); onClose(); }} onMouseEnter={() => setSelected(idx)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 18px', cursor: 'pointer', background: isSel ? 'rgba(201,160,85,0.1)' : 'transparent', transition: 'background 0.1s' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${item.color}18`, border: `1px solid ${item.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: item.color, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1, fontSize: '13px', color: isSel ? '#f0e8d5' : 'rgba(240,232,213,0.7)' }}>{item.label}</div>
                    {isSel && <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px' }}>↵</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(240,232,213,0.3)', fontSize: '13px' }}>No results for "{query}"</div>}
        </div>
        <div style={{ padding: '8px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '14px' }}>
          {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([key, label]) => (
            <span key={key} style={{ fontSize: '10px', color: 'rgba(240,232,213,0.2)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>{key}</span>{label}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes cmdIn { from { opacity:0; transform: scale(0.95) translateY(-8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}

// ─── ENCYCLOPEDIA ─────────────────────────────────────────────────────────────
function EntryModal({ existing, categoryId, onClose }) {
  const [form, setForm] = useState(existing ? { ...existing } : { name: '', summary: '', tags: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f0e8d5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
  const save = () => {
    if (!form.name.trim()) return;
    if (existing) { Store.updateEncyclopediaEntry(categoryId, existing.id, form); }
    else { Store.addEncyclopediaEntry(categoryId, { ...form, id: genId() }); }
    onClose();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} autoFocus /></div>
      <div><label style={labelStyle}>Summary</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} value={form.summary || ''} onChange={e => set('summary', e.target.value)} /></div>
      <div><label style={labelStyle}>Tags (comma-separated)</label><input style={inputStyle} value={form.tags || ''} onChange={e => set('tags', e.target.value)} placeholder="magic, artifact…" /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onClose} style={{ ..._cancelBtn }}>Cancel</button>
        <button onClick={save} style={{ ..._saveBtn }}>Save Entry</button>
      </div>
    </div>
  );
}

function CategoryModal({ onClose }) {
  const CAT_COLORS = ['#9b7ec8', '#6b9fd4', '#c8917e', '#c9a055', '#7ec89b', '#e8c87a', '#c87ec8', '#7ec8c8'];
  const [name, setName] = useState('');
  const [color, setColor] = useState('#9b7ec8');
  const inputStyle = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f0e8d5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
  const save = () => {
    if (!name.trim()) return;
    Store.addEncyclopediaCategory({ id: genId(), name: name.trim(), color, entries: [] });
    onClose();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Category Name *</label>
        <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="e.g. Artifacts, Factions…" />
      </div>
      <div>
        <label style={{ fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Color</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CAT_COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid white' : '2px solid transparent', boxSizing: 'border-box' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onClose} style={{ ..._cancelBtn }}>Cancel</button>
        <button onClick={save} style={{ ..._saveBtn }}>Create Category</button>
      </div>
    </div>
  );
}

function EncyclopediaView() {
  const encyclopedia = useStore(d => d.encyclopedia) || [];
  const [search, setSearch] = useState('');
  const [openCat, setOpenCat] = useState(null);
  const [openEntry, setOpenEntry] = useState(null);

  const openAddCat = () => window.openModal(<CategoryModal onClose={() => window.closeModal()} />);
  const openAddEntry = catId => window.openModal(<EntryModal categoryId={catId} onClose={() => window.closeModal()} />);
  const openEditEntry = (catId, entry) => window.openModal(<EntryModal existing={entry} categoryId={catId} onClose={() => window.closeModal()} />);
  const deleteEntry = (catId, entryId) => { if (confirm('Delete entry?')) Store.deleteEncyclopediaEntry(catId, entryId); };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7ec89b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Knowledge Base</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Encyclopedia</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries…"
              style={{ padding: '9px 14px 9px 36px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#f0e8d5', fontSize: '12px', outline: 'none', width: '200px' }} />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,232,213,0.3)', fontSize: '12px' }}>⌕</span>
          </div>
          <button onClick={openAddCat} style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(126,200,155,0.12)', border: '1px solid rgba(126,200,155,0.25)', color: '#7ec89b', fontSize: '12px', cursor: 'pointer' }}>+ Category</button>
        </div>
      </div>

      {encyclopedia.length === 0
        ? <div style={{ textAlign: 'center', color: 'rgba(240,232,213,0.25)', fontSize: '13px', padding: '60px 0', fontStyle: 'italic' }}>No categories yet. Create one above.</div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {encyclopedia.map(cat => {
              const filtered = (cat.entries || []).filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.summary || '').toLowerCase().includes(search.toLowerCase()));
              if (search && filtered.length === 0) return null;
              return (
                <div key={cat.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color || '#9b7ec8' }} />
                    <span style={{ fontSize: '12px', color: cat.color || '#9b7ec8', fontWeight: 600, letterSpacing: '0.05em', flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.25)' }}>{(cat.entries || []).length} entries</span>
                    <button onClick={() => openAddEntry(cat.id)} style={{ fontSize: '12px', background: 'none', border: 'none', color: cat.color || '#9b7ec8', cursor: 'pointer', padding: '2px 6px', opacity: 0.7 }}>+</button>
                  </div>
                  {filtered.map(entry => (
                    <div key={entry.id}
                      style={{ padding: '9px 12px', borderRadius: '8px', marginBottom: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = `${cat.color || '#9b7ec8'}10`}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#f0e8d5', flex: 1 }} onClick={() => setOpenEntry(openEntry?.id === entry.id ? null : entry)}>{entry.name}</span>
                        <button onClick={() => openEditEntry(cat.id, entry)} style={{ fontSize: '10px', background: 'none', border: 'none', color: 'rgba(240,232,213,0.3)', cursor: 'pointer', padding: '2px 4px' }}>✎</button>
                        <button onClick={() => deleteEntry(cat.id, entry.id)} style={{ fontSize: '12px', background: 'none', border: 'none', color: 'rgba(200,120,100,0.5)', cursor: 'pointer', padding: '2px 4px' }}>×</button>
                      </div>
                      {openEntry?.id === entry.id && entry.summary && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(240,232,213,0.5)', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", lineHeight: '1.6' }}>{entry.summary}</div>
                      )}
                    </div>
                  ))}
                  {filtered.length === 0 && !search && (
                    <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.2)', fontStyle: 'italic', padding: '4px 0' }}>No entries yet.</div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ─── MAPS ─────────────────────────────────────────────────────────────────────
function PinModal({ existing, onClose }) {
  const blank = { label: '', type: 'City', color: '#c9a055', desc: '', x: 50, y: 50 };
  const [form, setForm] = useState(existing ? { ...existing } : blank);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f0e8d5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '10px', color: 'rgba(240,232,213,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
  const save = () => {
    if (!form.label.trim()) return;
    if (existing) { Store.updateMapPin(existing.id, form); }
    else { Store.addMapPin({ ...form, id: genId() }); }
    onClose();
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div><label style={labelStyle}>Name *</label><input style={inputStyle} value={form.label} onChange={e => set('label', e.target.value)} autoFocus /></div>
        <div><label style={labelStyle}>Type</label>
          <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
            {['City', 'Town', 'Village', 'Fortress', 'Forest', 'Region', 'Ruin', 'Landmark', 'Other'].map(t => <option key={t} style={{ background: '#07070e' }}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
        <div><label style={labelStyle}>X position (%)</label><input style={inputStyle} type="number" min="0" max="100" value={form.x} onChange={e => set('x', Number(e.target.value))} /></div>
        <div><label style={labelStyle}>Y position (%)</label><input style={inputStyle} type="number" min="0" max="100" value={form.y} onChange={e => set('y', Number(e.target.value))} /></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '2px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.35)' }}>Color</span>
          <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: '32px', height: '28px', border: 'none', background: 'none', cursor: 'pointer' }} />
        </div>
      </div>
      <div><label style={labelStyle}>Description</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }} value={form.desc || ''} onChange={e => set('desc', e.target.value)} /></div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onClose} style={{ ..._cancelBtn }}>Cancel</button>
        <button onClick={save} style={{ ..._saveBtn }}>Save Pin</button>
      </div>
    </div>
  );
}

function MapsView() {
  const mapPins = useStore(d => d.mapPins);
  const [activePin, setActivePin] = useState(null);
  const [mapBg, setMapBg] = useState(null);
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);
  const bgRef = useRef(null);

  const openAddPin = () => window.openModal(<PinModal onClose={() => window.closeModal()} />);
  const openEditPin = pin => window.openModal(<PinModal existing={pin} onClose={() => window.closeModal()} />);
  const deletePin = pin => { if (confirm(`Delete pin "${pin.label}"?`)) { Store.deleteMapPin(pin.id); if (activePin?.id === pin.id) setActivePin(null); } };

  const handleBgUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setMapBg(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Drag logic: mousedown on pin → track window mousemove → mouseup release
  const startDrag = useCallback((e, pin) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(pin.id);

    const onMove = ev => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((ev.clientY - rect.top) / rect.height) * 100));
      Store.updateMapPin(pin.id, { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    };
    const onUp = () => {
      setDragging(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const activePinData = mapPins.find(p => p.id === activePin?.id);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#6b9fd4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Cartography</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Interactive Maps</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button onClick={() => bgRef.current.click()} style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(107,159,212,0.08)', border: '1px solid rgba(107,159,212,0.2)', color: '#6b9fd4', fontSize: '12px', cursor: 'pointer' }}>Upload Map</button>
          <input ref={bgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBgUpload} />
          <button onClick={openAddPin} style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(201,160,85,0.12)', border: '1px solid rgba(201,160,85,0.25)', color: 'var(--gold)', fontSize: '12px', cursor: 'pointer' }}>+ Pin</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', flex: 1 }}>
        {/* Map canvas */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '480px' }}>
          {mapBg
            ? <img src={mapBg} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(0.6)' }} />
            : (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 45%, rgba(201,160,85,0.04) 0%, transparent 70%), radial-gradient(ellipse at 70% 60%, rgba(107,159,212,0.03) 0%, transparent 60%)' }} />
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
                  <defs><pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,160,85,1)" strokeWidth="0.5" /></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#mapgrid)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.12)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Upload a world map image above</div>
                </div>
              </>
            )
          }

          {/* SVG pin overlay */}
          <svg ref={svgRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: dragging ? 'grabbing' : 'default' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {mapPins.map(pin => {
              const isActive = activePin?.id === pin.id;
              const isDragging = dragging === pin.id;
              return (
                <g key={pin.id} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  onClick={() => !isDragging && setActivePin(isActive ? null : pin)}
                  onMouseDown={e => startDrag(e, pin)}>
                  <circle cx={pin.x} cy={pin.y} r={isActive ? 3.5 : 2.5} fill={pin.color || '#c9a055'} opacity="0.9" style={{ transition: isDragging ? 'none' : 'r 0.2s' }} />
                  <circle cx={pin.x} cy={pin.y} r={isActive ? 6 : 4} fill="none" stroke={pin.color || '#c9a055'} strokeWidth="0.4" opacity="0.35" />
                  <text x={pin.x + 3.5} y={pin.y + 0.7} fontSize="2.5" fill={pin.color || '#c9a055'} fontFamily="sans-serif" style={{ pointerEvents: 'none' }}>{pin.label}</text>
                </g>
              );
            })}
          </svg>

          {/* Active pin detail */}
          {activePinData && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', padding: '14px 18px', borderRadius: '12px', background: 'rgba(7,7,14,0.9)', backdropFilter: 'blur(12px)', border: `1px solid ${activePinData.color || '#c9a055'}33` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#f0e8d5', fontWeight: 600 }}>{activePinData.label}</div>
                  <div style={{ fontSize: '11px', color: activePinData.color || '#c9a055', marginTop: '2px' }}>{activePinData.type}</div>
                  {activePinData.desc && <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.45)', marginTop: '6px', fontStyle: 'italic' }}>{activePinData.desc}</div>}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                  <button onClick={() => openEditPin(activePinData)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(240,232,213,0.6)', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => deletePin(activePinData)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(200,100,100,0.3)', background: 'rgba(200,100,100,0.08)', color: 'rgba(200,100,100,0.7)', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                  <button onClick={() => setActivePin(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(240,232,213,0.3)', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Pins ({mapPins.length})</div>
            {mapPins.map(pin => (
              <div key={pin.id} onClick={() => setActivePin(activePin?.id === pin.id ? null : pin)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', opacity: activePin && activePin.id !== pin.id ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: pin.color || '#c9a055', flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', color: activePin?.id === pin.id ? '#f0e8d5' : 'rgba(240,232,213,0.55)', flex: 1 }}>{pin.label}</span>
                <span style={{ fontSize: '9px', color: pin.color || '#c9a055' }}>{pin.type}</span>
              </div>
            ))}
            {mapPins.length === 0 && <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.2)', fontStyle: 'italic' }}>No pins yet.</div>}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px', fontSize: '10px', color: 'rgba(240,232,213,0.2)', lineHeight: '1.6', fontStyle: 'italic' }}>
            Drag pins on map to reposition. Changes save automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INSPIRATION PANEL ────────────────────────────────────────────────────────
function InspirationPanel() {
  const ambientSounds  = useStore(d => d.ambientSounds)  || [];
  const moodImages     = useStore(d => d.moodImages)     || [];
  const writingPrompts = useStore(d => d.writingPrompts) || [];
  const storyTags      = useStore(d => d.storyTags)      || [];

  const [promptIdx, setPromptIdx] = useState(0);
  const [newTag, setNewTag] = useState('');
  const imgInputRef = useRef(null);

  const activeSound = ambientSounds.find(s => s.active);

  const addImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const caption = file.name.replace(/\.[^.]+$/, '');
    const reader = new FileReader();
    reader.onload = ev => Store.addMoodImage({ url: ev.target.result, caption });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addTag = () => { if (!newTag.trim()) return; Store.addStoryTag(newTag.trim()); setNewTag(''); };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#7ec8c8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Creative Space</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Inspiration Board</h1>
      </div>

      {/* YouTube hidden iframe for ambient sound */}
      {activeSound && activeSound.youtubeId && (
        <iframe
          key={activeSound.id}
          src={`https://www.youtube.com/embed/${activeSound.youtubeId}?autoplay=1&loop=1&playlist=${activeSound.youtubeId}&controls=0&mute=0`}
          style={{ display: 'none' }}
          allow="autoplay"
          title="ambient"
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        {/* Moodboard */}
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Moodboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {moodImages.map((img, i) => (
              <div key={i} style={{ borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', aspectRatio: '3/2' }}
                onMouseEnter={e => { const cap = e.currentTarget.querySelector('.caption'); if(cap) cap.style.opacity='1'; }}
                onMouseLeave={e => { const cap = e.currentTarget.querySelector('.caption'); if(cap) cap.style.opacity='0'; }}>
                <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.6) brightness(0.8)' }} />
                <div className="caption" style={{ position: 'absolute', inset: 0, background: 'rgba(7,7,14,0.75)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '8px 10px', opacity: 0, transition: 'opacity 0.2s' }}>
                  <span style={{ fontSize: '10px', color: '#f0e8d5' }}>{img.caption}</span>
                  <button onClick={() => Store.deleteMoodImage(i)} style={{ background: 'rgba(200,100,100,0.3)', border: 'none', borderRadius: '4px', color: '#f0e8d5', fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>×</button>
                </div>
              </div>
            ))}
            <div onClick={() => imgInputRef.current.click()} style={{ borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)', aspectRatio: '3/2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(240,232,213,0.2)', fontSize: '11px', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>+</span><span>Add image</span>
            </div>
            <input ref={imgInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={addImage} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Writing prompt */}
          <div style={{ background: 'rgba(124,200,200,0.06)', border: '1px solid rgba(124,200,200,0.15)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Writing Prompt</div>
            {writingPrompts.length > 0
              ? <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#f0e8d5', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '16px' }}>"{writingPrompts[promptIdx % writingPrompts.length]}"</div>
              : <div style={{ fontSize: '13px', color: 'rgba(240,232,213,0.25)', fontStyle: 'italic', marginBottom: '16px' }}>No prompts in store.</div>
            }
            <button onClick={() => setPromptIdx(p => p + 1)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(124,200,200,0.2)', background: 'rgba(124,200,200,0.08)', color: '#7ec8c8', fontSize: '11px', cursor: 'pointer' }}>✦ New Prompt</button>
          </div>

          {/* Ambient sounds */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Ambient Sound</div>
            {ambientSounds.map(s => (
              <div key={s.id} onClick={() => Store.toggleAmbientSound(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', marginBottom: '6px', background: s.active ? 'rgba(201,160,85,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.active ? 'rgba(201,160,85,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer' }}>
                <span style={{ fontSize: '14px' }}>{s.icon}</span>
                <span style={{ fontSize: '12px', color: s.active ? '#c9a055' : 'rgba(240,232,213,0.5)', flex: 1 }}>{s.label}</span>
                {s.active && <span style={{ fontSize: '9px', color: '#c9a055' }}>▶ Playing</span>}
              </div>
            ))}
            {ambientSounds.length === 0 && <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.2)', fontStyle: 'italic' }}>No ambient tracks configured.</div>}
          </div>

          {/* Story tags */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Story Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {storyTags.map(tag => (
                <span key={tag} style={{ padding: '4px 9px', borderRadius: '5px', fontSize: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,232,213,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,100,100,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                  {tag}
                  <span style={{ opacity: 0.5 }} onClick={() => Store.removeStoryTag(tag)}>×</span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag…"
                style={{ flex: 1, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#f0e8d5', fontSize: '11px', outline: 'none' }} />
              <button onClick={addTag} style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(240,232,213,0.5)', fontSize: '12px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandMenu, InspirationPanel, MapsView, EncyclopediaView });
