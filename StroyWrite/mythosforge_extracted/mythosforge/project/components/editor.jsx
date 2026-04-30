
// Manuscript Editor — distraction-free writing with sliding lore sidebar
const { useState, useRef, useEffect } = React;

const LORE_CARDS = [
  {
    type: 'character', label: 'Lyra Voss', color: '#e8c87a',
    tags: ['Protagonist', 'Mage'],
    excerpt: 'Half-blood Veilwalker. Orphaned at 9. Carries the Last Ember.'
  },
  {
    type: 'character', label: 'Edren Mourne', color: '#6b9fd4',
    tags: ['Antagonist', 'Scholar'],
    excerpt: 'Former Archivist of the Hollow Court. Seeks the Ashen Crown.'
  },
  {
    type: 'place', label: 'Ironmere', color: '#c9a055',
    tags: ['City', 'Contested'],
    excerpt: 'A port city at the edge of the Veiled Reach. Ash falls like snow.'
  },
  {
    type: 'lore', label: 'Veilfire', color: '#9b7ec8',
    tags: ['Magic', 'Rare'],
    excerpt: 'A flame that burns only memory. Drawn from grief, spent in forgetting.'
  },
  {
    type: 'lore', label: 'The Ashen Crown', color: '#c8917e',
    tags: ['Artifact', 'MacGuffin'],
    excerpt: 'Forged from the bones of the First Unmaker. Grants dominion over forgotten things.'
  },
];

const SAMPLE_TEXT = `The city of Ironmere breathed smoke the morning Lyra Voss arrived.

She had crossed the Veiled Reach in four days — half the time any sensible traveler would manage — and her boots still carried the memory of the ashland's gray dust, now mixed with the cobblestones' grime into something darker, something that felt like guilt.

The Crown had been here. She could feel it in the way the air pressed against her temples, a dull and ancient ache, the kind Veilfire left in the bones of those it had touched.

Edren Mourne had a twelve-hour head start.

She did not allow herself to think about what that meant.

The harbor market was waking slowly, vendors unfurling canvas awnings the color of old bruises, fishwives calling prices that sounded more like warnings. Lyra moved through them without pausing, her travel-worn coat pulled close, the small ember-glass at her throat kept dark and dim — conspicuous light was the first mistake of the hunted.

She needed information. She needed, in truth, a dozen things she did not have.

What she had was the name of a smuggler, a city she had never visited, and a fire that was not quite fire pressing against the inside of her sternum, waiting.

That would have to be enough.`;

const CONSISTENCY_ISSUES = [
  { term: 'Veilfire', issue: null },
  { term: 'Ironmere', issue: null },
  { term: 'Ashen Crown', issue: null },
  { term: 'Veiled Reach', issue: null },
  { term: 'Edren Mourne', issue: null },
  { term: 'Lyra Voss', issue: null },
];

