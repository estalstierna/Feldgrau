// Game engine: state, effects, event selection, choice resolution, time.
window.SIM = window.SIM || {};

SIM.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
SIM.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

SIM.newState = function (char) {
  const s = {
    version: 1,
    char,
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
  });
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

SIM.findEvent = id => SIM.EVENTS.find(e => e.id === id) || SIM.POOL.find(e => e.id === id);

// Pick the event for the current day/phase.
SIM.pickEvent = function (s) {
  const scripted = SIM.EVENTS.filter(e => e.day === s.day && e.phase === s.phase && !s.seen[e.id] && (!e.cond || e.cond(s)));
  if (scripted.length) return scripted[0];
  const pool = SIM.POOL.filter(e => e.phases.includes(s.phase) && !s.seen[e.id] && (!e.cond || e.cond(s)));
  if (!pool.length) return null;
  const total = pool.reduce((a, e) => a + (e.weight || 1), 0);
  let r = Math.random() * total;
  for (const e of pool) { r -= (e.weight || 1); if (r <= 0) return e; }
  return pool[pool.length - 1];
};

SIM.choiceVisible = (s, ch) => !ch.show || ch.show(s);
SIM.choiceAllowed = (s, ch) => !ch.req || ch.req(s);

SIM.resolveChoice = function (s, ev, ch) {
  const out = { texts: [], deltas: {}, next: null, end: null, wounded: false };
  const x = {
    apply: e => SIM.apply(s, e, out.deltas),
    roll: p => Math.random() < p,
    rand: SIM.rand,
    say: t => out.texts.push(SIM.fmt(s, t)),
    log: t => SIM.addLog(s, t),
    next: id => { out.next = id; },
    end: id => { out.end = id; }
  };
  s.seen[ev.id] = true;
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
      const fatalChance = r.fatal !== undefined ? r.fatal : 0.08 + (dmg >= 30 ? 0.14 : 0);
      if (Math.random() < fatalChance) { out.deltas.health = (out.deltas.health || 0) - s.stats.health; s.stats.health = 0; s.deathCause = r.cause; return out; }
      x.say(dmg >= 35 ? 'It is bad. Very bad.' : dmg >= 20 ? 'A medic packs the wound. You can still walk, just.' : 'A graze. You will live.');
      if (s.stats.health <= 0) s.deathCause = r.cause;
      SIM.addLog(s, 'Wounded.');
    } else if (r.miss) x.say(r.miss);
  }
  if (ch.outcome) ch.outcome(s, x);
  if (ch.log) SIM.addLog(s, ch.log);
  out.next = out.next || ch.next || ev.after || null;
  out.end = out.end || ch.end || null;
  return out;
};

SIM.addLog = function (s, text) {
  const d = SIM.DAYS[Math.min(s.day, SIM.DAYS.length - 1)];
  s.log.push({ date: d.short, phase: SIM.PHASES[s.phase], text: SIM.fmt(s, text) });
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
  const atWar = !!SIM.DAYS[s.day].war;
  SIM.apply(s, { food: (atWar ? -7 : -5) + (s.flags.farm ? 1 : 0) }, d);
  if (!atWar && s.phase === 2) { SIM.apply(s, { food: 8 }, d); notes.push('The field kitchen comes round with pea soup.'); }
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
  if (s.day >= SIM.DAYS.length) return 'chapterEnd';
  return 'next';
};

SIM.finish = function (s, id) {
  let e = SIM.ENDINGS[id];
  if (e && e.resolve) { id = e.resolve(s); e = SIM.ENDINGS[id]; }
  if (id === 'decorated') s.rank = Math.max(s.rank, 1);
  s.ending = id;
  return id;
};

// Persistence (best effort).
SIM.SAVE_KEY = 'feldgrau-save-v1';
SIM.save = function (s) { try { localStorage.setItem(SIM.SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ } };
SIM.load = function () { try { const t = localStorage.getItem(SIM.SAVE_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } };
SIM.clearSave = function () { try { localStorage.removeItem(SIM.SAVE_KEY); } catch (e) { /* ignore */ } };
