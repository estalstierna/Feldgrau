// Game systems layered on the engine: relationships, skills, kit (items) and the squad.
window.SIM = window.SIM || {};

// ───────────────────────── Relationships ─────────────────────────
// A relationship is a base derived from what happened in earlier chapters,
// plus explicit changes recorded in s.rel. Range −100 … 100.
SIM.PEOPLE = {
  hartmann: { name: 'Willi Hartmann', role: 'Docker\'s son from Hamburg. Machine gunner, joker, talks too much.',
    base: f => (f.betrayedHartmann ? -35 : 0) + (f.protectedHartmann ? 20 : 0) + (f.hartmannFriend ? 20 : 0) + (f.reconciled ? 25 : 0) + (f.boughtForSquad ? 5 : 0) + 15 },
  lenz: { name: 'Karl Lenz', role: 'Former Hitler Youth leader. Ambitious, a true believer.',
    base: f => (f.lenzAlly ? 30 : 0) + (f.lenzRival ? -20 : 0) + (f.savedPole ? -10 : 0) + (f.refusedOrder ? -25 : 0) + (f.refusedOrder2 ? -15 : 0) + (f.lenzHeard ? -10 : 0) - 5 },
  rau: { name: 'Fritz Rau', role: 'The "choirboy". Joined in spring 1940, straight from the Hitler Youth.',
    present: f => f.rauHere, base: f => (f.rauLoyal ? 30 : 0) + 10 },
  vogel: { name: 'Ernst Vogel', role: 'Farm boy from Swabia. Devout, frightened, decent.',
    present: f => f.vogelStays,
    base: f => (f.vogelFriend ? 15 : 0) + (f.vogelSaved ? 30 : 0) + (f.vogelPromise ? 10 : 0) + (f.vogelReported ? -70 : 0) },
  brandt: { name: 'Paul Brandt', role: 'Twelve-year regular. Hard but fair.',
    base: f => (f.savedBrandt ? 45 : 0) + (f.cleanRifle ? 5 : 0) + (f.trainedDig ? 5 : 0) + (f['asleep_0'] ? -15 : 0) + 5 },
  albrecht: { name: 'Joachim von Albrecht', role: 'Your company commander. A Junker\'s son who believes in the rules of war.',
    base: f => (f.stoppedReprisal ? 25 : 0) + (f.triedToStop ? 10 : 0) + (f.savedTirailleurs ? 20 : 0) + (f.savedPole ? 5 : 0) + (f.firstWave ? 10 : 0) + (f.tookBoat ? 10 : 0) + (f.refusedOrder2 ? -20 : 0) },
  sattler: { name: 'Bruno Sattler', role: 'Berliner. Can get you anything, for a price.', present: f => f.metSattler, base: () => 0 },
  claire: { name: 'Claire Girard', role: 'Daughter of the house where you are billeted on the Cher.', present: f => f.metClaire, base: () => -20 },
  madame: { name: 'Madame Girard', role: 'Widow. Her husband died at Verdun.', present: f => f.metClaire, base: () => -30 }
};

// Painted portraits available in assets/portraits/<id>.webp. Others fall back to initials.
SIM.PORTRAITS = ['hartmann', 'lenz', 'rau'];

SIM.rel = (s, id) => SIM.clamp(SIM.PEOPLE[id].base(s.flags) + ((s.rel || {})[id] || 0), -100, 100);
SIM.relLabel = v => v <= -50 ? 'Hostile' : v <= -15 ? 'Cold' : v < 15 ? 'Neutral' : v < 50 ? 'Friendly' : 'Close';
SIM.knownPeople = s => Object.keys(SIM.PEOPLE).filter(id => {
  const p = SIM.PEOPLE[id];
  if (p.present) return p.present(s.flags) || (s.rel && s.rel[id] !== undefined);
  return true;
});
SIM.personStatus = function (s, id) {
  const f = s.flags;
  const st = {
    vogel: f.vogelStays ? 'In your platoon' : (f.vogelCaught || f.vogelReported) ? 'Penal camp, Emsland moors' : f.vogelDeserted ? 'Missing' : 'Unknown',
    brandt: f.savedBrandt || (s.chapter || 0) >= 2 ? 'Platoon sergeant (Feldwebel)' : 'Squad leader',
    lenz: (s.chapter || 0) >= 2 && f.lenzFeldgendarm ? 'Feldgendarmerie' : 'Gefreiter, 3rd Company',
    albrecht: (s.chapter || 0) >= 1 ? 'Oberleutnant, company commander' : 'Leutnant, platoon leader'
  };
  return st[id] || '';
};