function EditorView() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [wordCount, setWordCount] = useState(SAMPLE_TEXT.split(/\s+/).length);
  const [activeCard, setActiveCard] = useState(null);
  const [showConsistency, setShowConsistency] = useState(false);
  const [draggingCard, setDraggingCard] = useState(null);
  const textRef = useRef(null);

  const handleInput = () => {
    if (textRef.current) {
      const words = textRef.current.innerText.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  };

  // Highlight lore terms
  const highlightedText = () => {
    let text = SAMPLE_TEXT;
    const terms = CONSISTENCY_ISSUES.map(c => c.term);
    const regex = new RegExp(`(${terms.join('|')})`, 'g');
    return text.replace(regex, '<mark class="lore-term">$1</mark>');
  };

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Editor main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        {!focusMode && (
          <div style={{
            padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0,
            background: 'rgba(7,7,14,0.8)', backdropFilter: 'blur(10px)',
          }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#f0e8d5', fontWeight: 600 }}>
                Chapter II — Ash &amp; Ember
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', marginTop: '1px' }}>
                {wordCount} words · Saved just now
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <ToolbarBtn label="H1" title="Heading 1" />
            <ToolbarBtn label="H2" title="Heading 2" />
            <ToolbarBtn label="B" title="Bold" bold />
            <ToolbarBtn label="I" title="Italic" italic />
            <ToolbarBtn label="❝" title="Blockquote" />
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />
            <button
              onClick={() => setShowConsistency(!showConsistency)}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: `1px solid ${showConsistency ? '#6b9fd4' : 'rgba(255,255,255,0.1)'}`,
                background: showConsistency ? 'rgba(107,159,212,0.15)' : 'transparent',
                color: showConsistency ? '#6b9fd4' : 'rgba(240,232,213,0.5)',
                fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}
            >
              <span>◎</span> Consistency
            </button>
            <button
              onClick={() => setFocusMode(!focusMode)}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: `1px solid ${focusMode ? '#c9a055' : 'rgba(255,255,255,0.1)'}`,
                background: focusMode ? 'rgba(201,160,85,0.15)' : 'transparent',
                color: focusMode ? '#c9a055' : 'rgba(240,232,213,0.5)',
                fontSize: '11px', cursor: 'pointer',
              }}
            >
              Focus
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                background: sidebarOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                color: 'rgba(240,232,213,0.5)', fontSize: '11px', cursor: 'pointer',
              }}
            >
              {sidebarOpen ? '⊳ Notes' : '⊲ Notes'}
            </button>
          </div>
        )}

        {/* Consistency banner */}
        {showConsistency && (
          <div style={{
            padding: '10px 24px', background: 'rgba(107,159,212,0.07)',
            borderBottom: '1px solid rgba(107,159,212,0.15)',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>
            <span style={{ fontSize: '11px', color: '#6b9fd4' }}>◎ Lore terms highlighted</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {CONSISTENCY_ISSUES.map(t => (
                <span key={t.term} style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '10px',
                  background: 'rgba(107,159,212,0.12)', color: '#6b9fd4',
                  border: '1px solid rgba(107,159,212,0.2)',
                }}>{t.term}</span>
              ))}
            </div>
          </div>
        )}

        {/* Writing area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: focusMode ? '60px' : '40px 60px',
          background: focusMode ? '#05050a' : 'transparent',
          transition: 'padding 0.4s, background 0.4s',
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{ maxWidth: '680px', width: '100%' }}>
            {focusMode && (
              <button onClick={() => setFocusMode(false)} style={{
                position: 'fixed', top: '20px', right: '20px',
                padding: '6px 12px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(240,232,213,0.4)', fontSize: '11px', cursor: 'pointer', zIndex: 100,
              }}>Exit Focus</button>
            )}
            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              style={{
                outline: 'none',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '19px', lineHeight: '1.85',
                color: '#f0e8d5',
                letterSpacing: '0.01em',
                caretColor: '#c9a055',
                minHeight: '400px',
              }}
              dangerouslySetInnerHTML={showConsistency ? { __html: highlightedText() } : undefined}
            >
              {!showConsistency && SAMPLE_TEXT.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '1.6em' }}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Word count footer */}
        <div style={{
          padding: '8px 24px', borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', gap: '16px', flexShrink: 0,
        }}>
          {[
            { label: 'Words', val: wordCount },
            { label: 'Chars', val: SAMPLE_TEXT.length },
            { label: 'Read time', val: `${Math.ceil(wordCount / 200)} min` },
          ].map(s => (
            <span key={s.label} style={{ fontSize: '10.5px', color: 'rgba(240,232,213,0.25)' }}>
              {s.label}: <span style={{ color: 'rgba(240,232,213,0.45)' }}>{s.val}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Lore sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '0px',
        minWidth: sidebarOpen ? '260px' : '0px',
        overflow: 'hidden',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(7,7,14,0.6)',
        backdropFilter: 'blur(10px)',
        transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), min-width 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '10px', color: 'rgba(240,232,213,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Lore Notes</div>
          <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.3)', marginTop: '4px' }}>Drag cards next to your text</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', scrollbarWidth: 'none' }}>
          {LORE_CARDS.map((card, i) => (
            <LoreCard key={i} card={card} />
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button style={{
            width: '100%', padding: '8px', borderRadius: '8px',
            border: '1px dashed rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(240,232,213,0.3)',
            fontSize: '11px', cursor: 'pointer',
          }}>
            + Add Note
          </button>
        </div>
      </div>

      <style>{`
        .lore-term {
          background: rgba(107,159,212,0.2);
          color: #6b9fd4;
          border-radius: 3px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  );
}

function LoreCard({ card }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      draggable
      style={{
        padding: '10px 12px', borderRadius: '10px',
        border: `1px solid ${card.color}22`,
        background: `${card.color}08`,
        cursor: 'pointer', transition: 'all 0.2s',
        userSelect: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}44`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${card.color}22`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: expanded ? '8px' : 0 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: card.color, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', color: '#f0e8d5', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{card.label}</span>
        <span style={{ fontSize: '9px', color: card.color, marginLeft: 'auto' }}>{card.type}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
        {card.tags.map(t => (
          <span key={t} style={{
            fontSize: '9px', padding: '1px 5px', borderRadius: '3px',
            background: `${card.color}18`, color: card.color,
          }}>{t}</span>
        ))}
      </div>
      {expanded && (
        <div style={{ fontSize: '11px', color: 'rgba(240,232,213,0.55)', marginTop: '8px', lineHeight: '1.6', fontFamily: "'Cormorant Garamond', serif" }}>
          {card.excerpt}
        </div>
      )}
    </div>
  );
}

function ToolbarBtn({ label, title, bold, italic }) {
  return (
    <button title={title} style={{
      width: '28px', height: '28px', borderRadius: '5px', border: 'none',
      background: 'transparent', color: 'rgba(240,232,213,0.45)', fontSize: '12px',
      cursor: 'pointer', fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal',
      transition: 'background 0.15s, color 0.15s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f0e8d5'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(240,232,213,0.45)'; }}
    >
      {label}
    </button>
  );
}

Object.assign(window, { EditorView });
