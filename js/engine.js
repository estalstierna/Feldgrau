// Game engine: state, effects, event selection, choice resolution, time.
window.SIM = window.SIM || {};

SIM.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
SIM.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

SIM.newState = function (char) {
  const s = {
    version: 2,
    char,
    chapter: 0,
    stage: 'event',
    chMerit: 0,
    wounds: 0,
    assaultDays: [],
    medals: [],
    rankHistory: [{ rank: 0, date: SIM.serviceStart(char) }],
    rel: {},
    items: {},
    skillXp: {},
    squad: null,
    reviews: {},
    delayed: [],
    newAwards: [],
    stats: Object.assign({}, SIM.BASE_STATS),
    marks: SIM.BASE_MARKS,
    merit: 0,
    rank: 0,
    day: 0,
    phase: 0,
    flags: {},
    log: [],
    seen: {},
    current: null,
    ending: null,
    deathCause: null,
    notes: []
  };
  const opts = SIM.CREATION;
  const pick = (list, id) => list.find(o => o.id === id);
  [pick(opts.birthYear, char.birthYear), pick(opts.hometown, char.hometown),
   pick(opts.background, char.background), pick(opts.family, char.family)].forEach(o => {
    if (!o) return;
    SIM.apply(s, o.effects || {}, {});
    if (o.flag) s.flags[o.flag] = true;
    if (o.medal) SIM.award(s, o.medal, o.medalReason, o.medalDate);
  });
  s.newAwards = [];
  return s;
};

// Apply a delta object to the state; record visible deltas.
SIM.apply = function (s, eff, deltas) {
  for (const k in eff) {
    const v = eff[k];
    if (k in s.stats) {
      const before = s.stats[k];
      s.stats[k] = SIM.clamp(before + v, 0, 100);
      const d = s.stats[k] - before;
      if (d && deltas) deltas[k] = (deltas[k] || 0) + d;
    } else if (k === 'marks') {
      const before = s.marks;
      s.marks = Math.max(0, s.marks + v);
      if (deltas && s.marks !== before) deltas.marks = (deltas.marks || 0) + (s.marks - before);
    } else if (k === 'merit') {
      s.merit += v;
      s.chMerit = (s.chMerit || 0) + v;
    }
  }
};

SIM.fmt = function (s, t) {
  if (typeof t === 'function') t = t(s);
  if (!t) return '';
  const c = s.char;
  return String(t)
    .replace(/\{first\}/g, c.first)
    .replace(/\{last\}/g, c.last)
    .replace(/\{town\}/g, SIM.townName(c.hometown));
};

SIM.findEvent = id => SIM.EVENTS.find(e => e.id === id) || SIM.POOL.find(e => e.id === id) || SIM.INTERLUDE_EVENTS[id];
SIM.INTERLUDE_EVENTS = SIM.INTERLUDE_EVENTS || {};

SIM.chapter = s => SIM.CHAPTERS[s.chapter || 0];
SIM.days = s => SIM.chapter(s).days;
SIM.today = s => { const d = SIM.days(s); return d[Math.min(s.day, d.length - 1)]; };
// A day's place can depend on the story so far.
SIM.dayPlace = (s, d) => typeof d.place === 'function' ? d.place(s) : d.place;
SIM.place = (s, id) => SIM.chapter(s).places[id];
SIM.isPool = ev => SIM.POOL.includes(ev);
// Random events may recur in later chapters; story events never do.
SIM.seenKey = (s, ev) => SIM.isPool(ev) ? `${s.chapter || 0}:${ev.id}` : ev.id;

// Pick the event for the current day/phase.
SIM.pickEvent = function (s) {
  const ch = s.chapter || 0;
  const scripted = SIM.EVENTS.filter(e => (e.chapter || 0) === ch && e.day === s.day && e.phase === s.phase && !s.seen[e.id] && (!e.cond || e.cond(s)));
  if (scripted.length) return scripted[0];
  const pool = SIM.POOL.filter(e => (e.chapters || [0]).includes(ch) && e.phases.includes(s.phase) && !s.seen[SIM.seenKey(s, e)] && (!e.cond || e.cond(s)));
  if (!pool.length) return null;
  const total = pool.reduce((a, e) => a + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const e of pool) { r -= (e.weight || 1); if (r <= 0) return e; }
  return pool[pool.length - 1];
};

SIM.choiceVisible = (s, ch) => !ch.show || ch.show(s);
SIM.choiceAllowed = (s, ch) => !ch.req || ch.req(s);

