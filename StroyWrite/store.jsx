
// store.jsx — Central data store (localStorage-backed)
const STORAGE_KEY = 'mythosforge_v1';

const _SAMPLE = `The city of Ironmere breathed smoke the morning Lyra Voss arrived.

She had crossed the Veiled Reach in four days — half the time any sensible traveler would manage — and her boots still carried the memory of the ashland's gray dust, now mixed with the cobblestones' grime into something darker, something that felt like guilt.

The Crown had been here. She could feel it in the way the air pressed against her temples, a dull and ancient ache, the kind Veilfire left in the bones of those it had touched.

Edren Mourne had a twelve-hour head start.

She did not allow herself to think about what that meant.

The harbor market was waking slowly, vendors unfurling canvas awnings the color of old bruises, fishwives calling prices that sounded more like warnings. Lyra moved through them without pausing, her travel-worn coat pulled close, the small ember-glass at her throat kept dark and dim — conspicuous light was the first mistake of the hunted.

She needed information. She needed, in truth, a dozen things she did not have.

What she had was the name of a smuggler, a city she had never visited, and a fire that was not quite fire pressing against the inside of her sternum, waiting.

That would have to be enough.`;

const _DEFAULT = {
  version: 1,
  language: 'en',
  projectName: 'The Ashen Crown',
  activeCharacterId: 'lyra',
  activeChapterId: 'chapter2',
  todayWordGoal: 1000,

  characters: [
    {
      id: 'lyra', name: 'Lyra Voss', epithet: 'The Last Ember',
      role: 'Protagonist · Veilwalker', age: 24, origin: 'Ironmere Slums',
      faction: 'None (formerly: Hollow Court)', status: 'Active',
      avatar_initial: 'LV', avatar_color: '#e8c87a', avatar_image: null,
      bio: 'Lyra Voss was nine years old when the Veilfire took her parents. She does not remember the shape of the flame — only the sound it made, like a voice trying to remember how to speak. She was raised in the foundling halls of Ironmere, picking pockets and running messages for the lesser smuggling guilds until an Archivist named Edren Mourne found her and recognized what she carried.\n\nShe spent six years in the Hollow Court. She left on her own terms, which is to say she left with nothing, which is the only way the Court lets you leave.',
      stats: { Cunning: 88, Resolve: 72, Empathy: 65, Combat: 55, Magic: 91, Influence: 48 },
      traits: ['Pragmatic', 'Grief-hardened', 'Fiercely loyal', 'Distrustful of authority'],
      relationships: [
        { id: 'r1', name: 'Edren Mourne', type: 'Nemesis', color: '#c8917e' },
        { id: 'r2', name: 'Sable of the Ashwood', type: 'Ally', color: '#7ec89b' },
        { id: 'r3', name: 'The Hollow Court', type: 'Enemy', color: '#c87ec8' },
        { id: 'r4', name: 'Ferris (smuggler)', type: 'Contact', color: '#6b9fd4' },
      ],
      arc: [
        { act: 'Act I', note: 'Denial — refuses the weight of the Ember' },
        { act: 'Act II', note: 'Reckoning — forced to use Veilfire, loses something' },
        { act: 'Act III', note: 'Acceptance — becomes what she feared' },
      ],
    },
    {
      id: 'edren', name: 'Edren Mourne', epithet: 'The Hollow Archivist',
      role: 'Antagonist · Scholar', age: 51, origin: 'Hollow Court',
      faction: 'Hollow Court', status: 'Active',
      avatar_initial: 'EM', avatar_color: '#6b9fd4', avatar_image: null,
      bio: 'Former Archivist of the Hollow Court, Edren Mourne spent thirty years cataloguing the lost and the forgotten. He found Lyra Voss in an Ironmere gutter and saw potential — or perhaps a useful instrument. He seeks the Ashen Crown not for power, but because he believes forgetting is the only mercy left.',
      stats: { Cunning: 95, Resolve: 85, Empathy: 20, Combat: 40, Magic: 75, Influence: 88 },
      traits: ['Methodical', 'Coldly brilliant', 'Ends justify means', 'Genuinely grieving'],
      relationships: [
        { id: 'r5', name: 'Lyra Voss', type: 'Former Protégé', color: '#e8c87a' },
        { id: 'r6', name: 'The Hollow Court', type: 'Leads', color: '#9b7ec8' },
      ],
      arc: [
        { act: 'Act I', note: 'Introduction — the brilliant villain with a plan' },
        { act: 'Act II', note: 'Revelation — his grief is revealed' },
        { act: 'Act III', note: 'Tragedy — achieves his goal, loses everything' },
      ],
    },
    {
      id: 'sable', name: 'Sable of the Ashwood', epithet: 'Voice of the Forgotten Trees',
      role: 'Ally · Ashwalker', age: 33, origin: 'Ashwood Forest',
      faction: 'Ashwalkers', status: 'Active',
      avatar_initial: 'SA', avatar_color: '#7ec89b', avatar_image: null,
      bio: 'Sable emerged from the Ashwood three years ago and has not spoken of why. She fights with a staff of burned wood and knows things she should not. She finds Lyra in Ironmere, apparently by accident, and her help is given freely — which Lyra finds more suspicious than anything.',
      stats: { Cunning: 70, Resolve: 90, Empathy: 85, Combat: 78, Magic: 60, Influence: 45 },
      traits: ['Enigmatic', 'Deeply calm', 'Protective', 'Knows more than she says'],
      relationships: [
        { id: 'r7', name: 'Lyra Voss', type: 'Ally', color: '#e8c87a' },
        { id: 'r8', name: 'Ferris', type: 'Knows', color: '#c8917e' },
      ],
      arc: [
        { act: 'Act I', note: "Mystery — why is she really here?" },
        { act: 'Act II', note: "Trust — earns Lyra's confidence" },
        { act: 'Act III', note: 'Sacrifice — her secret revealed at great cost' },
      ],
    },
  ],

  timelineEvents: [
    { id: 'e1', year: 'Year 0',  label: 'The Shattering',        type: 'world',     color: '#c8917e', desc: 'The Veil tears. Veilfire spreads across Ironmere.' },
    { id: 'e2', year: 'Year 9',  label: 'Lyra orphaned',         type: 'character', color: '#e8c87a', desc: 'Veilfire takes her parents. Lyra survives alone.' },
    { id: 'e3', year: 'Year 10', label: 'Hollow Court founded',  type: 'faction',   color: '#9b7ec8', desc: 'Edren Mourne establishes the Archivists.' },
    { id: 'e4', year: 'Year 15', label: 'Lyra recruited',        type: 'character', color: '#e8c87a', desc: 'Edren discovers Lyra and brings her to the Court.' },
    { id: 'e5', year: 'Year 18', label: 'The Ember Awakens',     type: 'magic',     color: '#c9a055', desc: 'Lyra channels Veilfire for the first time. Nearly dies.' },
    { id: 'e6', year: 'Year 20', label: 'Lyra leaves the Court', type: 'character', color: '#e8c87a', desc: 'She escapes with nothing. The Court is not happy.' },
    { id: 'e7', year: 'Year 21', label: 'The Crown surfaces',    type: 'world',     color: '#c8917e', desc: 'Rumors of the Ashen Crown reach Ironmere.' },
    { id: 'e8', year: 'Year 24', label: 'Chapter I begins',      type: 'story',     color: '#6b9fd4', desc: 'Present day. Lyra arrives in Ironmere.' },
  ],

  encyclopediaCategories: [
    { id: 'cat1', name: 'Magic Systems', color: '#9b7ec8' },
    { id: 'cat2', name: 'Cultures',      color: '#6b9fd4' },
    { id: 'cat3', name: 'Religions',     color: '#c8917e' },
    { id: 'cat4', name: 'Artifacts',     color: '#c9a055' },
  ],

  encyclopediaEntries: [
    { id: 'l1',  categoryId: 'cat1', name: 'Veilfire',                    description: 'A flame that burns only memory. Drawn from grief, spent in forgetting.' },
    { id: 'l2',  categoryId: 'cat1', name: 'The Sundering Rite',          description: 'Ancient ceremony that tears the Veil, allowing passage to the forgotten realm.' },
    { id: 'l3',  categoryId: 'cat1', name: 'Ember Binding',               description: 'Art of containing Veilfire within glass. Burns cold and reveals hidden truths.' },
    { id: 'l4',  categoryId: 'cat1', name: 'Memory Siphoning',            description: 'Forbidden technique extracting specific memories, leaving an inexplicable gap.' },
    { id: 'l5',  categoryId: 'cat2', name: 'The Ironmeri',                description: 'The people of Ironmere. Pragmatic, trade-focused, suspicious of magic.' },
    { id: 'l6',  categoryId: 'cat2', name: 'Ashwalkers',                  description: 'Nomadic people roaming the ashlands, claiming kinship with forgotten things.' },
    { id: 'l7',  categoryId: 'cat2', name: 'Court Archivists',            description: 'Scholars of the Hollow Court dedicated to cataloguing all that has been forgotten.' },
    { id: 'l8',  categoryId: 'cat2', name: 'Veiled Nomads',               description: 'Those who walk the Veiled Reach, half in and half out of the world.' },
    { id: 'l9',  categoryId: 'cat3', name: 'The Hollow Doctrine',         description: 'Belief: forgetting is mercy, accumulated memory is what breaks people.' },
    { id: 'l10', categoryId: 'cat3', name: 'Cult of the Ember',           description: 'Those who worship Veilfire as cleansing force, seeking their own immolation.' },
    { id: 'l11', categoryId: 'cat3', name: 'Forgetting Faith',            description: 'Ironmeri folk religion: light a candle for what you want to forget.' },
    { id: 'l12', categoryId: 'cat4', name: 'The Ashen Crown',             description: 'Forged from bones of the First Unmaker. Grants dominion over forgotten things.' },
    { id: 'l13', categoryId: 'cat4', name: 'Ember-glass',                 description: 'Glass containing bound Veilfire. Burns cold, reveals hidden things.' },
    { id: 'l14', categoryId: 'cat4', name: "The First Unmaker's Bones",   description: 'Remains of the being who created the Veil. Used to forge the Ashen Crown.' },
    { id: 'l15', categoryId: 'cat4', name: 'Veil Shards',                 description: 'Crystallized fragments of torn Veil, each containing echoes of the tearing.' },
  ],

  chapters: [
    { id: 'chapter1', title: 'Chapter I — The Veil',           content: '' },
    { id: 'chapter2', title: 'Chapter II — Ash & Ember',       content: _SAMPLE },
    { id: 'chapter3', title: 'Chapter III — The Hollow King',  content: '' },
  ],

  mapPins: [
    { id: 'mp1', x: 42, y: 55, label: 'Ironmere',          color: '#c9a055', type: 'City',    description: 'A port city at the edge of the Veiled Reach. Ash falls like snow.' },
    { id: 'mp2', x: 68, y: 32, label: 'The Veiled Reach',  color: '#9b7ec8', type: 'Region',  description: 'A vast ashland where the Veil hangs thin. Dangerous to cross alone.' },
    { id: 'mp3', x: 22, y: 68, label: 'Ashwood',           color: '#7ec89b', type: 'Forest',  description: 'A forest of burned trees that somehow still grow.' },
    { id: 'mp4', x: 58, y: 22, label: 'Hollow Court',      color: '#6b9fd4', type: 'Fortress',description: 'The fortress-archive of Edren Mourne and his Archivists.' },
    { id: 'mp5', x: 80, y: 70, label: 'Ruined Waystation', color: '#c8917e', type: 'Ruin',    description: 'A collapsed outpost on the eastern trade road. Something happened here.' },
  ],

  mapBackground: null,

  moodImages: [
    { id: 'mi1', url: 'https://picsum.photos/seed/ash1/300/200',   caption: 'Ironmere harbor' },
    { id: 'mi2', url: 'https://picsum.photos/seed/veil2/300/200',  caption: 'The Veil at dusk' },
    { id: 'mi3', url: 'https://picsum.photos/seed/crown3/300/200', caption: 'Ancient ruins' },
    { id: 'mi4', url: 'https://picsum.photos/seed/lyra4/300/200',  caption: 'Character ref: Lyra' },
    { id: 'mi5', url: 'https://picsum.photos/seed/magic5/300/200', caption: 'Veilfire concept' },
    { id: 'mi6', url: 'https://picsum.photos/seed/court6/300/200', caption: 'Hollow Court' },
  ],

  writingPrompts: [
    'What memory does Lyra refuse to revisit, and why?',
    'Describe Ironmere from the perspective of its oldest building.',
    'If Veilfire had a voice, what would it say to Lyra?',
    "Write the last page of Edren Mourne's journal before he found the Crown.",
    'What does the smell of ash mean to someone who has never seen fire?',
  ],

  ambientSounds: [
    { id: 'as1', label: 'Harbor Rain',      icon: '🌧', youtubeId: 'q76bMs-NwRk', active: false },
    { id: 'as2', label: 'Tavern Murmur',    icon: '🍺', youtubeId: 'hHh3PJuDPiE', active: false },
    { id: 'as3', label: 'Wind Through Ash', icon: '🌬', youtubeId: 'aXItOY0sLRY', active: false },
  ],

  recentActivity: [
    { type: 'character', label: 'Lyra Voss updated',    time: Date.now() - 120000,    icon: '◈', color: '#e8c87a' },
    { type: 'chapter',   label: 'Chapter II drafted',   time: Date.now() - 3600000,   icon: '✍', color: '#c9a055' },
    { type: 'lore',      label: 'Veilfire magic added', time: Date.now() - 10800000,  icon: '◬', color: '#7ec89b' },
    { type: 'place',     label: 'Ironmere map pinned',  time: Date.now() - 86400000,  icon: '◉', color: '#6b9fd4' },
  ],

  storyTags: ['Gothic', 'Magic System', 'Found Family', 'Grief', 'Power Corruption', 'Dark Fantasy', 'Revenge Arc', 'Slow Burn'],
};

