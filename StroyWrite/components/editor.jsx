
// Manuscript Editor — persistence + consistency highlighting
const { useState, useRef, useEffect, useCallback } = React;

function EditorView({ activeView }) {
  const chapters  = useStore(d => d.chapters);
  const loreTerms = useStore(d => getLoreTerms(d));

  const chapterId = (() => {
    if (activeView === 'editor') return Store.get().activeChapterId || chapters[0]?.id;
    const ch = chapters.find(c => c.id === activeView);
    return ch ? ch.id : chapters[0]?.id;
  })();
  const chapter = chapters.find(c => c.id === chapterId) || chapters[0];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showConsistency, setShowConsistency] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [loreTooltip, setLoreTooltip] = useState(null);
  const textRef = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!textRef.current || !chapter) return;
    textRef.current.innerText = chapter.content || '';
    setWordCount((chapter.content||'').trim().split(/\s+/).filter(Boolean).length);
  }, [chapterId]);

  useEffect(() => {
    if (chapterId) Store.update(d => ({ ...d, activeChapterId: chapterId }));
  }, [chapterId]);

  const handleInput = useCallback(() => {
    if (!textRef.current) return;
    const text = textRef.current.innerText;
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => Store.updateChapterContent(chapterId, text), 800);
  }, [chapterId]);

  const applyFmt = (cmd, val) => {
    if (textRef.current) textRef.current.focus();
    document.execCommand(cmd, false, val || null);
  };

  const highlightedHtml = () => {
    const text = chapter?.content || '';
    const html = buildHighlightedHtml(text, loreTerms);
    return '<p style="margin-bottom:1.6em">' + html.replace(/\n\n/g, '</p><p style="margin-bottom:1.6em">').replace(/\n/g, '<br>') + '</p>';
  };

  const handleMouseMove = useCallback((e) => {
    const mark = e.target && e.target.closest && e.target.closest('.lore-term');
    if (mark && mark.dataset.term) {
      try { setLoreTooltip({ x: e.clientX, y: e.clientY, ...JSON.parse(decodeURIComponent(mark.dataset.term)) }); }
      catch(err) { setLoreTooltip(null); }
    } else { setLoreTooltip(null); }
  }, []);

  const openNewChapterModal = () => {
    let titleVal = 'New Chapter';
    window.openModal(
      <ModalForm title="New Chapter" onSave={() => {
        const t = titleVal.trim();
        if (!t) return;
        const ch = Store.addChapter(t);
        Store.update(d => ({ ...d, activeChapterId: ch.id }));
        window.closeModal();
      }}>
        <MField label="Title" value={titleVal} onChange={v => { titleVal = v; }} autoFocus />
      </ModalForm>
    );
  };

  const loreCards = useStore(d => [
    ...d.characters.map(c => ({ type:'character', label:c.name, color:c.avatar_color, tags:[c.role.split('·')[0].trim()], excerpt:(c.bio||'').slice(0,120) })),
    ...d.encyclopediaEntries.slice(0,8).map(e => ({ type:'lore', label:e.name, color:'#9b7ec8', tags:[], excerpt:e.description||'' })),
  ]);

  if (!chapter) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'16px' }}>
      <div style={{ color:'rgba(240,232,213,0.3)', fontSize:'14px' }}>No chapters yet.</div>
      <button onClick={openNewChapterModal} style={_saveBtn}>Create first chapter</button>
    </div>
  );

  return (
    <div style={{ flex:1, display:'flex', height:'100%', overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {!focusMode && (
          <div style={{ padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'8px', flexShrink:0, background:'rgba(7,7,14,0.8)', backdropFilter:'blur(10px)', flexWrap:'wrap' }}>
            <div style={{ marginRight:'8px' }}>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'15px', color:'#f0e8d5', fontWeight:600 }}>{chapter.title}</div>
              <div style={{ fontSize:'10px', color:'rgba(240,232,213,0.3)', marginTop:'1px' }}>{wordCount.toLocaleString()} words · auto-saved</div>
            </div>
            <div style={{ width:'1px', height:'20px', background:'rgba(255,255,255,0.08)' }} />
            <ToolbarBtn label="H1" title="Heading 1" onClick={() => applyFmt('formatBlock','h1')} />
            <ToolbarBtn label="H2" title="Heading 2" onClick={() => applyFmt('formatBlock','h2')} />
            <ToolbarBtn label="B" title="Bold" bold onClick={() => applyFmt('bold')} />
            <ToolbarBtn label="I" title="Italic" italic onClick={() => applyFmt('italic')} />
            <ToolbarBtn label="❝" title="Blockquote" onClick={() => applyFmt('formatBlock','blockquote')} />
            <ToolbarBtn label="↺" title="Undo" onClick={() => applyFmt('undo')} />
            <div style={{ width:'1px', height:'20px', background:'rgba(255,255,255,0.08)' }} />
            <button onClick={() => setShowConsistency(!showConsistency)}
              style={{ padding:'5px 10px', borderRadius:'6px', border:`1px solid ${showConsistency?'#6b9fd4':'rgba(255,255,255,0.1)'}`, background:showConsistency?'rgba(107,159,212,0.15)':'transparent', color:showConsistency?'#6b9fd4':'rgba(240,232,213,0.5)', fontSize:'11px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
              <span>◎</span> Consistency
            </button>
            <button onClick={() => setFocusMode(true)}
              style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(240,232,213,0.5)', fontSize:'11px', cursor:'pointer' }}>Focus</button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.1)', background:sidebarOpen?'rgba(255,255,255,0.05)':'transparent', color:'rgba(240,232,213,0.5)', fontSize:'11px', cursor:'pointer' }}>
              {sidebarOpen ? '⊳ Notes' : '⊲ Notes'}
            </button>
            <div style={{ flex:1 }} />
            <button onClick={openNewChapterModal} style={{ padding:'5px 10px', borderRadius:'6px', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', color:'rgba(240,232,213,0.45)', fontSize:'11px', cursor:'pointer' }}>+ Chapter</button>
          </div>
        )}

        {/* Chapter tabs */}
        {!focusMode && chapters.length > 1 && (
          <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(7,7,14,0.5)', overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
            {chapters.map(ch => (
              <button key={ch.id} onClick={() => Store.update(d => ({ ...d, activeChapterId: ch.id }))}
                style={{ padding:'7px 16px', border:'none', background:'transparent', color:ch.id===chapterId?'#f0e8d5':'rgba(240,232,213,0.35)', fontSize:'11px', cursor:'pointer', whiteSpace:'nowrap', borderBottom:`2px solid ${ch.id===chapterId?'var(--gold)':'transparent'}`, transition:'color 0.15s' }}>
                {ch.title}
              </button>
            ))}
          </div>
        )}

        {showConsistency && (
          <div style={{ padding:'7px 20px', background:'rgba(107,159,212,0.07)', borderBottom:'1px solid rgba(107,159,212,0.14)', display:'flex', alignItems:'center', gap:'8px', flexShrink:0, flexWrap:'wrap' }}>
            <span style={{ fontSize:'11px', color:'#6b9fd4' }}>◎ Hover terms for details</span>
            {loreTerms.slice(0,10).map(t => (
              <span key={t.id} style={{ padding:'2px 7px', borderRadius:'4px', fontSize:'10px', background:`${t.color}18`, color:t.color, border:`1px solid ${t.color}33` }}>{t.name}</span>
            ))}
          </div>
        )}

        <div style={{ flex:1, overflowY:'auto', padding:focusMode?'60px':'40px 60px', background:focusMode?'#05050a':'transparent', display:'flex', justifyContent:'center' }}
          onMouseMove={showConsistency ? handleMouseMove : undefined}
          onMouseLeave={() => setLoreTooltip(null)}>
          <div style={{ maxWidth:'680px', width:'100%' }}>
            {focusMode && (
              <button onClick={() => setFocusMode(false)} style={{ position:'fixed', top:'20px', right:'20px', padding:'6px 12px', borderRadius:'6px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(240,232,213,0.4)', fontSize:'11px', cursor:'pointer', zIndex:100 }}>Exit Focus</button>
            )}
            {showConsistency
              ? <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'19px', lineHeight:'1.85', color:'#f0e8d5' }} dangerouslySetInnerHTML={{ __html: highlightedHtml() }} />
              : <div ref={textRef} contentEditable suppressContentEditableWarning onInput={handleInput}
                  style={{ outline:'none', fontFamily:"'Cormorant Garamond', serif", fontSize:'19px', lineHeight:'1.85', color:'#f0e8d5', caretColor:'var(--gold)', minHeight:'400px' }} />
            }
          </div>
        </div>

        <div style={{ padding:'7px 20px', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', gap:'16px', flexShrink:0 }}>
          {[{ label:'Words', val:wordCount.toLocaleString() }, { label:'Chars', val:(chapter.content||'').length.toLocaleString() }, { label:'Read', val:`${Math.max(1,Math.ceil(wordCount/200))} min` }].map(s => (
            <span key={s.label} style={{ fontSize:'10.5px', color:'rgba(240,232,213,0.25)' }}>{s.label}: <span style={{ color:'rgba(240,232,213,0.45)' }}>{s.val}</span></span>
          ))}
        </div>
      </div>

      {/* Lore sidebar */}
      <div style={{ width:sidebarOpen?'255px':'0px', minWidth:sidebarOpen?'255px':'0px', overflow:'hidden', borderLeft:'1px solid rgba(255,255,255,0.06)', background:'rgba(7,7,14,0.6)', backdropFilter:'blur(10px)', transition:'width 0.35s cubic-bezier(0.4,0,0.2,1), min-width 0.35s cubic-bezier(0.4,0,0.2,1)', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'13px 15px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:'10px', color:'rgba(240,232,213,0.3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Lore Notes</div>
          <div style={{ fontSize:'10px', color:'rgba(240,232,213,0.22)', marginTop:'2px' }}>Click to expand · drag to text</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'10px', display:'flex', flexDirection:'column', gap:'6px', scrollbarWidth:'none' }}>
          {loreCards.map((card, i) => <LoreCard key={i} card={card} />)}
        </div>
        <div style={{ padding:'10px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button style={{ width:'100%', padding:'7px', borderRadius:'7px', border:'1px dashed rgba(255,255,255,0.1)', background:'transparent', color:'rgba(240,232,213,0.3)', fontSize:'11px', cursor:'pointer' }}>+ Add Note</button>
        </div>
      </div>

      {/* Lore hover tooltip */}
      {loreTooltip && (
        <div style={{ position:'fixed', left:Math.min(loreTooltip.x+14, window.innerWidth-280), top:loreTooltip.y-8, zIndex:9000, background:'rgba(7,7,14,0.96)', border:`1px solid ${loreTooltip.color}44`, borderRadius:'10px', padding:'10px 14px', maxWidth:'260px', pointerEvents:'none', backdropFilter:'blur(12px)' }}>
          <div style={{ fontSize:'9px', color:loreTooltip.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'3px' }}>{loreTooltip.type}</div>
          <div style={{ fontSize:'14px', color:'#f0e8d5', fontFamily:"'Cormorant Garamond', serif", fontWeight:600, marginBottom:'4px' }}>{loreTooltip.name}</div>
          <div style={{ fontSize:'11px', color:'rgba(240,232,213,0.6)', lineHeight:'1.5' }}>{loreTooltip.summary}</div>
        </div>
      )}
      <style>{`.lore-term { transition: opacity 0.15s; } .lore-term:hover { opacity: 0.85; }`}</style>
    </div>
  );
}

function LoreCard({ card }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div onClick={() => setExpanded(!expanded)} draggable
      style={{ padding:'9px 11px', borderRadius:'9px', border:`1px solid ${card.color}22`, background:`${card.color}07`, cursor:'pointer', userSelect:'none' }}
      onMouseEnter={e => e.currentTarget.style.borderColor=`${card.color}44`}
      onMouseLeave={e => e.currentTarget.style.borderColor=`${card.color}22`}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:card.color, flexShrink:0 }} />
        <span style={{ fontSize:'12px', color:'#f0e8d5', fontFamily:"'Cormorant Garamond', serif", fontWeight:600, flex:1 }}>{card.label}</span>
        <span style={{ fontSize:'9px', color:card.color }}>{card.type}</span>
      </div>
      {card.tags.length > 0 && (
        <div style={{ display:'flex', gap:'4px', marginTop:'5px', flexWrap:'wrap' }}>
          {card.tags.map(t => <span key={t} style={{ fontSize:'9px', padding:'1px 5px', borderRadius:'3px', background:`${card.color}18`, color:card.color }}>{t}</span>)}
        </div>
      )}
      {expanded && card.excerpt && (
        <div style={{ fontSize:'11px', color:'rgba(240,232,213,0.55)', marginTop:'7px', lineHeight:'1.6', fontFamily:"'Cormorant Garamond', serif" }}>{card.excerpt}</div>
      )}
    </div>
  );
}

function ToolbarBtn({ label, title, bold, italic, onClick }) {
  return (
    <button title={title} onClick={onClick}
      style={{ width:'28px', height:'28px', borderRadius:'5px', border:'none', background:'transparent', color:'rgba(240,232,213,0.45)', fontSize:'12px', cursor:'pointer', fontWeight:bold?700:400, fontStyle:italic?'italic':'normal', display:'flex', alignItems:'center', justifyContent:'center' }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#f0e8d5'; }}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(240,232,213,0.45)'; }}>
      {label}
    </button>
  );
}

// Shared modal helpers (used across components)
function ModalForm({ title, onSave, onCancel, children }) {
  return (
    <div style={{ padding:'26px' }}>
      <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'22px', color:'#f0e8d5', marginBottom:'20px' }}>{title}</div>
      {children}
      <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'22px' }}>
        <button onClick={onCancel || window.closeModal} style={_cancelBtn}>Cancel</button>
        <button onClick={onSave} style={_saveBtn}>Save</button>
      </div>
    </div>
  );
}

function MField({ label, value, onChange, type='text', placeholder='', multiline=false, autoFocus=false }) {
  const style = { width:'100%', padding:'9px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0e8d5', fontSize:'13px', outline:'none', marginTop:'5px', resize:'vertical' };
  return (
    <div style={{ marginBottom:'14px' }}>
      <label style={{ fontSize:'10px', color:'rgba(240,232,213,0.4)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</label>
      {multiline
        ? <textarea defaultValue={value} onChange={e => onChange(e.target.value)} style={{ ...style, minHeight:'80px' }} placeholder={placeholder} />
        : <input type={type} defaultValue={value} onChange={e => onChange(e.target.value)} style={style} placeholder={placeholder} autoFocus={autoFocus} />
      }
    </div>
  );
}

function MSelect({ label, value, options, onChange }) {
  return (
    <div style={{ marginBottom:'14px' }}>
      <label style={{ fontSize:'10px', color:'rgba(240,232,213,0.4)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</label>
      <select defaultValue={value} onChange={e => onChange(e.target.value)}
        style={{ width:'100%', padding:'9px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0e8d5', fontSize:'13px', outline:'none', marginTop:'5px' }}>
        {options.map(o => <option key={typeof o==='string'?o:o.value} value={typeof o==='string'?o:o.value}>{typeof o==='string'?o:o.label}</option>)}
      </select>
    </div>
  );
}

const _cancelBtn = { padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(240,232,213,0.55)', fontSize:'12px', cursor:'pointer' };
const _saveBtn   = { padding:'8px 20px', borderRadius:'8px', border:'none', background:'var(--gold)', color:'#07070e', fontSize:'12px', cursor:'pointer', fontWeight:600 };

Object.assign(window, { EditorView, ModalForm, MField, MSelect, _cancelBtn, _saveBtn });