SIM.resolveChoice = function (s, ev, ch, man) {
  const out = { texts: [], deltas: {}, extra: [], next: null, end: null, wounded: false };
  const x = {
    apply: e => SIM.apply(s, e, out.deltas),
    roll: p => Math.random() < p,
    rand: SIM.rand,
    say: t => out.texts.push(SIM.fmt(s, t)),
    log: t => SIM.addLog(s, t),
    next: id => { out.next = id; },
    end: id => { out.end = id; },
    get wasHit() { return out.wounded; },
    man: man || null
  };
  if (SIM.extendContext) SIM.extendContext(s, x, out);
  s.seen[SIM.seenKey(s, ev)] = true;
  s.newAwards = [];
  if (ch.effects) x.apply(ch.effects);
  if (ch.set) Object.assign(s.flags, ch.set);
  if (ch.result) x.say(ch.result);
  if (ch.risk) {
    const r = ch.risk;
    const p = typeof r.chance === 'function' ? r.chance(s) : r.chance;
    if (Math.random() < p) {
      const dmg = SIM.rand(r.dmg[0], r.dmg[1]);
      x.apply({ health: -dmg, morale: -3 });
      out.wounded = true;
      s.flags.wounded = true;
      x.say(r.hit || 'You are hit.');
      // Some hits are simply fatal. The chance rises with the severity of the wound.
      const fatalChance = r.fatal !== undefined ? r.fatal : 0.06 + (dmg >= 30 ? 0.11 : 0);
      if (Math.random() < fatalChance) { out.deltas.health = (out.deltas.health || 0) - s.stats.health; s.stats.health = 0; s.deathCause = r.cause; return out; }
      x.say(dmg >= 35 ? 'It is bad. Very bad.' : dmg >= 20 ? 'A medic packs the wound. You can still walk, just.' : 'A graze. You will live.');
      if (s.stats.health <= 0) s.deathCause = r.cause;
      SIM.addLog(s, 'Wounded.');
      SIM.woundBadge(s);
    } else if (r.miss) x.say(r.miss);
  }
  if (ch.assault && s.stats.health > 0) SIM.markAssault(s);
  if (ch.delay) s.delayed.push(Object.assign({}, ch.delay));
  if (SIM.applyExtras) SIM.applyExtras(s, ch, x, out);
  if (ch.outcome) ch.outcome(s, x);
  if (ch.log) SIM.addLog(s, ch.log);
  out.awards = s.newAwards.slice();
  out.next = out.next || ch.next || ev.after || null;
  out.end = out.end || ch.end || null;
  return out;
};

SIM.addLog = function (s, text) {
  const d = s.stage === 'interlude' ? { short: SIM.chapter(s).interludeDate || '' } : SIM.today(s);
  s.log.push({ date: d.short, phase: SIM.PHASES[s.phase], text: SIM.fmt(s, text), chapter: s.chapter || 0 });
};

SIM.fatal = function (s) {
  if (s.stats.health <= 0) return 'kia';
  if (s.stats.suspicion >= 100) return 'arrested';
  if (s.stats.morale <= 0) return 'breakdown';
  return null;
};

// End-of-phase upkeep. Returns notes to show at the top of the next event.
SIM.upkeep = function (s) {
  const notes = [];
  const d = {};
  const atWar = !!SIM.today(s).war;
  // Delayed effects (e.g. the crash after a stimulant).
  (s.delayed || []).forEach(dl => {
    dl.in--;
    if (dl.in <= 0) { SIM.apply(s, dl.effects || {}, d); if (dl.note) notes.push(dl.note); }
  });
  s.delayed = (s.delayed || []).filter(dl => dl.in > 0);
  const drain = SIM.chapter(s).foodDrain;
  SIM.apply(s, { food: (drain !== undefined && !atWar ? drain : (atWar ? -7 : -5)) + (s.flags.farm ? 1 : 0) }, d);
  if (!atWar && s.phase === 2) { SIM.apply(s, { food: 8 }, d); notes.push(SIM.chapter(s).kitchenNote || 'The field kitchen comes round with pea soup.'); }
  if (atWar && s.phase === 2 && Math.random() < 0.6) { SIM.apply(s, { food: 12 }, d); notes.push('The field kitchen catches up with the company at last: lukewarm stew and bread.'); }
  if (s.stats.food <= 15) {
    SIM.apply(s, { health: -4, morale: -3 }, d);
    notes.push('You are starving. Hunger gnaws at your strength and your nerve.');
  } else if (s.stats.food <= 30) {
    SIM.apply(s, { morale: -1 }, d);
    notes.push('You are hungry.');
  }
  if (s.phase === 2 && s.stats.food > 30) SIM.apply(s, { health: 3 }, d); // rest overnight
  if (s.stats.health < 30) notes.push('Your wounds throb. You need rest and a doctor.');
  if (s.stats.morale < 20) notes.push('Something in you is close to breaking.');
  if (s.stats.suspicion >= 70) notes.push('You feel eyes on you. People stop talking when you come near.');
  return notes;
};