// ── Engine ─────────────────────────────────────────────────────────────────
const _listeners = new Set();
let _data = _DEFAULT;

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    _data = {
      ..._DEFAULT,
      ...parsed,
      // always merge sub-arrays carefully
      characters: parsed.characters || _DEFAULT.characters,
      timelineEvents: parsed.timelineEvents || _DEFAULT.timelineEvents,
      encyclopediaCategories: parsed.encyclopediaCategories || _DEFAULT.encyclopediaCategories,
      encyclopediaEntries: parsed.encyclopediaEntries || _DEFAULT.encyclopediaEntries,
      chapters: parsed.chapters || _DEFAULT.chapters,
      mapPins: parsed.mapPins || _DEFAULT.mapPins,
      ambientSounds: parsed.ambientSounds || _DEFAULT.ambientSounds,
      recentActivity: parsed.recentActivity || _DEFAULT.recentActivity,
      moodImages: parsed.moodImages || _DEFAULT.moodImages,
      storyTags: parsed.storyTags || _DEFAULT.storyTags,
    };
  }
} catch(e) { console.warn('MythosForge: could not load saved data', e); }

const _save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_data)); } catch(e) {} };
const _notify = () => { _listeners.forEach(fn => { try { fn(_data); } catch(e) {} }); };

const genId = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

