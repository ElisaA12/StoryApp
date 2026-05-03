
// Sidebar — dynamic from Store
const { useState } = React;

const PROJECTS = [
  { id: 'p1', name: 'The Ashen Crown',   icon: '👑' },
  { id: 'p2', name: 'Seafarers of Nol',  icon: '⚓' },
  { id: 'p3', name: 'Mirrors of Dusk',   icon: '🪞' },
];

function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  const [expandedItems, setExpandedItems] = useState({ editor: true, characters: true, places: false });
  const [activeProject, setActiveProject] = useState('p1');
  const [showProjects, setShowProjects] = useState(false);

  const t = useT();
  const characters = useStore(d => d.characters);
  const chapters   = useStore(d => d.chapters);
  const mapPins    = useStore(d => d.mapPins);
  const language   = useStore(d => d.language || 'en');

  const NAV_ITEMS = [
    { id: 'dashboard',     icon: '✦', label: t('nav.dashboard'),     sub: [] },
    { id: 'editor',        icon: '✍', label: t('nav.editor'),        sub: chapters.map(ch => ({ id: ch.id, label: ch.title })) },
    { id: 'characters',    icon: '◈', label: t('nav.characters'),    sub: characters.map(c => ({ id: `char-${c.id}`, label: c.name })) },
    { id: 'places',        icon: '◉', label: t('nav.places'),        sub: mapPins.map(p => ({ id: `place-${p.id}`, label: p.label })) },
    { id: 'timeline',      icon: '◫', label: t('nav.timeline'),      sub: [] },
    { id: 'lore',          icon: '◬', label: t('nav.encyclopedia'),  sub: [] },
    { id: 'relationships', icon: '⬡', label: t('nav.relationships'), sub: [] },
    { id: 'maps',          icon: '◭', label: t('nav.maps'),          sub: [] },
    { id: 'inspiration',   icon: '✧', label: t('nav.inspiration'),   sub: [] },
  ];

  const toggleExpand = id => setExpandedItems(p => ({ ...p, [id]: !p[id] }));
  const currentProject = PROJECTS.find(p => p.id === activeProject);
  const totalWords = getTotalWordCount(chapters);

  const toggleLanguage = () => {
    Store.update(d => ({ ...d, language: d.language === 'en' ? 'it' : 'en' }));
  };
  
  const isParentActive = (item) => {
    if (activeView === item.id) return true;
    if (item.id === 'characters' && activeView.startsWith('char-')) return true;
    if (item.id === 'editor' && (activeView.startsWith('chapter'))) return true;
    if (item.id === 'places' && activeView.startsWith('place-')) return true;
    return false;
  };

  return (
    <aside style={{ width:collapsed?'64px':'240px', minWidth:collapsed?'64px':'240px', height:'100vh', background:'rgba(7,7,14,0.95)', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', transition:'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)', overflow:'hidden', backdropFilter:'blur(20px)', position:'relative', zIndex:10, flexShrink:0 }}>

      {/* Logo */}
      <div style={{ padding:collapsed?'20px 16px':'20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', flexShrink:0 }} onClick={() => setCollapsed(!collapsed)}>
        <div style={{ width:'32px', height:'32px', flexShrink:0, background:'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:'700', color:'#07070e', fontFamily:"'Cormorant Garamond', serif", boxShadow:'0 0 20px rgba(201,160,85,0.3)' }}>M</div>
        {!collapsed && (<>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'17px', fontWeight:'600', color:'#f0e8d5', whiteSpace:'nowrap' }}>MythosForge</div>
          </div>
          <div style={{ marginLeft:'auto', color:'rgba(240,232,213,0.3)', fontSize:'12px' }}>‹</div>
        </>)}
      </div>

      {/* Project Switcher */}
      <div style={{ padding:collapsed?'10px 12px':'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
        <div onClick={() => !collapsed && setShowProjects(!showProjects)}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px', borderRadius:'8px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}>
          <span style={{ fontSize:'14px', flexShrink:0 }}>{currentProject.icon}</span>
          {!collapsed && (<>
            <span style={{ fontSize:'12px', color:'#f0e8d5', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentProject.name}</span>
            <span style={{ fontSize:'10px', color:'rgba(240,232,213,0.3)' }}>⌄</span>
          </>)}
        </div>
        {showProjects && !collapsed && (
          <div style={{ marginTop:'6px', background:'rgba(7,7,14,0.98)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', overflow:'hidden' }}>
            {PROJECTS.map(p => (
              <div key={p.id} onClick={() => { setActiveProject(p.id); setShowProjects(false); }}
                style={{ padding:'8px 12px', display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'12px', color:p.id===activeProject?'var(--gold)':'#f0e8d5', background:p.id===activeProject?'rgba(201,160,85,0.1)':'transparent' }}
                onMouseEnter={e => { if(p.id!==activeProject) e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { if(p.id!==activeProject) e.currentTarget.style.background='transparent'; }}>
                <span>{p.icon}</span><span>{p.name}</span>
              </div>
            ))}
            <div style={{ padding:'8px 12px', fontSize:'11px', color:'rgba(240,232,213,0.35)', borderTop:'1px solid rgba(255,255,255,0.06)', cursor:'pointer' }}>{t('sidebar.newProject')}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex:1, overflowY:'auto', padding:'10px 0', scrollbarWidth:'none' }}>
        {NAV_ITEMS.map(item => {
          const active = isParentActive(item);
          return (
            <div key={item.id}>
              <div onClick={() => { setActiveView(item.id); if (item.sub.length) toggleExpand(item.id); }}
                style={{ display:'flex', alignItems:'center', gap:'10px', padding:collapsed?'10px 20px':'9px 18px', cursor:'pointer', position:'relative', background:active?'rgba(201,160,85,0.1)':'transparent', transition:'background 0.15s' }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background='transparent'; }}>
                {active && <div style={{ position:'absolute', left:0, top:'4px', bottom:'4px', width:'2px', background:'linear-gradient(180deg, var(--gold), var(--gold-light))', borderRadius:'0 2px 2px 0' }} />}
                <span style={{ fontSize:'13px', flexShrink:0, color:active?'var(--gold)':'rgba(240,232,213,0.45)', width:'18px', textAlign:'center' }}>{item.icon}</span>
                {!collapsed && (<>
                  <span style={{ fontSize:'12.5px', color:active?'#f0e8d5':'rgba(240,232,213,0.6)', flex:1, fontWeight:active?'500':'400' }}>{item.label}</span>
                  {item.sub.length > 0 && <span style={{ fontSize:'9px', color:'rgba(240,232,213,0.25)', transform:expandedItems[item.id]?'rotate(90deg)':'none', transition:'transform 0.2s' }}>▶</span>}
                </>)}
              </div>
              {!collapsed && item.sub.length > 0 && expandedItems[item.id] && (
                <div style={{ paddingLeft:'38px' }}>
                  {item.sub.map(sub => (
                    <div key={sub.id} onClick={() => setActiveView(sub.id)}
                      style={{ padding:'6px 10px', fontSize:'11.5px', color:activeView===sub.id?'var(--gold)':'rgba(240,232,213,0.38)', cursor:'pointer', borderLeft:'1px solid rgba(255,255,255,0.06)', marginLeft:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}
                      onMouseEnter={e => { if(activeView!==sub.id) e.currentTarget.style.color='rgba(240,232,213,0.65)'; }}
                      onMouseLeave={e => { if(activeView!==sub.id) e.currentTarget.style.color='rgba(240,232,213,0.38)'; }}>
                      {sub.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding:collapsed?'14px 12px':'14px 16px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:'6px', flexShrink:0 }}>
        {!collapsed && totalWords > 0 && (
          <div style={{ padding:'7px 10px', borderRadius:'7px', background:'rgba(201,160,85,0.06)', border:'1px solid rgba(201,160,85,0.14)', fontSize:'10px', color:'rgba(201,160,85,0.7)', display:'flex', justifyContent:'space-between' }}>
            <span>{t('sidebar.totalWords')}</span><strong style={{ color:'var(--gold)' }}>{totalWords.toLocaleString()}</strong>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg, #9b7ec8, #6b9fd4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'white', flexShrink:0 }}>A</div>
          {!collapsed && (<>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'11.5px', color:'#f0e8d5' }}>{t('sidebar.author')}</div>
              <div style={{ fontSize:'10px', color:'rgba(240,232,213,0.35)' }}>{t('sidebar.proPlan')}</div>
            </div>
            {/* Language toggle */}
            <button onClick={toggleLanguage}
              title={language === 'en' ? 'Passa all\'italiano' : 'Switch to English'}
              style={{ padding:'3px 7px', borderRadius:'5px', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.06)', color:'rgba(240,232,213,0.7)', fontSize:'10px', cursor:'pointer', fontWeight:600, letterSpacing:'0.05em', flexShrink:0 }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(201,160,85,0.15)'; e.currentTarget.style.borderColor='rgba(201,160,85,0.4)'; e.currentTarget.style.color='var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.color='rgba(240,232,213,0.7)'; }}>
              {t('lang.switch')}
            </button>
          </>)}
          {collapsed && (
            <button onClick={toggleLanguage}
              title={language === 'en' ? 'Italiano' : 'English'}
              style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.04)', color:'rgba(240,232,213,0.5)', fontSize:'9px', cursor:'pointer', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {t('lang.switch')}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar });
