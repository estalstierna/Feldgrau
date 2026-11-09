// Chapter VI: "Leave" — fourteen days at home, 20 – 26 April 1942.
// Army and Waffen-SS players share the chapter; the uniform changes how home receives them.
// Days 4–6, random events and endings live in ch6_more.js.
window.SIM = window.SIM || {};

(function () {
  const ss = s => !!s.flags.joinedSS;
  const town = s => SIM.townName(s.char.hometown);
  const bombed = s => ['hamburg', 'berlin'].includes(s.char.hometown);
  const fam = s => s.char.family;
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const fallen = s => (s.losses || []).filter(l => l.status === 'killed');
  const knows = s => !!(s.flags.starckWarned || s.flags.hidJews || s.flags.savedBialystok || s.flags.evidence || SIM.has(s, 'film') || s.seen.c4_3a);
  const rank = s => SIM.rankTitle(s);

  const DAYS = [
    { date: 'Monday, 20 April 1942',    short: 'Mon 20 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Tuesday, 21 April 1942',   short: 'Tue 21 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Wednesday, 22 April 1942', short: 'Wed 22 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Thursday, 23 April 1942',  short: 'Thu 23 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Friday, 24 April 1942',    short: 'Fri 24 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Saturday, 25 April 1942',  short: 'Sat 25 Apr', place: s => 'home_' + s.char.hometown },
    { date: 'Sunday, 26 April 1942',    short: 'Sun 26 Apr', place: s => 'home_' + s.char.hometown }
  ];
  const PLACES = {
    home_berlin:  { name: 'Berlin-Wedding',   x: 205, y: 105 },
    home_hamburg: { name: 'Hamburg-Altona',   x: 140, y: 72 },
    home_munich:  { name: 'Munich',           x: 165, y: 222 },
    home_breslau: { name: 'Breslau',          x: 255, y: 158 },
    home_stolp:   { name: 'Stolp, Pomerania', x: 236, y: 44 }
  };

  SIM.CHAPTERS.push({
    id: 'home', num: 'VI', title: 'Leave', range: '20 – 26 April 1942', year: 1942, start: [1942, 4],
    days: DAYS, places: PLACES, map: 'germany',
    finalEvent: 'c6_6n',
    commander: 'your company commander',
    hospital: 'the town hospital',
    deathDefault: 'Killed in an air raid at home, April 1942.',
    kiaText: s => `${s.deathCause || 'Killed in an air raid at home, April 1942.'}\n\nYou survived Poland, France and the winter before Moscow, and you died in a cellar in ${town(s)}, on leave, in your own street.\n\nIn 1942 British bombers killed more than four thousand people in German cities. By 1945 the number would be over three hundred thousand.`,
    casualties: '',
    foodDrain: -3,
    kitchenNote: 'Your mother cooks with what the ration cards allow, and gives you her portion when she thinks you are not looking.',
    promoDate: '1 May 1942',
    maxRank: s => s.rank >= 4 ? 4 : s.rank + 1,
    meritBar: 99,
    routineReason: 'Time in service.',
    meritReason: '',
    interludeDate: 'Winter 1941/42',
    interludeTitle: 'January – April 1942',
    blackMarks: s => {
      const b = [];
      if (s.flags.gestapoFile) b.push('Questioned by the Gestapo while on leave.');
      return b;
    },
    awards: () => {},
    ending: s => SIM.ch6Ending(s),
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, 82);
      s.stats.morale = Math.max(s.stats.morale, 55);
      s.stats.food = 70;
      s.stats.warmth = 70;
      // Months at the front, far from anyone who reports: suspicion fades.
      s.stats.suspicion = Math.max(0, s.stats.suspicion - 18);
      s.marks += 40; // pay saved over the winter
      s.flags.homeLeave = true;
      if (ss(s)) {
        SIM.makeSSSquad(s);
        if (s.rank < 4) { s.rank = 4; s.rankHistory.push({ rank: 4, date: 'February 1942' }); }
      }
    },
    onStart: s => { s.flags.homeLeave = true; },
    interlude: s => interludeItems(s),
    interludeEvents: ['i5_army', 'i5_ss']
  });

  function interludeItems(s) {
    const out = [];
    if (ss(s)) {
      out.push({ year: 'January', text: `The transfer papers came through in the first week of January. You left the company on the Ruza on a supply sledge. ${has(s, 'hartmann') ? 'Hartmann did not come out of the dugout to say goodbye.' : 'Nobody came out of the dugout to say goodbye.'} ${SIM.squadMen({ squad: s.oldSquad }).length ? 'Brenner shook your hand without a word.' : ''}` });
      out.push({ year: 'February', text: `Six weeks at an SS training barracks in Bohemia, behind the lines: ideological instruction every morning, weapons drill every afternoon. The instructors talked about "the Jewish-Bolshevik world enemy" the way the Army instructors talked about the weather.\n\nStarck kept his word. You were given the rank of ${SIM.SS_RANKS[Math.max(4, s.rank)]} and a section of your own: six men, none of whom you knew.` });
    } else {
      out.push({ year: 'January', text: 'The winter line held, just. The company dug into the frozen earth west of the Ruza and stayed there through January and February, at forty below. The Soviets attacked again and again. Hitler\'s order to stand fast was obeyed, and men died obeying it, and the front did not break.' });
      out.push({ year: 'March', text: `In March the thaw came, and with it the mud again. Replacements arrived: boys of nineteen with three months' training. ${SIM.squadMen(s).length} men left in your squad. In April your name came up on the leave roster: fourteen days at home, the first since Christmas 1939.` });
    }
    out.push({ year: 'Home', text: 'The news in the letters from home: rationing cut again in April. Bread, meat and fat. The British bombed Lübeck in March and burned the old town. Everyone says it is only the beginning.' });
    return out;
  }

  SIM.INTERLUDE_EVENTS.i5_army = {
    id: 'i5_army', scene: 'camp', cond: s => !ss(s),
    title: 'Before the Train',
    text: s => `The night before your leave, your squad sits round the stove in the dugout. Every man has something to send home with you: a letter, a photograph, a request.\n\n${fallen(s).length ? `And there are the families of the men who will not go home: ${fallen(s).slice(-2).map(l => l.name).join(' and ')}.` : ''}`,
    choices: [
      { text: 'Take everyone\'s letters. Promise to post them in Germany, past the censor.', effects: { suspicion: 4 }, squad: { all: { loyalty: 6 } },
        result: 'A bundle of letters in your pack, uncensored, which is strictly forbidden. The men watch you put them away as if you were carrying their souls.' },
      { text: 'Promise to visit the family of a fallen comrade.', show: s => fallen(s).length > 0, set: { promisedVisit: true }, squad: { all: { loyalty: 4 } },
        outcome: (s, x) => { const l = fallen(s).slice(-1)[0]; s.flags.visitFor = l.name; x.say(`${l.name}'s parents live two hours by train from your home town. You promise to go. The men nod. Someone has to tell them how it really was.`); } },
      { text: 'Just sleep. Fourteen days. You can hardly believe it.', effects: { health: 6, morale: 6 },
        result: 'You sleep for nine hours, which you have not done since 1939.' }
    ]
  };

  SIM.INTERLUDE_EVENTS.i5_ss = {
    id: 'i5_ss', scene: 'camp', cond: s => ss(s),
    title: 'Your New Section',
    text: 'Six men in black collar patches stand in a row in the barracks yard in Bohemia: Erich Voss, a veteran of Poland and France; Theo Wendt, a joker from Hamburg; Anton Mayr, an ex-policeman from Tyrol; Karl-Heinz Brück, a Ruhr miner; Paul Nowak, an ethnic German from Łódź; and Jürgen Haas, nineteen, straight from the Hitler Youth.\n\nThey are looking at you the way your old squad looked at Brandt in 1939. Starck stands at the edge of the yard, watching. You must name a deputy.',
    choices: [
      { text: 'Choose your deputy.', assign: true, assignPrompt: 'Who will be your deputy?',
        outcome: (s, x) => {
          const m = x.man;
          s.flags.deputy = m.id;
          x.squadMod(m.id, { loyalty: 15, morale: 8 });
          x.say({
            voss: 'Voss, of course. He has been doing the job anyway. Starck nods approvingly. Voss says, "Jawohl, Unterscharführer," and from that moment the section is run the way Starck would run it.',
            wendt: 'Wendt laughs, then stops when he sees you mean it. Voss stares at you. Starck makes a note.',
            mayr: 'Mayr, the oldest, the one who has seen the most. He looks at you for a long time. "You want someone who will tell you the truth," he says. "All right."',
            brueck: 'Brück. You do not know yet who he reports to. Starck does, and smiles.',
            nowak: 'Nowak goes white. The others exchange looks: a Polish-speaking boy as deputy. Starck raises his eyebrows and says nothing, which is worse.',
            haas: 'Haas, nineteen, glowing with pride. Voss looks at you with contempt for the rest of the day.'
          }[m.id] || `${m.name} it is.`);
          if (m.id !== 'voss') x.squadMod('voss', { loyalty: -12 });
          if (m.id === 'nowak') x.rel('starck', -5);
          x.log(`Chose ${m.name} as deputy in the SS section.`);
        } }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 5 }, o));

  // ───────────────────────── Day 0 · Monday 20 April ─────────────────────────
  ev({ id: 'c6_0m', day: 0, phase: 0, scene: 'station', time: '10:40',
    title: 'Homecoming',
    text: s => `${town(s)}. The station is hung with flags for the Führer's birthday: fifty-three today. The train from the East is twelve hours late and smells of lice and carbolic. You step down onto the platform in your ${ss(s) ? 'new field-grey uniform with the black collar patches' : 'patched field-grey'}.

Your mother is there. She has got thinner. She sees you, and her face does something you have never seen it do before. Then she sees ${ss(s) ? 'the black collar patches' : 'your face'}, and it does something else.`,
    choices: [
      { text: 'Hold her. Say nothing.', effects: { morale: 12 }, rel: { mother: 10 },
        result: 'She holds on to you on the platform for a long time while people walk round you. She smells of soap and the kitchen. You have forgotten that smell existed.' },
      { text: '"I\'m home, Mother. It\'s all right."', effects: { morale: 8 }, rel: { mother: 6 },
        outcome: (s, x) => x.say(ss(s) ? '"Those patches," she says quietly, touching the collar. "Why, my boy?" You give her the answer you have practised. She nods, as if she believed it.' : '"Look at you," she says, and touches your face. "Look at you." She does not ask about the war. She will not ask all week.') }
    ] });

  ev({ id: 'c6_0a', day: 0, phase: 1, scene: 'kitchen', time: '18:00',
    title: 'The Kitchen Table',
    text: s => {
      const f = {
        spd: ss(s) ? 'Your father looks at your collar patches for a long time across the table. Then he puts down his fork and goes out into the yard. You hear him chopping wood until it is dark.' : 'Your father, grey now, shakes your hand across the table. He does not ask about the war. Later, when your mother is washing up, he asks very quietly: "What have you seen?"',
        catholic: ss(s) ? 'Your father says grace, as always. Then he looks at your collar and says: "The SS. They take you out of the Church, don\'t they?" Your mother starts to cry.' : 'Your father says grace and thanks God for bringing you home. Your mother has kept a candle burning for you at Saint Joseph\'s every Sunday since 1939.',
        party: ss(s) ? 'Your father stands up when you come in and salutes the black collar patches. He has told the whole Ortsgruppe. He wants to take you to the Party office tomorrow to show you to everyone.' : 'Your father wants to hear about the battles. Moscow, the winter, the Bolsheviks. He has a map on the kitchen wall with pins in it.',
        none: ss(s) ? 'Your father looks at your collar, shrugs, and says: "Better boots, I suppose." Your sister, in black for the Lehmann boy, does not look at you at all.' : 'Your sister is at the table in black: the Lehmann boy was killed on Crete. Your father talks about the ration cards. Nobody talks about the war.'
      }[fam(s)];
      return `Potatoes, cabbage, a little meat that your mother has saved coupons for since March. The kitchen is exactly as you left it, and smaller.\n\n${f}`;
    },
    choices: [
      { text: 'Tell them about the front: the cold, the dead, all of it.', effects: { conscience: 4, morale: -4 }, rel: { father: 8, mother: -2 },
        outcome: (s, x) => x.say(fam(s) === 'party' ? 'Your father keeps interrupting to explain why it was necessary. After a while you stop talking.' : 'You tell them about the frost, the boots, the men frozen at their posts. You do not tell them about the villages. Your mother leaves the table halfway through. Your father listens to every word.') },
      { text: 'Tell them about the victories. It is what they want.', effects: { morale: 2 }, rel: { mother: 6 },
        outcome: (s, x) => { if (fam(s) === 'party') x.rel('father', 10); x.say('The Bug. Smolensk. The tanks you saw burning. You leave out everything that happened after December. Your mother looks relieved. You feel like a liar, because you are one.'); } },
      { text: 'Say nothing. Just eat.', effects: { food: 15 }, rel: { mother: 3 },
        result: 'You eat three plates of potatoes. Nobody makes you talk. That, it turns out, is the greatest kindness they can offer you.' }
    ] });

  ev({ id: 'c6_0n', day: 0, phase: 2, scene: 'kitchen', time: '02:00',
    title: 'A Soft Bed',
    text: s => `Your old bed. Clean sheets. A pillow. You cannot sleep. The silence is too loud: no guns, no wind, no men breathing in the dark around you. At two in the morning you are sitting on the floor with your back to the wall, the way you sat in the dugout.${s.flags.shotCommissar || s.flags.shotOwnMan || s.flags.firingSquad ? '\n\nWhen you do sleep, you dream. You wake up shouting.' : ''}`,
    choices: [
      { text: 'Go and sit in the kitchen with a cup of ersatz coffee.', effects: { morale: 4 },
        outcome: (s, x) => { x.rel('mother', 8); x.say('Your mother is already there, in her dressing gown, as if she knew. She pours you a cup without a word. You sit together until it gets light.'); } },
      { text: 'Walk the dark streets until dawn.', effects: { health: -3, morale: 2 },
        outcome: (s, x) => x.say(`The blackout makes ${town(s)} a city of shadows. A warden shouts at you about a cigarette. You walk past your old school, the swimming baths, the cinema. Everything is the same. Nothing is.`) },
      { text: 'Lie on the floor. It is more comfortable.', effects: { health: 4 },
        result: 'You sleep on the bedroom floor in your greatcoat. In the morning your mother finds you there and does not say anything about it.' }
    ] });

  // ───────────────────────── Day 1 · Tuesday 21 April ─────────────────────────
  ev({ id: 'c6_1m', day: 1, phase: 0, scene: 'street',
    title: 'The Empty Flat',
    text: s => `On the second floor of your building there used to live Dr. Rosenthal, the family doctor who set your broken arm when you were nine, and his wife. The door of their flat now has a new nameplate: a Party official's family moved in in January.

Frau Kuhlmann from the ground floor tells you on the stairs, in a whisper that is half excitement: the Rosenthals were "evacuated to the East" in December, with the other Jews of the district. Two suitcases each. She has their piano now. She bought it cheap.${knows(s) ? '\n\nYou have been in the East. You know what "the East" means. You know about Białystok, and the pits outside the towns. You stand on the stairs and cannot move.' : ''}`,
    choices: [
      { text: '"Do you know where in the East?"', effects: { suspicion: 4, conscience: 3 },
        outcome: (s, x) => x.say(`Frau Kuhlmann looks at you oddly. "${knows(s) ? 'Riga, they said. Or Minsk.' : 'Somewhere in Poland, they said.'} Why? They're better off with their own kind." She goes back into her flat, and you hear the piano lid being closed.`) },
      { text: 'Tell her what you saw in the East.', show: knows, effects: { suspicion: 15, conscience: 8 }, set: { toldNeighbour: true },
        result: 'You tell her: quietly, on the stairs, about Białystok. Frau Kuhlmann goes white, then red. "That is enemy propaganda," she says. "I will pretend you did not say it." She will not pretend for long.',
        log: 'Told a neighbour what I saw in the East.' },
      { text: 'Say nothing, and go up to your flat.', effects: { conscience: -3 },
        result: 'You climb the stairs past the new nameplate. Behind the door someone is laughing, and a radio is playing a march.' },
      { text: 'Ask if the Rosenthals left anything behind.', effects: { conscience: 2 },
        result: 'Frau Kuhlmann shrugs and gives you a box from her cellar: books in German and Hebrew, a stethoscope, a photograph of the doctor and his wife on a beach in 1925. You take it upstairs and do not know what to do with it.' }
    ] });

  ev({ id: 'c6_1a', day: 1, phase: 1, scene: 'street', cond: s => s.flags.sweetheart,
    title: 'Liesel',
    text: s => `She is waiting outside the post office at five, in a blue coat you do not know. She has said yes, in a letter. Now you are standing in front of each other in the street, and neither of you knows what to do with their hands.

"Marry me," you say. "This week."${ss(s) ? '\n\nBut you know the rule: an SS man may not marry without the approval of the SS Race and Settlement Office. Family trees back to 1800, for both of you. Medical examinations. Photographs. It takes months.' : '\n\nIn wartime it can be done quickly: a "war wedding" at the registry office, with special permission from your commander, which you have in your pocket.'}`,
    choices: [
      { text: '"Saturday. The registry office. I have the papers."', show: s => !ss(s), set: { weddingPlanned: true }, rel: { liesel: 20 }, effects: { morale: 15 },
        result: 'She laughs and cries at the same time. "Saturday," she says. "My mother will kill me. Saturday."',
        log: 'Asked Liesel to marry me on Saturday.' },
      { text: 'Submit the papers to the SS Race Office and hope.', show: ss, set: { rushaPapers: true }, rel: { liesel: 6 }, effects: { morale: 4 },
        result: 'She looks at the forms: grandparents, great-grandparents, a questionnaire about her hereditary health, photographs in a bathing costume. "They want to know if I am good enough to breed," she says flatly. She signs anyway.' },
      { text: 'Marry her anyway, without the SS. Damn the rules.', show: ss, set: { weddingPlanned: true, defiedRusha: true }, rel: { liesel: 22, starck: -10 }, effects: { morale: 12, suspicion: 8 },
        result: 'An SS man who marries without permission can be expelled from the SS. You know it. You do not care, this week. "Saturday," you say. Liesel holds on to you as if she had heard what it costs.',
        log: 'Decided to marry Liesel without the SS\'s permission.' },
      { text: '"After the war. When it\'s over."', rel: { liesel: -8 }, effects: { morale: -4 },
        result: '"When will that be?" she asks. You do not answer. She walks you home anyway, holding your arm.' }
    ] });
  ev({ id: 'c6_1a_alt', day: 1, phase: 1, scene: 'street',
    title: 'Kurt',
    text: s => `In the bar on the corner you meet Kurt Bauer, who sat next to you at school. He came home from the Ukraine in January without his left leg. He is drinking beer at three in the afternoon, which he can afford because nobody lets him pay.

"So," he says. "${ss(s) ? 'The black collar patches. Well, well. Better rations, I hear.' : 'The Moscow front. How was the weather?'}"`,
    choices: [
      { text: 'Drink with him until closing time.', effects: { morale: 8, health: -3, marks: -4 },
        result: 'You talk about school, girls, football, anything but the war, and then only about the war. At midnight he says, "We\'re the lucky ones, you know that?" and you are not sure he is joking.' },
      { text: 'Ask him what happened in the Ukraine.', effects: { conscience: 3, morale: -4 },
        result: 'He tells you about a ravine outside Kiev in September, and the shooting that went on for two days. He was guarding the road. "Thirty thousand," he says. "Babi Yar, the place was called." He orders another beer.' }
    ] });

  ev({ id: 'c6_1n', day: 1, phase: 2, scene: 'cellar', time: '01:20',
    title: 'Alarm',
    text: s => `At twenty past one the sirens. Your mother is already up, with the suitcase she keeps packed by the door. Down into the cellar with the whole building: Frau Kuhlmann in curlers, the Party official from the Rosenthals' flat and his children, the old couple from the top floor.

${bombed(s) ? 'Then you hear them: the drone, the flak, and the bombs, closer and closer. The cellar shakes. Dust falls from the ceiling.' : 'Bombers drone overhead for half an hour, going somewhere else. Nobody knows where. In the morning the radio will say: Rostock.'}

In the doorway stands a girl of about seventeen with a blue-and-white badge on her coat that says OST: a forced labourer from the Ukraine, who works at the bakery. Foreign workers are not allowed in the shelter. The air-raid warden is pushing her out.`,
    choices: [
      { text: 'Pull her inside. "She stays."', effects: { conscience: 8, suspicion: 6 },
        outcome: (s, x) => { x.say(`You say it in your front voice, the one that makes recruits jump. The warden looks at your ${ss(s) ? 'black collar patches and decides not to argue' : 'Iron Cross ribbon, then at your face, and gives way'}. The girl sits in the corner on the floor and does not look at anyone.`); if (x.roll(0.3)) { x.apply({ suspicion: 6 }); x.say('The Party official from the second floor writes something in a little book.'); } x.log('Let a forced labourer into the air-raid shelter.'); } },
      { text: 'Say nothing. The rules are the rules.', effects: { conscience: -6 },
        outcome: (s, x) => x.say(bombed(s) ? 'The warden shuts the door. In the morning she is sweeping glass outside the bakery, alive, with a cut on her forehead. She does not look at you.' : 'The warden shuts the door. Nothing falls on your street tonight. You do not know where she spent the raid.') },
      { text: 'Go up and stand in the doorway with her.', effects: { conscience: 6, morale: 2 },
        risk: { chance: s => bombed(s) ? 0.12 : 0.02, dmg: [8, 25], fatal: 0.25, cause: 'Killed by a bomb in the doorway of your own house, on leave, April 1942.', hit: 'A bomb in the next street. The blast throws you both down the steps.', miss: 'You stand in the doorway together and watch the searchlights. She says something in Ukrainian. You do not understand it. You think it might have been thank you.' } }
    ] });

  // ───────────────────────── Day 2 · Wednesday 22 April ─────────────────────────
  ev({ id: 'c6_2m_gestapo', day: 2, phase: 0, scene: 'street', time: '09:00',
    cond: s => s.stats.suspicion >= 45 || s.flags.starckEnemy || s.flags.starckFound || s.flags.toldNeighbour,
    title: 'A Summons',
    text: s => `A letter, delivered by hand: you are requested to attend the local office of the Geheime Staatspolizei at nine o'clock, "for a conversation". Your mother reads it over your shoulder and sits down.

The office is on the second floor of an ordinary building. A man in a grey suit offers you a cigarette. He has a file in front of him, thicker than you expected.

"Just a few questions," he says. "${s.flags.starckFound ? 'About a roll of film.' : s.flags.toldNeighbour ? 'About something you said to your neighbour.' : s.flags.spd ? 'About your father.' : 'About your attitude.'}"`,
    choices: [
      { text: 'Answer correctly and give nothing away.', train: { leadership: 1 },
        outcome: (s, x) => {
          const p = 0.5 + (ss(s) ? 0.2 : 0) + (SIM.hasMedal(s, 'ek2') ? 0.1 : 0) + (SIM.hasMedal(s, 'ek1') ? 0.1 : 0) - (s.stats.suspicion - 40) / 150;
          if (x.roll(p)) { x.apply({ suspicion: -5 }); x.say(`An hour of polite questions. You answer every one of them correctly and say nothing at all. At the end he closes the file. "A front-line soldier with ${SIM.hasMedal(s, 'ek2') ? 'the Iron Cross' : 'your record'}. Of course. Enjoy your leave."`); }
          else { x.apply({ suspicion: 12 }); s.flags.gestapoFile = true; x.say('Two hours. The same questions, again and again, in a different order. At the end he says: "We will be watching. Your leave is your own affair. Your future is ours." You walk out into the spring sunshine and your hands are shaking.'); }
        } },
      { text: 'Ask Starck for help.', show: s => SIM.rel(s, 'starck') >= 20 || (s.flags.metStarck && ss(s)),
        outcome: (s, x) => {
          if (SIM.rel(s, 'starck') >= 15) { x.apply({ suspicion: -15 }); x.rel('starck', 4); s.flags.starckSaved = true; x.say('You give the Gestapo man Starck\'s card. He makes a telephone call in the next room. When he comes back his manner has changed completely. "A misunderstanding. Heil Hitler." You will owe Starck for this. He will make sure you remember.'); x.log('Starck got me out of a Gestapo interrogation.'); }
          else { x.apply({ suspicion: 10 }); s.flags.gestapoFile = true; x.say('The Gestapo man telephones. He comes back smiling. "The Hauptsturmführer says he hopes we are thorough." Two more hours.'); }
        } },
      { text: 'Lose your temper. "I was at the front while you sat here!"', effects: { suspicion: 15, morale: 4 }, set: { gestapoFile: true },
        result: 'He lets you shout. Then he writes for a long time. "Thank you," he says. "That was very informative." You realise you have just given him everything he wanted.' }
    ] });

  ev({ id: 'c6_2m', day: 2, phase: 0, scene: 'street',
    title: 'The School',
    text: s => `The headmaster of your old school has heard you are home. Would you speak to the senior boys tomorrow about the front? "They need to hear from a real front-line fighter," he says. "Especially now."

Half of the boys in that class will be in uniform within a year.`,
    choices: [
      { text: 'Give the speech they want: heroism, victory, the Führer.', effects: { suspicion: -6, conscience: -5, officers: 2 },
        result: 'You stand where your teachers stood and say the words. The boys\' eyes shine. One of them asks how many Russians you have killed. You give him a number. They applaud.' },
      { text: 'Tell them the truth, carefully: cold, fear, comrades.', effects: { conscience: 5, suspicion: 6 },
        result: 'You tell them about frostbite and lice and the men who did not come back, without one political word. The headmaster\'s smile gets thinner and thinner. Afterwards one boy waits behind and says, "Thank you." He looks frightened.' },
      { text: 'Decline. You are on leave.', effects: { morale: 3 },
        result: '"Of course," the headmaster says, disappointed. "Perhaps on your next leave." You both know there might not be one.' }
    ] });

  ev({ id: 'c6_2a', day: 2, phase: 1, scene: 'kitchen', cond: s => !!s.flags.visitFor || fallen(s).length > 0,
    title: 'The Parents',
    text: s => {
      const name = s.flags.visitFor || fallen(s).slice(-1)[0].name;
      return `A two-hour train journey to a small town, a street of identical houses, a front room with a photograph on the dresser and a black ribbon across the corner of the frame: ${name}.

His mother brings coffee, real coffee, saved for a special occasion. His father sits in his armchair and does not look at you. They have the official letter: "fell bravely for Führer, Volk and Vaterland". They want to know how it really was.`;
    },
    choices: [
      { text: 'Tell them the truth, gently.', effects: { conscience: 6, morale: -6 },
        result: 'You tell them where, and how, and that he was not alone. His mother listens with her hands in her lap. At the end his father says, without looking up, "Thank you. That letter said nothing." When you leave, his mother gives you a scarf she knitted for him.' },
      { text: 'Tell them he died at once, bravely, without pain.', effects: { morale: -3 },
        result: 'It is what every soldier says. It is what they want to hear, and they know it is what every soldier says. They thank you anyway. You take the train home in the dark.' },
      { text: 'Give them something of his: a letter, a photograph from your kit.', show: s => SIM.has(s, 'photo') || SIM.has(s, 'letter'), effects: { conscience: 4 },
        outcome: (s, x) => { if (SIM.has(s, 'photo')) x.item('photo', -1); else x.item('letter', -1); x.say('You put it on the table. His mother picks it up and holds it against her chest and cannot speak.'); } }
    ] });
  ev({ id: 'c6_2a_alt', day: 2, phase: 1, scene: 'street',
    title: 'The Reserve Hospital',
    text: 'Your old school gymnasium is a reserve hospital now: forty beds under the climbing ropes. Frostbite cases from the winter, mostly. Men without toes, without feet, without fingers. A nurse asks whether you would sit with one of them who has no visitors.',
    choices: [
      { text: 'Sit with him.', effects: { conscience: 3, morale: -2 },
        result: 'A boy from Silesia, both feet gone below the ankle. He wants to talk about football. You talk about football for two hours. When you leave he says, "Come again," and you both know you will not.' },
      { text: 'Bring cigarettes for the whole ward.', show: s => SIM.has(s, 'cigarettes', 2), items: { cigarettes: -2 }, effects: { morale: 4 },
        result: 'Forty men, two packets. Everyone gets one and a half. It is the best afternoon the ward has had since Christmas.' }
    ] });

  // ───────────────────────── Day 3 · Thursday 23 April ─────────────────────────
  ev({ id: 'c6_3m', day: 3, phase: 0, scene: 'street',
    title: 'The Workers',
    text: s => `At the ${{ farm: 'farm where you worked before the war', factory: 'works where your father is a foreman', student: 'post office', apprentice: 'grocer\'s where you were an apprentice', unemployed: 'building site on the corner' }[s.char.background] || 'bakery'}, half the workers are foreigners now: Poles with a purple P on their jackets, Ukrainians and Russians with the blue-and-white OST badge. They live behind wire in a camp at the edge of town and work twelve hours a day for almost nothing.

The foreman, a man you have known since you were a child, is beating an old Ukrainian with his belt for dropping a crate.`,
    choices: [
      { text: 'Stop him. "That\'s enough."', effects: { conscience: 7, suspicion: 4 },
        result: 'The foreman stops, surprised, belt in hand. "They\'re animals, boy. You of all people should know, you\'ve been out there." But he puts the belt back on. The old man picks up the crate without looking at either of you.' },
      { text: 'Give the old man your bread when nobody is looking.', effects: { conscience: 5, food: -8 },
        result: 'Contact with foreign workers is forbidden; giving them food can get a German sent to a camp. You do it anyway, behind the shed. He takes it and hides it inside his shirt and nods once.' },
      { text: 'Look away. It is not your business.', effects: { conscience: -5 },
        result: 'You walk on. Behind you the belt goes on for a while. You count the strokes without wanting to.' }
    ] });

  ev({ id: 'c6_3a', day: 3, phase: 1, scene: 'kitchen',
    title: 'Behind Closed Doors',
    text: s => ({
      spd: `After dark your father takes the radio out of the cupboard, puts a blanket over it and over his head, and tunes to London. The BBC German service. Listening is punishable by prison, or death for spreading what you hear.\n\nHe looks up at you from under the blanket.${ss(s) ? ' He is not sure, any more, whether he can trust you.' : ''}`,
      catholic: 'Your mother gives you a copy of a sermon, typed on thin paper, passed from hand to hand in the parish: the Bishop of Münster, von Galen, last August. It says that the state is killing the sick and the disabled in its asylums. Possessing it is dangerous.',
      party: `Your father takes you to the Ortsgruppe meeting. Afterwards the Ortsgruppenleiter takes you aside: there is a family in your building, the Webers, whose son "deserted to the British" in 1939. He would like a statement from a front-line ${ss(s) ? 'SS man' : 'soldier'} that they make "defeatist remarks".`,
      none: 'Your sister finally talks to you, late at night in the kitchen. About the Lehmann boy. About how the telegram came. About whether you think it was worth it. She asks you to tell her the truth.'
    }[fam(s)]),
    choices: [
      { text: 'Get under the blanket with him.', show: s => fam(s) === 'spd', effects: { conscience: 5, suspicion: 5 }, rel: { father: 20 },
        result: '"This is London." The calm voice, the four drumbeats. Figures for the winter losses in the East. You know them to be close to the truth. Your father watches your face. When it is over he says: "Now you know I know." It is the closest you have been since 1933.' },
      { text: 'Leave the room. Pretend you did not see.', show: s => fam(s) === 'spd', rel: { father: -5 },
        outcome: (s, x) => x.say(ss(s) ? 'You go to your room. You hear the radio through the wall, very quietly. You do not report it. He does not know that you will not.' : 'You go to your room. You hear the radio through the wall. Later he knocks and says goodnight, and his voice is careful.') },
      { text: 'Read the sermon.', show: s => fam(s) === 'catholic', effects: { conscience: 6, suspicion: 4 }, rel: { mother: 6 },
        result: 'Ten pages. "If it is once accepted that men have the right to kill unproductive fellow men..." You read it twice, by candlelight, and then you burn it in the stove, and you remember every word.' },
      { text: 'Give it back unread. "Mother, you must not have this."', show: s => fam(s) === 'catholic', rel: { mother: -6 }, effects: { suspicion: -3 },
        result: 'She takes it back without a word and hides it in the flour bin.' },
      { text: 'Give the statement against the Webers.', show: s => fam(s) === 'party', effects: { conscience: -15, suspicion: -10 }, rel: { father: 10 }, set: { denouncedWebers: true },
        result: 'You sign. The Ortsgruppenleiter thanks you warmly. Two weeks later, you hear, Herr Weber was taken to a camp. You are back at the front by then.',
        log: 'Signed a statement against the Weber family.' },
      { text: 'Refuse. "I don\'t know these people."', show: s => fam(s) === 'party', effects: { conscience: 5, suspicion: 4 }, rel: { father: -12 },
        result: 'The Ortsgruppenleiter\'s smile does not move. Your father, walking home, does not speak to you.' },
      { text: 'Tell her the truth.', show: s => fam(s) === 'none', effects: { conscience: 4, morale: -4 },
        result: '"No," you say. "It wasn\'t." She nods. She was expecting it. She puts her hand over yours on the table and you sit like that until the candle goes out.' },
      { text: 'Tell her he died for Germany.', show: s => fam(s) === 'none', effects: { morale: 2 },
        result: 'She looks at you for a long time. "That is what they all say," she says, and goes to bed.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch6 = { ss, town, bombed, fam, has, fallen, knows, rank };
})();