const Store = {
  get: () => _data,
  subscribe: (fn) => { _listeners.add(fn); return () => _listeners.delete(fn); },

  update(updater) {
    _data = typeof updater === 'function' ? updater(_data) : { ..._data, ...updater };
    _save(); _notify();
  },

  addActivity(activity) {
    _data = { ..._data, recentActivity: [{ ...activity, time: Date.now() }, ..._data.recentActivity].slice(0, 12) };
    _save(); _notify();
  },

  // ── Characters ──────────────────────────────────────────────────────────
  addCharacter(ch) {
    const c = { traits: [], relationships: [], arc: [], stats: { Cunning:50, Resolve:50, Empathy:50, Combat:50, Magic:50, Influence:50 }, ...ch, id: genId() };
    this.update(d => ({ ...d, characters: [...d.characters, c] }));
    this.addActivity({ type: 'character', label: `${c.name} added`, icon: '◈', color: c.avatar_color || '#e8c87a' });
    return c;
  },
  updateCharacter(id, updates) {
    this.update(d => ({ ...d, characters: d.characters.map(c => c.id === id ? { ...c, ...updates } : c) }));
    this.addActivity({ type: 'character', label: `${updates.name || id} updated`, icon: '◈', color: updates.avatar_color || '#e8c87a' });
  },
  deleteCharacter(id) {
    this.update(d => ({
      ...d,
      characters: d.characters.filter(c => c.id !== id),
      activeCharacterId: d.activeCharacterId === id ? (d.characters.find(c => c.id !== id)?.id || null) : d.activeCharacterId,
    }));
  },

  // ── Timeline ────────────────────────────────────────────────────────────
  addTimelineEvent(ev) {
    const e = { ...ev, id: genId() };
    this.update(d => ({ ...d, timelineEvents: [...d.timelineEvents, e] }));
    this.addActivity({ type: 'timeline', label: `Event: ${ev.label}`, icon: '◫', color: ev.color || '#c9a055' });
    return e;
  },
  updateTimelineEvent(id, updates) {
    this.update(d => ({ ...d, timelineEvents: d.timelineEvents.map(e => e.id === id ? { ...e, ...updates } : e) }));
  },
  deleteTimelineEvent(id) {
    this.update(d => ({ ...d, timelineEvents: d.timelineEvents.filter(e => e.id !== id) }));
  },

  // ── Encyclopedia ─────────────────────────────────────────────────────────
  addEncyclopediaEntry(entry) {
    const e = { ...entry, id: genId() };
    this.update(d => ({ ...d, encyclopediaEntries: [...d.encyclopediaEntries, e] }));
    this.addActivity({ type: 'lore', label: `${entry.name} added`, icon: '◬', color: '#9b7ec8' });
    return e;
  },
  updateEncyclopediaEntry(id, updates) {
    this.update(d => ({ ...d, encyclopediaEntries: d.encyclopediaEntries.map(e => e.id === id ? { ...e, ...updates } : e) }));
  },
  deleteEncyclopediaEntry(id) {
    this.update(d => ({ ...d, encyclopediaEntries: d.encyclopediaEntries.filter(e => e.id !== id) }));
  },
  addEncyclopediaCategory(cat) {
    const c = { ...cat, id: genId() };
    this.update(d => ({ ...d, encyclopediaCategories: [...d.encyclopediaCategories, c] }));
    return c;
  },

  // ── Chapters ─────────────────────────────────────────────────────────────
  updateChapterContent(id, content) {
    this.update(d => ({ ...d, chapters: d.chapters.map(c => c.id === id ? { ...c, content } : c) }));
  },
  addChapter(title) {
    const c = { id: genId(), title, content: '' };
    this.update(d => ({ ...d, chapters: [...d.chapters, c] }));
    this.addActivity({ type: 'chapter', label: `${title} created`, icon: '✍', color: '#c9a055' });
    return c;
  },
  deleteChapter(id) {
    this.update(d => ({
      ...d,
      chapters: d.chapters.filter(c => c.id !== id),
      activeChapterId: d.activeChapterId === id ? (d.chapters[0]?.id || null) : d.activeChapterId,
    }));
  },

  // ── Map Pins ─────────────────────────────────────────────────────────────
  addMapPin(pin) {
    const p = { ...pin, id: genId() };
    this.update(d => ({ ...d, mapPins: [...d.mapPins, p] }));
    this.addActivity({ type: 'place', label: `${pin.label} pinned`, icon: '◉', color: pin.color || '#6b9fd4' });
    return p;
  },
  updateMapPin(id, updates) {
    this.update(d => ({ ...d, mapPins: d.mapPins.map(p => p.id === id ? { ...p, ...updates } : p) }));
  },
  deleteMapPin(id) {
    this.update(d => ({ ...d, mapPins: d.mapPins.filter(p => p.id !== id) }));
  },

  // ── Misc ──────────────────────────────────────────────────────────────────
  toggleAmbientSound(id) {
    this.update(d => ({
      ...d,
      ambientSounds: d.ambientSounds.map(s => ({ ...s, active: s.id === id ? !s.active : false })),
    }));
  },
  addMoodImage(img) {
    this.update(d => ({ ...d, moodImages: [...d.moodImages, { ...img, id: genId() }] }));
  },
  deleteMoodImage(id) {
    this.update(d => ({ ...d, moodImages: d.moodImages.filter(i => i.id !== id) }));
  },
  addStoryTag(tag) {
    this.update(d => ({ ...d, storyTags: d.storyTags.includes(tag) ? d.storyTags : [...d.storyTags, tag] }));
  },
  removeStoryTag(tag) {
    this.update(d => ({ ...d, storyTags: d.storyTags.filter(t => t !== tag) }));
  },
  reset() {
    _data = JSON.parse(JSON.stringify(_DEFAULT));
    _data.recentActivity = _DEFAULT.recentActivity.map(a => ({ ...a, time: Date.now() - (Math.random() * 86400000) }));
    localStorage.removeItem(STORAGE_KEY);
    _notify();
  },
};

// ── Hook ───────────────────────────────────────────────────────────────────
function useStore(selector) {
  const sel = selector || (d => d);
  const [value, setValue] = React.useState(() => sel(Store.get()));
  React.useEffect(() => {
    setValue(sel(Store.get()));
    return Store.subscribe(d => setValue(sel(d)));
  }, []);
  return value;
}

// ── Utilities ──────────────────────────────────────────────────────────────
function getLoreTerms(data) {
  const terms = [];
  (data.characters || []).forEach(c => {
    terms.push({ name: c.name, type: 'character', id: c.id, color: c.avatar_color || '#e8c87a', summary: (c.bio || c.role || '').slice(0, 140) });
  });
  (data.mapPins || []).forEach(p => {
    terms.push({ name: p.label, type: 'place', id: p.id, color: p.color || '#6b9fd4', summary: p.description || p.type });
  });
  (data.encyclopediaEntries || []).forEach(e => {
    terms.push({ name: e.name, type: 'lore', id: e.id, color: '#9b7ec8', summary: e.description || e.name });
  });
  return terms.filter(t => t.name && t.name.length > 2);
}

function getTotalWordCount(chapters) {
  return (chapters || []).reduce((sum, ch) => {
    return sum + ((ch.content || '').trim().split(/\s+/).filter(Boolean).length);
  }, 0);
}

function formatTimeAgo(ts) {
  const d = Date.now() - ts;
  if (d < 60000)   return 'Just now';
  if (d < 3600000) return `${Math.floor(d / 60000)} min ago`;
  if (d < 86400000)return `${Math.floor(d / 3600000)} hr ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

function buildHighlightedHtml(text, loreTerms) {
  if (!text || !loreTerms.length) return text || '';
  const sorted = [...loreTerms].sort((a, b) => b.name.length - a.name.length);
  const patterns = sorted.map(t => t.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${patterns.join('|')})`, 'gi');
  const termMap = {};
  loreTerms.forEach(t => { termMap[t.name.toLowerCase()] = t; });
  const escHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let result = '', last = 0, m;
  regex.lastIndex = 0;
  while ((m = regex.exec(text)) !== null) {
    result += escHtml(text.slice(last, m.index));
    const t = termMap[m[0].toLowerCase()];
    if (t) {
      const d = encodeURIComponent(JSON.stringify({ name: t.name, type: t.type, color: t.color, summary: t.summary }));
      result += `<mark class="lore-term" data-term="${d}" style="background:${t.color}22;color:${t.color};border-radius:3px;padding:0 2px;cursor:help;border-bottom:1px solid ${t.color}55">${escHtml(m[0])}</mark>`;
    } else {
      result += escHtml(m[0]);
    }
    last = m.index + m[0].length;
  }
  result += escHtml(text.slice(last));
  return result;
}

Object.assign(window, { Store, useStore, genId, getLoreTerms, getTotalWordCount, formatTimeAgo, buildHighlightedHtml });