// Advance to next phase. Returns 'next' or 'chapterEnd'.
SIM.advance = function (s) {
  s.notes = SIM.upkeep(s);
  s.phase++;
  if (s.phase > 2) { s.phase = 0; s.day++; }
  if (s.day >= SIM.days(s).length) return 'chapterEnd';
  return 'next';
};

SIM.finish = function (s, id) {
  let e = SIM.ENDINGS[id];
  if (e && e.resolve) { id = e.resolve(s); e = SIM.ENDINGS[id]; }
  s.ending = id;
  s.stage = 'ending';
  s.current = null;
  if (!e.final) SIM.review(s);
  if (e.onFinish) e.onFinish(s);
  return id;
};

// One step of game flow after a choice has been resolved.
// Returns { type: 'event', ev } or { type: 'ending', id }.
SIM.step = function (s, ev, out) {
  if (out.end) return { type: 'ending', id: SIM.finish(s, out.end) };
  let f = SIM.fatal(s);
  if (f) return { type: 'ending', id: SIM.finish(s, f) };
  if (out.next) { s.notes = []; return { type: 'event', ev: SIM.findEvent(out.next) }; }
  const ch = SIM.chapter(s);
  if (ev.id === ch.finalEvent) return { type: 'ending', id: SIM.finish(s, ch.ending(s)) };
  for (let guard = 0; guard < 50; guard++) {
    const res = SIM.advance(s);
    f = SIM.fatal(s);
    if (f) return { type: 'ending', id: SIM.finish(s, f) };
    if (res === 'chapterEnd') return { type: 'ending', id: SIM.finish(s, ch.ending(s)) };
    const next = SIM.pickEvent(s);
    if (next) return { type: 'event', ev: next };
  }
  return { type: 'ending', id: SIM.finish(s, ch.ending(s)) };
};

// ── Awards ──
SIM.hasMedal = (s, id) => s.medals.some(m => m.id === id);
SIM.award = function (s, id, reason, date) {
  if (!SIM.MEDALS[id] || SIM.hasMedal(s, id)) return false;
  const when = date || (s.stage === 'interlude' ? SIM.chapter(s).interludeDate : SIM.today(s).date);
  s.medals.push({ id, reason: reason || '', date: when, chapter: s.chapter || 0 });
  (s.newAwards = s.newAwards || []).push(id);
  if (!date) SIM.addLog(s, `Awarded the ${SIM.MEDALS[id].name}.`);
  return true;
};
SIM.woundBadge = function (s) {
  s.wounds = (s.wounds || 0) + 1;
  const where = SIM.today(s).date;
  if (s.wounds >= 5) SIM.award(s, 'wound_gold', `Wounded five times. Most recently on ${where}.`);
  else if (s.wounds >= 3) SIM.award(s, 'wound_silver', `Wounded three times. Most recently on ${where}.`);
  else SIM.award(s, 'wound_black', `Wounded in action, ${where}.`);
};
SIM.markAssault = function (s) {
  const key = `${s.chapter || 0}-${s.day}`;
  if (!s.assaultDays.includes(key)) s.assaultDays.push(key);
  // The Infantry Assault Badge was instituted in December 1939: only later actions count.
  const counted = s.assaultDays.filter(k => Number(k.split('-')[0]) >= 1).length;
  if (counted >= 3) SIM.award(s, 'isa', 'Three assaults with weapon in hand on three separate days.');
};