// ───────────────────────── Skills ─────────────────────────
// Level 0–5: a base from background and deeds, plus practice (2 points per level).
SIM.SKILLS = {
  shooting:   { name: 'Shooting',   desc: 'Rifle and machine gun. Helps on the range and in a fight.' },
  french:     { name: 'French',     desc: 'Talking to the people of the country you occupy.' },
  medicine:   { name: 'First aid',  desc: 'Dressings, splints, keeping men alive until the medics come.' },
  leadership: { name: 'Leadership', desc: 'Getting men to follow you. Steadies your squad.' },
  scrounging: { name: 'Scrounging', desc: 'Finding, trading and organising things the army forgot to issue.' }
};
SIM.skillBase = function (s, k) {
  const f = s.flags, m = id => SIM.hasMedal(s, id) ? 1 : 0;
  switch (k) {
    case 'shooting': return (f.farm ? 1 : 0) + (f.cleanRifle ? 1 : 0) + m('schnur1') + m('schnur2') + (f.tankKill ? 1 : 0);
    case 'french': return (f.educated ? 2 : 0) + (f.local ? 0 : 0);
    case 'medicine': return (f.savedBrandt ? 1 : 0) + (f.riverSave ? 1 : 0) + (f.savedPole ? 1 : 0);
    case 'leadership': return Math.max(0, s.rank - 1) + (f.rauLoyal ? 1 : 0) + (f.tookBoat ? 1 : 0);
    case 'scrounging': return (f.trader ? 2 : 0) + (f.hardship ? 1 : 0) + (f.looted ? 1 : 0);
  }
  return 0;
};
SIM.skill = (s, k) => Math.min(5, SIM.skillBase(s, k) + Math.floor(((s.skillXp || {})[k] || 0) / 2));
SIM.train = function (s, k, n = 1) {
  s.skillXp = s.skillXp || {};
  const before = SIM.skill(s, k);
  s.skillXp[k] = (s.skillXp[k] || 0) + n;
  return SIM.skill(s, k) > before;
};

