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
  liesel: { name: 'Liesel', role: 'Works at the post office. You met at a dance at Christmas 1939.', present: f => f.sweetheart, base: f => 45 + (f.married ? 15 : 0) },
  mother: { name: 'Your mother', short: 'Mother', role: 'Writes every week. Keeps your room exactly as you left it.', present: f => f.homeLeave, base: f => 60 },
  father: { name: 'Your father', short: 'Father', role: 'Fought at Verdun in 1916. Says little about it.', present: f => f.homeLeave,
    base: f => (f.party ? 40 : f.catholic ? 25 : 20) + (f.joinedSS ? (f.party ? 20 : f.spd ? -50 : f.catholic ? -25 : -5) : 0) },
  starck: { name: 'Wolfram Starck', role: 'SS-Hauptsturmführer. A schoolteacher from Brunswick who believes every word.', present: f => f.metStarck,
    // He respects courage and hardness, and despises what he calls softness.
    base: f => (f.party ? 10 : 0) + (f.spd ? -15 : 0) + (f.tankKill4 ? 15 : 0) + (f.tankKill ? 8 : 0) + (f.tookBoat ? 5 : 0) + (f.firstWave ? 5 : 0)
      + (f.shotCommissar ? 15 : 0) + (f.burnedVillage ? 8 : 0) + (f.signedAgainstHartmann ? 8 : 0) + (f.firingSquad ? 6 : 0)
      + (f.hidJews ? -20 : 0) + (f.savedBialystok ? -5 : 0) + (f.savedCommissar ? -10 : 0) + (f.refusedOrder4 ? -15 : 0) + (f.refusedOrder3 ? -10 : 0) + (f.savedTirailleurs ? -8 : 0) - 5 },
  claire: { name: 'Claire Girard', role: 'Daughter of the house where you are billeted on the Cher.', present: f => f.metClaire, base: () => -20 },
  madame: { name: 'Madame Girard', role: 'Widow. Her husband died at Verdun.', present: f => f.metClaire, base: () => -30 }
};

// Painted portraits available in assets/portraits/<id>.webp. Others fall back to initials.
SIM.PORTRAITS = ['hartmann', 'lenz', 'rau', 'vogel', 'brandt', 'albrecht', 'sattler', 'brenner', 'kuehn', 'claire', 'madame', 'pohl', 'starck', 'brandes', 'voss', 'wendt', 'mayr', 'brueck', 'nowak', 'haas', 'mother', 'father', 'liesel', 'grischa'];

// Some people have more than one portrait, chosen by chapter (e.g. summer and winter uniform).
SIM.PORTRAIT_FILE = {
  starck: s => (s.chapter || 0) >= 4 ? 'starck' : 'starck-summer'
};
SIM.portraitFile = (s, id) => SIM.PORTRAIT_FILE[id] ? SIM.PORTRAIT_FILE[id](s) : id;

