// Headless playthrough test: runs the engine with random choices many times,
// through every chapter and interlude.
// Usage: node tests/simulate.js [runs]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { console, Math };
ctx.window = ctx;
vm.createContext(ctx);
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(js\/[^"]+)"/g)].map(m => m[1]).filter(f => !/ui\.js$/.test(f));
for (const f of scripts) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx, { filename: f });
const SIM = ctx.SIM;

const pick = a => a[Math.floor(Math.random() * a.length)];
const RUNS = Number(process.argv[2] || 5000);
const BAD = /undefined|\[object|NaN|\$\{/;
const endings = {}, seen = {}, errors = [], ranks = {}, medals = {}, reached = {}, kit = {};

function check(label, t) { if (BAD.test(t)) throw new Error(`bad text in ${label}: ${t.slice(0, 120)}`); }

function playEvent(s, ev) {
  seen[ev.id] = (seen[ev.id] || 0) + 1;
  check(ev.id, SIM.fmt(s, ev.text));
  const options = ev.choices.filter(ch => SIM.choiceVisible(s, ch) && SIM.choiceAllowed(s, ch));
  if (!options.length) throw new Error(`no available choice in ${ev.id}`);
  const ch = pick(options);
  check(ev.id + ' choice', SIM.fmt(s, ch.text));
  let man = null;
  if (ch.assign) { const men = SIM.squadMen(s); if (!men.length) throw new Error(`assign without squad in ${ev.id}`); man = pick(men); }
  const out = SIM.resolveChoice(s, ev, ch, man);
  out.texts.forEach(t => check(ev.id + ' result', t));
  return out;
}

for (let run = 0; run < RUNS; run++) {
  try {
    const C = SIM.CREATION;
    const s = SIM.newState({ first: 'Hans', last: 'Test', birthYear: pick(C.birthYear).id, hometown: pick(C.hometown).id, background: pick(C.background).id, family: pick(C.family).id });
    let ev = SIM.pickEvent(s), guard = 0, ending = null;
    while (guard++ < 300) {
      if (!ev) throw new Error(`no event for chapter ${s.chapter} day ${s.day} phase ${s.phase}`);
      const out = playEvent(s, ev);
      const step = SIM.step(s, ev, out);
      if (step.type === 'event') { ev = step.ev; continue; }
      ending = step.id;
      const E = SIM.ENDINGS[ending];
      check('ending ' + ending, SIM.fmt(s, E.text));
      reached[s.chapter] = (reached[s.chapter] || 0) + 1;
      if (!SIM.hasNextChapter(s)) break;
      // Interlude.
      SIM.enterInterlude(s);
      const ch = SIM.chapter(s);
      ch.interlude(s).forEach(i => check('interlude', i.text));
      for (let ie; (ie = SIM.pendingInterlude(s)[0]);) playEvent(s, ie);
      ev = SIM.startChapter(s);
    }
    if (!ending) throw new Error('no ending reached');
    endings[ending] = (endings[ending] || 0) + 1;
    ranks[SIM.RANKS[s.rank]] = (ranks[SIM.RANKS[s.rank]] || 0) + 1;
    s.medals.forEach(m => { medals[m.id] = (medals[m.id] || 0) + 1; });
    Object.keys(s.items || {}).forEach(k => { kit[k] = (kit[k] || 0) + 1; });
    if (s.squad) { kit['~squadLoyalty ' + Math.floor(SIM.squadLoyalty(s) / 10) * 10] = (kit['~squadLoyalty ' + Math.floor(SIM.squadLoyalty(s) / 10) * 10] || 0) + 1; }
    // Saves must survive a JSON round trip.
    SIM.migrate(JSON.parse(JSON.stringify(s)));
  } catch (e) { errors.push(e.stack.split('\n').slice(0, 2).join(' | ')); }
}

const all = SIM.EVENTS.concat(SIM.POOL).map(e => e.id);
const pct = o => Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, (100 * v / RUNS).toFixed(1) + '%']));
console.log('Endings:', pct(endings));
console.log('Chapter ends reached:', reached);
console.log('Final rank:', pct(ranks));
console.log('Medals held:', pct(medals));
console.log('Kit at end:', pct(kit));
console.log('Never seen:', all.filter(id => !seen[id]));
console.log('Errors:', errors.length, [...new Set(errors)].slice(0, 10));
process.exit(errors.length ? 1 : 0);