// ───────────────────────── Kit ─────────────────────────
SIM.ITEMS = {
  cigarettes: { name: 'Cigarettes', unit: 'pack', value: 1, desc: 'The real currency of every army. Ration issue: one pack a week.' },
  rosary:     { name: 'Rosary', desc: 'From your mother. The beads are worn smooth.' },
  pervitin:   { name: 'Pervitin', unit: 'tablet', desc: 'Methamphetamine. Keeps you awake; the crash comes later.' },
  watch:      { name: 'Swiss watch', value: 15, desc: 'Taken from a French lieutenant on the bank of the Meuse.' },
  pistol:     { name: 'Browning pistol', value: 20, desc: 'A small French officer\'s pistol. Unregistered, and illegal to sell.' },
  pocketwatch:{ name: 'Pocket watch', value: 8, desc: 'From a refugee on a Polish road. You try not to think about it.' },
  wine:       { name: 'Wine', unit: 'bottle', value: 2, desc: 'From a Belgian château cellar. Opens doors and mouths.' },
  letter:     { name: 'A French letter', desc: 'Half-written, "ma chère Hélène". You never sent it.' },
  boots:      { name: 'Polish boots', desc: 'Good leather, taken from the dead. Better than yours.' },
  coffee:     { name: 'Real coffee', unit: 'bag', value: 4, desc: 'Bean coffee. In Germany, almost impossible to find. In France, worth more every month.' },
  stockings:  { name: 'Silk stockings', unit: 'pair', value: 3, desc: 'Every soldier in Paris buys them for someone at home.' },
  perfume:    { name: 'Perfume', unit: 'bottle', value: 5, desc: 'A tiny bottle from a shop on the Rue de la Paix.' },
  heine:      { name: 'Book of Heine', desc: 'Poems by a Jewish poet, banned and burned in Germany. Dangerous to own.' },
  photo:      { name: 'Photograph', desc: 'Your squad in front of the Eiffel Tower, July 1940.' },
  schnapps:   { name: 'Schnapps', unit: 'bottle', value: 2, desc: 'Cheap and fierce.' },
  tobacco:    { name: 'Tobacco', unit: 'pouch', value: 2, desc: 'Black-market tobacco, smuggled across the line.' }
};
SIM.has = (s, id, n = 1) => ((s.items || {})[id] || 0) >= n;
SIM.give = function (s, id, n = 1) {
  s.items = s.items || {};
  s.items[id] = Math.max(0, (s.items[id] || 0) + n);
  if (!s.items[id]) delete s.items[id];
};
// Translate flags from earlier chapters into kit (for older saves and new systems).
SIM.syncKit = function (s) {
  s.items = s.items || {};
  if (s.kitSynced) return;
  s.kitSynced = true;
  const f = s.flags;
  if (f.rosary && !s.items.rosary) s.items.rosary = 1;
  if (f.goodBoots && !s.items.boots) s.items.boots = 1;
  if (f.looted && !s.items.pocketwatch) s.items.pocketwatch = 1;
  if (f.tookWatch && !s.items.watch) { s.items.watch = 1; s.items.pistol = 1; }
  if (f.keptLetter && !s.items.letter) s.items.letter = 1;
  if (f.cellarBottles && !s.items.wine) s.items.wine = 2;
  if (f.pervitinSpare && !s.items.pervitin) s.items.pervitin = 2;
};

// ───────────────────────── Squad ─────────────────────────
SIM.TRAITS = {
  joker: 'Keeps spirits up. Says the wrong thing at the wrong time.',
  steady: 'Calm and reliable.',
  nervous: 'Frightened easily.',
  devout: 'Prays. Has a conscience.',
  zealot: 'A believer. Watches the others.',
  informer: 'Will report what he sees.',
  schemer: 'Always has a deal going.',
  strong: 'Can carry anything.',
  green: 'New and eager. Learns from you.',
  brave: 'Goes forward when others don\'t.',
  tired: 'Old for a soldier. Wants to go home.',
  loyal: 'Will stand by you.'
};
SIM.makeSquad = function (s) {
  const f = s.flags, r = id => SIM.rel(s, id);
  const loy = id => SIM.clamp(50 + Math.round(r(id) / 2), 5, 95);
  const men = [
    { id: 'hartmann', name: 'Willi Hartmann', role: 'MG gunner', age: 22, traits: ['joker', 'brave'], loyalty: loy('hartmann'), morale: 65 },
    { id: 'rau', name: 'Fritz Rau', role: 'Ammunition carrier', age: 19, traits: ['green', f.rauLoyal ? 'loyal' : 'zealot'], loyalty: loy('rau'), morale: 60 },
    { id: 'pohl', name: 'Gustav Pohl', role: 'Rifleman', age: 41, traits: ['steady', 'tired'], loyalty: 55, morale: 50,
      bio: 'A reservist plumber from Leipzig with four children. Fought at the Somme as a boy.' },
    { id: 'kuehn', name: 'Heinz Kühn', role: 'Rifleman', age: 20, traits: ['zealot', 'informer', 'brave'], loyalty: 40, morale: 70,
      bio: 'A former Hitler Youth leader from Thuringia. Writes letters to his old leader every week.' },
    { id: 'sattler', name: 'Bruno Sattler', role: 'Rifleman', age: 28, traits: ['schemer'], loyalty: f.sattlerPartner ? 70 : 45, morale: 70,
      bio: 'A Berliner from Wedding. Was a waiter, a bookmaker\'s runner, and briefly in prison.' },
    { id: 'brenner', name: 'Josef Brenner', role: 'Rifleman', age: 24, traits: ['strong', 'devout'], loyalty: 55, morale: 60,
      bio: 'A Bavarian farmhand. Says little, eats a great deal, prays before sleeping.' }
  ];
  if (f.vogelStays) men.splice(2, 0, { id: 'vogel', name: 'Ernst Vogel', role: 'Rifleman', age: 22, traits: ['devout', 'nervous', f.vogelSaved ? 'loyal' : 'steady'], loyalty: loy('vogel'), morale: 50 });
  men.forEach(m => { m.status = 'ok'; });
  s.squad = men;
  return men;
};
SIM.squadMen = s => (s.squad || []).filter(m => m.status === 'ok');
SIM.man = (s, id) => (s.squad || []).find(m => m.id === id);
SIM.hasTrait = (m, t) => !!m && m.traits.includes(t);
SIM.squadMorale = s => { const m = SIM.squadMen(s); return m.length ? Math.round(m.reduce((a, b) => a + b.morale, 0) / m.length) : 0; };
SIM.squadLoyalty = s => { const m = SIM.squadMen(s); return m.length ? Math.round(m.reduce((a, b) => a + b.loyalty, 0) / m.length) : 0; };
// Change a man (or 'all'). Leadership softens losses and amplifies gains in morale.
SIM.squadMod = function (s, id, d, out) {
  const targets = id === 'all' ? SIM.squadMen(s) : [SIM.man(s, id)].filter(Boolean);
  const lead = SIM.skill(s, 'leadership');
  targets.forEach(m => {
    if (d.morale) m.morale = SIM.clamp(m.morale + (d.morale > 0 ? d.morale + lead : Math.min(0, d.morale + lead)), 0, 100);
    if (d.loyalty) m.loyalty = SIM.clamp(m.loyalty + d.loyalty, 0, 100);
    if (d.status) m.status = d.status;
  });
  if (out) out.extra.push({ label: `${id === 'all' ? 'Squad' : (targets[0] ? targets[0].name.split(' ')[0] : id)} ${d.morale ? (d.morale > 0 ? 'morale +' : 'morale −') : ''}${d.loyalty ? (d.loyalty > 0 ? 'loyalty +' : 'loyalty −') : ''}${d.status && d.status !== 'ok' ? d.status : ''}`.trim(), good: (d.morale || 0) + (d.loyalty || 0) >= 0 && (!d.status || d.status === 'ok') });
};

// ───────────────────────── Hooks into choice resolution ─────────────────────────
// Choice fields: rel: {id: n}, items: {id: n}, train: {skill: n}, squad: {id|'all': {morale, loyalty}}
SIM.applyExtras = function (s, ch, x, out) {
  if (ch.rel) for (const id in ch.rel) x.rel(id, ch.rel[id]);
  if (ch.items) for (const id in ch.items) x.item(id, ch.items[id]);
  if (ch.train) for (const k in ch.train) x.train(k, ch.train[k]);
  if (ch.squad) for (const id in ch.squad) x.squadMod(id, ch.squad[id]);
};
SIM.extendContext = function (s, x, out) {
  out.extra = out.extra || [];
  x.rel = (id, n) => {
    s.rel = s.rel || {};
    s.rel[id] = (s.rel[id] || 0) + n;
    out.extra.push({ label: `${SIM.PEOPLE[id].name.split(' ')[0]} ${n > 0 ? '▲' : '▼'}`, good: n > 0, kind: 'rel' });
  };
  x.item = (id, n) => {
    SIM.give(s, id, n);
    out.extra.push({ label: `${n > 0 ? '+' : '−'}${Math.abs(n)} ${SIM.ITEMS[id].name}`, good: n > 0, kind: 'item' });
  };
  x.train = (k, n = 1) => {
    if (SIM.train(s, k, n)) out.extra.push({ label: `${SIM.SKILLS[k].name} → ${SIM.skill(s, k)}`, good: true, kind: 'skill' });
  };
  x.squadMod = (id, d) => SIM.squadMod(s, id, d, out);
  x.skill = k => SIM.skill(s, k);
  x.has = (id, n) => SIM.has(s, id, n);
};
