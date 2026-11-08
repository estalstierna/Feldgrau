// Chapter IV, part two: the road past Minsk, the Berezina, the Dnieper and Smolensk;
// random events for the East; endings.
window.SIM = window.SIM || {};

(function () {
  const { has, first, informed, say } = SIM.ch4;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 3 }, o));
  const killedThisChapter = s => (s.losses || []).filter(l => l.chapter === 3 && l.status === 'killed');

  // ───────────────────────── Day 5 · Thursday 3 July ─────────────────────────
  ev({ id: 'c4_5m', day: 5, phase: 0, scene: 'road',
    title: 'Stalin Speaks',
    text: `On 3 July Stalin speaks on the radio for the first time since the invasion. A captured set in the battalion staff car picks it up, and a prisoner who speaks German translates. By noon the words have gone down the whole column: "brothers and sisters", "scorched earth", and a war of partisans behind the enemy's lines.

The panzers took Minsk a week ago. Between them and the infantry, the forests are full of cut-off Red Army soldiers.`,
    choices: [
      { text: 'Tell the squad it\'s propaganda. Moscow by August.', squad: { all: { morale: 5 } },
        result: 'Rau believes you. Hartmann pretends to. Nobody asks what happens if you are wrong.' },
      { text: 'Tell them the truth: from now on, every forest is a front line.', set: { squadAlert: true }, squad: { all: { morale: -3, loyalty: 4 } }, train: { leadership: 1 },
        result: 'You double the sentries at night and make them march with rifles loaded. They curse you. In a week, two other squads in the company will lose men to snipers in the woods. Yours will not.' },
      { text: 'Ask the translator what else Stalin said.', effects: { conscience: 2, morale: -2 },
        result: '"He said the enemy is cruel and implacable," the prisoner says, looking straight at you. "He said this is not an ordinary war between two armies. It is a war of the whole people."' }
    ] });

  ev({ id: 'c4_5a', day: 5, phase: 1, scene: 'village',
    title: 'The Forest Village',
    text: s => `A village at the edge of a great forest. Yesterday shots came from here and a supply driver was killed. The order from division is clear: villages that harbour partisans or "irregulars" are to be burned.

In a barn, under the straw, ${has(s, 'rau') ? 'Rau' : 'one of your men'} finds a Red Army soldier of perhaps seventeen with a bullet through his leg. An old woman in a headscarf stands in front of him with her arms spread wide, saying the same word over and over.`,
    choices: [
      { text: '"He is a prisoner of war. He goes to the rear. The village stays."', effects: { conscience: 10, suspicion: 5, officers: -3 },
        outcome: (s, x) => {
          x.say('You put the boy on a cart with a field dressing round his leg and send him back with the next supply column. The village is not burned. The old woman tries to kiss your hand and you pull it away, embarrassed.');
          if (informed(s, x, 0.3)) { x.apply({ suspicion: 10 }); x.say('Somebody reports that your squad "failed to carry out reprisal measures". Albrecht files the report in a drawer.'); }
          x.log('Did not burn the forest village.');
        } },
      { text: 'Report it and let battalion decide.', effects: { conscience: -8, morale: -8 },
        result: 'Battalion decides. By evening the village is a line of brick chimneys standing in grey ash. Your squad is not ordered to take part. You watch the smoke from the road. The boy from the barn is not on any list of prisoners.' },
      { text: 'Burn it, as ordered. Hand the boy to the Feldgendarmerie.', effects: { conscience: -20, morale: -10, officers: 3 }, set: { burnedVillage: true }, squad: { all: { morale: -6 }, kuehn: { morale: 8 } },
        result: 'Petrol, straw, matches. The old woman sits in the road and watches her house burn with her hands in her lap. You will see her again, in dreams, sitting in the road.',
        log: 'Burned a village at the edge of the forest.' },
      { text: 'Refuse to burn anything.', effects: { conscience: 14, suspicion: 18, officers: -12 }, set: { refusedOrder4: true },
        outcome: (s, x) => {
          if (SIM.rel(s, 'albrecht') >= 40) { x.apply({ suspicion: -8 }); x.say('Albrecht comes himself. He listens, looks at the barn, looks at the boy, and writes in his report: "No partisan activity found." Then he says to you, very quietly, "You will get us both shot one day."'); }
          else x.say('Your refusal goes up the chain of command. Another squad burns the village an hour later. Your name goes into a file in the divisional headquarters.');
          x.log('Refused to burn the forest village.');
        } }
    ] });

  // ───────────────────────── Day 6 · Friday 4 July ─────────────────────────
  ev({ id: 'c4_6m', day: 6, phase: 0, scene: 'river', time: '09:00',
    title: 'The T-34',
    text: 'On the Berezina the Red Army counterattacks with a tank nobody in the company has seen before: low and broad, with sloping armour and wide tracks. The T-34. Your company\'s 37mm anti-tank guns hit it again and again, and the shells bounce off like peas. The men already call the gun the "army door-knocker". One T-34 is driving along your trench line, crushing it.',
    choices: [
      { text: 'Bundle charge. Go for it yourself.', effects: { merit: 5, officers: 10 }, assault: true,
        risk: { chance: 0.34, dmg: [18, 48], fatal: 0.25, cause: 'Killed attacking a Soviet T-34 with a bundle of grenades on the Berezina, 4 July 1941.',
          hit: 'You are three metres from it when its machine gun finds you.',
          miss: 'You come up out of the trench behind it, jam the bundle of grenades onto the engine deck behind the turret, and throw yourself flat. The explosion lifts the back of the tank. Smoke pours out. The hatch opens. Nobody climbs out.' },
        outcome: (s, x) => { if (!x.wasHit) { s.flags.tankKill4 = true; x.squadMod('all', { morale: 8, loyalty: 6 }); x.log('Destroyed a T-34 with a bundle charge on the Berezina.'); } } },
      { text: 'Send a man with the charge.', assign: true, assignPrompt: 'Who goes for the tank?',
        outcome: (s, x) => {
          const m = x.man;
          const p = 0.45 + (SIM.hasTrait(m, 'brave') ? 0.2 : 0) + (SIM.hasTrait(m, 'strong') ? 0.15 : 0) - (SIM.hasTrait(m, 'nervous') || SIM.hasTrait(m, 'green') ? 0.2 : 0);
          if (x.roll(p)) { s.flags.menTankKill = true; x.apply({ merit: 2 }); x.squadMod(m.id, { morale: 12, loyalty: 6 }); x.say(`${m.name} goes over the parapet without a word, runs, and jams the charge under the turret. The T-34 burns. He comes back grinning and shaking and cannot light his cigarette. You write his name in the report.`); x.log(`${m.name} destroyed a T-34 on the Berezina.`); }
          else { const lost = x.lose(m.id, x.roll(0.6) ? 'killed' : 'wounded', 'attacking a T-34 on the Berezina'); x.apply({ morale: -8, conscience: -2 }); x.say(lost.status === 'killed' ? `${m.name} gets halfway. The tank's machine gun gets him. You sent him. That is the only thought you have for the rest of the day.` : `${m.name} gets halfway before the machine gun hits him. You drag him back into the trench yourself. He will live. He will not be back.`); }
        } },
      { text: 'Keep everyone down and let it pass over.', effects: { officers: -3 },
        risk: { chance: 0.15, dmg: [10, 30], cause: 'Killed when a Soviet T-34 crushed a trench on the Berezina, 4 July 1941.', hit: 'The tank grinds over the trench beside you, and the wall of the trench comes down on you.', miss: 'The tank passes over you. The world is noise and earth and the stink of diesel. Then it is gone, and the infantry behind it is your problem.' },
        outcome: (s, x) => { const m = x.casualty(0.24, 'when the tank crushed the trench'); say(x, m, m => `When you dig the trench out, ${m.name} is under the earth.`, m => `${m.name} is dug out of the collapsed trench with a broken leg.`); } }
    ] });

  ev({ id: 'c4_6a', day: 6, phase: 1, scene: 'letter',
    title: 'Field Post',
    text: s => {
      const fam = {
        spd: '"Your father was taken in again by the Gestapo in June, for three weeks. Somebody said he listens to London. He is home now and very quiet. He asks after you every day."',
        catholic: '"The church bells rang for the victories. Father Kaspar prays for the boys in Russia every morning. Do you still have the rosary? Promise me you do."',
        party: '"Your father says that after the victory, soldiers who fought in the East will be given farms there. He is already looking at maps. He wants you to bring back something Russian for the parlour."',
        none: '"The Lehmann boy, your sister\'s husband, was killed on Crete in May. He was a paratrooper. She has not stopped crying. Please write to her."'
      }[s.char.family];
      return `The field post catches up with the company on the Berezina. A letter from your mother:\n\n${fam}${s.flags.sweetheart ? '\n\nAnd one from Liesel, on blue paper that smells faintly of soap. She is counting the days, she writes, although nobody knows how many there will be.' : ''}`;
    },
    choices: [
      { text: 'Write back honestly.', effects: { conscience: 3, suspicion: 5, morale: 2 },
        result: 'You write about the dust, the prisoners, the village with the chimneys. You stop before Białystok. Some things you cannot put on paper, and some things the censor would not let through.' },
      { text: 'Write about the weather and the sunflowers.', effects: { morale: 4 },
        result: 'Fields of sunflowers to the horizon. It is even true.' },
      { text: 'Write to Liesel.', show: s => s.flags.sweetheart, effects: { morale: 8 },
        result: 'You write until the light goes. At the end you ask her a question that you have never asked anyone. You will not get her answer for six weeks.' },
      { text: 'Help Rau write to his mother.', show: s => has(s, 'rau'), squad: { rau: { loyalty: 12 } }, rel: { rau: 8 }, train: { leadership: 1 },
        result: 'He cannot find the words, so you find some for him. "Dear Mother, I am well. The food is good. The Russians are not as bad as they said." He signs it carefully, like a schoolboy.' }
    ] });

  // ───────────────────────── Day 7 · Tuesday 15 July ─────────────────────────
  ev({ id: 'c4_7m', day: 7, phase: 0, scene: 'field', time: '01:30',
    title: 'The Listening Post',
    text: 'Mid-July, west of Smolensk. The panzers have thrown a ring around the city, and the infantry must hold it while the Russians try to break out. At night they come out of the rye, which stands taller than a man. Someone has to go fifty metres forward into the rye, to a foxhole called the listening post, to give warning.',
    choices: [
      { text: 'Send a man to the listening post.', assign: true, assignPrompt: 'Who goes to the listening post tonight?',
        outcome: (s, x) => {
          const m = x.man, f = s.flags;
          const p = 0.55 + (SIM.hasTrait(m, 'steady') || SIM.hasTrait(m, 'brave') ? 0.15 : 0) - (SIM.hasTrait(m, 'nervous') || SIM.hasTrait(m, 'green') ? 0.15 : 0) + (f.squadAlert ? 0.1 : 0) + (f.dugIn ? 0.05 : 0);
          if (x.roll(p)) {
            x.apply({ merit: 2 });
            x.squadMod(m.id, { loyalty: 6 });
            x.say(`At three in the morning ${m.name}'s flare goes up over the rye. The Russians are thirty metres out. The squad is ready for them. In the grey dawn ${first(m)} crawls back in, soaked with dew, and says only, "Bloody long night."`);
          } else {
            const lost = x.lose(m.id, x.roll(0.6) ? 'killed' : 'wounded', 'at the listening post in the rye');
            x.apply({ morale: -8 });
            x.say(lost.status === 'killed'
              ? `No flare goes up. The Russians are in the trench before anyone sees them. When it is over and the sun comes up, you go out into the rye to the listening post. ${m.name} is still there.`
              : `The Russians find the listening post before ${first(m)} sees them. He comes crawling back through the rye with a bayonet wound in his side, shouting a warning. You get him to the medics. He will live.`);
          }
        } },
      { text: 'Go yourself.', effects: { merit: 3 }, set: { wentForward4: true }, squad: { all: { loyalty: 8 } }, train: { leadership: 1 },
        risk: { chance: 0.28, dmg: [15, 42], fatal: 0.2, cause: 'Killed at a listening post in the rye west of Smolensk, July 1941.',
          hit: 'You hear them too late: a rustle in the rye, a shape. A shot at point-blank range.',
          miss: 'Three hours in a foxhole in the rye, listening to the crickets, then to something that is not crickets. You fire the flare. The squad is ready. You crawl back at dawn, and every man in the squad shakes your hand.' } },
      { text: 'Nobody goes forward. Everyone stays in the main line.', effects: { officers: -5 },
        outcome: (s, x) => { const m = x.casualty(0.4, 'when the Russians came out of the rye'); say(x, m, m => `The Russians are in the trench before anyone sees them. ${m.name} is killed in the first minute.`, m => `The Russians are in the trench before anyone sees them. ${m.name} is wounded fighting them off.`); if (!m) x.say('They come out of the rye without warning. Somehow, the squad holds, and nobody is hit. Next time it will be different.'); } }
    ] });

  ev({ id: 'c4_7a', day: 7, phase: 1, scene: 'field', time: '16:00',
    title: 'Under the Birch Cross',
    text: s => {
      const k = killedThisChapter(s);
      if (!k.length) return 'The company buries its dead in a row under birch crosses at the edge of a village: eleven men this week. None of them are from your squad. Not yet. Your men dig the graves without being asked.';
      const last = k[k.length - 1];
      return `You bury ${last.name} under a birch cross at the edge of a village, with his helmet on top of it. ${k.length > 1 ? `He is not the first of your squad. ${k.slice(0, -1).map(l => l.name).join(' and ')} lie in other graves along the road behind you.` : 'He is the first of your squad.'}

The men stand round the grave with their caps in their hands, looking at you.`;
    },
    choices: [
      { text: 'Say a few words for him.', show: s => killedThisChapter(s).length > 0, squad: { all: { loyalty: 6, morale: 4 } }, train: { leadership: 1 },
        result: 'You do not remember afterwards what you said. The men do. One of them will repeat it to you thirty years later.' },
      { text: 'Write to his mother tonight.', show: s => killedThisChapter(s).length > 0, effects: { conscience: 4, morale: -4 },
        result: 'You write that he died at once, that he did not suffer, that he was brave and well liked. Two of those things are true. You sign it with your rank and name.' },
      { text: 'Carve his name properly on the cross.', show: s => killedThisChapter(s).length > 0, effects: { morale: 2 }, squad: { all: { loyalty: 3 } },
        result: 'Name, dates, regiment, with a bayonet, in the white birch wood. In a year the forest will have grown over it. But not yet.' },
      { text: 'Help dig the graves.', show: s => !killedThisChapter(s).length, effects: { comrades: 4, morale: -2 },
        result: 'Eleven graves in sandy soil. Your squad digs four of them. Nobody talks.' },
      { text: 'Stand at the graves for a while, alone.', show: s => !killedThisChapter(s).length, effects: { conscience: 2 },
        result: 'Eleven names on eleven crosses. You read them all. You do not know why it matters to you to read them. It does.' }
    ] });

  // ───────────────────────── Day 8 · Wednesday 16 July ─────────────────────────
  ev({ id: 'c4_8m', day: 8, phase: 0, scene: 'city', time: '07:00',
    title: 'Smolensk',
    text: 'Smolensk is burning. The Red Army defends the city street by street, and the old wooden quarters burn like kindling. Your squad has to clear a row of houses by the river: every house has a cellar, and in every cellar there could be Red Army soldiers, or women and children hiding from the shells. There is no way to tell from outside.',
    choices: [
      { text: 'Grenade first, then go in. That\'s how it is done.', effects: { merit: 2 }, assault: true,
        risk: { chance: 0.08, dmg: [8, 25], cause: 'Killed in street fighting in Smolensk, 16 July 1941.', hit: 'A Soviet soldier fires up the cellar stairs.', miss: 'Grenade, wait, go. Grenade, wait, go. It works.' },
        outcome: (s, x) => { if (x.roll(0.45)) { x.apply({ conscience: -14, morale: -10 }); x.say('In the third cellar there were no soldiers. You do not describe to yourself what you saw on the stairs. You go on to the fourth house.'); x.log('A grenade into a cellar in Smolensk. There were no soldiers in it.'); } else { x.apply({ conscience: -3 }); x.say('Soldiers, in every cellar: some dead, some with their hands up, coughing in the smoke.'); } } },
      { text: 'Shout first. "Vykhodi!" Give them a chance to come out.', effects: { merit: 2, conscience: 6 }, assault: true,
        risk: { chance: 0.2, dmg: [12, 35], cause: 'Killed in street fighting in Smolensk, 16 July 1941, while calling on a cellar to surrender.', hit: 'The answer from one cellar is a burst of submachine-gun fire up the stairs.', miss: 'From one cellar: an old couple, a young woman, three children, blinking in the light. From the next: four soldiers with their hands up. From the third, a burst of fire, and then grenades.' },
        outcome: (s, x) => { const m = x.casualty(0.14, 'in the cellars of Smolensk'); say(x, m, m => `${m.name} is killed going down the third cellar stairs.`, m => `${m.name} is wounded on the cellar stairs.`); x.log('Called out before clearing the cellars in Smolensk.'); } },
      { text: 'Leave the houses to the flamethrower pioneers.', effects: { conscience: -12 },
        result: 'The pioneers come with their flamethrowers and do it the quick way. Your squad covers them from the street. Nobody comes out of any of the cellars. You do not let yourself think about it, and then you think about nothing else.' }
    ] });

  ev({ id: 'c4_8a', day: 8, phase: 1, scene: 'city',
    title: 'The Cathedral',
    text: s => `On the hill above Smolensk stands the great cathedral with its five gilded domes. The Soviets turned it into a museum of atheism. Now old women are climbing the hill again with candles they have kept hidden for twenty years, and kneeling on the stone floor.

Soldiers are going through the side chapels, taking icons as souvenirs.${s.char.family === 'party' ? ' Your father wanted something Russian for the parlour.' : ''}`,
    choices: [
      { text: 'Take an icon.', effects: { conscience: -6 }, items: { icon: 1 },
        result: 'A small saint in a dented tin frame, his face dark with a century of candle smoke. An old woman watches you put it in your pack. She says nothing at all.' },
      { text: 'Stand guard at the door. Nobody loots it on your watch.', effects: { conscience: 6, officers: 2 }, squad: { brenner: { loyalty: 8 }, vogel: { loyalty: 6 } },
        result: 'The army forbids looting, at least on paper. You quote the regulation at three soldiers from another regiment and an Unteroffizier. They leave, swearing. The old women go on praying.' },
      { text: 'Light a candle with the old women.', effects: { conscience: 4, morale: 6 },
        outcome: (s, x) => x.say(`${SIM.has(s, 'rosary') ? 'You kneel on the stone floor with your mother\'s rosary in your hand.' : 'You light a candle and stand there, not knowing what to do with your hands.'} An old woman beside you looks at your uniform, then at your face, and makes the sign of the cross over you. You do not know whether it is a blessing or something else.`) }
    ] });

  // ───────────────────────── Day 9 · Saturday 19 July ─────────────────────────
  ev({ id: 'c4_9m', day: 9, phase: 0, scene: 'camp',
    title: 'The Map',
    text: `Hauptmann von Albrecht spreads a map on the bonnet of a car. Moscow: 370 kilometres.

"Six weeks, they told us in June," he says. "It has been four. We have come six hundred kilometres. The company has lost a third of its men. And there are more Russians now than when we started." He folds the map carefully. "Have your men write home. Tell them we will be home for Christmas. That is what everyone is telling them."`,
    choices: [
      { text: '"Do you believe that, Herr Hauptmann?"', effects: { conscience: 2, morale: -3 }, rel: { albrecht: 5 },
        result: 'He looks at you for a long time. "No," he says. Then he gets into the car.' },
      { text: 'Tell the men: Moscow by the autumn, home by Christmas.', squad: { all: { morale: 6 } },
        result: 'They want to believe it, so they do. Rau starts planning what he will do on Christmas Eve.' },
      { text: 'Look east, and say nothing.', effects: { morale: -2 },
        result: 'Forest, then fields, then forest again, to the end of the world.' }
    ] });

  ev({ id: 'c4_9n', day: 9, phase: 2, scene: 'camp', time: '21:30',
    title: 'Taking Stock',
    text: s => {
      const alive = SIM.squadMen(s), lost = (s.losses || []).filter(l => l.chapter === 3);
      return `Night above the Dnieper. The ring around Smolensk is closing; the fighting will go on for weeks. Albrecht goes from squad to squad with his notebook, the way he did on the Vistula and in France. When he reaches you, he asks for the names.

Still with you: ${alive.length ? alive.map(m => m.name).join(', ') : 'nobody'}.${lost.length ? `\n\nNot with you any more: ${lost.map(l => `${l.name} (${l.status})`).join(', ')}.` : '\n\nNobody lost. Albrecht writes it down twice, as if he does not believe it.'}`;
    },
    choices: [ { text: 'Give him the names.', result: 'He writes them down. Somewhere to the east, the guns go on.' } ] });

  SIM.EVENTS.push(...E);

  // ───────────────────────── Random events ─────────────────────────
  const east = s => s.chapter === 3;
  SIM.POOL.push(
    { id: 'ex_milk', chapters: [3], phases: [2], cond: east, scene: 'village',
      title: 'Milk',
      text: 'A woman from the village brings a jug of milk to your position in the evening. She wants nothing for it, or perhaps she wants you not to burn her house.',
      choices: [
        { text: 'Pay her (1 RM).', req: s => s.marks >= 1, reqText: 'You need 1 RM.', effects: { marks: -1, food: 15, conscience: 2 }, result: 'She looks at the German coin as if it might bite her, then puts it in her apron.' },
        { text: 'Give her cigarettes.', show: s => SIM.has(s, 'cigarettes'), items: { cigarettes: -1 }, effects: { food: 15, conscience: 2 }, result: 'Cigarettes are worth more than money here. She hides them in her headscarf.' },
        { text: 'Take it.', effects: { food: 15, conscience: -2 }, result: 'Warm, thick, sweet. The best thing you have tasted in weeks.' }
      ] },
    { id: 'ex_lice', chapters: [3], phases: [2], cond: east, scene: 'camp',
      title: 'Lice',
      text: 'Everyone has lice now. They live in the seams of your shirt and come out at night. The men sit by the fire running their thumbnails along the seams, cracking them.',
      choices: [
        { text: 'Hold your shirt over the fire.', effects: { health: 3 }, result: 'The seams crackle. It helps, for two days.' },
        { text: 'Trade for delousing powder (2 cigarettes).', show: s => SIM.has(s, 'cigarettes', 2), items: { cigarettes: -2 }, effects: { health: 5, morale: 3 }, result: 'A medical orderly sells you a tin. For a week you sleep through the night.' },
        { text: 'Ignore them.', effects: { health: -4, morale: -3 }, result: 'You scratch until you bleed.' }
      ] },
    { id: 'ex_vodka', chapters: [3], phases: [2], cond: east, scene: 'village',
      title: 'The Cooperative Store',
      text: 'In the village cooperative store, empty of everything else, Sattler finds a crate of vodka under the counter.',
      choices: [
        { text: 'Keep two bottles for later.', items: { vodka: 2 }, result: 'Currency, medicine, courage. Two bottles of each.' },
        { text: 'Drink with the squad.', effects: { morale: 8, health: -4 }, squad: { all: { morale: 8, loyalty: 3 } }, result: 'For one evening, the squad sings. Even Kühn.' },
        { text: 'Smash the crate.', effects: { officers: 2 }, squad: { all: { morale: -5 } }, result: 'You will need clear heads tomorrow. The men will not forgive you for a week.' }
      ] },
    { id: 'ex_water', chapters: [3], phases: [2], cond: east, scene: 'camp',
      title: '"Voda"',
      text: 'After dark, the prisoners held in a barn next to your position start calling: "Voda. Voda." Water. They have had none all day. The guard has orders not to open the door.',
      choices: [
        { text: 'Take them a bucket of water.', effects: { conscience: 5, suspicion: 3 }, result: 'The guard looks away. You pass the bucket through the door and hear them drinking, like animals, in the dark.' },
        { text: 'Stay where you are.', effects: { conscience: -3, morale: -3 }, result: 'They call until about midnight. Then they stop.' }
      ] },
    { id: 'ex_kuehn', chapters: [3], phases: [2], cond: s => east(s) && has(s, 'kuehn'), scene: 'letter',
      title: 'Kühn\'s Letter',
      text: 'Kühn has left an unsealed letter on his pack, addressed to his old Hitler Youth leader in Thuringia. Your name is on the second page.',
      choices: [
        { text: 'Read it.', effects: { conscience: -1 },
          outcome: (s, x) => { const k = SIM.man(s, 'kuehn'); x.say(k.loyalty >= 55 ? '"...our squad leader is strict but fair, and a real front-line soldier..." You put it back exactly where it was, and feel ashamed.' : '"...our squad leader is politically unreliable and soft on the enemy. I am keeping a record..." You put it back exactly where it was.'); if (k.loyalty < 55) s.flags.kuehnRecord = true; } },
        { text: 'Talk to him about it.', squad: { kuehn: { loyalty: 6 } }, train: { leadership: 1 }, effects: { suspicion: -2 },
          result: '"Write what you like, Kühn. But if you have a problem with me, say it to my face." He goes red. He did not expect that. Something between you shifts, a little.' },
        { text: 'Leave it alone.', result: 'Some things are better not known.' }
      ] },
    { id: 'ex_sniper', chapters: [3], phases: [2], cond: east, scene: 'forest',
      title: 'Shots from the Forest',
      text: 'After dark, single shots from the edge of the forest: a sniper, or a straggler, or partisans. One round smacks into the sandbag beside your head.',
      choices: [
        { text: 'Everyone down. Nobody moves until dawn.', outcome: (s, x) => { const m = x.casualty(0.12, 'by a sniper at night'); say(x, m, m => `${m.name} lifts his head once, to look. Once is enough.`, m => `${m.name} is hit in the shoulder raising his head.`); if (!m) x.say('A long, cold night lying in the dirt. At dawn the shots stop.'); } },
        { text: 'Take two men and go after him.', effects: { merit: 2 }, assault: true,
          risk: { chance: 0.2, dmg: [10, 30], cause: 'Killed hunting a sniper in a forest near Smolensk, July 1941.', hit: 'He was waiting for you.', miss: 'You find a dugout at the edge of the forest, warm, empty, with a Soviet rifle and a photograph of a girl. Whoever it was has gone.' } }
      ] },
    { id: 'ex_stars', chapters: [3], phases: [2], cond: east, scene: 'camp',
      title: 'A Clear Night',
      text: s => `A clear night, enormously wide, full of stars. ${has(s, 'hartmann') ? 'Hartmann' : 'Somebody'} starts talking about what he will do after the war, and one by one the others join in.`,
      choices: [
        { text: 'Join in.', squad: { all: { morale: 6, loyalty: 4 } }, effects: { morale: 5 },
          outcome: (s, x) => x.say(`${has(s, 'hartmann') ? 'Argentina, again, for Hartmann.' : ''} ${has(s, 'brenner') ? 'Brenner wants a farm with twelve cows.' : ''} ${has(s, 'rau') ? 'Rau wants to be a teacher.' : ''} You say what you want, and it sounds strange out loud, because you realise you have not let yourself think about it for a year.`) },
        { text: 'Just listen.', effects: { morale: 3 }, result: 'You lie on your back and listen to them dream, and look at the stars, which are the same stars as at home.' }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  const after = 'In August the panzers turned south toward Kiev. In October the army marched on Moscow. Then came the rain, and the mud, and in November the frost: thirty degrees below zero, and the men still in their summer uniforms.\n\nThe war that was going to take six weeks was going to take four years.';
  SIM.ch4Ending = function (s) {
    const lostKilled = (s.losses || []).filter(l => l.chapter === 3 && l.status === 'killed').length;
    if (s.stats.health < 30) return 'ea_wounded';
    if (s.flags.refusedOrder4 || s.stats.suspicion >= 70) return 'ea_marked';
    if (SIM.earnsCross4(s)) return 'ea_decorated';
    if (lostKilled >= 2) return 'ea_losses';
    if (s.stats.conscience <= 25) return 'ea_hardened';
    if (s.stats.conscience >= 70) return 'ea_witness';
    if (SIM.squadLoyalty(s) >= 65) return 'ea_brothers';
    return 'ea_survivor';
  };
  Object.assign(SIM.ENDINGS, {
    ea_wounded: { title: 'Hospital Train West', text: s => `Your wounds take you out of the East on a hospital train: four days to Warsaw, lying in straw in a goods wagon, then a real bed in a requisitioned school. You read the victory announcements in the newspapers.\n\n${after}` },
    ea_marked: { title: 'The File', text: s => `By the end of the summer, your file at divisional headquarters has grown: ${s.flags.refusedOrder4 ? 'a refused order at the forest village' : 'reports, remarks, a pattern'}, and on top of it everything from Poland and France.${s.flags.kuehnRecord ? ' Kühn\'s letters are in it too.' : ''}\n\nIn the East, a man with a file like yours is not sent to prison. He is sent forward.\n\n${after}` },
    ea_decorated: { title: 'The Summer Battles', text: s => `${SIM.hasMedal(s, 'tankbadge') || s.flags.tankKill4 ? 'The T-34 on the Berezina is in the company war diary, and in the divisional newspaper.' : 'Your name is in the company war diary more often than any other.'} Albrecht pins a decoration on you in a birch wood above the Dnieper, while the guns go on in the distance.\n\nThe men in your squad look at you differently now: the way you once looked at Brandt.\n\n${after}` },
    ea_losses: { title: 'Birch Crosses', text: s => `You brought your squad to Smolensk. Not all of it. ${(s.losses || []).filter(l => l.chapter === 3 && l.status === 'killed').map(l => l.name).join(', ')}: birch crosses along six hundred kilometres of road.\n\nNew men arrive from Germany, boys of nineteen who ask you what it is like. You find you cannot tell them.\n\n${after}` },
    ea_hardened: { title: 'The East', text: s => `The East has taught you its rules: take what you need, shoot first, do not look at the prisoners, do not count the chimneys. You have learned them well. You are good at this war.\n\nSometimes, at night, you try to remember the man who stood in a courtyard in Pomerania in 1939, and you cannot.\n\n${after}` },
    ea_witness: { title: 'What You Carry', text: s => `You carry it with you: ${[
      s.flags.savedBialystok && 'a man and a boy slipping out of a gate in Białystok',
      s.flags.savedCommissar && 'a thin man in glasses vanishing into a column of prisoners',
      s.flags.evidence && 'a roll of film sewn into the lining of your pack',
      s.flags.refusedOrder4 && 'a village that did not burn'
    ].filter(Boolean).join('; ') || 'everything you saw, and everything you could not stop'}.\n\nYou know now what this war is. Not the newspapers' war, and not the generals' war. You are inside it, in its uniform, and you are still trying to be a man inside it.\n\n${after}` },
    ea_brothers: { title: 'The Squad', text: s => `Your squad would follow you anywhere now, and has: across the Bug, through the pocket, over the Berezina, into Smolensk. ${SIM.squadMen(s).map(m => first(m)).join(', ')}. The war has made them into something no word quite covers. Comrades is too small.\n\n${after}` },
    ea_survivor: { title: 'Six Hundred Kilometres', text: s => `You walked six hundred kilometres in four weeks, and you are still alive on the Dnieper. You did not distinguish yourself and you did not disgrace yourself, and in the East that is an achievement of a kind.\n\n${after}` }
  });

})();