// ── Promotion board and decorations at the end of a chapter ──
SIM.review = function (s) {
  const key = s.chapter || 0;
  if (s.reviews[key]) return s.reviews[key];
  const ch = SIM.chapter(s);
  s.newAwards = [];
  const from = s.rank, reasons = [];
  let steps = 0;
  const black = ch.blackMarks ? ch.blackMarks(s) : [];
  if (s.stats.suspicion >= 60) black.push('Political reliability in doubt.');
  if (!black.length) { steps++; reasons.push(ch.routineReason); }
  else reasons.push(...black.map(b => 'Routine promotion withheld: ' + b));
  const score = (s.chMerit || 0) + (s.stats.officers - 50) / 10;
  const bar = ch.meritBar || 6;
  if (score >= bar) {
    reasons.push(ch.meritReason);
    // Skipping a rank needs both a clean record and an exceptional recommendation.
    if (steps === 0 || score >= bar * 1.6) steps++;
    if (steps === 2) reasons.push('Promoted ahead of time for exceptional conduct.');
  }
  const maxRank = typeof ch.maxRank === 'function' ? ch.maxRank(s) : ch.maxRank;
  const to = Math.min(from + steps, Math.max(from, maxRank));
  if (to > from) { s.rank = to; s.rankHistory.push({ rank: to, date: ch.promoDate }); }
  if (from + steps > to && to >= 3) { s.flags.ncoCandidate = true; reasons.push('Recommended for the NCO course. Unteroffizier rank requires it.'); }
  else if (to === from && steps > 0) reasons.push('No higher rank is open to you yet.');
  if (ch.awards) ch.awards(s, score);
  s.reviews[key] = { from, to, reasons, awards: s.newAwards.slice(), score };
  s.newAwards = [];
  return s.reviews[key];
};

// Long service: four years in uniform by the start of a chapter.
SIM.SERVICE_START = { 1917: [1937, 11], 1918: [1938, 11], 1919: [1939, 4] };
SIM.checkService = function (s) {
  const ch = SIM.chapter(s);
  const st = SIM.SERVICE_START[s.char.birthYear];
  if (!ch.start || !st) return;
  const months = (ch.start[0] - st[0]) * 12 + (ch.start[1] - st[1]);
  if (months >= 48) {
    const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    SIM.award(s, 'longservice4', 'Four years of service.', `${names[st[1] - 1]} ${st[0] + 4}`);
  }
};

// Interlude events still to be played, in order.
SIM.pendingInterlude = s => (SIM.chapter(s).interludeEvents || []).map(id => SIM.INTERLUDE_EVENTS[id]).filter(ev => ev && !s.seen[ev.id]);

SIM.hasNextChapter = s => !!SIM.CHAPTERS[(s.chapter || 0) + 1] && s.ending && !SIM.ENDINGS[s.ending].final;

SIM.enterInterlude = function (s) {
  s.stage = 'interlude';
  s.chapter = (s.chapter || 0) + 1;
  const ch = SIM.chapter(s);
  if (ch.onInterlude) ch.onInterlude(s);
};

SIM.startChapter = function (s) {
  const ch = SIM.chapter(s);
  s.stage = 'event';
  s.day = 0; s.phase = 0; s.chMerit = 0;
  s.ending = null; s.notes = []; s.delayed = [];
  if (ch.onStart) ch.onStart(s);
  SIM.checkService(s);
  return SIM.pickEvent(s);
};

// Bring an older save up to date.
SIM.migrate = function (s) {
  if (!s) return s;
  s.chapter = s.chapter || 0;
  s.medals = s.medals || [];
  s.wounds = s.wounds || (s.flags && s.flags.wounded ? 1 : 0);
  s.assaultDays = s.assaultDays || [];
  s.rankHistory = s.rankHistory || [{ rank: s.rank || 0, date: SIM.serviceStart(s.char) }];
  s.reviews = s.reviews || {};
  s.delayed = s.delayed || [];
  s.newAwards = [];
  s.chMerit = s.chMerit || s.merit || 0;
  s.stage = s.stage || (s.current ? 'event' : 'ending');
  s.rel = s.rel || {};
  s.items = s.items || {};
  s.skillXp = s.skillXp || {};
  if (SIM.syncKit) SIM.syncKit(s);
  return s;
};

// Persistence (best effort).
SIM.SAVE_KEY = 'feldgrau-save-v1';
SIM.save = function (s) { try { localStorage.setItem(SIM.SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } };
SIM.load = function () { try { const t = localStorage.getItem(SIM.SAVE_KEY); return t ? SIM.migrate(JSON.parse(t)) : null; } catch (e) { return null; } };
SIM.clearSave = function () { try { localStorage.removeItem(SIM.SAVE_KEY); } catch (e) { /* ignore */ } };
