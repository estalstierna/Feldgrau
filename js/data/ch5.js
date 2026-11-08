// Chapter V: "Before Moscow" — the last offensive and the winter, 15 November – 24 December 1941.
// Introduces SS-Hauptsturmführer Wolfram Starck, a recurring character.
// Days 6–11, random events and endings live in ch5_more.js.
window.SIM = window.SIM || {};

(function () {
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const first = m => m.name.split(' ')[0];
  const starck = s => SIM.rel(s, 'starck');
  const informed = (s, x, base = 0.35) => {
    const k = SIM.man(s, 'kuehn');
    if (!k || k.status !== 'ok') return false;
    return x.roll(base * (1 - k.loyalty / 120) + (s.flags.deputy === 'kuehn' ? 0.1 : 0));
  };
  const say = (x, m, killed, wounded) => { if (m) x.say(m.status === 'killed' ? killed(m) : wounded(m)); };
  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;
  SIM.earnsCross5 = s => !s.flags.refusedOrder5 && (score(s) >= 14 || (s.flags.heldLine5 && score(s) >= 10));
  // The weakest man in the squad: the one most likely to run.
  SIM.weakestMan = s => {
    const men = SIM.squadMen(s);
    const rank = m => (SIM.hasTrait(m, 'nervous') ? 3 : 0) + (SIM.hasTrait(m, 'green') ? 2 : 0) + (SIM.hasTrait(m, 'tired') ? 1 : 0) + (100 - m.morale) / 50;
    return men.slice().sort((a, b) => rank(b) - rank(a))[0];
  };

  const DAYS = [
    { date: 'Saturday, 15 November 1941', short: 'Sat 15 Nov', place: 'highway', war: true, temp: -8 },
    { date: 'Sunday, 16 November 1941',   short: 'Sun 16 Nov', place: 'front_n', war: true, temp: -10 },
    { date: 'Monday, 17 November 1941',   short: 'Mon 17 Nov', place: 'village_n', war: true, temp: -12 },
    { date: 'Thursday, 27 November 1941', short: 'Thu 27 Nov', place: 'istra_road', war: true, temp: -20 },
    { date: 'Monday, 1 December 1941',    short: 'Mon 1 Dec', place: 'istra', war: true, temp: -25 },
    { date: 'Thursday, 4 December 1941',  short: 'Thu 4 Dec', place: 'moscow_edge', war: true, temp: -35 },
    { date: 'Friday, 5 December 1941',    short: 'Fri 5 Dec', place: 'moscow_edge', war: true, temp: -38 },
    { date: 'Sunday, 7 December 1941',    short: 'Sun 7 Dec', place: 'retreat_1', war: true, temp: -30 },
    { date: 'Thursday, 11 December 1941', short: 'Thu 11 Dec', place: 'retreat_2', war: true, temp: -28 },
    { date: 'Tuesday, 16 December 1941',  short: 'Tue 16 Dec', place: 'ruza', war: true, temp: -32 },
    { date: 'Saturday, 20 December 1941', short: 'Sat 20 Dec', place: 'ruza', war: true, temp: -27 },
    { date: 'Wednesday, 24 December 1941', short: 'Wed 24 Dec', place: 'ruza', war: true, temp: -25 }
  ];

  const PLACES = {
    highway:     { name: 'The Volokolamsk highway',            x: 150, y: 100 },
    front_n:     { name: 'North of the highway',               x: 178, y: 104 },
    village_n:   { name: 'A village on the road to Istra',     x: 192, y: 106 },
    istra_road:  { name: 'The road to Istra',                  x: 206, y: 108 },
    istra:       { name: 'Istra',                              x: 218, y: 110 },
    moscow_edge: { name: 'Thirty kilometres from Moscow',      x: 238, y: 114 },
    retreat_1:   { name: 'The retreat west of Istra',          x: 210, y: 112 },
    retreat_2:   { name: 'The retreat on the Volokolamsk road', x: 190, y: 114 },
    ruza:        { name: 'The winter line on the Ruza',        x: 176, y: 118 }
  };

  SIM.CHAPTERS.push({
    id: 'moscow', num: 'V', title: 'Before Moscow', range: '15 November – 24 December 1941', year: 1941, start: [1941, 11],
    days: DAYS, places: PLACES, map: 'moscow', sceneVariant: 'winter', cold: true, nightMorale: 4,
    finalEvent: 'c5_11n',
    commander: 'Hauptmann von Albrecht',
    hospital: 'Smolensk',
    deathDefault: 'Killed before Moscow, winter 1941.',
    casualties: 'Between November 1941 and March 1942 the German army in the East lost more than 400,000 men dead and wounded, and over 100,000 more to frostbite. The Red Army lost far more. In front of Moscow, the war that was supposed to be over by Christmas became a war that Germany could not win.',
    promoDate: '1 April 1942',
    maxRank: s => s.rank >= 4 ? ((s.flags.passedCourse && score(s) >= 15) ? 5 : 4) : ((s.flags.passedCourse || score(s) >= 10) ? 4 : 3),
    meritBar: 8,
    routineReason: 'Time in service and a clean record through the winter.',
    meritReason: 'Recommended by Hauptmann von Albrecht for holding your squad together in the winter battle.',
    interludeDate: 'Autumn 1941',
    interludeTitle: 'July – November 1941',
    warFoodDrain: -5, // dugouts and field kitchens, thin but regular
    blackMarks: s => {
      const b = [];
      if (s.flags.refusedOrder5) b.push('You refused an order during the retreat.');
      if (s.flags.starckEnemy) b.push('An SS officer has filed a report on your political attitude.');
      return b;
    },
    awards: (s, sc) => {
      SIM.award(s, 'ostmedaille', 'For the winter battle in the East, 1941/42.', 'July 1942');
      const hadEk2 = s.medals.some(m => m.id === 'ek2' && m.chapter < 4);
      if (!SIM.hasMedal(s, 'ek2') && SIM.earnsCross5(s)) SIM.award(s, 'ek2', 'For bravery in the winter battle before Moscow, 1941.', 'January 1942');
      else if (hadEk2 && !SIM.hasMedal(s, 'ek1') && !s.flags.refusedOrder5 && (sc >= 17 || (s.flags.heldLine5 && sc >= 13))) SIM.award(s, 'ek1', 'For outstanding bravery in the defensive battles on the Istra, December 1941.', 'January 1942');
      if (s.flags.carriedWounded5) SIM.award(s, 'kvk2', 'For bringing a wounded comrade back through the snow under fire, December 1941.', 'February 1942');
    },
    ending: s => SIM.ch5Ending(s),
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, s.ending === 'ea_wounded' ? 78 : 85);
      s.stats.morale = Math.max(s.stats.morale, 50);
      s.stats.food = 70;
      s.stats.warmth = 70;
      s.shelter = 0;
      s.squadWinter = 0;
      if (s.stats.suspicion < 80) s.stats.suspicion = Math.max(0, s.stats.suspicion - 8);
      s.marks += 15;
      SIM.give(s, 'cigarettes', 3);
      if (!s.squad) SIM.makeSquad(s);
      SIM.squadMen(s).forEach(m => { m.morale = Math.max(m.morale, 45); });
      // Wounded men from the summer come back; those killed do not.
      (s.squad || []).forEach(m => { if (m.status === 'wounded' && Math.random() < 0.5) { m.status = 'ok'; m.fate = null; m.returned = true; } });
    },
    onStart: s => { s.flags.hasSquad = true; s.shelter = 0; },
    interlude: s => interludeItems(s),
    interludeEvents: ['i4_mud', 'i4_winter']
  });

  function interludeItems(s) {
    const f = s.flags, out = [];
    if (s.ending === 'ea_wounded') out.push({ year: 'August', text: 'Six weeks in a military hospital in Warsaw. The wound healed; the nightmares did not. In September you were sent back east on a hospital train running the other way, full of fit men.' });
    out.push({ year: 'Aug – Sep', text: 'The Smolensk pocket was closed in August. Then the panzers turned south: at Kiev in September, five Soviet armies were encircled and more than 600,000 men taken prisoner. The newspapers at home printed maps with arrows. "The enemy in the East is broken," the Reich press chief announced in October, "and will never rise again."' });
    out.push({ year: 'October', text: 'Operation Typhoon, the march on Moscow, began on 2 October. At Vyazma and Bryansk, another 600,000 prisoners. Then on 7 October it snowed, and melted, and the rain came: the rasputitsa, the season without roads. The whole army sank into mud up to the axles.\n\nThe prisoners from the summer were dying. In open camps behind the lines, without shelter or food, hundreds of thousands of Red Army men starved or froze that autumn. You passed one of the camps on the road. You smelled it before you saw it.' });
    const r = [];
    const back = (s.squad || []).filter(m => m.returned).map(first);
    if (back.length) r.push(`${back.join(' and ')} came back from hospital in October and rejoined the squad.`);
    const lost = (s.squad || []).filter(m => m.status !== 'ok').map(first);
    if (lost.length) r.push(`The squad is smaller than it was in June. ${lost.join(', ')}: gone.`);
    if (f.lenzFeldgendarm) r.push('Lenz is still with the Feldgendarmerie, somewhere behind the front. You hear his name sometimes, in connection with hangings.');
    if (r.length) out.push({ year: 'November', text: r.join('\n\n') });
    out.push({ year: '4 November', text: 'On 4 November the frost came and the mud froze hard. The army could move again. On 15 November, with the temperature at minus eight and no winter clothing issued, the last offensive on Moscow began.' });
    return out;
  }

  SIM.INTERLUDE_EVENTS.i4_mud = {
    id: 'i4_mud', scene: 'road',
    title: 'The Rasputitsa, October 1941',
    text: 'A truck sunk to its doors in the mud. Horses dying in their harness. Your squad has been pushing the same field kitchen for six hours. Somebody has to decide what to do.',
    choices: [
      { text: 'Requisition a peasant\'s horse and cart. They work in this mud; trucks don\'t.', effects: { conscience: -3, food: 10 }, squad: { all: { morale: 5 } },
        result: 'The farmer stands in his yard and watches you lead the horse away. The cart moves when nothing else does. You eat hot food that night; most of the company does not.' },
      { text: 'Make the squad build a corduroy road of logs.', squad: { all: { morale: -4, loyalty: 4 } }, train: { leadership: 1 }, effects: { officers: 4, merit: 1 },
        result: 'Two days of felling birches and laying them across the mud. Albrecht drives over your road in his car and stops to shake your hand.' },
      { text: 'Rest the men. The mud will freeze eventually.', squad: { all: { morale: 6 } }, effects: { health: 4 },
        result: 'You sit in a peasant hut and wait for the frost, like everyone else. In November it comes.' }
    ]
  };

  SIM.INTERLUDE_EVENTS.i4_winter = {
    id: 'i4_winter', scene: 'village',
    title: 'Winter Clothing, November 1941',
    text: 'The army has issued no winter clothing. Rumour says it is stuck in railway yards in Poland, behind trains of ammunition. The men stuff newspaper into their boots. The Russian peasants wear sheepskin coats and felt boots, valenki. Before the offensive, you have a few days to prepare your squad for the cold.',
    choices: [
      { text: 'Buy felt boots and coats from the villagers (15 RM).', req: s => s.marks >= 15, reqText: 'You need 15 RM.', effects: { marks: -15, conscience: 2 }, items: { valenki: 1 }, winter: 1,
        result: 'The villagers sell what they can spare, for German money that will be worthless if you lose. You buy a pair of valenki for yourself and what you can for the men.' },
      { text: 'Take them. The army needs them more.', effects: { conscience: -10 }, items: { valenki: 1, furs: 1 }, winter: 2, squad: { all: { morale: 4 } },
        result: 'You take the coats from the backs of old men and the felt boots off a woman\'s feet. In the winter that follows, your squad will be warmer than most. The villagers will not.',
        log: 'Took winter clothing from the villagers before the offensive.' },
      { text: 'Get Sattler to "organise" something from the supply depot.', show: s => has(s, 'sattler'), effects: { suspicion: 4 }, items: { blanket: 1 }, winter: 1, squad: { sattler: { loyalty: 5 } },
        result: 'Sattler comes back at dawn with a sledge piled with blankets and woollen toques stamped with the depot number. You do not ask.' },
      { text: 'Trust the army. The winter kit will come.', squad: { all: { morale: 2 } },
        result: 'It will come: in January, for some. Not for you.' }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 4 }, o));

  // ───────────────────────── Day 0 · Saturday 15 November ─────────────────────────
  ev({ id: 'c5_0m', day: 0, phase: 0, scene: 'road', time: '06:00',
    title: 'Frost',
    text: 'Minus eight. The ground is iron. The offensive is starting again: Moscow is a hundred kilometres away along the Volokolamsk highway. Your men are in summer uniform with a greatcoat, a woollen toque if they are lucky, and leather boots with nailed soles that conduct the cold straight into their feet.',
    choices: [
      { text: 'Show them the old trick: straw and newspaper in the boots, boots a size too big.', effects: { warmth: 10 }, winter: 1, train: { scrounging: 1 }, squad: { all: { loyalty: 3 } },
        result: 'Your grandfather fought in the Carpathians in 1915 and told you about it. The men laugh at you, and then they do it.' },
      { text: 'Take felt boots from a dead Russian soldier.', show: s => !SIM.has(s, 'valenki'), effects: { conscience: -3, warmth: 8 }, items: { valenki: 1 },
        result: 'He has been dead for two days and the boots are frozen to his feet. It takes a long time. You do it anyway.' },
      { text: 'Give your scarf to the youngest.', effects: { warmth: -6, conscience: 3 }, squad: { all: { loyalty: 4 } },
        outcome: (s, x) => { const y = has(s, 'rau') ? SIM.man(s, 'rau') : SIM.squadMen(s)[0]; if (y) { x.squadMod(y.id, { loyalty: 10 }); x.say(`${y.name} protests, then wraps it twice round his neck. He will still have it at Christmas.`); } } },
      { text: 'March. Moving keeps you warm.', effects: { officers: 2 },
        result: 'Forty kilometres. By evening the sweat in your shirt has frozen.' }
    ] });

  ev({ id: 'c5_0a', day: 0, phase: 1, scene: 'village',
    title: 'The Village on the Highway',
    text: 'The Soviets have dug in at a village where the highway crosses a frozen stream. Their machine guns fire from the log houses. There is no cover on the white field: every man in field grey is a black mark on the snow.',
    choices: [
      { text: 'Attack across the snow at dawn, before they can see.', effects: { merit: 3, officers: 5 }, assault: true,
        risk: { chance: 0.16, dmg: [12, 35], cause: 'Killed attacking a village on the Volokolamsk highway, 15 November 1941.', hit: 'Fifty metres from the first house, a burst catches you in the open snow.', miss: 'You are into the first house before the machine gunner turns. Then the next.' },
        outcome: (s, x) => { const m = x.casualty(0.18, 'attacking across the snow'); say(x, m, m => `${m.name} falls in the snow and does not get up.`, m => `${m.name} is hit in the thigh in the open and lies in the snow until you drag him back.`); x.shelter(1); x.say('That night the squad sleeps in a log house with a stove. It feels like heaven.'); } },
      { text: 'Work round through the gully with the MG covering.', show: s => has(s, 'hartmann'), effects: { merit: 3, officers: 4 }, assault: true, train: { leadership: 1 },
        risk: { chance: 0.1, dmg: [10, 30], cause: 'Killed in a gully on the Volokolamsk highway, 15 November 1941.', hit: 'A grenade comes over the lip of the gully.', miss: 'Up the gully, waist-deep in snow, while Hartmann\'s MG keeps their heads down. You come out behind the village. It is over in ten minutes.' },
        outcome: (s, x) => { const m = x.casualty(0.1, 'in the gully'); say(x, m, m => `${m.name} is killed by a grenade in the gully.`, m => `${m.name} is wounded in the gully.`); x.shelter(1); } },
      { text: 'Wait for the artillery. Let them burn the village down first.', effects: { conscience: -4, warmth: -6 },
        result: 'The artillery comes at noon. Then there is no village, and no shelter for the night either. Your squad sleeps in the snow behind a wall.',
        outcome: (s, x) => x.shelter(0) }
    ] });

  // ───────────────────────── Day 1 · Sunday 16 November ─────────────────────────
  ev({ id: 'c5_1m', day: 1, phase: 0, scene: 'camp', time: '08:00',
    title: 'Hauptsturmführer Starck',
    text: s => `A staff car with SS runes on the number plate pulls up at the company command post. The officer who gets out is tall, about thirty-five, in a long leather coat lined with fur: SS-Hauptsturmführer Wolfram Starck, liaison officer from the Waffen-SS division on your right flank. Tomorrow the two units attack together.

He walks along your squad's line as if inspecting cattle. He stops in front of you, looks at your ${SIM.hasMedal(s, 'ek2') ? 'Iron Cross ribbon' : 'empty buttonhole'}, and then at your face for a long moment.

"${SIM.RANKS[s.rank]} ${s.char.last}." He knows your name. "I have heard about you." He does not say what.`,
    choices: [
      { text: 'Volunteer your squad for the spearhead tomorrow.', effects: { officers: 3, merit: 1 }, rel: { starck: 15 }, set: { metStarck: true, spearhead: true }, squad: { all: { morale: -5 } },
        result: 'Starck smiles for the first time. "Good. The Army has a few men left after all." Your squad looks at you in silence. Hartmann mouths something you decide not to understand.' },
      { text: 'Correct and cool. Report, salute, nothing more.', set: { metStarck: true }, rel: { starck: 2 },
        result: '"Correct," Starck says. "Like all of you. Correct and cautious." He moves on.' },
      { text: '"My father is in the Party, Herr Hauptsturmführer."', show: s => s.flags.party, set: { metStarck: true }, rel: { starck: 12 }, effects: { suspicion: -4 },
        result: '"Is he." Starck makes a note. "Then you know what this war is for. Many here do not." He offers you a cigarette. It is a good one.' },
      { text: '"With respect, Herr Hauptsturmführer: my men are in summer boots."', set: { metStarck: true }, rel: { starck: -6 }, effects: { comrades: 4 }, squad: { all: { loyalty: 4 } },
        result: 'Starck looks down at the boots, then up at you. "My men too. They do not complain. They know the Führer will provide." He walks away. Your men heard you say it. That matters more.' }
    ] });

  ev({ id: 'c5_1a', day: 1, phase: 1, scene: 'field',
    title: 'Side by Side',
    text: s => `The joint attack: your company and an SS battalion against a wood held by Soviet rifle troops and ski units. ${s.flags.spearhead ? 'Your squad is the point.' : 'Your squad is in the second line.'} The SS men go forward upright, in short rushes, and take terrible losses. Starck walks among them with a pistol in his hand, as if under no fire at all.`,
    choices: [
      { text: 'Keep up with the SS. Don\'t let them say the Army held back.', effects: { merit: 3, officers: 4 }, rel: { starck: 10 }, assault: true,
        risk: { chance: s => s.flags.spearhead ? 0.22 : 0.15, dmg: [12, 38], cause: 'Killed in a joint attack with the Waffen-SS north of the Volokolamsk highway, 16 November 1941.', hit: 'You are running beside Starck when it hits you.', miss: 'You reach the wood with the SS. Starck, beside you, nods once.' },
        outcome: (s, x) => { const m = x.casualty(s.flags.spearhead ? 0.24 : 0.14, 'in the attack on the wood'); say(x, m, m => `${m.name} is killed at the edge of the wood.`, m => `${m.name} is wounded at the edge of the wood.`); } },
      { text: 'Advance properly: fire and movement, cover each other.', effects: { merit: 2 }, train: { leadership: 1 }, rel: { starck: -2 },
        risk: { chance: 0.1, dmg: [10, 30], cause: 'Killed in an attack on a wood north of the Volokolamsk highway, 16 November 1941.', hit: 'Even done properly, it is the open snow.', miss: 'You reach the wood ten minutes after the SS, with all your men. Starck, counting his dead, says nothing to you.' },
        outcome: (s, x) => { const m = x.casualty(0.08, 'in the attack on the wood'); say(x, m, m => `${m.name} is killed at the edge of the wood.`, m => `${m.name} is wounded at the edge of the wood.`); } },
      { text: 'Hold your men back. Let the SS have their glory.', effects: { officers: -5 }, rel: { starck: -12 }, squad: { all: { loyalty: 5 } },
        result: 'The SS take the wood alone and lose a third of their men doing it. Afterwards Starck walks over to your squad, looks at each of you, and walks away. Your men are alive. He will remember.' }
    ] });

  // ───────────────────────── Day 2 · Monday 17 November ─────────────────────────
  ev({ id: 'c5_2m', day: 2, phase: 0, scene: 'village', time: '17:00',
    title: 'The Eviction',
    text: s => `Minus twelve, and falling. The battalion takes over a village for the night: thirty log houses, and in them the families who live there. Starck's order, passed down through battalion: the civilians are to be driven out. All of them. The troops need the houses.

In the house your squad is given there is a woman, her old mother and three small children. Outside it is getting dark. The nearest other village is eight kilometres away through the forest.`,
    choices: [
      { text: 'Carry out the order.', effects: { conscience: -15, warmth: 12 }, rel: { starck: 8 }, shelter: 2,
        result: 'The woman wraps the children in everything she has and leads her mother out into the snow without a word. You watch them go up the road toward the forest until they are too small to see. That night your squad sleeps warm. Nobody talks.',
        log: 'Drove a family out of their house into the snow.' },
      { text: 'Let them keep the back room. They stay; so do you.', effects: { conscience: 10, warmth: 10, suspicion: 4 }, shelter: 2, rel: { starck: -6 },
        outcome: (s, x) => {
          x.say('Seven soldiers and five Russians in a log house with one stove. The old woman cooks potatoes for everyone.' + (has(s, 'rau') ? ' The children stare at Rau\'s ears and giggle.' : ' The children giggle at the soldiers\' frozen moustaches.'));
          if (informed(s, x, 0.35)) { x.apply({ suspicion: 10 }); x.rel('starck', -10); x.say('In the morning Starck walks past the house and sees the children at the window. He looks at you for a long time.'); }
          x.log('Let a Russian family stay in their house.');
        } },
      { text: 'Refuse. Your squad sleeps in the barn.', effects: { conscience: 8, warmth: -8, suspicion: 8 }, shelter: 1, rel: { starck: -15 }, squad: { all: { morale: -6 } }, set: { defiedStarck: true },
        result: 'The barn is a little better than the snow. The family stays in the house. In the morning Starck asks battalion who commanded the squad in house twelve.' },
      { text: 'Ask Albrecht to intervene.',
        outcome: (s, x) => {
          if (SIM.rel(s, 'albrecht') >= 40) { x.apply({ conscience: 8, warmth: 10 }); x.shelter(2); x.rel('starck', -4); x.say('Albrecht goes to battalion and comes back an hour later. "The order is that the troops are to be quartered. It says nothing about the order in which people sleep." The family keeps the back room. You keep the stove.'); }
          else { x.apply({ conscience: -6, warmth: 10 }); x.shelter(2); x.say('Albrecht listens and shakes his head. "It is an SS order and battalion has endorsed it. I cannot." The family goes out into the dark. Albrecht does not watch.'); }
        } }
    ] });

  ev({ id: 'c5_2a', day: 2, phase: 1, scene: 'camp',
    title: 'A Face from Home',
    text: s => `A replacement arrives with the supply sledge: Max Brandes, eighteen, from ${SIM.townName(s.char.hometown)}. He knows your street. His mother knows your mother.

He has letters, and news. ${{
  spd: 'Your father works twelve-hour shifts in the munitions factory now, he says, and keeps his head down. There are new posters everywhere: "Pst! Feind hört mit!" The enemy is listening.',
  catholic: 'The bishop of Münster preached against the killing of the sick in August, he says, and everyone has heard about it, though nobody says it out loud. Your mother sends a medal of Saint Christopher.',
  party: 'Your father is a big man now, he says. He gave a speech at the school about the heroes in the East. He mentioned you by name.',
  none: 'Rations are smaller. The British bomb at night, sometimes. Your sister has gone to work in a munitions factory.'
}[s.char.family]}`,
    choices: [
      { text: 'Take him under your wing.', squad: { all: { loyalty: 2 } }, train: { leadership: 1 },
        outcome: (s, x) => { SIM.addMan(s, { id: 'brandes', name: 'Max Brandes', role: 'Rifleman (replacement)', age: 18, traits: ['green', 'loyal'], loyalty: 70, morale: 60, bio: `A baker's son from ${SIM.townName(s.char.hometown)}. Knows your street and your mother.` }); x.say('You show him how to wrap his feet, how to keep his rifle under his coat, how to sleep sitting up. He follows you everywhere.'); } },
      { text: 'Treat him like any other replacement.', effects: { officers: 2 },
        outcome: (s, x) => { SIM.addMan(s, { id: 'brandes', name: 'Max Brandes', role: 'Rifleman (replacement)', age: 18, traits: ['green'], loyalty: 50, morale: 55, bio: `A baker's son from ${SIM.townName(s.char.hometown)}.` }); x.say('He will learn like everyone else, or not. Most replacements last two weeks out here. You try not to learn their names. You already know his.'); } }
    ] });

  // ───────────────────────── Day 3 · Thursday 27 November ─────────────────────────
  ev({ id: 'c5_3m', day: 3, phase: 0, scene: 'field', time: '05:00',
    title: 'Twenty Below',
    text: 'Minus twenty. The oil in the rifles has turned to grease, then to glue. A bolt that will not close. A machine gun that fires one round and stops. In the next company, three men have been found frozen at their posts.',
    choices: [
      { text: 'Strip the weapons dry and lubricate them with sunflower oil.', train: { scrounging: 1 }, set: { gunsWork: true }, effects: { officers: 3 },
        result: 'A trick from a Finnish volunteer you met in Smolensk: wipe off all the gun oil and use a drop of sunflower oil from the villagers. It works. Your MG fires when others don\'t.' },
      { text: 'Make every man sleep with his rifle bolt inside his coat.', set: { gunsWork: true }, squad: { all: { morale: -2 } }, effects: { warmth: -3 },
        result: 'A frozen steel bolt against your stomach all night. It works. Nobody thanks you.' },
      { text: 'Light fires under everything. Burn what you must.', effects: { warmth: 12, conscience: -2 }, squad: { all: { morale: 4 } },
        result: 'You burn a peasant\'s fence, then his shed. Everyone is warm for an hour. The weapons are still frozen.' }
    ] });

  ev({ id: 'c5_3a', day: 3, phase: 1, scene: 'road', cond: s => s.flags.vogelCaught || s.flags.vogelReported,
    title: 'The Penal Detail',
    text: 'Behind the line, a work gang is digging positions in the frozen earth with picks, under guard: men in uniforms with the insignia torn off, from a field penal camp. Prisoners of the Wehrmacht, sent to the front to dig where the shells fall.\n\nOne of them looks up as your squad passes. It takes you a moment to recognise him. Ernst Vogel. His face is grey and his hands are wrapped in rags.',
    choices: [
      { text: 'Give him your gloves.', effects: { warmth: -10, conscience: 8 }, rel: { vogel: 25 },
        result: 'You pull them off and press them into his hands. A guard shouts. Vogel puts the gloves inside his coat, fast, and goes back to digging. He did not say anything. His eyes did.',
        log: 'Gave my gloves to Ernst Vogel on a penal work detail.' },
      { text: 'Bribe the guard to give him extra rations.', req: s => SIM.has(s, 'cigarettes', 2) || SIM.has(s, 'vodka'), reqText: 'Needs 2 cigarettes or vodka.', effects: { conscience: 5 }, rel: { vogel: 15 },
        outcome: (s, x) => { if (SIM.has(s, 'vodka')) x.item('vodka', -1); else x.item('cigarettes', -2); x.say('The guard pockets it and promises. You will never know if he keeps his word. Vogel watches the exchange and understands.'); } },
      { text: 'Walk past.', effects: { conscience: -6 }, rel: { vogel: -10 },
        result: 'You walk past. When you look back, he is still watching you, leaning on his pick.' }
    ] });
  ev({ id: 'c5_3a_alt', day: 3, phase: 1, scene: 'field',
    title: 'Horses',
    text: 'The supply horses are dying of cold and hunger by the dozen. They lie frozen at the side of the road with their legs in the air. The field kitchen has not come for two days.',
    choices: [
      { text: 'Cut meat from a dead horse. Cook it.', effects: { food: 25, warmth: 6 }, squad: { all: { morale: 5 } }, result: 'You need an axe, not a knife. Horse soup with snow water. It is the best thing anyone has eaten in a week.' },
      { text: 'Share out your last iron ration.', effects: { food: 10 }, squad: { all: { loyalty: 4 } }, result: 'A tin of meat between eight men. A spoonful each. It is the gesture that matters.' }
    ] });

  // ───────────────────────── Day 4 · Monday 1 December ─────────────────────────
  ev({ id: 'c5_4m', day: 4, phase: 0, scene: 'village', time: '22:00',
    title: 'The Lights of Moscow',
    text: 'Istra has fallen. On a clear night, minus twenty-five, from the church tower in the ruins, you can see flashes on the eastern horizon: the anti-aircraft guns of Moscow, thirty kilometres away. A patrol is needed to scout the next village on the road.',
    choices: [
      { text: 'Lead the patrol yourself.', effects: { merit: 3, warmth: -8 }, squad: { all: { loyalty: 4 } },
        risk: { chance: 0.18, dmg: [12, 35], cause: 'Killed on a night patrol thirty kilometres from Moscow, 1 December 1941.', hit: 'A Soviet ski patrol, white on white. You never see them.', miss: 'You crawl to the edge of the next village and count the tanks: four, dug in, white-painted. You bring the numbers back.' } },
      { text: 'Send a man.', assign: true, assignPrompt: 'Who goes on the night patrol?',
        outcome: (s, x) => {
          const m = x.man;
          const p = 0.55 + (SIM.hasTrait(m, 'steady') || SIM.hasTrait(m, 'brave') ? 0.15 : 0) - (SIM.hasTrait(m, 'green') || SIM.hasTrait(m, 'nervous') ? 0.15 : 0);
          if (x.roll(p)) { x.apply({ merit: 2 }); x.squadMod(m.id, { loyalty: 5 }); x.say(`${m.name} comes back at three in the morning with ice in his eyebrows and the numbers: four tanks, dug in. Albrecht writes his name down.`); }
          else { const l = x.lose(m.id, x.roll(0.5) ? 'killed' : 'wounded', 'on a night patrol near Istra'); x.apply({ morale: -8 }); x.say(l.status === 'killed' ? `${m.name} does not come back. In the morning you can see him from the tower, a dark shape on the white field.` : `${m.name} comes back crawling, shot through the hand, his fingers already white with frost.`); }
        } },
      { text: 'Send nobody. It is suicide.', effects: { officers: -4 }, rel: { starck: -4 },
        result: 'Albrecht sends another squad. Two of them come back.' }
    ] });

  ev({ id: 'c5_4a', day: 4, phase: 1, scene: 'camp',
    title: 'Starck\'s Offer',
    text: s => `Starck finds you in the ruins. His men have overrun a Soviet supply dump: sheepskin coats, felt boots, fur caps. Enough for a company.

"Your men are freezing, ${SIM.RANKS[s.rank]}. Mine are not." He lights a cigarette. "I can give you enough for your squad. In return, I need men tomorrow. We have taken partisans. There will be an execution at the crossroads, a public one, for the villagers to see. My men are needed at the front. Yours will do it."`,
    choices: [
      { text: '"My men are soldiers, not hangmen." Refuse.', effects: { conscience: 8 }, rel: { starck: -10 }, squad: { all: { loyalty: 4 } },
        outcome: (s, x) => {
          if (starck(s) >= 30) { x.winter(1); x.say('Starck looks at you for a long time. Then he laughs. "You have nerve. I like that, a little." He has a sledge of felt boots sent over anyway, half of what he offered. "For the nerve," he says.'); }
          else x.say('"Then freeze," Starck says, and walks away. That night, minus thirty.');
        } },
      { text: 'Accept.', effects: { conscience: -25, morale: -10 }, items: { furs: 1, valenki: 1 }, winter: 2, rel: { starck: 15 }, set: { hangmen: true }, squad: { all: { morale: -8 }, kuehn: { loyalty: 6 } },
        result: 'The coats are thick and warm and smell of their previous owners. In the morning at the crossroads your squad does what it was given the coats for. Afterwards nobody speaks for the rest of the day. The bodies stay hanging, as a warning, for weeks.',
        log: 'Accepted winter coats from Starck in exchange for an execution detail.' },
      { text: 'Offer him something else: the icon from Smolensk.', show: s => SIM.has(s, 'icon'), items: { icon: -1, furs: 1 }, winter: 1, rel: { starck: 4 }, effects: { conscience: -2 },
        result: '"A Russian saint." He turns it over, amused. "For my sister. She collects such things." He gives you a coat and a sledge of felt boots. He finds other men for the crossroads.' },
      { text: 'Offer him vodka and a soldier\'s handshake.', show: s => SIM.has(s, 'vodka') && starck(s) >= 25, items: { vodka: -1 }, winter: 1, rel: { starck: 6 },
        result: 'He drinks from the bottle and hands it back. "You are a strange one. Brave, and soft at the same time." He sends the felt boots. The crossroads is done by others.' }
    ] });

  // ───────────────────────── Day 5 · Thursday 4 December ─────────────────────────
  ev({ id: 'c5_5m', day: 5, phase: 0, scene: 'field', time: '04:00',
    title: 'Thirty-Five Below',
    text: s => `Minus thirty-five. The air is so cold it hurts to breathe. The Soviets probe your position before dawn: shapes in white snowsuits crossing the field.

${s.flags.gunsWork ? 'Your weapons work. You made sure of it.' : 'You pull the trigger of the MG. Nothing. The oil has frozen.'}`,
    choices: [
      { text: 'Hold the line.', effects: { merit: 3 }, assault: true,
        risk: { chance: s => s.flags.gunsWork ? 0.12 : 0.28, dmg: [12, 38], cause: 'Killed defending a position thirty kilometres from Moscow, 4 December 1941.', hit: 'They reach the trench.', miss: 'The white shapes go to ground, then pull back into the dark.' },
        outcome: (s, x) => { if (s.flags.gunsWork) { s.flags.heldLine5 = true; x.apply({ officers: 5 }); } const m = x.casualty(s.flags.gunsWork ? 0.12 : 0.3, 'when the Soviets reached the trench'); say(x, m, m => `${m.name} is killed in the trench, his rifle frozen in his hands.`, m => `${m.name} is wounded fighting with a frozen rifle.`); } },
      { text: 'Fall back to the village before they reach you.', effects: { officers: -5, warmth: 5 },
        outcome: (s, x) => { const m = x.casualty(0.12, 'falling back across the snow'); say(x, m, m => `${m.name} is killed in the open.`, m => `${m.name} is wounded in the open.`); if (!m) x.say('You make it back to the houses. In the light of day, the position you left is a white field.'); } }
    ] });

  ev({ id: 'c5_5a', day: 5, phase: 1, scene: 'letter',
    title: 'A Letter to Write',
    text: s => `There is an hour of quiet in a dugout. You have a pencil stub and a sheet of paper. Your fingers are too stiff to write properly. ${s.flags.sweetheart ? 'There is a letter from Liesel in your pocket you have read twelve times. She has said yes.' : ''}`,
    choices: [
      { text: s => s.flags.sweetheart ? 'Write to Liesel.' : 'Write home.', effects: { morale: 8 },
        outcome: (s, x) => x.say(s.flags.sweetheart ? 'You write that you will marry her on your first leave, in her parish church, with Hartmann as best man if he behaves. You do not mention the cold. She will read about it in your handwriting.' : 'You write that you are well and that Moscow is close. Both are true, in a way.') },
      { text: 'Write the truth about the cold and the eviction.', effects: { conscience: 4, suspicion: 6 },
        result: 'You write it, and then you burn it in the dugout stove. The truth, it turns out, is something you can only tell yourself.' },
      { text: 'Help the men who cannot hold a pencil any more.', squad: { all: { loyalty: 5, morale: 3 } }, train: { leadership: 1 },
        result: 'You write five letters for five men, in their words. "Dear Mother, I am well." Five times.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch5 = { has, first, starck, informed, say, score };
})();
