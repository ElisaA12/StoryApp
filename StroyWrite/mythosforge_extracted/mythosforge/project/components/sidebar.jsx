
// MythosForge Sidebar Component
const { useState } = React;

const NAV_ITEMS = [
  {
    id: 'dashboard', icon: '✦', label: 'Constellation Hub',
    sub: []
  },
  {
    id: 'editor', icon: '✍', label: 'Manuscript',
    sub: [
      { id: 'chapter1', label: 'Chapter I — The Veil' },
      { id: 'chapter2', label: 'Chapter II — Ash & Ember' },
      { id: 'chapter3', label: 'Chapter III — The Hollow King' },
    ]
  },
  {
    id: 'characters', icon: '◈', label: 'Characters',
    sub: [
      { id: 'char-lyra', label: 'Lyra Voss' },
      { id: 'char-edren', label: 'Edren Mourne' },
      { id: 'char-sable', label: 'Sable of the Ashwood' },
    ]
  },
  {
    id: 'places', icon: '◉', label: 'Places',
    sub: [
      { id: 'place-ironmere', label: 'Ironmere' },
      { id: 'place-veiled', label: 'The Veiled Reach' },
    ]
  },
  {
    id: 'timeline', icon: '◫', label: 'Timeline',
    sub: []
  },
  {
    id: 'lore', icon: '◬', label: 'Encyclopedia',
    sub: [
      { id: 'lore-magic', label: 'Magic Systems' },
      { id: 'lore-culture', label: 'Cultures & Faiths' },
      { id: 'lore-history', label: 'World History' },
    ]
  },
  {
    id: 'relationships', icon: '⬡', label: 'Relationships',
    sub: []
  },
  {
    id: 'maps', icon: '◭', label: 'Maps',
    sub: []
  },
  {
    id: 'inspiration', icon: '✧', label: 'Inspiration Board',
    sub: []
  },
];

const PROJECTS = [
  { id: 'p1', name: 'The Ashen Crown', icon: '👑', color: '#c9a055' },
  { id: 'p2', name: 'Seafarers of Nol', icon: '⚓', color: '#6b9fd4' },
  { id: 'p3', name: 'Mirrors of Dusk', icon: '🪞', color: '#9b7ec8' },
];