SIM.rel = (s, id) => SIM.clamp(SIM.PEOPLE[id].base(s.flags) + ((s.rel || {})[id] || 0), -100, 100);
SIM.relLabel = v => v <= -50 ? 'Hostile' : v <= -15 ? 'Cold' : v < 15 ? 'Neutral' : v < 50 ? 'Friendly' : 'Close';
SIM.knownPeople = s => Object.keys(SIM.PEOPLE).filter(id => {
  const p = SIM.PEOPLE[id];
  if (p.present) return p.present(s.flags) || (s.rel && s.rel[id] !== undefined);
  return true;
});
SIM.personStatus = function (s, id) {
  const f = s.flags;
  const sm = SIM.man(s, id);
  if (sm && sm.status !== 'ok' && sm.fate) return sm.fate;
  const st = {
    vogel: f.vogelStays ? 'In your platoon' : (f.vogelCaught || f.vogelReported) ? 'Penal camp, Emsland moors' : f.vogelDeserted ? 'Missing' : 'Unknown',
    brandt: f.savedBrandt || (s.chapter || 0) >= 2 ? 'Platoon sergeant (Feldwebel)' : 'Squad leader',
    lenz: (s.chapter || 0) >= 2 && f.lenzFeldgendarm ? 'Feldgendarmerie' : 'Gefreiter, 3rd Company',
    starck: (s.chapter || 0) >= 3 ? 'SS-Hauptsturmführer, liaison officer' : 'SS-Obersturmführer, liaison officer',
    albrecht: (s.chapter || 0) >= 3 ? 'Hauptmann, company commander' : (s.chapter || 0) >= 1 ? 'Oberleutnant, company commander' : 'Leutnant, platoon leader'
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
  tobacco:    { name: 'Tobacco', unit: 'pouch', value: 2, desc: 'Black-market tobacco, smuggled across the line.' },
  vodka:      { name: 'Vodka', unit: 'bottle', value: 2, desc: 'Soviet vodka from a village cooperative. Stronger than anything at home.' },
  icon:       { name: 'Orthodox icon', value: 10, desc: 'A small painted saint in a tin frame, taken from a church in Smolensk.' },
  furs:       { name: 'Sheepskin coat', desc: 'A Russian sheepskin coat, the fleece turned inwards. Worth more than gold in December.' },
  valenki:    { name: 'Felt boots', unit: 'pair', desc: 'Russian valenki: thick pressed felt. Your leather marching boots freeze; these do not.' },
  blanket:    { name: 'Blanket', desc: 'A grey wool blanket, worn over the greatcoat like a cloak.' },
  film:       { name: 'Undeveloped film', desc: 'A roll of film from Białystok, 27 June 1941. Proof, if anyone ever asks for it. A death sentence, if the wrong person finds it.' }
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

// Transfer to the Waffen-SS: the old squad stays with the Army; Starck gives the player a new one.
SIM.makeSSSquad = function (s) {
  if (s.flags.ssSquad) return;
  s.flags.ssSquad = true;
  s.oldSquad = s.squad;
  s.squad = [
    { id: 'voss', name: 'Erich Voss', role: 'Deputy, MG gunner', age: 24, traits: ['zealot', 'brave'], loyalty: 55, morale: 75, rank: 3,
      bio: 'A Saxon who joined the SS at eighteen. Fought in Poland and France. Would follow Starck into the sea.' },
    { id: 'wendt', name: 'Theo Wendt', role: 'Rifleman', age: 23, traits: ['joker', 'steady'], loyalty: 55, morale: 70, rank: 2,
      bio: 'A Hamburg clerk who volunteered "for the adventure". Jokes about everything except the Führer.' },
    { id: 'mayr', name: 'Anton Mayr', role: 'Rifleman', age: 31, traits: ['tired', 'steady'], loyalty: 50, morale: 50, rank: 2,
      bio: 'A former policeman from Tyrol. Saw things in Poland in 1939 that he does not talk about.' },
    { id: 'brueck', name: 'Karl-Heinz Brück', role: 'Rifleman', age: 26, traits: ['strong', 'informer'], loyalty: 45, morale: 65, rank: 2,
      bio: 'A Ruhr miner. Huge, quiet, and in regular contact with the SD officer at battalion.' },
    { id: 'nowak', name: 'Paul Nowak', role: 'Rifleman', age: 21, traits: ['nervous', 'devout'], loyalty: 55, morale: 50, rank: 0,
      bio: 'An ethnic German from Łódź. Speaks Polish at home and is ashamed of it here.' },
    { id: 'haas', name: 'Jürgen Haas', role: 'Ammunition carrier', age: 19, traits: ['green', 'zealot'], loyalty: 60, morale: 75, rank: 0,
      bio: 'Straight from the Hitler Youth. Has read every word of the Führer\'s book, twice.' }
  ].map(m => Object.assign({ status: 'ok' }, m));
};

// ── Supplies: the squad's ammunition, rations and medical kit (chapters with supplies: true) ──
SIM.SUPPLY = {
  ammo: { name: 'Ammunition', short: 'Ammo', desc: 'Belts, clips and grenades. Low ammunition makes every fight more costly.' },
  rations: { name: 'Rations', short: 'Rat.', desc: 'Bread, tins and horsemeat for the squad. When it runs out, everyone starves.' },
  med: { name: 'Medical kit', short: 'Med.', desc: 'Dressings and morphine. Can save a wounded man.' }
};
SIM.SUPPLY_MAX = 12;
SIM.hasSupplies = s => !!SIM.chapter(s).supplies && !!s.supplies;
SIM.supply = function (s, k, n, out) {
  if (!s.supplies) return;
  const before = s.supplies[k];
  s.supplies[k] = SIM.clamp(before + n, 0, SIM.SUPPLY_MAX);
  const d = s.supplies[k] - before;
  if (d && out) out.extra.push({ label: `${d > 0 ? '+' : '−'}${Math.abs(d)} ${SIM.SUPPLY[k].name}`, good: d > 0, kind: 'item' });
};
// Each night: in the pocket the squad eats its rations and the airlift brings what it can.
SIM.supplyUpkeep = function (s, d, notes) {
  const ch = SIM.chapter(s), day = SIM.today(s);
  if (!ch.supplies || !s.supplies || s.phase !== 2) return;
  const men = SIM.squadMen(s).length + 1;
  if (!day.pocket) {
    ['ammo', 'rations', 'med'].forEach(k => SIM.supply(s, k, 1));
    return;
  }
  const need = Math.ceil(men / 3);
  s.supplies.rations -= need;
  if (s.supplies.rations < 0) {
    s.supplies.rations = 0;
    SIM.apply(s, { food: -12, morale: -4 }, d);
    SIM.squadMod(s, 'all', { morale: -8 });
    notes.push('There is nothing left to eat. The squad chews snow and the leather of their belts.');
  } else SIM.apply(s, { food: 6 }, d);
  const air = day.airlift || 0;
  if (Math.random() < air) {
    const got = [];
    if (Math.random() < 0.75) { SIM.supply(s, 'rations', 1 + (Math.random() < 0.4 ? 1 : 0)); got.push('bread'); }
    if (Math.random() < 0.5) { SIM.supply(s, 'ammo', 1); got.push('ammunition'); }
    if (Math.random() < 0.3) { SIM.supply(s, 'med', 1); got.push('dressings'); }
    if (got.length) notes.push(`A supply canister from the airlift reaches the squad: ${got.join(', ')}.`);
  } else if (air > 0) notes.push('The planes did not get through tonight, or they did not drop here.');
};

// A replacement joins the squad.
SIM.addMan = function (s, m) {
  s.squad = s.squad || [];
  if (SIM.man(s, m.id)) return;
  s.squad.push(Object.assign({ status: 'ok', morale: 55, loyalty: 50 }, m));
};

// ── Cold ──
// Protection from kit (0–0.8) and squad winter gear (0–3).
SIM.coldProtection = s => Math.min(0.8, 0.15 + (SIM.has(s, 'furs') ? 0.3 : 0) + (SIM.has(s, 'valenki') ? 0.25 : 0) + (SIM.has(s, 'blanket') ? 0.1 : 0));
SIM.coldUpkeep = function (s, d, notes) {
  const day = SIM.today(s);
  const temp = day.temp !== undefined ? day.temp : 0;
  if (temp >= 0) return;
  const drain = Math.round((-temp / 2.8) * (1 - SIM.coldProtection(s)));
  SIM.apply(s, { warmth: -drain }, d);
  if (s.phase === 2) SIM.apply(s, { warmth: (s.shelter || 0) * 6 }, d);
  if (s.stats.warmth <= 20) {
    SIM.apply(s, { health: -3, morale: -1 }, d);
    notes.push('You are freezing. You cannot feel your toes, and your fingers will not close properly.');
    if (Math.random() < 0.14) {
      s.frostbites = (s.frostbites || 0) + 1;
      SIM.apply(s, { health: -8 }, d);
      notes.push('Frostbite. The skin on your feet has gone white and hard, then black. The medical orderly cuts away what he has to.');
      SIM.addLog(s, 'Frostbite.');
      SIM.woundBadge(s);   // frostbite counted as a wound for the Wound Badge
      if (s.stats.health <= 0) s.deathCause = `Froze to death ${SIM.chapter(s).id === 'stalingrad' ? 'in the Stalingrad pocket' : 'in a foxhole before Moscow'}, ${day.date}.`;
    }
  } else if (s.stats.warmth <= 40) notes.push('The cold gets into everything: your bones, your rifle, your thoughts.');
  // At night the cold takes men from the squad.
  if (s.phase === 2 && s.squad) {
    const p = Math.max(0, Math.min(0.4, (-temp - 15) / 90)) * (1 - 0.25 * Math.min(3, s.squadWinter || 0)) * ((s.shelter || 0) ? 0.65 : 1);
    if (Math.random() < p) {
      const men = SIM.squadMen(s);
      if (men.length) {
        const m = men[Math.floor(Math.random() * men.length)];
        const dead = Math.random() < 0.12;
        SIM.loseMan(s, m.id, dead ? 'killed' : 'evacuated', null, dead ? 'from the cold' : 'with frostbite');
        notes.push(dead ? `${m.name} went out to relieve himself in the night and did not come back. They find him in the morning, sitting in the snow.` : `${m.name}'s feet are black with frostbite. He is taken to the rear on a sledge.`);
      }
    }
  }
};

// A man leaves the squad: 'killed', 'wounded' or 'evacuated'.
SIM.FATE_TEXT = { killed: 'Killed in action', wounded: 'Wounded, evacuated', evacuated: 'Evacuated sick', gone: 'No longer with the squad' };
SIM.loseMan = function (s, id, status, out, how) {
  const m = SIM.man(s, id);
  if (!m || m.status !== 'ok') return null;
  m.status = status;
  m.fate = `${SIM.FATE_TEXT[status] || status}, ${SIM.today(s).date}`;
  s.losses = (s.losses || []).concat({ id: m.id, name: m.name, status, date: SIM.today(s).date, chapter: s.chapter || 0 });
  if (status === 'killed') s.flags.lastKilled = m.id;
  if (s.flags.deputy === m.id) delete s.flags.deputy;
  if (out) out.extra.push({ label: `${m.name.split(' ')[0]}: ${status}`, good: false, kind: 'loss' });
  SIM.squadMod(s, 'all', { morale: status === 'killed' ? -10 : -4 });
  SIM.addLog(s, `${m.name} ${status === 'killed' ? 'was killed' : status === 'wounded' ? 'was wounded' : 'was sent to the rear'}${how ? ' ' + how : ''}.`);
  return m;
};
// A chance that one man (not the player) is hit. Nervous and green men are more often hit;
// preparation (checked kit, dug-in squad, first-aid training) lowers the odds.
SIM.squadCasualty = function (s, out, chance, how) {
  const f = s.flags;
  const lowAmmo = SIM.hasSupplies(s) && s.supplies.ammo <= 2 ? 1.4 : 1;
  const p = chance * lowAmmo * (f.kitChecked ? 0.85 : 1) * (f.dugIn ? 0.85 : 1) * (f.squadAlert ? 0.9 : 1);
  if (Math.random() >= p) return null;
  const men = SIM.squadMen(s);
  if (!men.length) return null;
  const weight = m => 1 + (SIM.hasTrait(m, 'nervous') || SIM.hasTrait(m, 'green') ? 0.6 : 0) + (SIM.hasTrait(m, 'brave') ? 0.3 : 0);
  let r = Math.random() * men.reduce((a, m) => a + weight(m), 0), pick = men[0];
  for (const m of men) { r -= weight(m); if (r <= 0) { pick = m; break; } }
  let killed = Math.random() < (f.medics ? 0.35 : 0.45);
  if (killed && SIM.hasSupplies(s) && s.supplies.med > 0 && Math.random() < 0.5) { killed = false; SIM.supply(s, 'med', -1, out); }
  return SIM.loseMan(s, pick.id, killed ? 'killed' : 'wounded', out, how);
};

// ───────────────────────── Hooks into choice resolution ─────────────────────────
// Choice fields: rel: {id: n}, items: {id: n}, train: {skill: n}, squad: {id|'all': {morale, loyalty}}
SIM.applyExtras = function (s, ch, x, out) {
  if (ch.rel) for (const id in ch.rel) x.rel(id, ch.rel[id]);
  if (ch.items) for (const id in ch.items) x.item(id, ch.items[id]);
  if (ch.train) for (const k in ch.train) x.train(k, ch.train[k]);
  if (ch.squad) for (const id in ch.squad) x.squadMod(id, ch.squad[id]);
  if (ch.winter) x.winter(ch.winter);
  if (ch.supply) for (const k in ch.supply) x.supply(k, ch.supply[k]);
  if (ch.shelter !== undefined) x.shelter(ch.shelter);
};
SIM.extendContext = function (s, x, out) {
  out.extra = out.extra || [];
  x.rel = (id, n) => {
    s.rel = s.rel || {};
    s.rel[id] = (s.rel[id] || 0) + n;
    const p = SIM.PEOPLE[id];
    out.extra.push({ label: `${p.short || p.name.split(' ')[0]} ${n > 0 ? '▲' : '▼'}`, good: n > 0, kind: 'rel' });
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
  x.lose = (id, status, how) => SIM.loseMan(s, id, status, out, how);
  x.casualty = (chance, how) => SIM.squadCasualty(s, out, chance, how);
  x.supply = (k, n) => SIM.supply(s, k, n, out);
  x.supplies = () => s.supplies || {};
  x.winter = n => { s.squadWinter = Math.max(0, Math.min(3, (s.squadWinter || 0) + n)); out.extra.push({ label: `Squad winter kit ${n > 0 ? '▲' : '▼'}`, good: n > 0, kind: 'item' }); };
  x.shelter = n => { s.shelter = Math.max(0, Math.min(2, n)); out.extra.push({ label: n > 0 ? 'Shelter for the night' : 'No shelter', good: n > 0, kind: 'item' }); };
};
