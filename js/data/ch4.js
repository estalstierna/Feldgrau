// Chapter IV: "Barbarossa" — the invasion of the Soviet Union, 21 June – 19 July 1941.
// The Bug at Brest → Białystok and the pocket → the road past Minsk → the Berezina → Smolensk.
// Random events and endings live in ch4_more.js.
window.SIM = window.SIM || {};

(function () {
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const first = m => m.name.split(' ')[0];
  // Does the informer report you? Kühn reports unless he has come to trust you.
  const informed = (s, x, base = 0.35) => {
    const k = SIM.man(s, 'kuehn');
    if (!k || k.status !== 'ok') return false;
    return x.roll(base * (1 - k.loyalty / 120) + (s.flags.deputy === 'kuehn' ? 0.1 : 0));
  };
  const say = (x, m, killedText, woundedText) => { if (m) x.say(m.status === 'killed' ? killedText(m) : woundedText(m)); };
  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;
  SIM.earnsCross4 = s => !s.flags.refusedOrder4 && (score(s) >= 14 || (s.flags.tankKill4 && score(s) >= 9));

  const DAYS = [
    { date: 'Saturday, 21 June 1941',  short: 'Sat 21 Jun', place: 'bug', war: true },
    { date: 'Sunday, 22 June 1941',    short: 'Sun 22 Jun', place: 'bug', war: true },
    { date: 'Monday, 23 June 1941',    short: 'Mon 23 Jun', place: 'road_east', war: true },
    { date: 'Friday, 27 June 1941',    short: 'Fri 27 Jun', place: 'bialystok', war: true },
    { date: 'Saturday, 28 June 1941',  short: 'Sat 28 Jun', place: 'pocket', war: true },
    { date: 'Thursday, 3 July 1941',   short: 'Thu 3 Jul', place: 'minsk_road', war: true },
    { date: 'Friday, 4 July 1941',     short: 'Fri 4 Jul', place: 'berezina', war: true },
    { date: 'Tuesday, 15 July 1941',   short: 'Tue 15 Jul', place: 'dnieper', war: true },
    { date: 'Wednesday, 16 July 1941', short: 'Wed 16 Jul', place: 'smolensk', war: true },
    { date: 'Saturday, 19 July 1941',  short: 'Sat 19 Jul', place: 'smolensk', war: true }
  ];

  const PLACES = {
    bug:        { name: 'The forests on the River Bug, north of Brest', x: 54, y: 168 },
    road_east:  { name: 'The sand roads east of the Bug',               x: 80, y: 158 },
    bialystok:  { name: 'Białystok',                                    x: 60, y: 110 },
    pocket:     { name: 'The Białystok pocket, near Wołkowysk',         x: 98, y: 124 },
    minsk_road: { name: 'The road past Minsk',                          x: 150, y: 110 },
    berezina:   { name: 'The Berezina at Borisov',                      x: 186, y: 98 },
    dnieper:    { name: 'The Dnieper west of Smolensk',                 x: 252, y: 88 },
    smolensk:   { name: 'Smolensk',                                     x: 274, y: 78 }
  };

  SIM.CHAPTERS.push({
    id: 'east', num: 'IV', title: 'Barbarossa', range: '21 June – 19 July 1941', year: 1941, start: [1941, 6],
    days: DAYS, places: PLACES, map: 'east', sceneVariant: 'east',
    finalEvent: 'c4_9n',
    commander: 'Hauptmann von Albrecht',
    hospital: 'Warsaw',
    deathDefault: 'Killed in the Soviet Union, summer 1941.',
    casualties: 'Between June and December 1941 the German army lost more than 300,000 men killed in the East. Soviet losses ran into the millions. Of the 3.3 million Red Army soldiers taken prisoner in 1941, about two million were dead by the following spring, most of them starved in German camps.',
    promoDate: '1 October 1941',
    // Feldwebel needs an Unteroffizier with an exceptional record; a field promotion to
    // Unteroffizier is possible without the course, for outstanding merit.
    maxRank: s => s.rank >= 4 ? ((s.flags.passedCourse && score(s) >= 16) ? 5 : 4) : ((s.flags.passedCourse || score(s) >= 10) ? 4 : 3),
    meritBar: 8,
    routineReason: 'Time in service and a clean record in the East.',
    meritReason: 'Recommended by Hauptmann von Albrecht for leading your squad in the summer battles.',
    interludeDate: 'Spring 1941',
    interludeTitle: 'November 1940 – June 1941',
    blackMarks: s => {
      const b = [];
      if (s.flags.refusedOrder4) b.push('You refused an order in the East.');
      if (s.flags.asleep_3) b.push('You were found asleep on sentry duty.');
      return b;
    },
    awards: (s, sc) => {
      if (s.flags.tankKill4) SIM.award(s, 'tankbadge', 'For destroying a Soviet T-34 single-handed on the Berezina, 4 July 1941. Awarded retroactively.', 'March 1942');
      const hadEk2 = s.medals.some(m => m.id === 'ek2' && m.chapter < 3);
      if (!SIM.hasMedal(s, 'ek2') && SIM.earnsCross4(s)) SIM.award(s, 'ek2', 'For bravery in the summer battles in the East, 1941.', 'August 1941');
      else if (hadEk2 && !SIM.hasMedal(s, 'ek1') && !s.flags.refusedOrder4 && (sc >= 17 || (s.flags.tankKill4 && sc >= 13))) SIM.award(s, 'ek1', 'For outstanding bravery between the Bug and Smolensk, 1941.', 'August 1941');
      if (s.flags.wentForward4) SIM.award(s, 'kvk2', 'For taking the listening post himself under fire on the Dnieper, July 1941.', 'September 1941');
    },
    ending: s => SIM.ch4Ending(s),
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, s.ending === 'oc_wounded' ? 80 : 88);
      s.stats.morale = Math.max(s.stats.morale, 58);
      s.stats.food = 80;
      if (s.stats.suspicion < 80) s.stats.suspicion = Math.max(0, s.stats.suspicion - 15);
      s.marks += 20;
      SIM.give(s, 'cigarettes', 4);
      if (!s.squad) SIM.makeSquad(s);
      if (s.ending === 'oc_court') { const m = SIM.man(s, 'sattler'); if (m && m.status === 'ok') { m.status = 'gone'; m.fate = 'Military prison, Torgau'; } }
      // Everyone starts the new campaign rested.
      SIM.squadMen(s).forEach(m => { m.morale = Math.max(m.morale, 55); });
    },
    onStart: s => { if (!s.squad) SIM.makeSquad(s); s.flags.hasSquad = true; },
    interlude: s => interludeItems(s),
    interludeEvents: ['i3_drill', 'i3_train']
  });

  function interludeItems(s) {
    const f = s.flags, out = [];
    if (s.ending === 'oc_court') out.push({ year: 'Winter', text: 'Four months in the military prison at Torgau: cold cells, drill at dawn, a Feldwebel who had been a prison warder in civilian life. In March the army needed men more than it needed to punish them. You were sent back to the 3rd Company as a Schütze. Sattler was not. Albrecht, who had more squads than squad leaders, gave you your old men back anyway. "On probation," he said. "Do not make me regret it."' });
    else if (s.ending === 'oc_wounded') out.push({ year: 'Winter', text: 'You spent the winter in a requisitioned hospital in Paris, and rejoined the company on the Cher in February, thinner and with a new scar.' });
    out.push({ year: 'Winter', text: 'The winter passed on the demarcation line. The war seemed far away: the Luftwaffe bombed London night after night, and England did not give in. In the spring came news of new campaigns in the Balkans. In April German troops took Yugoslavia and Greece in three weeks. In May Rudolf Hess, the Führer\'s deputy, flew alone to Scotland. The newspapers said he had gone mad. The men made jokes about it for a week.' });

    const g = [];
    if (f.savedCrossers && SIM.rel(s, 'claire') >= 30) g.push('In January a postcard arrived from Lyon in the free zone: a picture of the Rhône, no signature, only "Merci" and a drawing of a mill. You keep it in your paybook.');
    if (f.reportedClaire) g.push('Claire Girard was sentenced by a German court in Tours. You do not know where she is now. Madame Girard closed the shutters of her house the day you left and did not open them while the column passed.');
    if (f.paulArrested) g.push('Paul Girard, fourteen years old, was sent to a prison in Germany for stealing a rifle. You think about him more than you would like to.');
    if (f.lenzFeldgendarm) g.push('Karl Lenz\'s Feldgendarmerie troop was attached to the division for "special tasks in the East". He seemed pleased.');
    if (has(s, 'pohl') && f.pohlSonIll) g.push('Pohl\'s youngest, Hänschen, recovered from diphtheria. Pohl showed everybody the letter.');
    if (g.length) out.push({ year: 'Spring', text: g.join('\n\n') });

    out.push({ year: 'May 1941', text: 'In May the division was loaded onto trains. They went east: through Germany, through what had been Poland and was now the "General Government", to the forests along the River Bug. Across the river was the Soviet Union, Germany\'s partner since 1939. Every night, trains loaded with Soviet grain and oil still crossed the bridge at Brest into Germany. Nobody had told the men why they were there. Everybody knew.' });
    return out;
  }

  SIM.INTERLUDE_EVENTS.i3_drill = {
    id: 'i3_drill', scene: 'field',
    title: 'Training the Squad, April 1941',
    text: s => `In April, back in France, Albrecht gives every squad leader a week to train his men as he sees fit. "Where we are going," he says, "the men who are trained will live."

He does not say where you are going. You have seven men${SIM.squadMen(s).length !== 7 ? ` (${SIM.squadMen(s).length}, now)` : ''}, a field, and a week.`,
    choices: [
      { text: 'Marksmanship, every day. A squad that shoots well wastes nothing.', train: { shooting: 2 }, squad: { all: { morale: -2, loyalty: 3 } },
        outcome: (s, x) => {
          if (SIM.hasMedal(s, 'schnur2') && x.roll(0.35 + SIM.skill(s, 'shooting') * 0.1)) { SIM.award(s, 'schnur3', 'Qualification shoot, April 1941.', 'April 1941'); x.say('You shoot with them, and on the last day you qualify for the third grade of the lanyard yourself: two acorns.'); }
          x.say('By the end of the week even Rau can put five rounds in a hand at two hundred metres.');
        } },
      { text: 'Fieldcraft: digging in, moving under fire, keeping your head down.', set: { dugIn: true }, squad: { all: { morale: 3, loyalty: 4 } }, train: { leadership: 1 },
        result: 'Holes, holes and more holes. The men curse you all week. Pohl, who dug trenches at the Somme, says it is the only useful thing the army has ever taught him.' },
      { text: 'First aid. Bandages, tourniquets, carrying the wounded.', set: { medics: true }, train: { medicine: 2 }, squad: { all: { loyalty: 3 } },
        result: 'A medical orderly teaches the squad how to stop bleeding and splint a leg with a rifle. Brenner turns out to have gentle hands. Kühn says it is a waste of time. You make him do it twice.' },
      { text: 'Let them rest. Wine, cards, sleep. They\'ve earned it.', squad: { all: { morale: 12, loyalty: 5 } }, effects: { officers: -3 },
        result: 'A week of spring in the French countryside. Hartmann teaches the farmer\'s daughter skat. It is the last good week any of you will have for a long time.' }
    ]
  };

  SIM.INTERLUDE_EVENTS.i3_train = {
    id: 'i3_train', scene: 'road',
    title: 'The Train East, May 1941',
    text: s => `The troop train stops for an hour at a siding outside Warsaw. Beyond the tracks is a brick wall, three metres high, topped with broken glass: the wall of the ghetto, where the Germans have shut up four hundred thousand Jews.

On the siding, a work gang of Jewish men in white armbands is shovelling coal under guard. They are thin in a way you have never seen. A boy of about twelve comes to the open door of your wagon and holds out his hand without a word. ${has(s, 'kuehn') ? 'Kühn has his camera out.' : 'Somebody in the next wagon is taking photographs.'}`,
    choices: [
      { text: 'Give him your bread and your cigarettes.', effects: { conscience: 6, food: -15, suspicion: 2 }, items: { cigarettes: -2 },
        result: 'He takes them and is gone before the guard turns round. Pohl, without a word, gives him his bread too. The guard shouts something. The train moves on.',
        log: 'Gave my bread to a boy at the Warsaw ghetto wall.' },
      { text: 'Close the door.', effects: { conscience: -4 },
        result: 'You slide the door shut. In the dark of the wagon, nobody says anything for a long time.' },
      { text: 'Stop Kühn taking photographs.', show: s => has(s, 'kuehn'), effects: { conscience: 4 }, squad: { kuehn: { loyalty: -8 } },
        result: '"Put that away." He looks at you, surprised. "It is only for the album." But he puts it away. The boy has gone.' }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 3 }, o));

  // ───────────────────────── Day 0 · Saturday 21 June ─────────────────────────
  ev({ id: 'c4_0m', day: 0, phase: 0, scene: 'forest', time: '05:30',
    title: 'The Forest by the Bug',
    text: s => `Midsummer. The division has been hiding in the forests along the River Bug for a week, under orders of total silence: no fires, no radios, no swimming. Through binoculars you can see a Soviet border guard on the far bank in a green cap, smoking, bored. Last night a goods train rolled west across the bridge at Brest, loaded with grain for Germany.

Your squad lies in the ferns: ${SIM.squadMen(s).map(first).join(', ')}. They are waiting for you to say something.`,
    choices: [
      { text: 'Inspect every man\'s weapon and kit. Twice.', set: { kitChecked: true }, train: { leadership: 1 }, squad: { all: { loyalty: 3, morale: -2 } }, effects: { officers: 3 },
        result: 'Rifles, bolts, grenades, field dressings, gas mask filters. Rau has forgotten his spare socks; in three weeks that could cost him his feet. The men grumble. They also check their own kit afterwards, without being told.' },
      { text: 'Let them sleep. They\'ll need it.', squad: { all: { morale: 6 } }, effects: { health: 4 },
        result: 'You let them doze in the green shade until noon. It is very quiet. Somewhere a cuckoo calls, over and over.' },
      { text: 'Talk to each man alone, five minutes each.', train: { leadership: 2 }, squad: { all: { loyalty: 5 } },
        outcome: (s, x) => {
          const t = [];
          if (has(s, 'pohl')) t.push('Pohl shows you a photograph of his four children, in order of height.');
          if (has(s, 'rau')) t.push('Rau asks you, seriously, how big Russia is. You tell him. He goes quiet.');
          if (has(s, 'kuehn')) t.push('Kühn says he has been waiting for this all his life.');
          if (has(s, 'hartmann')) t.push('Hartmann says, "Napoleon also started in June," and then, "Sorry. Bad joke."');
          x.say(t.join(' ') || 'Each man says something different. All of them are afraid.');
        } }
    ] });

  ev({ id: 'c4_0a', day: 0, phase: 1, scene: 'camp', time: '16:00',
    title: 'The Guidelines',
    text: `Hauptmann von Albrecht assembles the company in a clearing and reads from a typed sheet: the "Guidelines for the Conduct of the Troops in Russia".

"Bolshevism is the mortal enemy of the German people... This struggle demands ruthless and energetic action against Bolshevik agitators, irregulars, saboteurs and Jews, and the total elimination of all active or passive resistance."

He reads in a flat voice without looking up, the way Steiner read in Pomerania two years ago. Afterwards he calls the squad leaders aside.

"There is a further order, for the officers. Political commissars of the Red Army are not to be treated as prisoners of war. They are to be separated from the other prisoners and... dealt with." He looks at each of you. "You will not hear this from me twice."`,
    choices: [
      { text: 'Say nothing. Salute.', effects: { conscience: -3 },
        result: 'You salute. Everybody salutes. Albrecht nods and walks away with the paper folded small in his hand.' },
      { text: 'Ask him quietly: "And if we don\'t, Herr Hauptmann?"', effects: { conscience: 4, suspicion: 3 }, rel: { albrecht: 8 }, set: { askedAlbrecht: true },
        result: 'He looks at you for a long moment. "Then you will hand them to the rear, and let the rear decide. That is what I intend to do." He pauses. "I did not say that."',
        log: 'Asked Albrecht about the commissar order.' },
      { text: '"Understood, Herr Hauptmann. No mercy."', effects: { officers: 3, suspicion: -4, conscience: -6 }, rel: { albrecht: -6 }, squad: { kuehn: { loyalty: 8 } },
        result: 'Albrecht looks at you as if he does not quite recognise you. "Good," he says, without any warmth at all.' }
    ] });

  ev({ id: 'c4_0n', day: 0, phase: 2, scene: 'forest', time: '23:30',
    title: 'Midsummer Night',
    text: 'The shortest night of the year. The forest is full of men lying awake: three million of them, from the Baltic to the Black Sea, although you do not know that yet. At 03:15 the guns will open. The air smells of pine resin and gun oil.',
    choices: [
      { text: 'Go from man to man. A word, a cigarette.', items: { cigarettes: -1 }, squad: { all: { morale: 8, loyalty: 3 } }, effects: { comrades: 4 },
        result: 'Seven cigarettes, seven glowing points in the dark under the trees, cupped in hands. Nobody says anything important. That is the point.' },
      { text: 'Take a Pervitin to stay sharp.', show: s => SIM.has(s, 'pervitin'), items: { pervitin: -1 }, effects: { morale: 10, health: -3 },
        delay: { in: 3, effects: { morale: -12, health: -6 }, note: 'The Pervitin is wearing off. Your heart races and the world turns grey.' },
        result: 'Twenty minutes later the night becomes very clear. You will not sleep now. You will not need to, not for a day or two.' },
      { text: 'Write a letter to be sent if you don\'t come back.', effects: { morale: 5 }, set: { lastLetter: true },
        result: 'The third one you have written. They get shorter.' },
      { text: 'Pray.', outcome: (s, x) => { if (s.flags.catholic || SIM.has(s, 'rosary')) { x.apply({ morale: 9, conscience: 2 }); x.say('The rosary from your mother, its beads worn smooth. Brenner, lying next to you, hears and joins in under his breath.'); if (has(s, 'brenner')) x.squadMod('brenner', { loyalty: 8 }); } else { x.apply({ morale: 4 }); x.say('You still don\'t know how. You try anyway.'); } } },
      { text: 'Sleep.', effects: { health: 6 }, result: 'Two hours. It is enough.' }
    ] });

  // ───────────────────────── Day 1 · Sunday 22 June ─────────────────────────
  ev({ id: 'c4_1m', day: 1, phase: 0, scene: 'river', time: '03:15',
    title: '03:15',
    text: 'At 03:15 the sky behind you tears open: thousands of guns at once, from horizon to horizon. The forest shakes. You run down to the river with the assault boats on your shoulders. On the far bank, the Soviet border post wakes up: a machine gun in a log bunker starts firing across the water.',
    choices: [
      { text: 'Lead from the first boat.', effects: { merit: 3, officers: 6 }, assault: true, train: { leadership: 1 },
        risk: { chance: 0.18, dmg: [15, 40], cause: 'Killed crossing the River Bug at dawn on 22 June 1941, the first morning of the war in the East.',
          hit: 'Halfway across, the bunker finds your boat. Something smashes into you and you are lying in the bilge water.',
          miss: 'You are standing in the bow shouting and paddling like a madman, and then you are on the far bank in the reeds, alive.' },
        outcome: (s, x) => { const m = x.casualty(0.16, 'in the boats on the Bug'); say(x, m, m => `${m.name} is hit in the boat beside you. He goes over the side and the river takes him.`, m => `${m.name} is hit in the shoulder in the boat. The medics take him back across the river.`); } },
      { text: 'Put Hartmann\'s MG on the bank to cover the crossing, then go.', show: s => has(s, 'hartmann'), effects: { merit: 2, officers: 4 }, assault: true, squad: { hartmann: { morale: 5 } },
        risk: { chance: 0.1, dmg: [10, 30], cause: 'Killed crossing the River Bug on 22 June 1941.',
          hit: 'You are the last into the boat, and the last bullet of the burst finds you.',
          miss: 'Hartmann hoses the bunker\'s firing slit until it falls silent, and the boats cross under his fire. Then you go back for him.' },
        outcome: (s, x) => { const m = x.casualty(0.08, 'crossing the Bug'); say(x, m, m => `${m.name} does not reach the far bank.`, m => `${m.name} is hit in the leg on the far bank.`); } },
      { text: 'Cross with the second wave.', effects: { merit: 1, officers: -2 },
        risk: { chance: 0.07, dmg: [8, 25], cause: 'Killed by artillery on the River Bug on 22 June 1941.',
          hit: 'A Soviet mortar finds the second wave on the near bank.', miss: 'The first wave has paid for the crossing. You step over its dead to reach the boats.' },
        outcome: (s, x) => { const m = x.casualty(0.1, 'on the near bank of the Bug'); say(x, m, m => `${m.name} is killed by a mortar bomb while waiting for the boats.`, m => `${m.name} is wounded by mortar splinters before he can cross.`); } }
    ] });

  ev({ id: 'c4_1a', day: 1, phase: 1, scene: 'village', time: '13:00',
    title: 'The Border Post',
    text: s => `The Soviet border post holds out until noon: a log blockhouse and a few cottages behind wire. The border guards in their green caps fight to the last cartridge. When it is over, two people come out with their hands up: a boy in uniform with a bandaged head, and a young woman in a summer dress, the wife of the post commander. Her husband is still inside.

${has(s, 'kuehn') ? 'Kühn has his rifle up. "Border guards are NKVD, Herr Unteroffizier. Commissars, all of them."' : 'A soldier from the next platoon has his rifle up. "NKVD. They\'re all commissars."'}`,
    choices: [
      { text: '"They are prisoners. Both of them go to the rear."', effects: { conscience: 6 }, rel: { albrecht: 3 }, squad: { kuehn: { loyalty: -6 } },
        result: 'The boy is marched off with the other prisoners. The woman sits down in the grass by the road and will not move. Somebody gives her water. When the company moves on, she is still sitting there.' },
      { text: 'Send the woman home to the village. The boy goes to the rear.', effects: { conscience: 8, suspicion: 2 }, train: { leadership: 1 },
        result: '"Go home." She does not understand the words and then she does. She walks away down the road toward the village without looking back.' },
      { text: 'Let them do as they like.', effects: { conscience: -14, morale: -6 }, squad: { kuehn: { morale: 6 } }, set: { borderShot: true },
        result: 'You turn away. Two shots. When you look back, the woman is still standing, and then she is not. The cuckoo is calling again in the forest.',
        log: 'Looked away at the border post on the first day.' }
    ] });

  // ───────────────────────── Day 2 · Monday 23 June ─────────────────────────
  ev({ id: 'c4_2m', day: 2, phase: 0, scene: 'road',
    title: 'Dust',
    text: s => `Thirty-five degrees in the shade, and there is no shade. The roads here are sand, and the panzers churn them into a fine grey dust that hangs in the air for kilometres and gets into your eyes, your teeth, your rifle. Forty kilometres yesterday. Forty today. The panzers are already a hundred kilometres ahead.

${has(s, 'pohl') ? 'Pohl, forty-one years old, is grey in the face and stumbling.' : 'Even Brenner is stumbling.'}`,
    choices: [
      { text: 'Carry Pohl\'s pack and keep him going.', show: s => has(s, 'pohl'), effects: { health: -10, comrades: 5 }, squad: { pohl: { loyalty: 15 } }, train: { leadership: 1 },
        result: 'It nearly kills you. Pohl says, "I\'m too old for this, boy," every kilometre. He keeps walking.' },
      { text: 'Send Pohl to the aid post. He\'s too old for this.', show: s => has(s, 'pohl'), effects: { conscience: 2 },
        outcome: (s, x) => { x.lose('pohl', 'evacuated', 'with heat exhaustion'); x.say('He wants to argue and doesn\'t have the strength. A medical truck takes him back down the column. He waves until the dust swallows him. You will hear later that he was sent home to Leipzig. Of all of you, he may be the lucky one.'); } },
      { text: 'Share out your water. Everyone drinks.', effects: { food: -5, health: -4 }, squad: { all: { morale: 6, loyalty: 4 } },
        result: 'Your canteen goes round and comes back empty. In the evening Sattler appears with a stolen bucket of well water and you all drink like horses.' },
      { text: 'Keep the pace. Everyone suffers the same.', effects: { officers: 3 }, squad: { all: { morale: -6 } },
        outcome: (s, x) => { if (has(s, 'pohl') && x.roll(0.5)) { x.lose('pohl', 'evacuated', 'with heat exhaustion'); x.say('In the afternoon Pohl goes down in the dust and does not get up. The medics take him away on a cart.'); } else x.say('Nobody falls out. Nobody thanks you either.'); } }
    ] });

  ev({ id: 'c4_2a', day: 2, phase: 1, scene: 'village',
    title: 'Bread and Salt',
    text: `A village of wooden houses with carved window frames painted blue. The villagers do not run. They come out to meet you with an embroidered towel, a round loaf and a dish of salt, the old welcome for honoured guests.

An old man who learned German as a prisoner in the last war explains: two years ago the Soviets came, took the land into a collective farm, and sent a third of the village to Siberia. A young woman asks whether the Germans will open the NKVD prison in town; her husband was taken there last week.

You do not know yet that the NKVD shot its prisoners before it retreated. She will find out tomorrow.`,
    choices: [
      { text: 'Accept the bread and salt and thank them.', effects: { food: 20, morale: 5, conscience: 2 },
        result: 'You break the bread, dip it in the salt and eat it, the way the old man shows you. The children stare at your helmet. For an hour it feels as if you have come to liberate someone.' },
      { text: 'Stop Kühn taking their chickens.', show: s => has(s, 'kuehn'), effects: { conscience: 4, officers: 1 }, squad: { kuehn: { loyalty: -6 } },
        result: '"Looting is forbidden." Kühn lets the chicken go, sulking. The old woman who owns it bows to you. Behind the village, men from another company are already driving off a cow.' },
      { text: 'Take what the squad needs. We\'re at war.', effects: { food: 25, conscience: -5 }, squad: { all: { morale: 4 } },
        result: 'Eggs, a ham, honey. The villagers watch you take it with the same polite smiles they welcomed you with. The smiles do not change. That is what you remember afterwards.' }
    ] });

  // ───────────────────────── Day 3 · Friday 27 June ─────────────────────────
  ev({ id: 'c4_3m', day: 3, phase: 0, scene: 'city', time: '10:30',
    title: 'Smoke over Białystok',
    text: `Białystok was taken without much fighting. The company is held up in the city, waiting for the road east to clear. Then a battalion of Order Police arrives: policemen in green uniforms, not army. By mid-morning there is shooting in the streets of the old Jewish quarter, and smoke rising above the roofs near the great synagogue.

Your squad is resting in a courtyard. A man of about forty climbs over the back wall with a boy of ten, both grey with soot. He sees your uniforms and freezes. In the street outside, boots and German voices, coming closer.`,
    choices: [
      { text: '"Under the tarpaulin on the cart. Quick."', effects: { conscience: 14 }, set: { hidJews: true },
        outcome: (s, x) => {
          const shield = ['hartmann', 'pohl', 'brenner', 'vogel'].includes(s.flags.deputy) ? 0.1 : 0;
          x.say('They are under the tarpaulin in five seconds. A police sergeant puts his head round the gate. "Seen any Jews come through here?"');
          if (informed(s, x, 0.45 - shield)) {
            x.apply({ suspicion: 20, morale: -12 });
            s.flags.hidJewsFound = true;
            x.say(`You say no. Kühn says nothing, but his eyes go to the cart, and the sergeant follows them. They pull the man and the boy out and take them away down the street. The sergeant writes your name in his notebook. Kühn will not look at you for the rest of the day.`);
            x.log('Hid a Jewish man and his son on our cart in Białystok. They were found.');
          } else {
            x.apply({ morale: 4 });
            s.flags.savedBialystok = true;
            x.say('"No." The sergeant looks round the courtyard, at your squad lying in the shade, at the cart. Then he goes. At dusk you lift the tarpaulin. The man takes your hand in both of his and says something in Yiddish. Then they slip out of the back gate toward the river and the forest beyond it. You never learn their names.');
            x.log('Hid a Jewish man and his son on our cart in Białystok. At dusk they went to the forest.');
          }
        } },
      { text: 'Point them to the far gate, away from the shouting.', effects: { conscience: 8 },
        result: 'You point. They run. You hear nothing more from that direction, which might mean anything. You will never know what happened to them.',
        log: 'Showed a Jewish man and his son the way out of a courtyard in Białystok.' },
      { text: 'Call the policemen.', effects: { conscience: -25, suspicion: -10, morale: -10 }, rel: { lenz: 5 },
        result: 'You shout. The policemen come. The man does not resist; he only puts his hand over the boy\'s eyes. Afterwards you sit down on the cart and find that your hands are shaking and will not stop.',
        log: 'Called the police to a Jewish man and his son in Białystok.' },
      { text: 'Turn your back. It\'s not the army\'s business.', effects: { conscience: -10, morale: -6 },
        result: 'When you turn round again, they are gone, and the policemen go past the gate without looking in. You will never know where they went.' }
    ] });

  ev({ id: 'c4_3a', day: 3, phase: 1, scene: 'city', time: '19:00',
    title: 'The Photographs',
    text: s => `By evening the smoke still hangs over the city. The men know what happened, because everybody knows: the police drove hundreds of Jewish men into the great synagogue and set it on fire. More were shot in the streets. Two thousand people, the rumour says. The army did not stop it. Nobody tried.

${has(s, 'kuehn') ? 'Kühn' : 'A corporal from the 2nd platoon'} has been taking photographs all day with a camera bought in Paris. He holds up a roll of film. "Sattler can get it developed. Who wants copies?"`,
    choices: [
      { text: 'Take the film and open it to the light.', effects: { conscience: 3 }, squad: { kuehn: { loyalty: -12 } },
        result: 'You pull the film out of its case in the evening sun until it is ruined. He shouts at you. You do not explain. You are not sure you could.' },
      { text: 'Take the film and keep it. Someone should be able to prove this one day.', effects: { conscience: 6, suspicion: 8 }, items: { film: 1 }, set: { evidence: true }, squad: { kuehn: { loyalty: -8 } },
        result: '"For the company album," you say. You wrap it in oilcloth and sew it into the lining of your pack. If anyone ever finds it, they will not believe the reason.',
        log: 'Kept a roll of film from Białystok.' },
      { text: 'Say nothing.', effects: { conscience: -4 },
        result: 'He goes round the squad. Two men put their names down for copies. You do not. You do not stop him either.' },
      { text: 'Put your name down for copies.', effects: { conscience: -10 }, squad: { kuehn: { loyalty: 6 } },
        result: 'Everyone does it, you tell yourself. Something to show people at home. You do not let yourself think about who you would show it to.' }
    ] });

  // ───────────────────────── Day 4 · Saturday 28 June ─────────────────────────
  ev({ id: 'c4_4m', day: 4, phase: 0, scene: 'field', time: '04:10',
    title: 'The Pocket',
    text: 'The Soviet armies cut off around Białystok are trying to break out to the east. At dawn they come out of the mist across a wet meadow toward your company\'s line: thousands of men, some arm in arm, shouting "Urrah!", with almost no artillery behind them. It is the most terrible thing you have ever seen, and it is coming straight at you.',
    choices: [
      { text: 'Hold. Fire only on your command.', effects: { merit: 3, officers: 6 }, assault: true, train: { leadership: 1 }, squad: { all: { loyalty: 3 } },
        risk: { chance: 0.16, dmg: [12, 35], cause: 'Killed in the Białystok pocket on 28 June 1941.', hit: 'The wave reaches your line. A bayonet, or a bullet, you never know which.', miss: 'Your voice holds the squad together. "Wait. Wait. Now." When the mist lifts, the meadow is grey with bodies, and your line has held.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'in the Białystok pocket'); say(x, m, m => `${m.name} is killed at your side when the wave reaches the trench.`, m => `${m.name} is wounded in the hand-to-hand fighting at the trench.`); x.apply({ conscience: -3 }); } },
      { text: 'Get the MG onto the flank and fire along their line.', show: s => has(s, 'hartmann'), effects: { merit: 4, officers: 6, conscience: -5 }, assault: true,
        risk: { chance: 0.1, dmg: [10, 30], cause: 'Killed in the Białystok pocket on 28 June 1941.', hit: 'You are hit running to the flank.', miss: 'From the flank, the MG 34 cuts into the side of the wave. It breaks. Hartmann is sick in the grass afterwards.' },
        outcome: (s, x) => { const m = x.casualty(0.12, 'in the Białystok pocket'); say(x, m, m => `${m.name} is killed on the flank.`, m => `${m.name} is wounded on the flank.`); x.squadMod('hartmann', { morale: -8 }); } },
      { text: 'Fall back to the second line before they reach you.', effects: { officers: -6 },
        risk: { chance: 0.1, dmg: [10, 28], cause: 'Killed falling back across open ground in the Białystok pocket.', hit: 'Running across open ground was the worst thing you could do.', miss: 'You reach the second line. Others do not.' },
        outcome: (s, x) => { const m = x.casualty(0.3, 'falling back across open ground'); say(x, m, m => `${m.name} is shot in the back running across the open ground.`, m => `${m.name} is hit while you fall back, and you carry him.`); } }
    ] });

  ev({ id: 'c4_4a', day: 4, phase: 1, scene: 'road',
    title: 'Prisoners',
    text: `By afternoon: prisoners. Tens of thousands of them, filthy, hungry, many wounded, sitting in fields by the road under guard. Nobody planned to feed them. Your squad is ordered to march a column of two thousand west to a collection camp, fifteen kilometres.

The orders are explicit: prisoners who cannot keep up are not to be left behind alive.`,
    choices: [
      { text: 'Let the village women throw bread to them.', effects: { conscience: 8, suspicion: 4 },
        outcome: (s, x) => { x.say('In every village, women stand by the road with bread, potatoes, jugs of water. You let them. The prisoners fight over the bread like animals and you let that too.'); if (informed(s, x, 0.2)) { x.apply({ suspicion: 8 }); x.say('That evening a staff officer asks why your column was "fraternising with the population".'); } } },
      { text: 'Put the weakest ones on the squad\'s cart.', effects: { conscience: 10, officers: -4 }, train: { leadership: 1 },
        outcome: (s, x) => x.say(`${has(s, 'brenner') ? 'Brenner lifts them up onto the cart like children.' : 'You lift them onto the cart yourself.'} Six men, then nine. The horse can barely pull it. Nobody in your column is left behind on the road. You see what happens to the columns that come after yours.`),
        log: 'Nobody in my prisoner column was left behind.' },
      { text: 'Give them your own bread and water.', effects: { conscience: 6, food: -20 },
        result: 'It is nothing: a loaf among two thousand. A man with a bandaged face takes it, breaks it into pieces and passes them back down the line.' },
      { text: 'Follow orders. Let Kühn deal with the stragglers.', show: s => has(s, 'kuehn'), effects: { conscience: -16, morale: -8 }, squad: { kuehn: { morale: 6 } }, set: { stragglers: true },
        result: 'Every kilometre or so, a shot behind the column. You stop counting at eleven.',
        log: 'Let Kühn shoot the stragglers from my prisoner column.' },
      { text: 'Follow orders.', show: s => !has(s, 'kuehn'), effects: { conscience: -16, morale: -8 }, set: { stragglers: true },
        result: 'Every kilometre or so, a shot behind the column. You stop counting at eleven.',
        log: 'Followed the order about stragglers.' }
    ] });

  ev({ id: 'c4_4n', day: 4, phase: 2, scene: 'camp', time: '21:00',
    title: 'The Commissar',
    text: s => `At the collection point, ${has(s, 'kuehn') ? 'Kühn' : 'a Feldgendarme'} brings a prisoner to you: a thin man of about thirty-five in round glasses, with a red cloth star sewn onto the sleeve of his tunic, the badge of a political officer.

"A commissar, Herr ${SIM.RANKS[s.rank]}. You know the order."

At the gate of the collection point, Feldgendarmes are separating "special cases" from the other prisoners. One of them is Karl Lenz.`,
    choices: [
      { text: 'Hand him over to the Feldgendarmerie.', effects: { conscience: -12 }, rel: { lenz: 8 },
        result: 'Lenz nods to you as if you had passed him the salt. The man in glasses is taken behind a barn with four others. You hear it from the other side of the field.',
        log: 'Handed a commissar over to Lenz.' },
      { text: 'Tell him, low, to tear off the star. Push him back into the column.', effects: { conscience: 10, suspicion: 8 },
        outcome: (s, x) => {
          if (informed(s, x, 0.5)) { x.apply({ suspicion: 15 }); x.rel('lenz', -15); x.say('He rips the star off with shaking fingers and is gone into the crowd. An hour later Lenz comes looking for you. "Your man Kühn says you let a commissar go." He smiles. "I found him anyway. They always have the haircut." He writes something down.'); }
          else { x.say('He looks at you, rips the star off, and is swallowed up by two thousand men in identical brown tunics. You will never know what became of him in the camps. But not this, not tonight.'); s.flags.savedCommissar = true; x.log('Let a commissar disappear into the prisoner column.'); }
        } },
      { text: 'Take him to Hauptmann von Albrecht.',
        outcome: (s, x) => {
          if (s.flags.askedAlbrecht || SIM.rel(s, 'albrecht') >= 40) { x.apply({ conscience: 8 }); x.rel('albrecht', 4); s.flags.savedCommissar = true; x.say('Albrecht looks at the man, then at the star, then at you. "I see a prisoner of war," he says. "Send him to the rear with the others." He turns back to his maps.'); }
          else { x.apply({ conscience: 3, morale: -6 }); x.say('Albrecht looks at the man for a long time. "This is not my decision to make," he says finally, and calls the Feldgendarmerie. He does not look at you while they take him away.'); }
        } },
      { text: 'Do it yourself.', effects: { conscience: -25, morale: -12, officers: 2 }, set: { shotCommissar: true },
        result: 'Behind the barn. One shot. He takes his glasses off first and folds them, carefully, and puts them in his pocket. You will remember the glasses.',
        log: 'Shot a commissar behind a barn near Wołkowysk.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch4 = { has, first, informed, say };
})();
