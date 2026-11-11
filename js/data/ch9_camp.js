// Chapter IX, camp track: Krasnogorsk, the Antifa course or the train east, Camp 97 at Yelabuga on the
// Kama, the logging camp in the forest, and an escape plan built over the winter (food, map, compass,
// boots, a partner), with the risk that someone talks. The attempt is on the night of 1 May 1944.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, men, say } = SIM.ch9;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 8, track: 'camp' }, o));
  const signed = s => !!s.flags.signedNKFD;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  SIM.EXTRA_PEOPLE = Object.assign(SIM.EXTRA_PEOPLE || {}, {
    haller: { name: 'Leopold Haller', role: 'Obergefreiter, a mountain guide from the Tyrol. Has escaped from two camps already, and been caught twice.', present: f => f.metHaller, base: () => 10 }
  });

  // ── The escape plan ──
  const plan = s => s.escape || (s.escape = { food: 0, map: false, compass: false, boots: false, partner: null, risk: 0 });
  SIM.escapeChance = s => {
    const e = plan(s);
    return clamp(0.03 + Math.min(e.food, 8) * 0.02 + (e.map ? 0.08 : 0) + (e.compass ? 0.06 : 0) + (e.boots ? 0.06 : 0) + (e.partner ? 0.07 : 0) + (s.stats.hope - 50) / 500 + SIM.skill(s, 'scrounging') * 0.01, 0.02, 0.45);
  };
  const prep = (x, s, k, v, risk, label) => {
    const e = plan(s);
    if (k === 'food') e.food = Math.min(10, e.food + v); else e[k] = v;
    e.risk = clamp(e.risk + (risk || 0), 0, 100);
    x.log(label);
  };
  // Someone may have noticed. Returns true if the plan is found out.
  const search = (s, x, extra) => {
    const e = plan(s);
    if (!x.roll(clamp(e.risk / 100 + (extra || 0), 0, 0.8))) return false;
    e.food = Math.max(0, e.food - 4); e.map = false; e.compass = false; e.risk = Math.max(0, e.risk - 20);
    x.apply({ health: -12, hope: -12, food: -10 });
    s.flags.escapeFound = (s.flags.escapeFound || 0) + 1;
    x.log('Escape hoard found by the guards.');
    return true;
  };

  // ───────────────────────── Day 0 · 2 August: Krasnogorsk ─────────────────────────
  ev({ id: 'c9c_0m', day: 0, phase: 0, scene: 'powcamp', time: '09:00',
    title: 'The Lists',
    text: s => `The camp is being emptied again. Two lists go up on the notice board: one for the "Antifa school", a course in politics for prisoners the Soviets want to use, and one for a labour camp far to the east, at Yelabuga on the river Kama.

${signed(s) ? 'Your name is on the first list. You signed the manifesto.' : 'Your name is on the second.'}`,
    choices: [
      { text: s => signed(s) ? 'Go to the school.' : 'Accept it. There is nothing else to do.', effects: { hope: 2 },
        result: s => signed(s) ? 'Wiese shakes your hand. "Now you will learn why," he says.' : 'Two thousand kilometres east. Further from home than anyone in your family has ever been.' },
      { text: s => signed(s) ? 'Ask to go east with your men instead.' : 'Ask Wiese for a place at the school.', show: s => signed(s) ? men(s).length > 0 : !!s.flags.metWiese,
        outcome: (s, x) => { if (signed(s)) { s.flags.declinedSchool = true; x.squadMod('all', { loyalty: 10 }); x.apply({ hope: 3 }); x.say('Wiese looks at you as if you had refused a gift. Your men look at you as if you had carried one.'); } else { x.apply({ hope: 4 }); x.say('"You did not sign," Wiese says. "The school is for men who signed." He does not say it unkindly.'); } } }
    ] });
  ev({ id: 'c9c_0a', day: 0, phase: 1, scene: 'barracks', time: '20:00',
    title: 'Kursk',
    text: 'The loudspeaker: the German offensive at Kursk has failed; Orel has fallen; the Red Army is advancing to the Dnieper. Some men in the barrack cheer, quietly. Most of them do not know what to feel.',
    choices: [
      { text: 'Think of the men who got out of Stalingrad. They were there.', effects: { conscience: 2, hope: -2 }, result: 'You wonder how many of them are dead now. You wonder whether you are the lucky one.' },
      { text: '"The sooner it ends, the sooner we go home."', effects: { hope: 6 }, result: 'It is the first time you have said it aloud. Several men nod.' }
    ] });

  // ───────────────────────── Day 1 · 4 September ─────────────────────────
  ev({ id: 'c9c_1m', day: 1, phase: 0, scene: 'office', time: '10:00',
    title: 'The School',
    cond: s => signed(s) && !s.flags.declinedSchool,
    text: 'The Antifa school: lectures on history, economics, the crimes of the Nazi state, given by German communists who fled in 1933 and prisoners who have "seen the light". Some of what they say is propaganda. Some of it you saw with your own eyes.',
    choices: [
      { text: 'Study hard.', effects: { hope: 6, food: 10, conscience: 3 }, set: { antifaStudent: true }, rel: { wiese: 6 }, result: 'Better food, a bed, books. You read about things you never knew about your own country. Some nights you cannot sleep for it.' },
      { text: 'Sit at the back and say nothing.', effects: { hope: 2, food: 6 }, result: 'You learn to nod at the right moments. The instructors notice, and do not mind. Nodding is a beginning.' }
    ] });
  ev({ id: 'c9c_1m_alt', day: 1, phase: 0, scene: 'train', time: '06:00',
    title: 'East',
    text: 'The train goes east for three weeks: past Moscow, across the Volga at Kazan, into country where the birch forests do not end. Fifty men to a car. At every stop the dead are handed out.',
    choices: [
      { text: 'Keep your men alive: water, turns at the window, nobody sits alone.', effects: { hope: 4, health: -4 }, train: { leadership: 1 }, squad: { all: { loyalty: 6 } }, result: 'It is harder than anything at Beketovka, because it is slower. Everyone in your group arrives.' },
      { text: 'Look out of the window and memorise the way.', effects: { hope: 3 }, outcome: (s, x) => { s.flags.knowsRoute = true; x.say('Kazan, the Volga, the Kama. You count the days, the rivers, the turns. If you ever walk back, you will know which way.'); } }
    ] });
  ev({ id: 'c9c_1a', day: 1, phase: 1, scene: 'barracks', time: '19:00',
    title: 'Haller',
    text: 'A thin Austrian with a sunburnt face and pale eyes sits down beside you: Leopold Haller, a mountain guide from the Tyrol. "I have been out twice," he says quietly. "Once for nine days, once for three weeks. Next time I will not come back." He looks at you. "Two have a better chance than one."',
    choices: [
      { text: '"Tell me how."', set: { metHaller: true }, rel: { haller: 10 }, effects: { hope: 6 },
        outcome: (s, x) => { plan(s); x.say('He talks for an hour, very quietly: food, boots, a compass, the stars, the rivers. "And nobody," he says, "nobody must know. Half the men in here would sell us for a loaf of bread."'); } },
      { text: '"You are mad."', set: { metHaller: true }, rel: { haller: -4 }, result: '"Probably," he says, and smiles. "Think about it. I will ask again in spring."' }
    ] });

  // ───────────────────────── Day 2 · 1 October: Yelabuga ─────────────────────────
  ev({ id: 'c9c_2m', day: 2, phase: 0, scene: 'powcamp', time: '10:00',
    title: 'Camp 97',
    text: s => `Camp 97 at Yelabuga: an old monastery on a hill above the Kama, its church full of bunks${signed(s) && !s.flags.declinedSchool ? ', and you arrive as an Antifa activist, sent to teach the others' : ''}. The prisoners work in the forests above the river, cutting timber for the Soviet war effort. Winter here is eight months long.`,
    choices: [
      { text: 'Take the bunk nearest the stove.', effects: { warmth: 10, conscience: -2 }, shelter: 1, result: 'You push and take it. Somebody else sleeps by the door.' },
      { text: 'Keep your group together.', effects: { hope: 5 }, squad: { all: { loyalty: 4 } }, result: 'Back to back in the cold church, under the painted saints.' }
    ] });
  ev({ id: 'c9c_2a', day: 2, phase: 1, scene: 'barracks', time: '18:00',
    title: 'The Activist',
    cond: s => signed(s) && !s.flags.declinedSchool,
    text: 'As an Antifa activist you are expected to hold reading evenings and to report "fascist elements" to the camp commissar. Your barrack is full of officers and NCOs who think you a traitor.',
    choices: [
      { text: 'Hold the readings. Report nobody.', effects: { hope: 4, conscience: 3 }, result: 'Twelve men come the first week, twenty the second. You never give the commissar a single name, and he never quite asks.' },
      { text: 'Report the die-hards, for extra rations.', effects: { food: 15, conscience: -8, comrades: -10 }, outcome: (s, x) => { plan(s).risk = clamp(plan(s).risk + 15, 0, 100); x.say('Three names. Three men sent to the punishment camp. You eat better, and sleep worse, and the barrack goes silent when you come in.'); } }
    ] });
  ev({ id: 'c9c_2a_alt', day: 2, phase: 1, scene: 'barracks', time: '18:00',
    title: 'The Brigade',
    text: 'The work brigades are formed again. You are known now: men from Beketovka and Krasnogorsk ask to be in your brigade.',
    choices: [
      { text: 'Take the ones nobody else wants.', effects: { conscience: 4, hope: 3 }, result: 'The old, the sick, the clumsy. Your norm will be hard to meet. Your brigade will be loyal.' },
      { text: 'Take the strongest.', effects: { food: 8 }, result: 'Strong men meet the norm. Strong men eat. That is the arithmetic of the camp.' }
    ] });

  // ───────────────────────── Day 3 · 7 November: Revolution Day ─────────────────────────
  ev({ id: 'c9c_3m', day: 3, phase: 0, scene: 'powcamp', time: '10:00',
    title: 'Revolution Day',
    text: 'The anniversary of the October Revolution: a day without work, a parade of guards, a speech in Russian, a double ration of bread. In the afternoon the guards get drunk.',
    choices: [
      { text: 'Save half your extra bread.', effects: { food: 4 }, outcome: (s, x) => { prep(x, s, 'food', 1, 3, 'Saved bread for the escape.'); x.say('You dry it on the stove and hide it in the lining of your coat. Your first day\'s food for the road.'); } },
      { text: 'Eat it all, and sleep.', effects: { food: 15, health: 4, hope: 3 }, result: 'For one day you are not hungry. You had forgotten what that was like.' },
      { text: 'Watch how the guards change at night when they are drunk.', show: s => !!s.flags.metHaller, rel: { haller: 4 }, outcome: (s, x) => { s.flags.watchedGuards = true; plan(s).risk += 3; x.say('Two in the tower, one on the gate, and at two in the morning, nobody at all. Haller nods when you tell him. "May Day," he says. "They drink more on May Day."'); } }
    ] });

  // ───────────────────────── Day 4 · 1 December: the forest ─────────────────────────
  ev({ id: 'c9c_4m', day: 4, phase: 0, scene: 'forest', time: '07:00',
    title: 'Logging',
    text: 'The logging camp in the forest above the Kama: minus fourteen, snow to the knees, a saw for two men and a norm of six cubic metres a day. The guards are few; the forest is endless. That is why they are not worried.',
    choices: [
      { text: 'Meet the norm, whatever it takes.', effects: { food: 10, health: -8 }, result: 'Six cubic metres. Your hands bleed inside your mittens. You eat.' },
      { text: 'Steal from the forest kitchen while the others cut.', train: { scrounging: 1 }, outcome: (s, x) => { if (x.roll(0.75)) { prep(x, s, 'food', 2, 6, 'Stole food from the logging-camp kitchen.'); x.say('A bag of millet, a lump of salt fat. Buried in the snow under a marked birch.'); } else { x.apply({ health: -10, hope: -6 }); plan(s).risk += 10; x.say('The cook catches you. A beating, and a week of half rations. And the guards will watch you now.'); } } },
      { text: 'Learn the forest: the paths, the river, where the sun goes down.', show: s => !!s.flags.metHaller, rel: { haller: 4 }, outcome: (s, x) => { s.flags.knowsForest = true; x.say('Haller shows you how to read a forest: moss, snow, the lean of the trees. "South-west," he says, "always south-west, to the Volga."'); } }
    ] });
  ev({ id: 'c9c_4a', day: 4, phase: 1, scene: 'forest', time: '15:00',
    title: 'A Dead Man\'s Boots',
    text: 'A man in the next brigade dies at the saw, of his heart, or the cold, or both. He has good leather boots, and felt overboots over them. The guards have not noticed yet.',
    choices: [
      { text: 'Take the boots.', effects: { conscience: -3, warmth: 8 }, outcome: (s, x) => { prep(x, s, 'boots', true, 4, 'Took a dead man\'s boots for the escape.'); x.say('You have to cut the laces. They fit. You do not look at his feet.'); } },
      { text: 'Leave them for him.', effects: { conscience: 3 }, result: 'The guards take them in the evening. A Soviet sergeant is wearing them the next week.' }
    ] });

  // ───────────────────────── Day 5 · 24 December ─────────────────────────
  ev({ id: 'c9c_5m', day: 5, phase: 0, scene: 'barracks', time: '20:00',
    title: 'Christmas on the Kama',
    text: 'Christmas Eve in the old church at Yelabuga. Somebody has carved a small crib out of firewood. The painted saints look down from the walls. Minus twenty-two outside.',
    choices: [
      { text: 'Sing with the others.', effects: { hope: 10, morale: 6 }, result: '"Silent Night", in German, under the Russian saints. The guards stand in the doorway and do not stop it. One of them takes off his cap.' },
      { text: 'Trade your Christmas tobacco for a compass.', req: s => SIM.has(s, 'tobacco') || SIM.has(s, 'cigarettes') || s.marks >= 10, reqText: 'You need tobacco, cigarettes or 10 RM.',
        outcome: (s, x) => { if (SIM.has(s, 'tobacco')) x.item('tobacco', -1); else if (SIM.has(s, 'cigarettes')) x.item('cigarettes', -1); else x.apply({ marks: -10 }); prep(x, s, 'compass', true, 8, 'Bought a compass for the escape.'); x.say('A Hungarian prisoner has a small brass compass sewn into a button. He wants to know nothing about why you want it.'); } }
    ] });
  ev({ id: 'c9c_5a', day: 5, phase: 1, scene: 'letter', time: '21:00',
    title: 'A Red Cross Card',
    text: s => `A miracle: a Red Cross card, the first post from home since 1942, twenty-five words. ${s.flags.married ? `From Liesel. ${s.flags.daughter || 'The baby'} is alive. She is waiting.` : 'From your mother. They are alive. They are waiting.'}`,
    choices: [
      { text: 'Read it until you know it by heart.', effects: { hope: 18, morale: 8 }, result: 'Twenty-five words. You read them by the stove until the stove goes out.' }
    ] });

  // ───────────────────────── Day 6 · 1 January 1944 ─────────────────────────
  ev({ id: 'c9c_6m', day: 6, phase: 0, scene: 'barracks', time: '08:00',
    title: 'Whispers',
    text: s => `A man in your barrack, a former clerk from Leipzig, asks you casually why you are saving bread. ${plan(s).risk > 15 ? 'He has seen more than he should have.' : 'He may just be hungry.'}`,
    choices: [
      { text: 'Give him some, and say it is for a sick friend.', effects: { conscience: 1 }, outcome: (s, x) => { const e = plan(s); e.food = Math.max(0, e.food - 1); e.risk = Math.max(0, e.risk - 6); x.say('He takes it and goes away. You have bought silence, for now.'); } },
      { text: 'Threaten him.', effects: { conscience: -3 }, outcome: (s, x) => { const e = plan(s); if (x.roll(0.5)) { e.risk = Math.max(0, e.risk - 4); x.say('He goes pale, and never speaks to you again.'); } else { e.risk += 15; x.say('He nods too quickly. That evening he spends a long time in the commissar\'s office.'); } } },
      { text: 'Laugh it off.', outcome: (s, x) => { plan(s).risk += 4; x.say('"Habit," you say. "From Stalingrad." He laughs too. You are not sure he believed you.'); } }
    ] });
  ev({ id: 'c9c_6a', day: 6, phase: 1, scene: 'office', time: '14:00',
    title: 'The Map',
    text: 'In the camp office, while you are carrying wood, you see a school atlas lying on a shelf: the Soviet Union, rivers, railways, towns.',
    choices: [
      { text: 'Tear out the page of the Volga and the Kama.', train: { scrounging: 1 }, outcome: (s, x) => { if (x.roll(0.7)) { prep(x, s, 'map', true, 8, 'Stole a map for the escape.'); x.say('One page, folded small, inside your boot. Your hands are shaking when you come out.'); } else { x.apply({ health: -12, hope: -8 }); plan(s).risk += 15; x.say('The clerk comes back too soon. Ten days in the punishment block.'); } } },
      { text: 'Memorise it instead.', effects: { hope: 2 }, outcome: (s, x) => { s.flags.knowsRoute = true; x.say('Kama, Volga, Kazan, Kuibyshev. You go over it every night until you can draw it with your eyes shut.'); } },
      { text: 'Leave it.', result: 'You carry the wood and go out. Some risks are not worth it.' }
    ] });

  // ───────────────────────── Day 7 · 22 January: minus thirty ─────────────────────────
  ev({ id: 'c9c_7m', day: 7, phase: 0, scene: 'forest', time: '07:00',
    title: 'Minus Thirty',
    text: 'Minus thirty in the forest. The breath freezes on your scarf. Men lose fingers, toes, ears. In the logging camp, three die in a week.',
    choices: [
      { text: 'Work in pairs, rub each other\'s faces, keep moving.', effects: { warmth: 6, hope: 3 }, squad: { all: { loyalty: 4 } }, result: 'Every ten minutes, a glance at your partner\'s nose and cheeks: white means frostbite. It works, mostly.' },
      { text: 'Refuse to work at minus thirty.', effects: { hope: 2, food: -12 }, outcome: (s, x) => { if (x.roll(0.5)) x.say('The guards are cold too. Work stops at noon, for everyone. Nobody admits you started it.'); else { x.apply({ health: -8 }); x.say('Three days in the cooler. You come out with frostbitten toes.'); } } }
    ] });
  ev({ id: 'c9c_7a', day: 7, phase: 1, scene: 'forest', time: '15:00',
    title: 'The Cache',
    cond: s => plan(s).food > 0,
    text: 'You check your food cache under the marked birch. It has been dug up. Wolves, or men?',
    choices: [
      { text: 'Start again. Save from every ration.', effects: { food: -10, hope: -4 }, outcome: (s, x) => { const e = plan(s); e.food = Math.max(0, e.food - 2) + 1; x.say('Two days of food gone. You begin again with the next ration.'); } },
      { text: 'Hide it in the barrack instead.', outcome: (s, x) => { plan(s).risk += 8; x.say('Inside the stove-pipe, behind a loose brick. Warmer. Easier to find.'); } }
    ] });

  // ───────────────────────── Day 8 · 15 February: the search ─────────────────────────
  ev({ id: 'c9c_8m', day: 8, phase: 0, scene: 'barracks', time: '05:00',
    title: 'Search',
    text: 'At five in the morning the guards come into the barrack with lamps and turn everything over: bunks, coats, stoves, boots. Somebody has talked. Or it is routine. You will never know which.',
    choices: [
      { text: 'Stand still and wait.', outcome: (s, x) => { if (search(s, x)) x.say('They find your hoard. The commissar does not ask what it was for; he knows. Ten days in the punishment block, and everything gone.'); else x.say('They turn over your bunk, feel your coat, and move on. You do not breathe until they have gone.'); } },
      { text: 'Get your things out of the barrack before they reach you.', train: { scrounging: 1 }, outcome: (s, x) => { if (search(s, x, -0.15)) x.say('You are seen going to the latrine with a bundle. They search it there.'); else x.say('Out to the latrine with a bundle under your coat, back without it. Nobody notices.'); } }
    ] });
  ev({ id: 'c9c_8a', day: 8, phase: 1, scene: 'barracks', time: '19:00',
    title: 'Haller Again',
    cond: s => !!s.flags.metHaller && !plan(s).partner,
    text: 'Haller sits down beside you. "Spring," he says. "May Day, when the guards are drunk and the ice is gone. Are you coming?"',
    choices: [
      { text: '"Yes."', rel: { haller: 10 }, effects: { hope: 8 }, outcome: (s, x) => { prep(x, s, 'partner', 'haller', 6, 'Agreed to escape with Haller.'); x.say('He shakes your hand under the table. "South-west," he says. "Always south-west."'); } },
      { text: '"Not yet. I will tell you."', result: 'He nods. "Do not wait too long. Men who wait here die here."' }
    ] });

  // ───────────────────────── Day 9 · 15 March ─────────────────────────
  ev({ id: 'c9c_9m', day: 9, phase: 0, scene: 'river', time: '10:00',
    title: 'The Ice',
    text: 'The ice on the Kama begins to groan and crack. The guards say that when it goes, the river will be a kilometre wide.',
    choices: [
      { text: 'Choose a partner from your own men.', show: s => men(s).length > 0 && !plan(s).partner, assign: true, assignPrompt: 'Who goes with you?',
        outcome: (s, x) => { const m = x.man; if (SIM.hasTrait(m, 'informer')) { plan(s).risk += 30; x.say(`${m.name} agrees at once. Too quickly, you think later.`); } else { prep(x, s, 'partner', m.id, 4, `Agreed to escape with ${m.name}.`); x.squadMod(m.id, { loyalty: 10 }); x.say(`${m.name} listens, and is silent for a long time, and then says, "Yes."`); } } },
      { text: 'Go alone, if you go at all.', effects: { hope: -2 }, result: 'One man is harder to find, and has nobody to carry him when he falls.' },
      { text: 'Watch the river and think of home.', effects: { hope: 4 }, result: 'The ice moves, slowly, towards the Volga, towards the sea. Everything is going somewhere except you.' }
    ] });
  ev({ id: 'c9c_9a', day: 9, phase: 1, scene: 'barracks',
    title: 'Food for the Road',
    text: 'Two months left. Every ration you save is a day on the road.',
    choices: [
      { text: 'Save half of every ration.', effects: { food: -15, health: -4 }, outcome: (s, x) => { prep(x, s, 'food', 2, 4, 'Saved rations for the escape.'); x.say('You are hungrier than you have been since Beketovka. The bag in the stove-pipe grows.'); } },
      { text: 'Trade for dried fish with the Tatar women at the work site.', req: s => s.marks >= 5 || Object.keys(s.items || {}).some(k => SIM.ITEMS[k] && SIM.ITEMS[k].value), reqText: 'You have nothing left to trade.',
        outcome: (s, x) => { const k = Object.keys(s.items || {}).find(k => SIM.ITEMS[k] && SIM.ITEMS[k].value); if (k) x.item(k, -1); else x.apply({ marks: -5 }); prep(x, s, 'food', 3, 6, 'Traded for food for the escape.'); x.say('Dried fish, hard as wood. It will keep for months.'); } },
      { text: 'Eat. You need your strength now.', effects: { food: 15, health: 6 }, result: 'Strength is food too, Haller says. He is right.' }
    ] });

  // ───────────────────────── Day 10 · 1 April ─────────────────────────
  ev({ id: 'c9c_10m', day: 10, phase: 0, scene: 'river', time: '09:00',
    title: 'The River Opens',
    text: 'The Kama breaks up in a single night with a roar like artillery. In the morning the river is a brown flood full of ice and trees. In a month it will be calm.',
    choices: [
      { text: 'Plan the route along the river, on foot, by night.', effects: { hope: 4 }, outcome: (s, x) => { s.flags.routeRiver = true; x.say('Along the bank, hidden in the forest, west to the Volga. Eight hundred kilometres to Kuibyshev. Then what? You will think about then when you get there.'); } },
      { text: 'Plan to steal a boat.', train: { scrounging: 1 }, outcome: (s, x) => { s.flags.routeBoat = true; plan(s).risk += 5; x.say('There are fishing boats at the village below the camp. A boat on the flood could go a hundred kilometres in a night. Or turn over.'); } }
    ] });
  ev({ id: 'c9c_10a', day: 10, phase: 1, scene: 'office', time: '15:00',
    title: 'The Commissar',
    text: s => `The camp commissar sends for you. "I hear," he says in careful German, "that some prisoners are dreaming of going home early." He waits. ${signed(s) ? '"You are an Antifa man. You would tell me."' : '"Perhaps you know who."'}`,
    choices: [
      { text: '"I have heard nothing."', state: { key: 'escape', v: 'lie', t: 'To the commissar: you have heard nothing about an escape.' },
        outcome: (s, x) => { if (x.roll(clamp(plan(s).risk / 120, 0, 0.6))) { x.apply({ hope: -6 }); plan(s).risk += 10; x.say('"Of course," he says, and writes something. You know that he knows.'); } else x.say('He looks at you for a long time, then lets you go.'); } },
      { text: 'Give him a name: one of the die-hards who boasts of escaping.', effects: { conscience: -6, food: 10 }, outcome: (s, x) => { plan(s).risk = Math.max(0, plan(s).risk - 15); x.say('A man who was never going anywhere goes to the punishment camp. The commissar is satisfied. For now, no one is looking at you.'); } },
      { text: 'Give him Haller.', show: s => s.flags.metHaller && plan(s).partner === 'haller', effects: { conscience: -14, food: 15, hope: -8 }, rel: { haller: -80 },
        outcome: (s, x) => { plan(s).partner = null; plan(s).risk = 0; s.flags.betrayedHaller = true; x.say('They take Haller that night. You will not see him again. You will never be able to look at a mountain again, either.'); } }
    ] });

  // ───────────────────────── Day 11 · 15 April ─────────────────────────
  ev({ id: 'c9c_11m', day: 11, phase: 0, scene: 'forest', time: '08:00',
    title: 'Spring',
    text: 'Spring in the forest: snowdrops in the clearings, birch sap running, the first warm sun. The logging brigade works in shirtsleeves. Men who survived the winter begin, cautiously, to believe they will survive.',
    choices: [
      { text: 'Collect birch sap and wild garlic for the road.', effects: { health: 4 }, outcome: (s, x) => { prep(x, s, 'food', 1, 2, 'Gathered food in the forest for the escape.'); x.say('Bitter green garlic, sweet sap. The old Russians in the village eat it every spring against scurvy.'); } },
      { text: 'Rest in the sun at midday.', effects: { hope: 6, health: 4 }, result: 'Ten minutes with your face turned up to the sun, and the guard pretending not to see.' }
    ] });
  ev({ id: 'c9c_11a', day: 11, phase: 1, scene: 'barracks', time: '20:00',
    title: 'The Antifa Man',
    text: 'An Antifa activist from another barrack, a young man from Bremen, takes you aside. "I know what you are planning," he says. "I won\'t report it. But listen: everyone who has tried from here has been brought back, or found in the forest in the summer. The war will end. Wait."',
    choices: [
      { text: '"Thank you. I will think about it."', effects: { hope: 3 }, result: '"Think hard," he says, and goes.' },
      { text: '"I cannot wait any longer."', effects: { hope: 2 }, result: 'He nods sadly. "Then go with God," he says, which is a strange thing for an Antifa man to say.' }
    ] });

  // ───────────────────────── Day 12 · 30 April ─────────────────────────
  ev({ id: 'c9c_12m', day: 12, phase: 0, scene: 'powcamp', time: '18:00',
    title: 'The Last Evening',
    text: s => {
      const e = plan(s), ok = k => e[k] ? 'yes' : 'no';
      return `The evening before May Day. The guards have already started drinking. If you are going, it is tomorrow night.\n\nWhat you have: food for ${e.food} days; a map: ${ok('map')}; a compass: ${ok('compass')}; good boots: ${ok('boots')}; a partner: ${e.partner ? (e.partner === 'haller' ? 'Haller' : (SIM.man(s, e.partner) || {}).name || 'yes') : 'none'}.${s.flags.escapeFound ? '\n\nThe guards found your hoard once already. They will be watching.' : ''}`;
    },
    choices: [
      { text: 'Get everything ready. You are going.', set: { goEscape: true }, effects: { hope: 6 }, result: 'Bread sewn into your coat, the map in your boot, the compass on a string round your neck. You lie awake all night.' },
      { text: 'You are staying. The war will end.', set: { goEscape: false }, effects: { hope: 2 }, result: 'You give your saved bread to the boy by the door. He looks at you as if you had given him a year of his life. Perhaps you have.' }
    ] });
  ev({ id: 'c9c_12a', day: 12, phase: 1, scene: 'barracks', time: '22:00',
    title: 'May Eve',
    text: 'The barrack is noisy with talk of the May Day ration. Outside, the guards are singing.',
    choices: [
      { text: 'Sleep, if you can.', effects: { health: 4 }, result: 'You sleep two hours, and dream of the Elbe.' },
      { text: 'Write a letter you cannot send, and leave it under your bunk.', effects: { hope: 3, conscience: 1 }, result: s => `To ${s.flags.married ? 'Liesel' : 'your mother'}. If you do not come back, someone may one day find it.` }
    ] });

  // ───────────────────────── Day 13 · 1 May 1944 ─────────────────────────
  ev({ id: 'c9c_13m', day: 13, phase: 0, scene: 'river', time: '01:30',
    title: 'May Day',
    text: s => s.flags.goEscape
      ? `Half past one in the morning. The guard on the gate is asleep over his rifle; the tower is dark. ${plan(s).partner ? 'Your partner is beside you in the dark, breathing hard.' : 'You are alone.'} Under the wire, through the gap Haller found in the autumn, down the hill to the river.`
      : 'May Day. A day without work, a parade, a speech. In the evening there is a rumour that two men from another barrack are missing. Nobody knows their names.',
    choices: [
      { text: 'Go.', show: s => !!s.flags.goEscape,
        outcome: (s, x) => {
          s.flags.escaped9 = 'tried';
          const p = SIM.escapeChance(s) + (s.flags.watchedGuards ? 0.04 : 0) + (s.flags.knowsRoute ? 0.03 : 0) + (s.flags.knowsForest ? 0.03 : 0) + (s.flags.routeBoat ? 0.03 : 0);
          if (x.roll(p)) { s.flags.escaped9 = 'out'; x.say('Under the wire, down the hill, into the forest. Nobody shouts. At dawn you are eighteen kilometres away, lying in a thicket by the river, listening for dogs. There are none. You are free, two thousand kilometres from the nearest German.'); return; }
          if (x.roll(0.22)) { x.apply({ health: -300 }); s.deathCause = 'Shot while escaping from Camp 97 at Yelabuga, May 1944.'; return; }
          s.flags.escaped9 = 'caught';
          x.apply({ health: -20, hope: -20, food: -15 });
          x.say(`${x.roll(0.5) ? 'Dogs, on the second day. They find you in a gully above the river.' : 'A Tatar shepherd sees you crossing a field on the fourth day and runs to the village.'} You are brought back to the camp tied to a cart, and shown to the other prisoners at the evening count.`);
        } },
      { text: 'Stay in your bunk.', show: s => !!s.flags.goEscape, effects: { hope: -6 }, result: 'You lie in the dark with your coat full of bread and do not move. In the morning you eat the bread.' },
      { text: 'Watch the parade.', show: s => !s.flags.goEscape, effects: { hope: 4 }, result: 'Red flags, a band, a speech about the coming victory. The guards are in a good mood. Some of the prisoners are too.' }
    ] });

  SIM.EVENTS.push(...E);
})();
