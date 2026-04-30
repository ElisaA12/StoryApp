
// Command Menu (Cmd+K) + Inspiration Panel + Maps placeholder
const { useState, useEffect, useRef } = React;

// ─── COMMAND MENU ────────────────────────────────────────────────────────────

const ALL_ITEMS = [
  { id: 'dashboard',    label: 'Constellation Hub',    icon: '✦', type: 'view',      color: '#c9a055' },
  { id: 'editor',       label: 'Manuscript Editor',    icon: '✍', type: 'view',      color: '#c9a055' },
  { id: 'characters',   label: 'Characters',           icon: '◈', type: 'view',      color: '#e8c87a' },
  { id: 'timeline',     label: 'Timeline',             icon: '◫', type: 'view',      color: '#9b7ec8' },
  { id: 'relationships',label: 'Relationship Graph',   icon: '⬡', type: 'view',      color: '#c87ec8' },
  { id: 'char-lyra',    label: 'Lyra Voss',            icon: '◈', type: 'character', color: '#e8c87a' },
  { id: 'char-edren',   label: 'Edren Mourne',         icon: '◈', type: 'character', color: '#6b9fd4' },
  { id: 'char-sable',   label: 'Sable of the Ashwood', icon: '◈', type: 'character', color: '#7ec89b' },
  { id: 'chapter1',     label: 'Chapter I — The Veil', icon: '✍', type: 'chapter',   color: '#c9a055' },
  { id: 'chapter2',     label: 'Chapter II — Ash & Ember', icon: '✍', type: 'chapter', color: '#c9a055' },
  { id: 'lore',         label: 'Veilfire (Lore)',       icon: '◬', type: 'lore',      color: '#9b7ec8' },
  { id: 'lore',         label: 'Ashen Crown (Lore)',    icon: '◬', type: 'lore',      color: '#c9a055' },
  { id: 'place-ironmere',label: 'Ironmere',             icon: '◉', type: 'place',     color: '#6b9fd4' },
];

function CommandMenu({ open, onClose, setActiveView }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = query
    ? ALL_ITEMS.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.type.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS;

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
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
  filtered.forEach(item => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });

  let globalIdx = 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '15vh',
    }} onClick={onClose}>
      <div style={{
        width: '560px', borderRadius: '16px',
        background: 'rgba(12,12,20,0.98)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        animation: 'cmdIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
      }} onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <span style={{ color: '#c9a055', fontSize: '14px' }}>⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search characters, scenes, lore…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f0e8d5', fontSize: '15px', fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.2)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 5px', borderRadius: '4px' }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px 0', scrollbarWidth: 'none' }}>
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              <div style={{ padding: '6px 18px 4px', fontSize: '10px', color: 'rgba(240,232,213,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{type}</div>
              {items.map(item => {
                const idx = globalIdx++;
                const isSelected = idx === selected;
                return (
                  <div key={`${item.id}-${idx}`}
                    onClick={() => { setActiveView(item.id); onClose(); }}
                    onMouseEnter={() => setSelected(idx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '9px 18px', cursor: 'pointer',
                      background: isSelected ? 'rgba(201,160,85,0.1)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: `${item.color}18`, border: `1px solid ${item.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', color: item.color, flexShrink: 0,
                    }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: isSelected ? '#f0e8d5' : 'rgba(240,232,213,0.7)' }}>{item.label}</div>
                    </div>
                    {isSelected && <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.25)', border: '1px solid rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px' }}>↵</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(240,232,213,0.3)', fontSize: '13px' }}>
              No results for "{query}"
            </div>
          )}
        </div>

        <div style={{ padding: '8px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '14px' }}>
          {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([key, label]) => (
            <span key={key} style={{ fontSize: '10px', color: 'rgba(240,232,213,0.2)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>{key}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes cmdIn { from { opacity:0; transform: scale(0.95) translateY(-8px); } to { opacity:1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}

// ─── INSPIRATION PANEL ───────────────────────────────────────────────────────

const MOOD_IMAGES = [
  { url: 'https://picsum.photos/seed/ash1/300/200', caption: 'Ironmere harbor' },
  { url: 'https://picsum.photos/seed/veil2/300/200', caption: 'The Veil at dusk' },
  { url: 'https://picsum.photos/seed/crown3/300/200', caption: 'Ancient ruins' },
  { url: 'https://picsum.photos/seed/lyra4/300/200', caption: 'Character ref: Lyra' },
  { url: 'https://picsum.photos/seed/magic5/300/200', caption: 'Veilfire concept' },
  { url: 'https://picsum.photos/seed/court6/300/200', caption: 'Hollow Court' },
];

const PROMPTS = [
  'What memory does Lyra refuse to revisit, and why?',
  'Describe Ironmere from the perspective of its oldest building.',
  'If Veilfire had a voice, what would it say to Lyra?',
  "Write the last page of Edren Mourne's journal before he found the Crown.",
  'What does the smell of ash mean to someone who has never seen fire?',
];

function InspirationPanel() {
  const [currentPrompt, setCurrentPrompt] = useState(0);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#7ec8c8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>The Ashen Crown · Creative Space</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Inspiration Board</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        {/* Moodboard */}
        <div>
          <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Moodboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {MOOD_IMAGES.map((img, i) => (
              <div key={i} style={{
                borderRadius: '10px', overflow: 'hidden', position: 'relative',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer', aspectRatio: '3/2',
              }}
              onMouseEnter={e => e.currentTarget.querySelector('.caption').style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.querySelector('.caption').style.opacity = '0'}
              >
                <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.6) brightness(0.8)' }} />
                <div className="caption" style={{
                  position: 'absolute', inset: 0, background: 'rgba(7,7,14,0.7)',
                  display: 'flex', alignItems: 'flex-end', padding: '10px',
                  opacity: 0, transition: 'opacity 0.2s',
                }}>
                  <span style={{ fontSize: '10px', color: '#f0e8d5' }}>{img.caption}</span>
                </div>
              </div>
            ))}
            <div style={{
              borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.1)',
              aspectRatio: '3/2', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(240,232,213,0.2)', fontSize: '11px',
              flexDirection: 'column', gap: '6px',
            }}>
              <span style={{ fontSize: '18px' }}>+</span>
              <span>Add image</span>
            </div>
          </div>
        </div>

        {/* Right: prompts + ambient */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Writing prompt */}
          <div style={{
            background: 'rgba(124,200,200,0.06)', border: '1px solid rgba(124,200,200,0.15)',
            borderRadius: '14px', padding: '20px',
          }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Writing Prompt</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
              color: '#f0e8d5', lineHeight: '1.7', fontStyle: 'italic',
              marginBottom: '16px',
            }}>"{PROMPTS[currentPrompt]}"</div>
            <button
              onClick={() => setCurrentPrompt(p => (p + 1) % PROMPTS.length)}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(124,200,200,0.2)',
                background: 'rgba(124,200,200,0.08)', color: '#7ec8c8', fontSize: '11px', cursor: 'pointer',
              }}>
              ✦ New Prompt
            </button>
          </div>

          {/* Ambient sound */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '18px',
          }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Ambient Sound</div>
            {[
              { label: 'Harbor Rain', icon: '🌧', active: true },
              { label: 'Tavern Murmur', icon: '🍺', active: false },
              { label: 'Wind Through Ash', icon: '🌬', active: false },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px', marginBottom: '6px',
                background: s.active ? 'rgba(201,160,85,0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${s.active ? 'rgba(201,160,85,0.2)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: '14px' }}>{s.icon}</span>
                <span style={{ fontSize: '12px', color: s.active ? '#c9a055' : 'rgba(240,232,213,0.5)', flex: 1 }}>{s.label}</span>
                {s.active && <span style={{ fontSize: '9px', color: '#c9a055' }}>▶ Playing</span>}
              </div>
            ))}
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.2)', marginTop: '8px', textAlign: 'center' }}>
              Spotify / YouTube integration
            </div>
          </div>

          {/* Tags */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Story Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Gothic', 'Magic System', 'Found Family', 'Grief', 'Power Corruption', 'Dark Fantasy', 'Revenge Arc', 'Slow Burn'].map(tag => (
                <span key={tag} style={{
                  padding: '4px 9px', borderRadius: '5px', fontSize: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(240,232,213,0.5)', cursor: 'pointer',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAPS PLACEHOLDER ────────────────────────────────────────────────────────

const MAP_PINS = [
  { x: 42, y: 55, label: 'Ironmere', color: '#c9a055', type: 'City' },
  { x: 68, y: 32, label: 'The Veiled Reach', color: '#9b7ec8', type: 'Region' },
  { x: 22, y: 68, label: 'Ashwood', color: '#7ec89b', type: 'Forest' },
  { x: 58, y: 22, label: 'Hollow Court', color: '#6b9fd4', type: 'Fortress' },
  { x: 80, y: 70, label: 'Ruined Waystation', color: '#c8917e', type: 'Ruin' },
];

function MapsView() {
  const [activePin, setActivePin] = useState(null);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#6b9fd4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>The Ashen Crown · Cartography</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Interactive Maps</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '20px', flex: 1 }}>
        {/* Map canvas */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', position: 'relative', overflow: 'hidden', minHeight: '480px',
        }}>
          {/* Parchment-like background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 40% 45%, rgba(201,160,85,0.04) 0%, transparent 70%), radial-gradient(ellipse at 70% 60%, rgba(107,159,212,0.03) 0%, transparent 60%)',
          }} />
          {/* Grid */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
            <defs>
              <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,160,85,1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapgrid)" />
          </svg>
          {/* Placeholder text */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '12px', pointerEvents: 'none',
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.12)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>[ Upload world map to enable layers ]</div>
          </div>
          {/* SVG pins overlay */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {MAP_PINS.map((pin, i) => (
              <g key={i} style={{ cursor: 'pointer' }}
                onClick={() => setActivePin(activePin === i ? null : i)}
              >
                <circle cx={pin.x} cy={pin.y} r={activePin === i ? 3.5 : 2.5}
                  fill={pin.color} opacity="0.9"
                  style={{ transition: 'r 0.2s' }}
                />
                <circle cx={pin.x} cy={pin.y} r={activePin === i ? 6 : 4}
                  fill="none" stroke={pin.color} strokeWidth="0.4" opacity="0.35"
                />
                <text x={pin.x + 3.5} y={pin.y + 0.7} fontSize="2.5" fill={pin.color} fontFamily="sans-serif"
                  style={{ pointerEvents: 'none' }}
                >{pin.label}</text>
              </g>
            ))}
          </svg>
          {/* Active pin detail */}
          {activePin !== null && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px', right: '16px',
              padding: '14px 18px', borderRadius: '12px',
              background: 'rgba(7,7,14,0.9)', backdropFilter: 'blur(12px)',
              border: `1px solid ${MAP_PINS[activePin].color}33`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#f0e8d5', fontWeight: 600 }}>{MAP_PINS[activePin].label}</div>
                  <div style={{ fontSize: '11px', color: MAP_PINS[activePin].color, marginTop: '2px' }}>{MAP_PINS[activePin].type}</div>
                </div>
                <button onClick={() => setActivePin(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(240,232,213,0.3)', cursor: 'pointer', fontSize: '16px' }}>×</button>
              </div>
            </div>
          )}
          {/* Controls */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {['+', '−', '⊞'].map(c => (
              <button key={c} style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: 'rgba(7,7,14,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(240,232,213,0.5)', fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Layers panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Map Layers</div>
            {[
              { label: 'Locations', active: true, color: '#c9a055' },
              { label: 'Faction Territories', active: false, color: '#9b7ec8' },
              { label: 'Travel Routes', active: true, color: '#6b9fd4' },
              { label: 'Veil Presence', active: false, color: '#e8c87a' },
            ].map(layer => (
              <div key={layer.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '3px',
                  background: layer.active ? `${layer.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${layer.active ? layer.color : 'rgba(255,255,255,0.1)'}`,
                  cursor: 'pointer', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {layer.active && <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: layer.color }} />}
                </div>
                <span style={{ fontSize: '11.5px', color: layer.active ? '#f0e8d5' : 'rgba(240,232,213,0.35)' }}>{layer.label}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Pins ({MAP_PINS.length})</div>
            {MAP_PINS.map((pin, i) => (
              <div key={i} onClick={() => setActivePin(activePin === i ? null : i)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0',
                cursor: 'pointer',
                opacity: activePin !== null && activePin !== i ? 0.4 : 1,
                transition: 'opacity 0.2s',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: pin.color, flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', color: activePin === i ? '#f0e8d5' : 'rgba(240,232,213,0.55)' }}>{pin.label}</span>
                <span style={{ fontSize: '9px', color: pin.color, marginLeft: 'auto' }}>{pin.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Encyclopedia placeholder
function EncyclopediaView() {
  const [search, setSearch] = useState('');
  const ENTRIES = [
    { cat: 'Magic Systems', items: ['Veilfire', 'The Sundering Rite', 'Ember Binding', 'Memory Siphoning'] },
    { cat: 'Cultures', items: ['The Ironmeri', 'Ashwalkers', 'Court Archivists', 'Veiled Nomads'] },
    { cat: 'Religions', items: ['The Hollow Doctrine', 'Cult of the Ember', 'Forgetting Faith'] },
    { cat: 'Artifacts', items: ['The Ashen Crown', 'Ember-glass', "The First Unmaker's Bones", 'Veil Shards'] },
  ];
  const COLORS = { 'Magic Systems': '#9b7ec8', 'Cultures': '#6b9fd4', 'Religions': '#c8917e', 'Artifacts': '#c9a055' };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7ec89b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>The Ashen Crown · Knowledge Base</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '34px', fontWeight: 600, color: '#f0e8d5', margin: 0 }}>Encyclopedia</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search entries…"
            style={{
              padding: '9px 14px 9px 36px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: '#f0e8d5', fontSize: '12px', outline: 'none',
              width: '220px',
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,232,213,0.3)', fontSize: '12px' }}>⌕</span>
        </div>
      </div>

      {/* Consistency checker banner */}
      <div style={{
        padding: '14px 18px', borderRadius: '12px',
        background: 'rgba(107,159,212,0.07)', border: '1px solid rgba(107,159,212,0.15)',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <span style={{ fontSize: '16px' }}>◎</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#6b9fd4', fontWeight: 600 }}>Consistency Generator</div>
          <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.4)', marginTop: '2px' }}>3 potential contradictions detected across Chapter I and Chapter II</div>
        </div>
        <button style={{
          padding: '7px 14px', borderRadius: '7px', border: '1px solid rgba(107,159,212,0.3)',
          background: 'rgba(107,159,212,0.12)', color: '#6b9fd4', fontSize: '11px', cursor: 'pointer',
        }}>Review Issues</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {ENTRIES.map(cat => {
          const color = COLORS[cat.cat];
          const filtered = cat.items.filter(i => !search || i.toLowerCase().includes(search.toLowerCase()));
          if (search && filtered.length === 0) return null;
          return (
            <div key={cat.cat} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px', padding: '18px', overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '12px', color, fontWeight: 600, letterSpacing: '0.05em' }}>{cat.cat}</span>
                <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(240,232,213,0.25)' }}>{cat.items.length} entries</span>
              </div>
              {filtered.map(item => (
                <div key={item} style={{
                  padding: '9px 12px', borderRadius: '8px', marginBottom: '6px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${color}10`}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  <span style={{ fontSize: '12px', color: '#f0e8d5' }}>{item}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(240,232,213,0.2)' }}>→</span>
                </div>
              ))}
              <button style={{
                width: '100%', padding: '7px', borderRadius: '7px', border: '1px dashed rgba(255,255,255,0.08)',
                background: 'transparent', color: 'rgba(240,232,213,0.25)', fontSize: '11px', cursor: 'pointer', marginTop: '4px',
              }}>+ Add Entry</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { CommandMenu, InspirationPanel, MapsView, EncyclopediaView });