function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  const [expandedItems, setExpandedItems] = useState({ editor: true, characters: true });
  const [activeProject, setActiveProject] = useState('p1');
  const [showProjects, setShowProjects] = useState(false);

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentProject = PROJECTS.find(p => p.id === activeProject);

  return (
    <aside style={{
      width: collapsed ? '64px' : '240px',
      minWidth: collapsed ? '64px' : '240px',
      height: '100vh',
      background: 'rgba(7,7,14,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        flexShrink: 0,
      }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{
          width: '32px', height: '32px', flexShrink: 0,
          background: 'linear-gradient(135deg, #c9a055, #e8c87a)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '700', color: '#07070e',
          fontFamily: "'Cormorant Garamond', serif",
          boxShadow: '0 0 20px rgba(201,160,85,0.3)',
        }}>M</div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: '600', color: '#f0e8d5', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>MythosForge</div>
          </div>
        )}
        {!collapsed && (
          <div style={{ marginLeft: 'auto', color: 'rgba(240,232,213,0.3)', fontSize: '12px', flexShrink: 0 }}>‹</div>
        )}
      </div>

      {/* Project Switcher */}
      <div style={{
        padding: collapsed ? '10px 12px' : '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <div
          onClick={() => !collapsed && setShowProjects(!showProjects)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          <span style={{ fontSize: '14px', flexShrink: 0 }}>{currentProject.icon}</span>
          {!collapsed && (
            <>
              <span style={{ fontSize: '12px', color: '#f0e8d5', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentProject.name}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)' }}>⌄</span>
            </>
          )}
        </div>

        {showProjects && !collapsed && (
          <div style={{
            marginTop: '6px',
            background: 'rgba(7,7,14,0.98)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            {PROJECTS.map(p => (
              <div key={p.id}
                onClick={() => { setActiveProject(p.id); setShowProjects(false); }}
                style={{
                  padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                  cursor: 'pointer', fontSize: '12px', color: p.id === activeProject ? '#c9a055' : '#f0e8d5',
                  background: p.id === activeProject ? 'rgba(201,160,85,0.1)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (p.id !== activeProject) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if (p.id !== activeProject) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </div>
            ))}
            <div style={{
              padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer', fontSize: '11px', color: 'rgba(240,232,213,0.4)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span>+</span><span>New Project</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(item => (
          <div key={item.id}>
            <div
              onClick={() => {
                setActiveView(item.id);
                if (item.sub.length > 0) toggleExpand(item.id);
              }}
              style={{
                display: 'flex', alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px 20px' : '9px 18px',
                cursor: 'pointer',
                borderRadius: '0',
                position: 'relative',
                transition: 'background 0.15s',
                background: activeView === item.id ? 'rgba(201,160,85,0.1)' : 'transparent',
              }}
              onMouseEnter={e => { if (activeView !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activeView !== item.id) e.currentTarget.style.background = 'transparent'; }}
            >
              {activeView === item.id && (
                <div style={{
                  position: 'absolute', left: 0, top: '4px', bottom: '4px',
                  width: '2px', background: 'linear-gradient(180deg, #c9a055, #e8c87a)',
                  borderRadius: '0 2px 2px 0',
                }} />
              )}
              <span style={{
                fontSize: '13px', flexShrink: 0,
                color: activeView === item.id ? '#c9a055' : 'rgba(240,232,213,0.45)',
                width: '18px', textAlign: 'center',
              }}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span style={{
                    fontSize: '12.5px',
                    color: activeView === item.id ? '#f0e8d5' : 'rgba(240,232,213,0.6)',
                    flex: 1, fontWeight: activeView === item.id ? '500' : '400',
                    letterSpacing: '0.01em',
                  }}>{item.label}</span>
                  {item.sub.length > 0 && (
                    <span style={{ fontSize: '9px', color: 'rgba(240,232,213,0.25)', transform: expandedItems[item.id] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▶</span>
                  )}
                </>
              )}
            </div>

            {/* Sub items */}
            {!collapsed && item.sub.length > 0 && expandedItems[item.id] && (
              <div style={{ paddingLeft: '38px' }}>
                {item.sub.map(sub => (
                  <div key={sub.id}
                    onClick={() => setActiveView(sub.id)}
                    style={{
                      padding: '6px 10px', fontSize: '11.5px',
                      color: activeView === sub.id ? '#c9a055' : 'rgba(240,232,213,0.38)',
                      cursor: 'pointer', borderLeft: '1px solid rgba(255,255,255,0.06)',
                      marginLeft: '2px',
                      transition: 'color 0.15s',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                    onMouseEnter={e => { if (activeView !== sub.id) e.currentTarget.style.color = 'rgba(240,232,213,0.65)'; }}
                    onMouseLeave={e => { if (activeView !== sub.id) e.currentTarget.style.color = 'rgba(240,232,213,0.38)'; }}
                  >
                    {sub.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        padding: collapsed ? '14px 12px' : '14px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: '6px',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{
            padding: '8px 10px', borderRadius: '8px',
            background: 'rgba(107,159,212,0.08)',
            border: '1px solid rgba(107,159,212,0.15)',
            fontSize: '11px', color: 'rgba(107,159,212,0.8)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span>◎</span>
            <span>Consistency Check: <strong style={{ color: '#6b9fd4' }}>3 issues</strong></span>
          </div>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #9b7ec8, #6b9fd4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', color: 'white', flexShrink: 0,
          }}>A</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '11.5px', color: '#f0e8d5' }}>Author</div>
              <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.35)' }}>Pro Plan</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar });
