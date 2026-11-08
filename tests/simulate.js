// Headless playthrough test: runs the engine with random choices many times.
// Usage: node tests/simulate.js [runs]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {}, console, Math };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['data/world.js', 'data/events.js', 'data/pool.js', 'data/endings.js', 'engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'), ctx, { filename: f });
}
const SIM = ctx.SIM;
const pick = a => a[Math.floor(Math.random() * a.length)];
const RUNS = Number(process.argv[2] || 5000);
const endings = {}, seen = {}, errors = [];

for (let run = 0; run < RUNS; run++) {
  try {
    const C = SIM.CREATION;
    const s = SIM.newState({ first: 'Hans', last: 'Test', birthYear: pick(C.birthYear).id, hometown: pick(C.hometown).id, background: pick(C.background).id, family: pick(C.family).id });
    let ev = SIM.pickEvent(s), ending = null, guard = 0;
    while (!ending && guard++ < 100) {
      if (!ev) throw new Error(`no event for day ${s.day} phase ${s.phase}`);
      seen[ev.id] = (seen[ev.id] || 0) + 1;
      SIM.fmt(s, ev.text);
      const options = ev.choices.filter(ch => SIM.choiceVisible(s, ch) && SIM.choiceAllowed(s, ch));
      if (!options.length) throw new Error(`no available choice in ${ev.id}`);
      const ch = pick(options);
      SIM.fmt(s, ch.text);
      const out = SIM.resolveChoice(s, ev, ch);
      out.texts.forEach(t => { if (/undefined|\[object|NaN/.test(t)) throw new Error(`bad text in ${ev.id}: ${t.slice(0, 80)}`); });
      if (out.end) { ending = SIM.finish(s, out.end); break; }
      const f = SIM.fatal(s);
      if (f) { ending = SIM.finish(s, f); break; }
      if (out.next) { ev = SIM.findEvent(out.next); continue; }
      if (ev.id === 'd6n') { ending = SIM.finish(s, SIM.chapterEnding(s)); break; }
      if (SIM.advance(s) === 'chapterEnd') { ending = SIM.finish(s, SIM.chapterEnding(s)); break; }
      const f2 = SIM.fatal(s);
      if (f2) { ending = SIM.finish(s, f2); break; }
      ev = SIM.pickEvent(s);
    }
    if (!ending) throw new Error('no ending reached');
    const text = SIM.fmt(s, SIM.ENDINGS[ending].text);
    if (/undefined|\[object|NaN/.test(text)) throw new Error(`bad ending text ${ending}`);
    endings[ending] = (endings[ending] || 0) + 1;
  } catch (e) { errors.push(e.message); }
}

const all = SIM.EVENTS.concat(SIM.POOL).map(e => e.id);
console.log('Endings:', endings);
console.log('Never seen:', all.filter(id => !seen[id]));
console.log('Errors:', errors.length, [...new Set(errors)].slice(0, 10));
process.exit(errors.length ? 1 : 0);
