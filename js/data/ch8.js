// Chapter VIII: "Two Roads", February – July 1943.
// Two tracks in one chapter: men who went into Soviet captivity at Stalingrad (camp),
// and men who got out of the pocket (front: the hospital, Major Kessler, Kursk).
// This file: the chapter, both calendars, the interlude and the camp track.
// The front track is in ch8_front.js; random events and endings in ch8_more.js.
window.SIM = window.SIM || {};

(function () {
  const ss = s => !!s.flags.joinedSS;
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const men = s => SIM.squadMen(s);
  const say = (x, m, killed, wounded) => { if (m) x.say(m.status === 'killed' ? killed(m) : wounded(m)); };
  const track = s => s.flags.track8 || 'front';
  const camp = s => track(s) === 'camp';
  const weber = s => has(s, 'grischa') && !!s.flags.grischaPapers;

  SIM.EXTRA_PEOPLE = Object.assign(SIM.EXTRA_PEOPLE || {}, {
    kessler: { name: 'Ludwig Kessler', role: 'Major of the Secret Field Police. Investigates every man who came out of Stalingrad. Never raises his voice.', present: f => f.metKessler, base: () => 0 },
    vera: { name: 'Vera Lipatova', role: 'Soviet camp doctor at Beketovka. A paediatrician from Moscow. Her husband was killed at Kiev in 1941.', present: f => f.metVera, base: () => -10 },
    belov: { name: 'Arkady Belov', role: 'NKVD captain at Camp 27. Speaks perfect German, learned from the books he now confiscates.', present: f => f.metBelov, base: () => -15 },
    wiese: { name: 'Konrad Wiese', role: 'Former Hitler Youth leader, captured in 1941. Now an "Antifa" instructor who recruits prisoners for the Soviets.', present: f => f.metWiese, base: () => 0 }
  });

  const CAMP_DAYS = [
    { date: 'Tuesday, 2 February 1943',  short: 'Tue 2 Feb',  place: 'column',     temp: -22, variant: 'winter', foodDrain: -5 },
    { date: 'Saturday, 6 February 1943', short: 'Sat 6 Feb',  place: 'beketovka',  temp: -25, variant: 'winter', foodDrain: -5 },
    { date: 'Monday, 15 February 1943',  short: 'Mon 15 Feb', place: 'beketovka',  temp: -18, variant: 'winter', foodDrain: -5 },
    { date: 'Monday, 1 March 1943',      short: 'Mon 1 Mar',  place: 'beketovka',  temp: -10, variant: 'winter', foodDrain: -5 },
    { date: 'Saturday, 20 March 1943',   short: 'Sat 20 Mar', place: 'ruins_work', temp: -4,  variant: 'winter', foodDrain: -5 },
    { date: 'Saturday, 10 April 1943',   short: 'Sat 10 Apr', place: 'beketovka',  temp: 4,  foodDrain: -5 },
    { date: 'Sunday, 25 April 1943',     short: 'Sun 25 Apr', place: 'beketovka',  temp: 9,  foodDrain: -5 },
    { date: 'Monday, 10 May 1943',       short: 'Mon 10 May', place: 'train',      temp: 15, foodDrain: -4 },
    { date: 'Thursday, 20 May 1943',     short: 'Thu 20 May', place: 'krasnogorsk', temp: 16, foodDrain: -4 },
    { date: 'Wednesday, 2 June 1943',    short: 'Wed 2 Jun',  place: 'krasnogorsk', temp: 19, foodDrain: -4 },
    { date: 'Tuesday, 22 June 1943',     short: 'Tue 22 Jun', place: 'krasnogorsk', temp: 23, foodDrain: -4 },
    { date: 'Thursday, 1 July 1943',     short: 'Thu 1 Jul',  place: 'krasnogorsk', temp: 24, foodDrain: -4 },
    { date: 'Tuesday, 6 July 1943',      short: 'Tue 6 Jul',  place: 'krasnogorsk', temp: 25, foodDrain: -4 },
    { date: 'Tuesday, 13 July 1943',     short: 'Tue 13 Jul', place: 'krasnogorsk', temp: 24, foodDrain: -4 }
  ];
  const FRONT_DAYS = [
    { date: 'Thursday, 4 February 1943', short: 'Thu 4 Feb',  place: 'hospital',  temp: -8 },
    { date: 'Thursday, 18 February 1943', short: 'Thu 18 Feb', place: 'hospital', temp: -5 },
    { date: 'Wednesday, 10 March 1943',  short: 'Wed 10 Mar', place: 'poltava',   temp: 1 },
    { date: 'Tuesday, 16 March 1943',    short: 'Tue 16 Mar', place: 'kharkov',   war: true, variant: 'east', temp: 2 },
    { date: 'Saturday, 10 April 1943',   short: 'Sat 10 Apr', place: 'belgorod',  war: true, variant: 'east', temp: 8 },
    { date: 'Tuesday, 20 April 1943',    short: 'Tue 20 Apr', place: 'belgorod',  war: true, variant: 'east', temp: 12 },
    { date: 'Saturday, 15 May 1943',     short: 'Sat 15 May', place: 'belgorod',  war: true, variant: 'east', temp: 18 },
    { date: 'Tuesday, 1 June 1943',      short: 'Tue 1 Jun',  place: 'startline', war: true, variant: 'east', temp: 22 },
    { date: 'Sunday, 20 June 1943',      short: 'Sun 20 Jun', place: 'startline', war: true, variant: 'east', temp: 25 },
    { date: 'Sunday, 4 July 1943',       short: 'Sun 4 Jul',  place: 'startline', war: true, variant: 'east', temp: 27 },
    { date: 'Monday, 5 July 1943',       short: 'Mon 5 Jul',  place: 'oboyan',    war: true, variant: 'east', temp: 29 },
    { date: 'Wednesday, 7 July 1943',    short: 'Wed 7 Jul',  place: 'oboyan',    war: true, variant: 'east', temp: 30 },
    { date: 'Monday, 12 July 1943',      short: 'Mon 12 Jul', place: 'prokhorovka', war: true, variant: 'east', temp: 28 },
    { date: 'Saturday, 17 July 1943',    short: 'Sat 17 Jul', place: 'retreat',   war: true, variant: 'east', temp: 26 }
  ];
  const PLACES = {
    column:      { name: 'The column of prisoners, Stalingrad', x: 0, y: 0 },
    beketovka:   { name: 'Prisoner-of-war camp, Beketovka', x: 0, y: 0 },
    ruins_work:  { name: 'Work detail in the ruins of Stalingrad', x: 0, y: 0 },
    train:       { name: 'A prisoner train, somewhere north', x: 0, y: 0 },
    krasnogorsk: { name: 'Camp 27, Krasnogorsk, near Moscow', x: 0, y: 0 },
    hospital:    { name: 'Reserve hospital, Dnepropetrovsk', x: 0, y: 0 },
    poltava:     { name: 'Convalescent company, Poltava', x: 0, y: 0 },
    kharkov:     { name: 'Kharkov, retaken', x: 0, y: 0 },
    belgorod:    { name: 'The line north of Belgorod', x: 0, y: 0 },
    startline:   { name: 'The start line, south face of the Kursk bulge', x: 0, y: 0 },
    oboyan:      { name: 'The road to Oboyan', x: 0, y: 0 },
    prokhorovka: { name: 'Near Prokhorovka', x: 0, y: 0 },
    retreat:     { name: 'Falling back towards Belgorod', x: 0, y: 0 }
  };

  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;

  SIM.CHAPTERS.push({
    id: 'tworoads', num: 'VIII', title: 'Two Roads', range: 'February – July 1943', year: 1943, start: [1943, 2],
    track, days: s => camp(s) ? CAMP_DAYS : FRONT_DAYS, places: PLACES,
    map: s => camp(s) ? 'pow' : 'kursk', maps: ['pow', 'kursk'],
    cold: s => camp(s), hope: s => camp(s), supplies: s => !camp(s),
    nightMorale: s => camp(s) ? 1 : 2,
    kitchenNote: 'The evening soup: hot water, a few grains of millet, sometimes a fish head.',
    finalEvent: ['c8c_13m', 'c8f_13m'],
    commander: 'your company commander',
    hospital: 'the camp hospital barrack',
    deathDefault: 'Died in Soviet captivity, 1943.',
    kiaText: s => camp(s)
      ? `${s.deathCause || 'Died of typhus and hunger in the camp at Beketovka, spring 1943.'}\n\nYou are buried in a mass grave outside the wire, with no marker. Your family will be told that you are missing at Stalingrad. For years your mother will meet every train of returning prisoners. The last ones come home in 1956.\n\nOf the roughly 91,000 men taken prisoner at Stalingrad, about 5,000 came home.`
      : `${s.deathCause || 'Killed in action at Kursk, July 1943.'}\n\nYou survived Stalingrad. You did not survive the summer. Operation Citadel, the last great German offensive in the East, cost both sides hundreds of thousands of men; after it, the German army never attacked in the East again.\n\nA letter reaches ${SIM.townName(s.char.hometown)} three weeks later.`,
    arrestText: s => `Major Kessler's file is closed at last, and it is closed against you. The charge is cowardice before the enemy and making false statements to the Secret Field Police. The court-martial sits for twenty minutes.\n\nThe sentence is death, commuted to a penal battalion. You go back east with a shovel instead of a rifle, to clear mines in front of the German lines.`,
    breakdownText: s => camp(s)
      ? 'One morning you do not get up for the count. Your comrades shake you and you look at them as if from very far away. You are not ill, the doctor says. You have simply stopped. In the camps they had a word for men like you. Two weeks later you are dead.'
      : 'It happens in the middle of a quiet afternoon behind the lines. You sit down and you cannot stop shaking. The doctors call it a nervous collapse and send you to a hospital in Germany. You never go back to the front, and you never quite come back from it either.',
    casualties: '',
    warFoodDrain: -5,
    promoDate: '20 July 1943',
    maxRank: s => camp(s) ? s.rank : (s.rank >= 4 ? ((s.flags.passedCourse && score(s) >= 14) ? 5 : 4) : 4),
    meritBar: 8,
    routineReason: 'Time in service.',
    meritReason: 'Recommended for conduct in Operation Citadel.',
    interludeDate: 'February 1943',
    interludeTitle: 'February 1943',
    blackMarks: s => camp(s) ? ['In Soviet captivity since 31 January 1943.'] : (s.flags.penal && !s.flags.penalCleared ? ['Sentenced by court-martial.'] : []),
    awards: (s, sc) => {
      if (camp(s)) return;
      if (s.flags.tankKill) SIM.award(s, 'tankbadge', 'For destroying a Soviet tank single-handed near Oboyan, July 1943.', 'July 1943');
      const close = (s.assaultDays || []).filter(k => k.startsWith('7-')).length;
      if (close >= 3) SIM.award(s, 'nahkampf', 'For close combat in Operation Citadel, July 1943.', 'July 1943');
      if (!SIM.hasMedal(s, 'ek2') && sc >= 10) SIM.award(s, 'ek2', 'For bravery at Kursk, July 1943.', 'July 1943');
      else if (SIM.hasMedal(s, 'ek2') && !SIM.hasMedal(s, 'ek1') && sc >= 15) SIM.award(s, 'ek1', 'For outstanding bravery in Operation Citadel, July 1943.', 'July 1943');
    },
    ending: s => SIM.ch8Ending(s),
    onInterlude: s => {
      const captive = ['st_captive', 'st_captive_squad'].includes(s.ending) || (!s.flags.flown && !s.flags.brokeOut);
      s.flags.track8 = captive ? 'camp' : 'front';
      const g = SIM.man(s, 'grischa');
      if (captive) {
        if (g && g.status === 'ok' && !s.flags.grischaPapers) { g.status = 'killed'; g.fate = 'Taken out of the column and shot by the NKVD, February 1943'; }
        s.stats.health = Math.max(40, Math.min(s.stats.health, 60));
        s.stats.food = 45; s.stats.warmth = 55; s.stats.morale = Math.max(s.stats.morale, 40);
        s.shelter = 1;
        s.stats.hope = 40 + (men(s).length >= 2 ? 10 : 0) + (s.flags.married ? 5 : 0);
        s.supplies = null;
      } else {
        if (g && g.status === 'ok') { g.status = 'gone'; g.fate = 'Left behind in Stalingrad, January 1943'; }
        s.stalingradSquad = (s.squad || []).map(m => Object.assign({}, m, m.status === 'ok' ? { status: 'gone', fate: 'Missing at Stalingrad, February 1943' } : {}));
        s.squad = SIM.makeReplacements();
        s.stats.health = Math.max(s.stats.health, 70);
        s.stats.food = 80; s.stats.warmth = 80; s.stats.morale = Math.max(s.stats.morale, 50);
        s.supplies = { ammo: 8, rations: 8, med: 5 };
        delete s.flags.deputy;
      }
      s.stats.suspicion = Math.max(0, s.stats.suspicion - (captive ? 15 : 25));
      if (!captive) s.shelter = 0;
    },
    onStart: s => { s.statements = s.statements || {}; },
    interlude: s => interludeItems(s),
    interludeEvents: []
  });

  // The men who join a squad that came back from Stalingrad without its men. By 1943 the Waffen-SS
  // took Luftwaffe transfers and ethnic Germans from the Balkans just like the Army.
  SIM.makeReplacements = () => [
    { id: 'rehm', name: 'Paul Rehm', role: 'Rifleman', age: 17, traits: ['green', 'brave'], loyalty: 55, morale: 80, rank: 0,
      bio: 'A Hitler Youth flak helper from Essen who lied about his age by a month. Has never seen a dead man.' },
    { id: 'tamas', name: 'Andreas Tamás', role: 'Machine gunner', age: 23, traits: ['steady', 'devout'], loyalty: 50, morale: 60, rank: 2,
      bio: 'An ethnic German from the Banat, in Romania. Speaks German with a Swabian accent his grandparents brought there in 1770.' },
    { id: 'lorenz', name: 'Ewald Lorenz', role: 'Rifleman', age: 38, traits: ['tired', 'joker'], loyalty: 50, morale: 55, rank: 2,
      bio: 'Luftwaffe ground crew, transferred to the infantry in the great comb-out after Stalingrad. Still calls his rifle "the propeller".' },
    { id: 'fink', name: 'Georg Fink', role: 'Rifleman', age: 26, traits: ['strong', 'schemer'], loyalty: 45, morale: 60, rank: 1,
      bio: 'Back from a penal company, rank restored. Will not say what he did. Can find anything.' },
    { id: 'kraus', name: 'Martin Kraus', role: 'Ammunition carrier', age: 19, traits: ['nervous', 'loyal'], loyalty: 60, morale: 50, rank: 0,
      bio: 'A baker\'s apprentice from Würzburg. Writes to his mother every single day.' }
  ].map(m => Object.assign({ status: 'ok' }, m));

  function interludeItems(s) {
    const out = [];
    if (camp(s)) {
      out.push({ year: '2 February 1943', text: 'The last German troops in Stalingrad, in the factory district in the north, surrender at noon. The silence afterwards is the strangest thing. For five months there has never been a moment without guns.' });
      out.push({ year: 'Germany', text: `The radio announces that the Sixth Army has fought "to the last breath". Three days of national mourning; theatres and cinemas are closed. Your family is told you are missing. ${s.flags.married ? 'Liesel is seven months pregnant.' : 'Your mother keeps your room as it is.'}` });
      if (weber(s)) out.push({ year: 'February', text: 'In the column of prisoners, "Gefreiter Johann Weber of Danzig" walks beside you. Nobody has noticed. Yet.' });
    } else {
      out.push({ year: 'February 1943', text: `${s.flags.flown === 'starck' ? 'Starck\'s pass' : s.flags.flown === 'forged' ? 'A dead man\'s wound tag' : s.flags.brokeOut ? 'Nineteen nights on the steppe' : 'Your wound'} got you out. The Sixth Army is gone: the men you led, the company, Albrecht. You are in a hospital bed with clean sheets, and you do not know what to do with your hands.` });
      out.push({ year: 'Germany', text: 'The radio plays Bruckner. Three days of national mourning. Then, two weeks later, Goebbels at the Sportpalast: "Do you want total war?" The crowd screams that it does.' });
    }
    return out;
  }

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 7, track: 'camp' }, o));

  // ───────────────────────── Day 0 · 2 February: the column ─────────────────────────
  ev({ id: 'c8c_0m', day: 0, phase: 0, scene: 'ruins', time: '08:00',
    title: 'The Column',
    text: s => `You march. Out of the ruins, past the frozen dead, along the riverbank. Thousands of men in a grey column, walking south, guarded by soldiers on horseback with submachine guns. Nobody tells you where.

${men(s).length ? `${men(s).map(m => m.name.split(' ')[0]).join(', ')}: you keep together, a knot in the column.` : 'You are alone among strangers.'} After two hours, a man in front of you sits down in the snow. A guard rides up and unslings his gun.`,
    choices: [
      { text: 'Pull him up and carry him between you.', effects: { conscience: 6, health: -8, hope: 4 }, squad: { all: { loyalty: 6 } },
        outcome: (s, x) => { if (x.roll(0.15)) { x.apply({ health: -10 }); x.say('The guard hits you across the back with the butt of his gun, once, and rides on. You keep the man up. He walks the rest of the way on your shoulder.'); } else x.say('You get him under the arms. He weighs nothing. The guard watches, then rides on. At dusk the man thanks you in a Saxon accent and asks your name.'); } },
      { text: 'Keep walking. Do not look.', effects: { conscience: -5, hope: -4 },
        result: 'Behind you, a short burst. The column does not slow down. By evening you have heard it eleven times.' },
      { text: 'Tell your men: whatever happens, nobody sits down.', show: s => men(s).length > 0, effects: { hope: 3 }, train: { leadership: 1 }, squad: { all: { morale: 6 } },
        result: 'You walk among them, talking: Christmas, beer, girls, nonsense, anything. Nobody in your group sits down. Not today.' }
    ] });

  ev({ id: 'c8c_0a', day: 0, phase: 1, scene: 'field', time: '15:00',
    title: 'Uri',
    text: s => `A Soviet soldier walks along the column. "Uri, uri," he says: watches. He takes them from wrists, and rings, and boots if they are good. He stops in front of you.${s.flags.married ? ' He looks at your wedding ring.' : ''}`,
    choices: [
      { text: s => s.flags.married ? 'Give him your watch, and hide your hand.' : 'Give him your watch.', effects: { hope: -2 },
        outcome: (s, x) => { if (SIM.has(s, 'watch')) x.item('watch', -1); else if (SIM.has(s, 'pocketwatch')) x.item('pocketwatch', -1); x.say('He takes it, holds it to his ear, grins. He gives you a piece of black bread in return, which is more than most men get.'); x.apply({ food: 8 }); } },
      { text: 'Pretend you have nothing.', effects: { hope: 1 },
        outcome: (s, x) => { if (x.roll(0.4)) { x.apply({ health: -8 }); x.say('He finds it, of course. He hits you in the face, takes it, and moves on, laughing.'); } else x.say('He looks at you for a long moment, then shrugs and goes on to the next man.'); } },
      { text: 'Offer him cigarettes instead.', show: s => SIM.has(s, 'cigarettes') || SIM.has(s, 'tobacco'), effects: { hope: 2 },
        outcome: (s, x) => { x.item(SIM.has(s, 'cigarettes') ? 'cigarettes' : 'tobacco', -1); x.say('German cigarettes. He laughs, lights one, and slaps you on the shoulder. "Gitler kaput," he says, not unkindly.'); } }
    ] });

  // ───────────────────────── Day 1 · 6 February: Beketovka ─────────────────────────
  ev({ id: 'c8c_1m', day: 1, phase: 0, scene: 'powcamp', time: '07:00',
    title: 'Beketovka',
    text: 'The camp at Beketovka, south of the city: a few brick buildings, dugouts in the frozen earth, a fence. Tens of thousands of men. No beds, no blankets, no stoves for most. The count in the snow every morning takes three hours, and every morning there are fewer men to count.\n\nIn your barrack there is one stove. Around it, the strongest men have taken the places.',
    choices: [
      { text: 'Fight for a place by the stove.', effects: { warmth: 20, conscience: -3, health: -4 }, shelter: 1,
        result: 'You push and shove and take a place. Someone curses you. You sleep warm, and you do not look at the man who now sleeps by the door.' },
      { text: 'Keep your group together, by the wall, close for warmth.', effects: { warmth: 8, hope: 5 }, squad: { all: { loyalty: 5, morale: 4 } },
        result: 'Back to back, under every coat you have. It is enough to live through the night. In the morning, you count each other first.' },
      { text: 'Take the place by the door, so a weaker man can have yours.', effects: { conscience: 7, warmth: -8, hope: 3 },
        result: 'The door does not close. The wind comes in all night. But the man you gave your place to, a boy from Thuringia, is still alive in the morning.' }
    ] });

  ev({ id: 'c8c_1a', day: 1, phase: 1, scene: 'barracks',
    title: 'The Soup Carrier',
    text: 'Every barrack chooses a man to fetch the soup and bread from the kitchen and divide it. It is the most powerful job in the camp. The men choose you.',
    choices: [
      { text: 'Divide it honestly, to the last spoonful.', effects: { conscience: 5, hope: 6, comrades: 6 }, train: { leadership: 1 },
        result: 'A ladle, a tin, and two hundred men watching your hands. You divide it with a precision you never had at school. Nobody accuses you. That is the greatest compliment the camp knows.' },
      { text: 'Take a little extra for yourself and your men.', effects: { food: 15, conscience: -5, comrades: -4 }, squad: { all: { morale: 5 } },
        result: 'A little thicker from the bottom of the pot for your group. Nobody can prove anything. Everybody knows.' },
      { text: 'Refuse. You do not want that power.', effects: { hope: -2 },
        result: 'A man from a Panzer division takes the job. Within a week he is fat, and within two, someone has killed him in the night.' }
    ] });

  // ───────────────────────── Day 2 · 15 February: typhus ─────────────────────────
  ev({ id: 'c8c_2m', day: 2, phase: 0, scene: 'hospital', time: '09:00',
    title: 'Dr. Lipatova',
    text: 'Typhus. It came with the lice from Stalingrad, and now it is in every barrack. Men burn with fever, rave, and die in three days.\n\nThe camp doctor is a small, tired Soviet woman in a white coat over a quilted jacket: Dr. Vera Lipatova. She needs orderlies for the hospital barrack. "Extra soup," she says in careful German. "And typhus. Both are certain."',
    choices: [
      { text: 'Volunteer.', set: { veraOrderly: true, metVera: true }, rel: { vera: 12 }, effects: { food: 15, conscience: 6, hope: 6 },
        result: 'Washing men who cannot wash, carrying out men who have died, holding cups of water to cracked lips. Dr. Lipatova works eighteen hours a day. She lost her husband at Kiev, a nurse tells you. She treats you exactly as she treats the Soviet guards.' },
      { text: 'Volunteer one of your men instead.', show: s => men(s).length > 0, assign: true, assignPrompt: 'Who works in the hospital?', set: { metVera: true },
        outcome: (s, x) => { const m = x.man; x.squadMod(m.id, { morale: -4 }); x.apply({ food: 6, conscience: -2 }); if (x.roll(0.35)) { const l = x.lose(m.id, x.roll(0.5) ? 'killed' : 'evacuated', 'of typhus'); x.apply({ hope: -8 }); x.say(l.status === 'killed' ? `${m.name} catches typhus in the second week. He dies in the barrack he was working in.` : `${m.name} catches typhus and is moved to the isolation barrack. You do not see him again.`); } else x.say(`${m.name} works in the hospital and brings back soup for the group every evening.`); } },
      { text: 'Stay away from the hospital.', effects: { hope: -2 },
        result: 'You stay in your barrack and pick lice out of your seams. It is safer. It is also very long, the day, when there is nothing to do but count.' }
    ] });

  ev({ id: 'c8c_2a', day: 2, phase: 1, scene: 'barracks',
    title: 'Fever',
    cond: s => men(s).length > 0,
    text: s => `${men(s)[men(s).length - 1].name} has the fever. He shivers and talks to his mother and does not know you. The others have moved away from him.`,
    choices: [
      { text: 'Nurse him yourself: water, snow on his forehead, your blanket.', effects: { conscience: 6, hope: 2 },
        outcome: (s, x) => { const m = men(s)[men(s).length - 1]; if (x.roll(0.55)) { x.squadMod(m.id, { loyalty: 20 }); x.say(`For four days you sit by him. On the fifth, the fever breaks. ${m.name.split(' ')[0]} looks at you and asks what day it is.`); } else { x.lose(m.id, 'killed', 'of typhus in Beketovka'); x.apply({ hope: -10 }); x.say(`On the fourth night ${m.name} stops talking. In the morning he is cold.`); } if (x.roll(0.3)) { s.flags.typhus = true; x.apply({ health: -18 }); x.say('Ten days later you have it too: the headache like a nail through the skull, the fever, the rash. You live. You do not know how.'); } } },
      { text: 'Get him to Dr. Lipatova.', show: s => !!s.flags.metVera, rel: { vera: 4 }, effects: { hope: 2 },
        outcome: (s, x) => { const m = men(s)[men(s).length - 1]; if (x.roll(s.flags.veraOrderly ? 0.7 : 0.5)) x.say(`She has no medicine either, but she has a bed and clean water. ${m.name.split(' ')[0]} lives.`); else { x.lose(m.id, 'killed', 'of typhus in Beketovka'); x.apply({ hope: -8 }); x.say(`She does what she can. It is not enough. ${m.name} dies in the hospital barrack.`); } } },
      { text: 'Keep away from him. You cannot save everyone.', effects: { conscience: -5, hope: -4 },
        outcome: (s, x) => { const m = men(s)[men(s).length - 1]; if (x.roll(0.6)) { x.lose(m.id, 'killed', 'of typhus in Beketovka'); x.say(`${m.name} dies alone in the corner, two days later.`); } else x.say(`Somehow ${m.name.split(' ')[0]} lives through it on his own. He does not speak to you for a week.`); } }
    ] });

  // ───────────────────────── Day 3 · 1 March: a familiar face ─────────────────────────
  ev({ id: 'c8c_3m', day: 3, phase: 0, scene: 'powcamp', time: '06:30',
    title: 'Gefreiter Brandau',
    text: s => `At the morning count, the man beside you in the row has a shaved head, a private's greatcoat and a face like a skull. It takes you a long time to recognise him.

Starck. He did not use the pistol after all.

"Gefreiter Wilhelm Brandau," he says quietly, without turning his head. "Infantry. We have never met." His left arm is bandaged above the elbow, where the SS tattoo their blood group.${ss(s) ? ' He glances at your own arm.' : ''}`,
    choices: [
      { text: 'Say nothing. Keep his secret.', set: { starckSecret: true }, rel: { starck: 15 }, effects: { conscience: -2 },
        result: '"Good," he whispers. "Good." For the first time since you have known him, he looks at you as if you were the one with power. You do not like how that feels.' },
      { text: '"Why didn\'t you use the pistol?"', set: { starckSecret: true }, rel: { starck: 4 }, effects: { conscience: 2 },
        result: 'A long silence. "Because Germany will need men who survived this," he says. "Men who remember." He means men who will take revenge. You keep his secret, for now.' },
      { text: 'Tell the guards who he is.', set: { starckReported: true }, rel: { starck: -60 }, effects: { conscience: 3, comrades: -8, hope: 3, food: 10 },
        outcome: (s, x) => { s.flags.metBelov = true; x.say('An NKVD officer comes for him at noon. Starck looks at you once as they take him away. In the evening, you are given an extra ration of bread. Several of the men in the barrack will not eat with you any more.'); } }
    ] });

  ev({ id: 'c8c_3a', day: 3, phase: 1, scene: 'powcamp',
    title: 'The Arm',
    cond: s => ss(s),
    text: 'The NKVD is looking for SS men. They make every prisoner strip to the waist in the snow and raise his left arm. Under it, every man in the Waffen-SS has his blood group tattooed. You have yours. They are six rows away.',
    choices: [
      { text: 'Burn it out now, with the hot nail a man is heating in the stove.', effects: { health: -14, hope: 2 }, set: { tattooGone: true },
        result: 'You bite on your belt. The smell is the worst of it. By the time they reach your row there is a black, weeping wound where the letters were. "Frostbite," you say. The officer looks at it for a long time, then moves on.' },
      { text: 'Hope they miss it.', effects: { hope: -4 },
        outcome: (s, x) => { if (x.roll(0.45)) { x.apply({ health: -25, hope: -15 }); s.flags.sdCamp = true; x.say('They find it. You are beaten in front of the barrack and sent to the punishment block for a month: half rations, no stove. You come out a different shape.'); } else x.say('The officer is tired and the light is poor. He lifts your arm, glances, drops it. You do not breathe again until he is three men further on.'); } },
      { text: 'Ask Starck what to do.', show: s => !!s.flags.starckSecret, rel: { starck: 4 }, effects: { health: -10 }, set: { tattooGone: true },
        result: '"The nail," Starck says. "Like I did. Now. I will hold you." He holds you while it is done, as calmly as he once checked your paybook in Belgium.' }
    ] });
  ev({ id: 'c8c_3a_alt', day: 3, phase: 1, scene: 'powcamp',
    title: 'The Line-Up',
    text: s => `The NKVD is looking for SS men and officers hiding as privates. Every prisoner must strip to the waist in the snow and raise his left arm. ${s.flags.starckSecret ? 'Starck is two men to your left. His bandaged arm is clamped to his side.' : 'Men are dragged out of the line.'}`,
    choices: [
      { text: s => s.flags.starckSecret ? 'Step half a pace in front of Starck as they pass.' : 'Stand still and look straight ahead.', effects: { hope: 1 },
        outcome: (s, x) => { if (!s.flags.starckSecret) return x.say('They take nine men from your barrack. None of them comes back.'); if (x.roll(0.75)) { x.rel('starck', 8); x.say('The officer looks at your arm, then past you, then moves on. Starck does not thank you. He does not need to.'); } else { s.flags.starckTaken = true; x.say('They pull off his bandage. The officer reads the burned skin like a page. They take Starck away. He does not look back.'); } } },
      { text: 'Point him out. Let it be over.', show: s => !!s.flags.starckSecret, set: { starckReported: true, starckSecret: false, metBelov: true }, rel: { starck: -60 }, effects: { conscience: 2, comrades: -6, food: 10 },
        result: 'You point. It is a very small movement. They take him away, and in the evening there is extra bread. You eat it. You are not sure whether you are ashamed.' }
    ] });

  // ───────────────────────── Day 4 · 20 March: the dead of Stalingrad ─────────────────────────
  ev({ id: 'c8c_4m', day: 4, phase: 0, scene: 'ruins', time: '08:00',
    title: 'The Dead',
    text: s => {
      const lost = (s.losses || []).find(l => l.chapter === 6 && l.status === 'killed');
      return `A work detail in the ruins of the city: clearing the streets of the dead before the thaw. They are everywhere, German and Russian, frozen in the shapes in which they died. You load them onto carts and take them to a ravine.${lost ? `\n\nIn a cellar near the Tractor Works you find ${lost.name}. You know him by his boots.` : ''}\n\nRussian women are clearing rubble across the street. They watch you.`;
    },
    choices: [
      { text: 'Take his identity disc, and say a prayer over him.', effects: { conscience: 4, hope: 2, morale: -4 },
        result: 'You break the disc and keep one half. Perhaps one day you can tell someone where he lies. The women across the street have stopped working. One of them crosses herself.' },
      { text: 'Work fast and do not look at the faces.', effects: { morale: -6 },
        result: 'You look at them anyway. You will see them for the rest of your life.' },
      { text: 'Look at the Russian women. Nod.', effects: { conscience: 2, hope: 4 },
        outcome: (s, x) => { if (x.roll(0.5)) { x.apply({ food: 10 }); x.say('An old woman comes over when the guard looks away and pushes a cold boiled potato into your hand. She says something in Russian. You do not understand it, but you understand her.'); } else { x.apply({ health: -3 }); x.say('A young woman spits at you. A stone hits your shoulder. The guard laughs. You understand her too.'); } } }
    ] });

  ev({ id: 'c8c_4a', day: 4, phase: 1, scene: 'ruins',
    title: 'The Norm',
    text: 'The Soviet foreman announces a new rule: a work norm. Brigades that meet it get the full ration, six hundred grams of bread. Brigades that exceed it get more. Those who fail get three hundred. Your brigade is the weakest in the camp.',
    choices: [
      { text: 'Push your men to meet it, all of them.', effects: { food: 10, health: -6, hope: 2 }, squad: { all: { morale: -4 } },
        outcome: (s, x) => { const m = x.casualty(0.2, 'from exhaustion on the work detail'); say(x, m, m => `${m.name} collapses on the third day and does not get up.`, m => `${m.name} collapses and is taken to the hospital barrack.`); if (!m) x.say('You meet the norm. Six hundred grams. You hold the loaf in both hands like a child.'); } },
      { text: 'Work slowly and fake the numbers with the brigade clerk.', effects: { food: 6, conscience: -1 }, train: { scrounging: 1 },
        outcome: (s, x) => { if (x.roll(0.7)) x.say('The clerk is a German from Breslau. Two cigarettes and a lie, and your brigade has exceeded its norm by eleven per cent.'); else { x.apply({ food: -8, hope: -5 }); x.say('The foreman counts the bricks himself. Half rations for a week.'); } } },
      { text: 'Do the work of the weakest yourself.', effects: { health: -10, conscience: 5, comrades: 6, food: 6 }, squad: { all: { loyalty: 6 } },
        result: 'You carry for two men. In the evening you cannot close your hands. But nobody in your brigade is on half rations.' }
    ] });

  // ───────────────────────── Day 5 · 10 April: Weber ─────────────────────────
  ev({ id: 'c8c_5m', day: 5, phase: 0, scene: 'barracks',
    title: 'Johann Weber of Danzig',
    cond: weber,
    text: 'A Feldwebel from another barrack, a man named Kranz who works for the camp\'s "Antifa" committee, sits down beside you at the soup. "Your friend Weber," he says. "From Danzig. He told me he went to school on the Langgasse. There is no school on the Langgasse." He smiles. "Your bread for a week, and I forget it."',
    choices: [
      { text: 'Pay him.', effects: { food: -20, hope: -3 },
        result: 'A week of bread. You give it to him one ration at a time, and watch him eat it. Grischa never learns why you are so thin that week.' },
      { text: 'Threaten him.', effects: { conscience: -2 },
        outcome: (s, x) => { if (men(s).length >= 3 || x.roll(0.45)) { x.say('You and your men find him behind the latrine that night. You do not hurt him much. He never mentions Weber again.'); } else { x.lose('grischa', 'killed', 'after being denounced in the camp'); s.flags.weberTaken = true; x.apply({ hope: -15 }); x.say('Kranz goes straight to the NKVD. They take Grischa at the evening count. He looks at you once as they lead him out of the gate.'); } } },
      { text: 'Tell Grischa to go to Dr. Lipatova and tell her the truth.', show: s => !!s.flags.metVera, rel: { vera: 6 },
        outcome: (s, x) => { if (x.roll(0.6)) { s.flags.weberSaved = true; x.lose('grischa', 'gone', 'moved to the hospital staff under Dr. Lipatova\'s protection'); x.apply({ hope: 6 }); x.say('She listens without a word. The next day "Weber" is listed as a hospital orderly, permanently, under her authority. When Kranz goes to the NKVD, they already have a file on Weber, and it is closed.'); } else { x.lose('grischa', 'killed', 'after being denounced in the camp'); x.apply({ hope: -12 }); x.say('She cannot protect him. Nobody can protect a Soviet citizen who wore a German uniform. They take him the next morning.'); } } }
    ] });
  ev({ id: 'c8c_5m_alt', day: 5, phase: 0, scene: 'barracks',
    title: 'The Thaw',
    text: 'The thaw comes, and with it the smell. The latrines overflow; the dead buried in the snow at the edge of the camp appear again. But the sun is warm on your face for the first time since October, and men sit outside the barracks with their eyes closed.',
    choices: [
      { text: 'Sit in the sun.', effects: { hope: 6, health: 3 }, result: 'You sit against the wall with your eyes closed and think of nothing at all. It is the best hour in months.' },
      { text: 'Organise the men to bury the dead properly.', effects: { conscience: 5, hope: 3 }, squad: { all: { loyalty: 4 } }, result: 'A grave for each, with a stick and a name where you know it. The guards let you. Even they want it done.' }
    ] });

  ev({ id: 'c8c_5a', day: 5, phase: 1, scene: 'powcamp',
    title: 'Numbers',
    text: 'A Soviet clerk reads out the camp statistics, as if they were good news: of the prisoners who came to Beketovka in February, more than half are dead. Typhus, dysentery, hunger. The worst is over, he says.',
    choices: [
      { text: '"Then we are the ones who will live."', effects: { hope: 8, morale: 3 }, result: 'You say it aloud, to your men. It is a stupid thing to say, and it helps.' },
      { text: 'Count the men from your company who are still alive.', effects: { hope: -4, conscience: 2 }, result: s => `You count them on your fingers. It does not take long. ${men(s).length ? `${men(s).length} in your group. ` : ''}A handful in the other barracks.` }
    ] });

  // ───────────────────────── Day 6 · 25 April: Easter ─────────────────────────
  ev({ id: 'c8c_6m', day: 6, phase: 0, scene: 'barracks', time: '05:00',
    title: 'Easter',
    text: 'Easter Sunday. Before dawn, in the corner of the barrack, a Catholic chaplain who is listed as a medical orderly holds a service in a whisper. Forty men. A crust of bread instead of a wafer. The Russian guards must know. They do not come in.',
    choices: [
      { text: 'Go.', effects: { hope: 10, conscience: 3, morale: 4 }, result: 'Christ is risen. You have not believed it since you were twelve. This morning, in the dark, you very nearly do.' },
      { text: 'Stand at the door and keep watch.', effects: { hope: 5, comrades: 4 }, result: 'You stand at the door while they pray. One of the guards outside lights a cigarette and turns his back. It is Easter for the Orthodox too, today.' },
      { text: 'Stay in your corner. God left at Stalingrad.', effects: { hope: -3 }, result: 'You listen to them whispering. You envy them, a little.' }
    ] });

  ev({ id: 'c8c_6a', day: 6, phase: 1, scene: 'powcamp',
    title: 'The List',
    text: s => `The camp is being emptied. The fit will go north, to camps near Moscow and beyond; the sick will stay. A Soviet officer walks along the lines and points: you, you, not you.${men(s).length ? '' : ''}`,
    choices: [
      { text: 'Make sure your whole group goes together.', show: s => men(s).length > 0, effects: { hope: 5 }, train: { scrounging: 1 },
        outcome: (s, x) => { if (x.roll(0.65)) { x.squadMod('all', { loyalty: 6 }); x.say('You argue, lie about who is fit, swap places with the German clerk. Your whole group is on the list.'); } else { const weak = men(s).slice().sort((a, b) => a.morale - b.morale)[0]; x.lose(weak.id, 'gone', 'left behind, sick, at Beketovka'); x.apply({ hope: -6 }); x.say(`${weak.name} is too weak. They will not take him. You leave him your blanket.`); } } },
      { text: 'Get yourself on it, whatever it takes.', effects: { hope: 4, conscience: -2 }, result: 'You stand straight, pinch colour into your cheeks, and lie about your fever. You are on the list.' },
      { text: 'Ask to stay and work with Dr. Lipatova.', show: s => !!s.flags.veraOrderly, rel: { vera: 8 }, effects: { conscience: 4, hope: 2 }, set: { stayedVera: true },
        result: '"No," she says. "You go. Here you will die of what they die of." She puts your name on the list herself, and two packets of sulfa powder in your pocket.' }
    ] });

  // ───────────────────────── Day 7 · 10 May: the train ─────────────────────────
  ev({ id: 'c8c_7m', day: 7, phase: 0, scene: 'train', time: '10:00',
    title: 'Cattle Cars',
    text: 'Fifty men to a cattle car, a bucket in the corner, a barred window the size of a book. The train goes north for six days. Twice a day the door opens for water. When it opens, the dead are handed out.',
    choices: [
      { text: 'Take charge of the water: everyone drinks in turn.', effects: { conscience: 4, hope: 4 }, train: { leadership: 1 }, result: 'You make a rota and you enforce it, with your fists once. Nobody in your car dies of thirst.' },
      { text: 'Take the place by the window.', effects: { hope: 6, warmth: -2 }, result: 'Air, and through the bars, Russia: birch woods, villages, endless green. A woman at a crossing raises her hand. You do not know whether to wave.' },
      { text: 'Sleep, as much as you can.', effects: { health: 6 }, result: 'You sleep sitting up, for six days. It is the most you have slept since August.' }
    ] });

  ev({ id: 'c8c_7a', day: 7, phase: 1, scene: 'train',
    title: 'A Station',
    text: s => `The train stops at a station. Russian women come along the cars selling sunflower seeds and milk for anything. One of them holds up a bottle to your window and says something.${weber(s) ? ' Grischa answers her in Russian before he can stop himself.' : ''}`,
    choices: [
      { text: 'Trade whatever you have left.', req: s => s.marks > 0 || Object.keys(s.items || {}).some(k => SIM.ITEMS[k] && SIM.ITEMS[k].value), reqText: 'You have nothing left to trade.', effects: { food: 18, hope: 4 },
        outcome: (s, x) => { const k = Object.keys(s.items || {}).find(k => SIM.ITEMS[k] && SIM.ITEMS[k].value); if (k) x.item(k, -1); else x.apply({ marks: -Math.min(s.marks, 20) }); x.say('Milk, a twist of seeds, half a loaf. The best trade of your life.'); } },
      { text: s => weber(s) ? 'Pull Grischa back from the window.' : 'Just look at her.',
        outcome: (s, x) => { if (weber(s)) { if (x.roll(0.8)) { x.squadMod('grischa', { loyalty: 6 }); x.say('You yank him down. Nobody noticed, except a man from Hamburg who looks at Grischa, then at you, then at the wall.'); } else { x.apply({ hope: -4 }); s.flags.weberHeard = true; x.say('Too late. A guard on the platform heard him. He looks at Grischa for a long time and writes something down.'); } } else { x.apply({ hope: 3 }); x.say('She gives you the milk through the bars for nothing. She is about your mother\'s age.'); } } }
    ] });

  // ───────────────────────── Day 8 · 20 May: Camp 27 ─────────────────────────
  ev({ id: 'c8c_8m', day: 8, phase: 0, scene: 'powcamp', time: '09:00',
    title: 'Camp 27',
    text: 'Camp 27 at Krasnogorsk, outside Moscow: wooden barracks with bunks, a bathhouse, a kitchen that serves soup with things in it. A library with German books. A newspaper in German, "Das freie Wort". After Beketovka, it is almost a hotel.\n\nThere is a reason, the old prisoners say. This is where the Soviets choose the Germans they want.',
    choices: [
      { text: 'Eat. Wash. Sleep in a bunk.', effects: { health: 12, food: 20, hope: 8 }, result: 'Hot water in the bathhouse. You watch the grey run off you, the lice, Stalingrad. You sleep twelve hours on a plank with a straw sack.' },
      { text: 'Read the German newspaper.', effects: { hope: 3, conscience: 3 }, set: { readFreeWord: true }, result: 'Lists of German cities bombed. Reports from Africa: the Afrika Korps has surrendered in Tunisia, a quarter of a million men. You do not know whether to believe it. You suspect it is true.' }
    ] });

  ev({ id: 'c8c_8a', day: 8, phase: 1, scene: 'barracks',
    title: 'Konrad Wiese',
    text: 'A German comes to your barrack in a clean Soviet tunic without insignia: Konrad Wiese, twenty-eight, captured near Smolensk in 1941. He was a Hitler Youth leader once, he says. Now he runs a reading circle in the library. "Come and listen. You do not have to agree. There is tea."',
    choices: [
      { text: 'Go to the reading circle.', set: { metWiese: true, antifaCircle: true }, rel: { wiese: 10 }, effects: { hope: 6, food: 5, comrades: -3 },
        result: 'Twenty men, tea, a reading from Heine. Then Wiese talks: about what the war is for, about the camps in Poland. Some of it is propaganda. Some of it you saw yourself.' },
      { text: '"I don\'t need a Soviet priest."', set: { metWiese: true }, rel: { wiese: -6 }, effects: { comrades: 4 },
        result: 'He shrugs. "When you do, I am in the library." The officers in the next barrack nod at you approvingly. You are not sure you want their approval either.' },
      { text: 'Go, and watch who else goes.', show: s => !!s.flags.starckSecret && !s.flags.starckTaken, set: { metWiese: true, watchedCircle: true }, rel: { starck: 6 }, effects: { conscience: -3 },
        result: 'Starck asked you to. "We need to know who the traitors are," he said, "for afterwards." You sit at the back, drink the tea, and memorise faces.' }
    ] });

  // ───────────────────────── Day 9 · 2 June: Belov ─────────────────────────
  ev({ id: 'c8c_9m', day: 9, phase: 0, scene: 'office', time: '23:00',
    title: 'Kapitan Belov',
    text: 'Interrogations happen at night. A small office, a lamp, a samovar. NKVD Captain Arkady Belov speaks German like a Berlin professor. He has your paybook in front of him.\n\n"Your division was at Białystok in June 1941," he says. "Tell me what you saw there."',
    choices: [
      { text: 'Tell him the truth: the executions, everything.', set: { metBelov: true }, state: { key: 'bialystok', v: 'truth', t: 'To Belov: what you saw at Białystok, the shootings, everything.' }, rel: { belov: 10 }, effects: { conscience: 6, hope: 4 },
        result: 'He writes for an hour. He does not look surprised by anything. At the end he pours you tea. "You understand," he says, "that I have heard this many times."' },
      { text: '"I was a soldier. I saw fighting."', set: { metBelov: true }, state: { key: 'bialystok', v: 'lie', t: 'To Belov: you saw only fighting at Białystok.' }, rel: { belov: -6 }, effects: { hope: -2 },
        result: '"Of course," he says, and writes something short. "Everyone saw only fighting." He lets you go. He does not pour tea.' },
      { text: 'Tell him about the film you hid.', show: s => !!s.flags.filmHidden || SIM.has(s, 'film'), set: { metBelov: true, toldFilm: true }, state: { key: 'bialystok', v: 'truth', t: 'To Belov: the shootings at Białystok, and the film you hid in Germany.' }, rel: { belov: 18 }, effects: { conscience: 8, hope: 6 },
        result: 'For the first time, he stops writing. "Where?" You tell him. He nods slowly. "After the war," he says, "someone will need that film." It is the first time anyone has said "after the war" to you as if it were a real place.' }
    ] });

  ev({ id: 'c8c_9a', day: 9, phase: 1, scene: 'office', time: '02:00',
    title: 'Who is Brandau?',
    cond: s => !!s.flags.starckSecret && !s.flags.starckTaken,
    text: 'Belov again, the next night. "One more question. There is a Gefreiter Brandau in your barrack. Infantry, he says. Your men say you knew him before." He watches you. "Who is Brandau?"',
    choices: [
      { text: '"Just a Gefreiter. I met him at Beketovka."', state: { key: 'brandau', v: 'lie', t: 'To Belov: Brandau is just a Gefreiter you met at Beketovka.' }, rel: { starck: 8 },
        outcome: (s, x) => { const talkers = men(s).filter(m => m.loyalty < 55 || SIM.hasTrait(m, 'informer')).length; if (talkers && x.roll(0.5)) { s.flags.caughtLying = true; x.rel('belov', -15); x.apply({ hope: -10, food: -10 }); x.say('"Strange," Belov says. "One of your men told me he was an SS-Hauptsturmführer named Starck." He closes the file. You spend the next week in the punishment block.'); } else x.say('Belov writes it down. "Thank you," he says, and you cannot tell whether he believes you.'); } },
      { text: 'Tell him the truth.', state: { key: 'brandau', v: 'truth', t: 'To Belov: Brandau is SS-Hauptsturmführer Wolfram Starck.' }, set: { starckReported: true, starckSecret: false }, rel: { starck: -60, belov: 10 }, effects: { conscience: 2, hope: 4 },
        result: '"Thank you," he says. "We knew. I wanted to know whether you would say it." They take Starck the next day.' },
      { text: '"Ask him yourself."', rel: { belov: -4 }, effects: { hope: -2 },
        result: 'Belov smiles thinly. "I will," he says.' }
    ] });

  // ───────────────────────── Day 10 · 22 June: two years ─────────────────────────
  ev({ id: 'c8c_10m', day: 10, phase: 0, scene: 'powcamp', time: '18:00',
    title: 'Two Years',
    text: 'Two years since the invasion of the Soviet Union. The Antifa holds a meeting on the parade ground: speeches, a banner in black, white and red, a band of prisoners playing old German songs. Wiese asks for volunteers to speak about "what they saw".',
    choices: [
      { text: 'Speak.', set: { spokeAntifa: true, metWiese: true }, rel: { wiese: 12, starck: -20 }, effects: { conscience: 5, hope: 6, comrades: -8 },
        result: s => `You stand on a crate and tell five hundred men about ${s.flags.firingSquad ? 'the barn wall in Poland' : 'Białystok'}. Your voice shakes. Some of them shout "traitor". Some of them are crying. Afterwards, an old Gefreiter shakes your hand without a word.` },
      { text: 'Stand at the back and listen.', effects: { hope: 2 }, result: 'Men speak, one after another. Most of it you know. Some of it you did not.' },
      { text: 'Walk away. You will not perform for the Russians.', rel: { starck: 6, wiese: -4 }, effects: { comrades: 4 }, result: 'You go back to the barrack. The officers there have made a list of everyone who went to the meeting. They do not ask you to sign it.' }
    ] });

  ev({ id: 'c8c_10a', day: 10, phase: 1, scene: 'barracks', time: '23:00',
    title: 'The Court',
    cond: s => !!s.flags.starckSecret && !s.flags.starckTaken,
    text: 'Starck has formed a "court of honour" among the officers and the Nazi die-hards in the barrack. Tonight it has tried Wiese in his absence, for treason. The sentence is a beating, and the beating is to be tonight, behind the bathhouse. Starck wants you there.\n\n"You owe me," he says. "Gumrak. Remember."',
    choices: [
      { text: 'Go with them.', rel: { starck: 10, wiese: -30 }, effects: { conscience: -10, comrades: 3 }, set: { beatWiese: true },
        result: 'Wiese does not fight. When it is over, Starck wipes his hands on a rag. "Germany will remember who stood firm," he says. You go back to your bunk and lie awake until the morning count.' },
      { text: 'Warn Wiese.', rel: { starck: -40, wiese: 20 }, effects: { conscience: 6, hope: 3 }, set: { warnedWiese: true },
        outcome: (s, x) => { s.flags.starckEnemy = true; x.say('Wiese sleeps in the hospital barrack that night. In the morning, Starck stops beside you at the count. "I know," he says. Nothing else.'); } },
      { text: 'Stay out of it.', effects: { hope: -2 }, result: 'You stay in your bunk. In the morning, Wiese has two black eyes and a broken hand, and does not look at anyone.' }
    ] });
  ev({ id: 'c8c_10a_alt', day: 10, phase: 1, scene: 'barracks',
    title: 'Letters Nobody Sends',
    text: 'In the evening the men write letters on scraps of birch bark and cement-sack paper, letters that cannot be sent. They read them to each other. One man has written forty, all to his wife, all starting "My dear Grete".',
    choices: [
      { text: 'Write one.', effects: { hope: 6 }, result: s => `You write to ${s.flags.married ? 'Liesel, and to a child you have never seen' : 'your mother'}. You fold it into your pocket with the others.` },
      { text: 'Listen to theirs.', effects: { hope: 3, comrades: 3 }, result: 'Grete, Grete, Grete. By the fortieth letter, you feel you know her.' }
    ] });

  // ───────────────────────── Day 11 · 1 July: Radio Moscow ─────────────────────────
  ev({ id: 'c8c_11m', day: 11, phase: 0, scene: 'office', time: '10:00',
    title: 'Radio Moscow',
    text: s => `Wiese has news: Radio Moscow will broadcast greetings from German prisoners, by name, in its German service. "Your family will know you are alive."

It is a crime in Germany to listen to enemy radio. Families have been sent to camps for it. And a name read on Soviet radio is the name of a man who went over to the enemy.${s.flags.married ? ' Liesel will have had the baby by now.' : ''}`,
    choices: [
      { text: 'Give your name.', set: { nameOnRadio: true }, effects: { hope: 14 }, rel: { wiese: 4 },
        result: s => `"${s.char.first} ${s.char.last}, of ${SIM.townName(s.char.hometown)}, is alive and well and sends his love." You will never know whether anyone heard it. You choose to believe that someone did.` },
      { text: 'Refuse. It would endanger them.', effects: { hope: -4, conscience: 2 },
        result: 'You protect them by staying dead. It is the hardest thing you have done since the cellar.' },
      { text: 'Give the names of your men instead, those who want it.', show: s => men(s).length > 0, effects: { hope: 8 }, squad: { all: { loyalty: 8, morale: 8 } },
        result: 'Some want it, some do not. You take the list to Wiese. That evening, in the barrack, someone starts singing.' }
    ] });

  ev({ id: 'c8c_11a', day: 11, phase: 1, scene: 'office',
    title: 'Grischa',
    cond: s => weber(s) && !s.flags.weberSaved,
    text: s => `Belov has Grischa's file on his desk. ${s.flags.weberHeard ? 'A guard reported a "German" speaking Russian on the train. ' : ''}"Johann Weber, from Danzig," he says. "Who has never been to Danzig. A Ukrainian, I think." He looks at you. "Why should I not hand him to the tribunal?"`,
    choices: [
      { text: '"Because he saved my life, and he never fired a shot at your people."', effects: { conscience: 6, hope: 2 }, rel: { belov: 4 },
        outcome: (s, x) => { if (x.roll((SIM.rel(s, 'belov') >= 0 ? 0.6 : 0.35) + (s.flags.toldFilm ? 0.15 : 0))) { s.flags.grischaLives = true; x.say('Belov is silent for a long time. "Ten years in a labour camp," he says at last. "Not the tribunal. It is the best I can do." It is a sentence. It is also a life.'); x.lose('grischa', 'gone', 'sentenced to ten years in a Soviet labour camp'); } else { x.lose('grischa', 'killed', 'by a Soviet military tribunal, July 1943'); x.apply({ hope: -12 }); x.say('"Everyone saved someone\'s life," Belov says, and closes the file. Grischa is taken away that night.'); } } },
      { text: '"He is Johann Weber. I knew him in Danzig."', state: { key: 'weber', v: 'lie', t: 'To Belov: Weber is a German from Danzig.' },
        outcome: (s, x) => { if (x.roll(0.3)) { x.say('Belov looks at you, then writes "German" on the file. You will never know why.'); } else { x.lose('grischa', 'killed', 'by a Soviet military tribunal, July 1943'); x.apply({ hope: -14, health: -6 }); x.say('"You were never in Danzig either," Belov says. Grischa is taken away. You spend a week in the punishment block.'); } } }
    ] });
  ev({ id: 'c8c_11a_alt', day: 11, phase: 1, scene: 'powcamp',
    title: 'Sunday',
    text: 'A Sunday with no work. Football on the parade ground with a ball made of rags: officers against men. The Russian guards bet cigarettes on it.',
    choices: [
      { text: 'Play.', effects: { hope: 6, health: -2, comrades: 5 }, result: 'You score once, by accident. The men cheer as if it were Berlin in 1936.' },
      { text: 'Watch, in the sun.', effects: { hope: 4 }, result: 'Sun, shouting, a ball. For an hour, you are boys again.' }
    ] });

  // ───────────────────────── Day 12 · 6 July: Kursk ─────────────────────────
  ev({ id: 'c8c_12m', day: 12, phase: 0, scene: 'powcamp', time: '08:00',
    title: 'The Loudspeaker',
    text: 'The camp loudspeaker: yesterday, the German army attacked the Soviet lines at Kursk with everything it has. The Red Army is holding. The Soviet announcer reads out numbers of German tanks destroyed, in a voice like a football commentator.\n\nIn the barrack, men stand in groups and argue. Some of them still believe.',
    choices: [
      { text: '"They will hold. It is over."', effects: { hope: 4, comrades: -3 }, result: 'Saying it out loud is like taking off a heavy pack. Somebody calls you a defeatist. Somebody else nods.' },
      { text: 'Think of the men who got out of the pocket. They are there now.', effects: { conscience: 2, morale: -2 }, result: 'Twenty-five thousand men flew out of Stalingrad. You wonder how many of them are in that battle. You wonder if you envy them.' },
      { text: '"Germany will win this one."', effects: { hope: 2 }, rel: { starck: 4 }, result: 'You do not believe it. You need to say it. The officers nod.' }
    ] });

  ev({ id: 'c8c_12a', day: 12, phase: 1, scene: 'barracks',
    title: 'Starck',
    cond: s => !!s.flags.starckSecret && !s.flags.starckTaken && !s.flags.starckReported,
    text: s => `They come for Starck at last: somebody else talked. He is packing his things when you come into the barrack: a spoon, a tin, a photograph of a schoolroom in Brunswick.

"They will hang me," he says calmly, "or send me to Vorkuta, which is the same thing, slower." He holds out his hand.${s.flags.starckEnemy ? ' "Even you. I am not a man who holds grudges at the end."' : ''}`,
    choices: [
      { text: 'Shake it.', rel: { starck: 10 }, effects: { conscience: -1 }, set: { starckFarewell: true },
        result: '"You will go home," he says. "Remember that we were right." Then he goes out between the guards, straight-backed, as if to a parade. You never see him again.' },
      { text: 'Do not.', rel: { starck: -10 }, effects: { conscience: 3, hope: 2 },
        result: 'He looks at your hand, and then at you, and lowers his own. "As you like," he says, and goes out between the guards. It is the last thing he says to you.' },
      { text: '"Was it worth it?"', effects: { conscience: 2 },
        result: 'He thinks about it for a long time. "That is a schoolteacher\'s question," he says. "I was a schoolteacher." He does not answer it. They take him away.' }
    ] });
  ev({ id: 'c8c_12a_alt', day: 12, phase: 1, scene: 'barracks',
    title: 'Summer',
    text: 'Long summer evenings. The sun does not set until after ten. Men sit outside the barracks carving spoons, chess pieces, small wooden horses for children they may never see.',
    choices: [
      { text: 'Carve something.', effects: { hope: 6 }, result: s => `A small horse, for ${s.flags.married ? 'the child' : 'nobody in particular'}. It takes you three evenings. It is the first thing you have made since 1939.` },
      { text: 'Teach someone to read.', effects: { hope: 4, conscience: 3, comrades: 4 }, result: 'A farmhand from Masuria who never went to school. By the end of the week he can write his own name.' }
    ] });

  // ───────────────────────── Day 13 · 13 July: the manifesto ─────────────────────────
  ev({ id: 'c8c_13m', day: 13, phase: 0, scene: 'powcamp', time: '10:00',
    title: 'Free Germany',
    text: s => `In the camp club, under a black-white-red banner, German prisoners and exiled German communists found the "National Committee for a Free Germany". Its manifesto calls on the army to overthrow Hitler and end the war. It is signed by soldiers, officers, a few generals' sons.

Wiese brings the paper to your barrack. "Sign," he says. "Not for Moscow. For Germany."

${s.flags.spokeAntifa ? 'The men who heard you speak are watching you.' : 'The officers at the end of the barrack are watching you.'} In Germany, the families of men who sign are watched by the Gestapo.`,
    choices: [
      { text: 'Sign.', set: { signedNKFD: true }, effects: { hope: 10, conscience: 5, comrades: -6 }, rel: { wiese: 10 },
        result: s => `You write your name under the others, ${s.char.first} ${s.char.last}. It looks very small. It is the most dangerous thing you have ever written.` },
      { text: 'Refuse. You swore an oath.', set: { refusedNKFD: true }, effects: { hope: -2, comrades: 4 }, rel: { wiese: -6 },
        result: '"I swore an oath," you say. Wiese nods as if he expected it. "So did I," he says. "To a man who sent us here to die."' },
      { text: 'Sign, if your men get the better rations that signatories get.', show: s => men(s).length > 0, set: { signedNKFD: true, signedForMen: true }, effects: { hope: 8, conscience: 2 }, squad: { all: { loyalty: 8 } }, rel: { wiese: 4 },
        result: 'Wiese hesitates, then agrees. You sign. Your men eat better that month. Whether that was politics or arithmetic, you could not say.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch8 = { ss, has, men, say, track, camp, weber, score };
})();
