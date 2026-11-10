// Chapter VII: "Stalingrad" — 28 June 1942 to 31 January 1943.
// The steppe, the city, the pocket, the last planes and captivity.
// Days 7–12, random events and endings live in ch7_more.js.
window.SIM = window.SIM || {};

(function () {
  const ss = s => !!s.flags.joinedSS;
  const has = (s, id) => !!SIM.man(s, id) && SIM.man(s, id).status === 'ok';
  const first = m => m.name.split(' ')[0];
  const unit = s => ss(s) ? 'section' : 'squad';
  const say = (x, m, killed, wounded) => { if (m) x.say(m.status === 'killed' ? killed(m) : wounded(m)); };
  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;
  SIM.earnsCross7 = s => score(s) >= 14 || (s.flags.heldFactory && score(s) >= 10);

  const DAYS = [
    { date: 'Sunday, 28 June 1942',      short: 'Sun 28 Jun', place: 'steppe', war: true, temp: 31 },
    { date: 'Thursday, 23 July 1942',    short: 'Thu 23 Jul', place: 'donbend', war: true, temp: 38 },
    { date: 'Sunday, 23 August 1942',    short: 'Sun 23 Aug', place: 'volga_north', war: true, temp: 33 },
    { date: 'Monday, 14 September 1942', short: 'Mon 14 Sep', place: 'city', war: true, temp: 21 },
    { date: 'Wednesday, 14 October 1942', short: 'Wed 14 Oct', place: 'factory', war: true, temp: 9 },
    { date: 'Sunday, 1 November 1942',   short: 'Sun 1 Nov', place: 'factory', war: true, temp: 2 },
    { date: 'Thursday, 19 November 1942', short: 'Thu 19 Nov', place: 'factory', war: true, temp: -6, variant: 'winter' },
    { date: 'Monday, 23 November 1942',  short: 'Mon 23 Nov', place: 'kessel', war: true, temp: -12, variant: 'winter', pocket: true, airlift: 0.6, foodDrain: -6 },
    { date: 'Saturday, 12 December 1942', short: 'Sat 12 Dec', place: 'kessel', war: true, temp: -22, variant: 'winter', pocket: true, airlift: 0.55, foodDrain: -7 },
    { date: 'Thursday, 24 December 1942', short: 'Thu 24 Dec', place: 'kessel', war: true, temp: -25, variant: 'winter', pocket: true, airlift: 0.45, foodDrain: -7 },
    { date: 'Sunday, 17 January 1943',   short: 'Sun 17 Jan', place: 'gumrak', war: true, temp: -30, variant: 'winter', pocket: true, airlift: 0.3, foodDrain: -6 },
    { date: 'Friday, 22 January 1943',   short: 'Fri 22 Jan', place: 'gumrak', war: true, temp: -32, variant: 'winter', pocket: true, airlift: 0.15, foodDrain: -6 },
    { date: 'Sunday, 31 January 1943',   short: 'Sun 31 Jan', place: 'centre', war: true, temp: -28, variant: 'winter', pocket: true, airlift: 0, foodDrain: -6 }
  ];
  const PLACES = {
    steppe:      { name: 'The steppe west of the Don',          x: 10, y: 40 },
    donbend:     { name: 'The great bend of the Don near Kalach', x: 120, y: 140 },
    volga_north: { name: 'The Volga at Rynok, north of Stalingrad', x: 250, y: 120 },
    city:        { name: 'The centre of Stalingrad',             x: 245, y: 145 },
    factory:     { name: 'The factory district, Stalingrad',     x: 255, y: 130 },
    kessel:      { name: 'The pocket: bunkers in the steppe near Pitomnik',   x: 210, y: 145 },
    gumrak:      { name: 'Gumrak airfield, in the pocket',       x: 225, y: 140 },
    centre:      { name: 'The ruins of central Stalingrad',      x: 245, y: 145 }
  };

  SIM.CHAPTERS.push({
    id: 'stalingrad', num: 'VII', title: 'Stalingrad', range: '28 June 1942 – 31 January 1943', year: 1942, start: [1942, 6],
    days: DAYS, places: PLACES, map: 'stalingrad', cold: true, supplies: true, nightMorale: 1,
    finalEvent: 'c7_12a',
    commander: 'Hauptmann von Albrecht',
    hospital: 'a cellar hospital in Stalingrad',
    deathDefault: 'Died of hunger, cold and exhaustion in the Stalingrad pocket, January 1943.',
    kiaText: s => `${s.deathCause || SIM.chapter(s).deathDefault}\n\nYour family will not hear for months. In February 1943 the radio plays the slow movement of Beethoven's Fifth and announces that the Sixth Army has "fought to the last breath". There is no letter. There is no grave.\n\nAbout 300,000 German and allied soldiers were trapped in the pocket. Some 25,000 wounded and specialists were flown out. About 91,000 went into Soviet captivity. Roughly 5,000 of them came home, the last in 1956. Soviet military dead in the battle numbered close to half a million; tens of thousands of the city's civilians died too.`,
    casualties: '',
    warFoodDrain: -5,
    promoDate: '30 January 1943',
    maxRank: s => s.rank >= 4 ? ((s.flags.passedCourse && score(s) >= 15) ? 5 : 4) : ((s.flags.passedCourse || score(s) >= 10) ? 4 : 3),
    meritBar: 8,
    routineReason: 'Time in service. In the last week of January 1943, promotions are handed out in the pocket by radio from army headquarters.',
    meritReason: 'Recommended for conduct in the street fighting and the defence of the pocket.',
    interludeDate: 'May 1942',
    interludeTitle: 'April – June 1942',
    blackMarks: s => s.flags.forgedTag ? ['Left the pocket under false pretences.'] : [],
    awards: (s, sc) => {
      const close = (s.assaultDays || []).filter(k => k.startsWith('6-')).length;
      if (close >= 3) SIM.award(s, 'nahkampf', 'For close combat in the streets and factories of Stalingrad, 1942.', 'January 1943');
      const hadEk2 = s.medals.some(m => m.id === 'ek2' && m.chapter < 6);
      if (!SIM.hasMedal(s, 'ek2') && SIM.earnsCross7(s)) SIM.award(s, 'ek2', 'For bravery at Stalingrad, 1942.', 'December 1942');
      else if (hadEk2 && !SIM.hasMedal(s, 'ek1') && (sc >= 17 || (s.flags.heldFactory && sc >= 13))) SIM.award(s, 'ek1', 'For outstanding bravery in the factory district of Stalingrad, October 1942.', 'December 1942');
      if (s.flags.carriedWounded7) SIM.award(s, 'kvk2', 'For bringing wounded comrades out under fire in the pocket, January 1943.', 'January 1943');
    },
    ending: s => SIM.ch7Ending(s),
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, 85);
      s.stats.morale = Math.max(s.stats.morale, 58);
      s.stats.food = 80; s.stats.warmth = 80;
      s.marks += 15;
      s.stats.suspicion = Math.max(0, s.stats.suspicion - 20);
      if (!s.squad) SIM.makeSquad(s);
      SIM.squadMen(s).forEach(m => { m.morale = Math.max(m.morale, 60); });
    },
    onStart: s => {
      s.supplies = { ammo: 10, rations: 9, med: 5 };
      s.squadWinter = 1; s.shelter = 0;
      SIM.addMan(s, { id: 'grischa', name: 'Grigori "Grischa" Sobol', role: 'Hiwi (auxiliary volunteer)', age: 27, traits: ['steady', 'loyal'], loyalty: 50, morale: 55,
        bio: 'A Ukrainian collective-farm tractor driver, taken prisoner at Kiev in 1941. He volunteered to work for the German army rather than starve in a camp. If the Red Army takes him back, he will be shot as a traitor.' });
    },
    interlude: s => interludeItems(s),
    interludeEvents: ['i6_kharkov']
  });

  function interludeItems(s) {
    const out = [];
    out.push({ year: 'May 1942', text: `${ss(s) ? 'Your section reached the front in May, attached with Starck to the staff of the Sixth Army as an SS liaison detachment.' : 'You rejoined the company in May, in a village south of Kharkov.'} In the third week of May the Red Army attacked at Kharkov and walked into a trap: 240,000 prisoners. The men said that the Russians were finished. The officers said it more carefully.` });
    out.push({ year: 'June', text: `The Führer's directive for the summer: the oil fields of the Caucasus, and the Volga at a city called Stalingrad. ${ss(s) ? 'Starck is delighted. "The city that bears his name," he says. "Imagine taking it."' : 'Albrecht shows the squad leaders the map. The distances are enormous.'}\n\nThe Sixth Army is assigned the Volga. It is the largest army Germany has: three hundred thousand men.` });
    if (s.flags.married) out.push({ year: 'June', text: 'Liesel writes every week. She thinks she might be pregnant. She will know for certain in August.' });
    return out;
  }

  SIM.INTERLUDE_EVENTS.i6_kharkov = {
    id: 'i6_kharkov', scene: 'steppe',
    title: 'Before the Offensive, June 1942',
    text: s => `The last week before the offensive. Your ${unit(s)} is resting in a village of whitewashed huts, among cherry orchards. There is time for one thing.`,
    choices: [
      { text: 'Get your men proper kit: canteens, goggles against the dust, spare boots.', supply: { ammo: 1 }, squad: { all: { loyalty: 4 } }, train: { scrounging: 1 },
        result: 'Three days of arguing with quartermasters. Every man ends up with two canteens. In August, on the steppe, two canteens will be the difference between walking and lying in the dust.' },
      { text: 'Train them in street fighting: grenades, doorways, cellars.', set: { streetDrill: true }, train: { leadership: 1 }, squad: { all: { morale: -2, loyalty: 3 } },
        result: 'You use the ruins of a collective-farm barn. Through the door, grenade first, low and fast. The men think it is pointless on the open steppe. They will stop thinking so in September.' },
      { text: 'Let them rest under the cherry trees.', squad: { all: { morale: 10 } }, effects: { health: 5 },
        result: 'Cherries, a river to swim in, Ukrainian girls who laugh at the soldiers\' terrible Russian. It is the last peaceful week some of them will have.' }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 6 }, o));

  // ───────────────────────── Day 0 · Sunday 28 June ─────────────────────────
  ev({ id: 'c7_0m', day: 0, phase: 0, scene: 'steppe', time: '05:00',
    title: 'Sunflowers to the Horizon',
    text: s => `Operation Blue begins at dawn. The steppe opens up in front of you: flat as a table, gold with wheat and sunflowers, cut by dry ravines the Russians call balkas. The panzers race ahead, and the infantry walks behind them, forty kilometres a day in a cloud of dust.

This time the Red Army does not stand and fight. It falls back, and back, and the men begin to say that it is beaten.${ss(s) ? '\n\nStarck rides in a staff car beside your section\'s truck, reading maps.' : ''}`,
    choices: [
      { text: 'Push the pace. Keep up with the panzers.', effects: { officers: 4, merit: 1, health: -6 }, squad: { all: { morale: -3 } },
        result: 'Your squad is the first into three villages in a row. Albrecht notes it. The men\'s feet bleed into their boots.' },
      { text: 'March at a pace they can keep, and save water.', supply: { rations: 1 }, squad: { all: { loyalty: 4 } }, train: { leadership: 1 },
        result: 'An hour\'s rest in every four, in the shade of a broken tractor. Nobody falls out. You reach the evening\'s village behind everyone else, and in better shape.' },
      { text: 'Trade with the villagers for food as you go.', effects: { food: 15, marks: -3 }, supply: { rations: 2 }, train: { scrounging: 1 },
        result: 'Eggs, sunflower seeds, a sack of flour. The old women watch your squad go with flat, patient faces. They have seen armies go east before, and come back west.' }
    ] });

  ev({ id: 'c7_0a', day: 0, phase: 1, scene: 'steppe',
    title: 'Grischa',
    text: s => `A new man is assigned to your ${unit(s)}: Grigori Sobol, called Grischa, twenty-seven, a Ukrainian tractor driver from near Poltava. He was taken prisoner at Kiev. He volunteered to work for the German army as a "Hiwi", an auxiliary, rather than starve in the camps, where hundreds of thousands of his comrades did starve.

He drives, digs, cooks and carries ammunition. He speaks a little German. He looks at you with careful, measuring eyes.

${ss(s) ? 'Voss looks at him with open contempt. "A Slav. In an SS section."' : has(s, 'kuehn') ? 'Kühn says, loudly, "Since when do we take Bolsheviks into the squad?"' : 'The men look at him, then at you.'}`,
    choices: [
      { text: 'Shake his hand. He is one of the squad now.', effects: { conscience: 4 }, squad: { grischa: { loyalty: 15 } }, set: { grischaComrade: true },
        outcome: (s, x) => { if (ss(s)) { x.squadMod('voss', { loyalty: -6 }); x.rel('starck', -4); } x.say('His hand is hard and dry. "Spasibo," he says, and then, carefully, "Danke." That evening he cooks for everyone: kasha with sunflower oil. Even the ones who glared at him eat it.'); } },
      { text: 'He works. That is what he is here for.', effects: { officers: 1 }, squad: { grischa: { loyalty: -4 } },
        result: 'He works. He digs the latrines and carries the heaviest boxes and sleeps under the truck. He does not complain. He does not smile either.' },
      { text: 'Ask him why he volunteered.', train: { leadership: 1 }, squad: { grischa: { loyalty: 8 } }, effects: { conscience: 2 },
        result: '"In the camp at Kiev," he says slowly, "we ate grass. Then we ate the men who died." He looks at the horizon. "I want to live. Is that a crime?" You do not have an answer.' }
    ] });

  // ───────────────────────── Day 1 · Thursday 23 July ─────────────────────────
  ev({ id: 'c7_1m', day: 1, phase: 0, scene: 'steppe', time: '06:00',
    title: 'The Don Bend',
    text: 'Thirty-eight degrees, and the Soviets have turned to fight in the great bend of the Don, west of Kalach. Dug-in T-34s and anti-tank guns in the balkas. Your company must clear a ravine so that the panzers can pass.',
    choices: [
      { text: 'Clear the ravine from the flank, under cover of the MG.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.14, dmg: [12, 35], cause: 'Killed in the bend of the Don, July 1942.', hit: 'A Soviet machine gun at the end of the ravine.', miss: 'Down the side of the balka, grenades, a short, savage fight among the thorn bushes. Then the panzers roll past.' },
        outcome: (s, x) => { const m = x.casualty(0.18, 'in the Don bend'); say(x, m, m => `${m.name} is killed in the ravine.`, m => `${m.name} is wounded in the ravine and sent back on a truck.`); } },
      { text: 'Call in the Stukas and wait.', effects: { officers: -2 }, supply: { ammo: -1 },
        outcome: (s, x) => { x.say('An hour later the Stukas come, screaming down out of the white sky. When the smoke clears, the ravine is quiet.'); const m = x.casualty(0.06, 'by a Soviet survivor in the ravine'); say(x, m, m => `${m.name} is shot by a wounded Russian who is not quite dead.`, m => `${m.name} is wounded by a wounded Russian who is not quite dead.`); } }
    ] });

  ev({ id: 'c7_1a', day: 1, phase: 1, scene: 'village',
    title: 'Water',
    text: s => `A Cossack village on the Don. The Cossacks have little love for the Soviets; some of them came out with bread and salt. But the well has been poisoned by the retreating Red Army, or so the rumour says, and your ${unit(s)} has had no water since dawn. An old Cossack woman says the water is fine. She drinks a cup to show you.`,
    choices: [
      { text: 'Trust her. Drink.', effects: { health: 6, morale: 4 }, supply: { rations: 1 },
        result: 'The water is cold and tastes of iron. Nobody is poisoned. The old woman nods, as if you had passed a test.' },
      { text: 'Boil everything first.', effects: { health: 3 }, squad: { all: { morale: -2 } },
        result: 'An hour of boiling water over a dung fire in thirty-eight degrees. Safe, and miserable.' },
      { text: 'Make her drink from every bucket first.', effects: { conscience: -4, health: 5 },
        result: 'She does it, bucket after bucket, without looking at you. Afterwards her granddaughter spits in the dust behind your back.' }
    ] });

  // ───────────────────────── Day 2 · Sunday 23 August ─────────────────────────
  ev({ id: 'c7_2m', day: 2, phase: 0, scene: 'steppe', time: '16:00',
    title: 'The Volga',
    text: 'The panzers break through from the Don to the Volga in one day. In the late afternoon your company reaches the high bank at Rynok, north of the city, and there it is: the Volga, a kilometre wide, grey-blue, with the flat endless steppe of Asia on the far side.\n\nMen take photographs. Some of them cry. Some of them say, "This is the end of the world."',
    choices: [
      { text: 'Take off your helmet and look at it.', effects: { morale: 8 },
        result: 'The Volga. At school it was a line on a map, the edge of Europe. Now it is a river with barges on it, and gulls, and you have walked here.' },
      { text: 'Fill your canteen from the Volga, for your father.', effects: { morale: 5 }, rel: { father: 4 },
        result: 'A field-post bottle of grey water. You will send it home. It will never arrive, but you do not know that yet.' },
      { text: 'Look south, at the smoke over the city.', effects: { conscience: 2, morale: -2 },
        result: 'Stalingrad stretches along the river for forty kilometres. Tonight it is burning from one end to the other.' }
    ] });

  ev({ id: 'c7_2a', day: 2, phase: 1, scene: 'ruins', time: '19:00',
    title: 'Six Hundred Aircraft',
    text: 'All evening the Luftwaffe bombs the city: six hundred aircraft, wave after wave, high explosive and incendiaries on wooden suburbs and oil tanks. Thousands of civilians are killed tonight. The sky to the south is orange, and the smoke rises five kilometres high.\n\nA column of refugees comes north along the riverbank, out of the fire: women, children, old men, with what they can carry.',
    choices: [
      { text: 'Share your water and bread with them.', effects: { conscience: 6, food: -10 }, supply: { rations: -1 },
        result: 'A woman with burned hands takes the bread for a child who cannot stop coughing. Your squad gives away a day\'s rations. Nobody tells them to.' },
      { text: 'Send them west, away from the fighting.', effects: { conscience: 2 },
        result: '"West," you say, pointing. They go west, onto the steppe, toward the German rear. Some of them will be sent to Germany as forced labourers. Some will die on the road. You will never know which.' },
      { text: 'Watch the city burn.', effects: { morale: 2, conscience: -3 },
        result: 'It is the most terrible and beautiful thing you have ever seen. Someone says, "There will be nothing left for the Russians to defend." He is wrong.' }
    ] });

  // ───────────────────────── Day 3 · Monday 14 September ─────────────────────────
  ev({ id: 'c7_3m', day: 3, phase: 0, scene: 'ruins', time: '08:00',
    title: 'The Grain Elevator',
    text: s => `The city centre. The fighting is not like anything before: not fronts and lines but streets, houses, single rooms. The Soviets hold the great concrete grain elevator above the river, and every building around it.

Your ${unit(s)} must take a block of flats across the street. Forty metres of open ground.${s.flags.streetDrill ? ' You trained for this under the cherry trees.' : ''}`,
    choices: [
      { text: 'Smoke, then rush across all at once.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: s => s.flags.streetDrill ? 0.13 : 0.2, dmg: [12, 38], cause: 'Killed in the street fighting in the centre of Stalingrad, September 1942.', hit: 'Halfway across, through the smoke, a burst from a cellar window.', miss: 'Smoke, the rush, the doorway, a grenade up the stairs. The building is yours, floor by floor, by evening.' },
        outcome: (s, x) => { const m = x.casualty(s.flags.streetDrill ? 0.14 : 0.24, 'crossing the street'); say(x, m, m => `${m.name} is killed in the street.`, m => `${m.name} is wounded in the street and dragged into the doorway.`); } },
      { text: 'Blast through the walls from house to house. Never use the street.', effects: { merit: 2 }, train: { leadership: 1 }, supply: { ammo: -3 }, assault: true,
        risk: { chance: 0.08, dmg: [10, 28], cause: 'Killed fighting house to house in Stalingrad, September 1942.', hit: 'A grenade comes back through the hole you blew.', miss: 'Pioneers\' charges through the cellar walls, one house at a time. Slow and safe, and it eats ammunition.' },
        outcome: (s, x) => { const m = x.casualty(0.08, 'fighting through the cellars'); say(x, m, m => `${m.name} is killed in a cellar.`, m => `${m.name} is wounded in a cellar.`); } }
    ] });

  ev({ id: 'c7_3a', day: 3, phase: 1, scene: 'ruins',
    title: 'The Sniper',
    text: s => `A Soviet sniper in the ruins opposite. Three men in your company shot through the head since morning, each from a different direction. Nobody can move in daylight. Someone has to find him.`,
    choices: [
      { text: 'Hunt him yourself.', effects: { merit: 2 }, train: { shooting: 1 },
        risk: { chance: 0.16, dmg: [15, 40], fatal: 0.25, cause: 'Shot by a Soviet sniper in Stalingrad, September 1942.', hit: 'You raise your head for one second.', miss: 'Six hours lying in the rubble with a periscope. A flash of glass in a chimney. One shot. The sniper is a girl of about nineteen.' },
        outcome: (s, x) => { if (!x.wasHit) x.apply({ conscience: -3 }); } },
      { text: 'Send your best shot.', assign: true, assignPrompt: 'Who goes after the sniper?',
        outcome: (s, x) => { const m = x.man; const p = 0.5 + (SIM.hasTrait(m, 'steady') ? 0.15 : 0) - (SIM.hasTrait(m, 'green') || SIM.hasTrait(m, 'nervous') ? 0.2 : 0);
          if (x.roll(p)) { x.apply({ merit: 1 }); x.squadMod(m.id, { morale: 6, loyalty: 4 }); x.say(`${m.name} lies in the rubble all afternoon. At dusk, one shot. He comes back and does not want to talk about who it was.`); }
          else { const l = x.lose(m.id, x.roll(0.75) ? 'killed' : 'wounded', 'by a Soviet sniper'); x.apply({ morale: -8 }); x.say(l.status === 'killed' ? `${m.name} raises his head once. That is all it takes.` : `${m.name} is shot through the shoulder and lies in the rubble until dark, when you can reach him.`); } } },
      { text: 'Bring down the whole building with an anti-tank gun.', supply: { ammo: -2 }, effects: { officers: 2 },
        result: 'Four rounds into the ruin opposite until it collapses. Nobody knows if the sniper was inside. Tomorrow there will be another one.' }
    ] });

  // ───────────────────────── Day 4 · Wednesday 14 October ─────────────────────────
  ev({ id: 'c7_4m', day: 4, phase: 0, scene: 'factory', time: '07:30',
    title: 'The Tractor Works',
    text: 'The great offensive into the factory district. The Dzerzhinsky Tractor Works: kilometres of ruined halls, gantries, chimneys, furnaces, rail yards. Three hundred Stukas bomb it at dawn. Then the infantry goes in.\n\nInside, it is a labyrinth. The Soviets are in the pits under the machinery, in the drains, behind the furnaces. Every hall is a battle.',
    choices: [
      { text: 'Lead the assault into the assembly hall.', effects: { merit: 4, officers: 6 }, assault: true, supply: { ammo: -3 }, set: { heldFactory: true },
        risk: { chance: 0.22, dmg: [14, 42], cause: 'Killed in the Tractor Works at Stalingrad, 14 October 1942.', hit: 'Something explodes beside you under a gantry.', miss: 'Through the hall, from girder to girder, grenades into the pits. By evening your squad holds the assembly hall. It costs everything you have.' },
        outcome: (s, x) => { const m = x.casualty(0.3, 'in the Tractor Works'); say(x, m, m => `${m.name} is killed among the machines.`, m => `${m.name} is wounded in the assembly hall.`); } },
      { text: 'Hold the rail yard and cover the attack.', effects: { merit: 2, officers: 2 }, supply: { ammo: -2 },
        risk: { chance: 0.12, dmg: [10, 30], cause: 'Killed covering the attack on the Tractor Works, October 1942.', hit: 'Mortar fire walks across the rail yard.', miss: 'You fire until the barrels glow and your hands blister. The assault goes in under your fire.' },
        outcome: (s, x) => { const m = x.casualty(0.16, 'in the rail yard'); say(x, m, m => `${m.name} is killed in the rail yard.`, m => `${m.name} is wounded in the rail yard.`); } }
    ] });

  ev({ id: 'c7_4a', day: 4, phase: 1, scene: 'ruins',
    title: 'The Ravine',
    text: s => `Behind the factory, in a ravine, the dressing station: wounded men lying in rows in the open, waiting for trucks that do not come. ${(s.losses || []).some(l => l.chapter === 6 && l.status === 'wounded') ? 'Some of your own men are among them.' : 'Men from your company are among them.'} The doctor has no morphine left.`,
    choices: [
      { text: 'Give them your squad\'s medical kit.', supply: { med: -3 }, effects: { conscience: 6 }, squad: { all: { loyalty: 5 } },
        result: 'Morphine, dressings, sulfa powder. The doctor takes it without a word and goes to work. Your squad will have less when its own time comes. Every man knows it, and nobody objects.' },
      { text: 'Find a truck and get them out yourself.', effects: { merit: 2, health: -4 }, train: { scrounging: 1 },
        outcome: (s, x) => { if (x.roll(0.5 + SIM.skill(s, 'scrounging') * 0.08)) { x.apply({ conscience: 6 }); x.say('You find a Russian truck with half a tank of fuel in the rubble. Eleven wounded men on the back, through the ruins to the airfield at Gumrak. You come back at midnight. You will never know how many of them lived.'); } else { x.apply({ morale: -4 }); x.say('There are no trucks. You come back with nothing. The rows of wounded are longer.'); } } },
      { text: 'Keep your kit. Your men will need it.', effects: { conscience: -3 },
        result: 'You walk past the rows. The doctor does not look up. Your medical kit stays in your pack.' }
    ] });

  // ───────────────────────── Day 5 · Sunday 1 November ─────────────────────────
  ev({ id: 'c7_5m', day: 5, phase: 0, scene: 'ruins',
    title: 'Rattenkrieg',
    text: 'The men have a word for it now: Rattenkrieg, the war of the rats. Your squad holds half a building: the ground floor and the cellar. The Soviets hold the first floor and the attic. You can hear them talking through the ceiling. Sometimes a grenade comes down the stairwell; sometimes you send one up.\n\nThe Volga is two hundred metres away. It might as well be two hundred kilometres.',
    choices: [
      { text: 'Fortify: sandbags, wire on the stairs, firing slits.', supply: { ammo: -1 }, set: { dugIn: true }, squad: { all: { morale: 3, loyalty: 3 } }, train: { leadership: 1 },
        result: 'Two days of work in silence, under the enemy\'s feet. When the Soviets come down the stairs at night, the wire and the slits do the rest.' },
      { text: 'Clear the upper floor. Finish it.', effects: { merit: 3 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.2, dmg: [12, 38], cause: 'Killed fighting floor by floor in a building in Stalingrad, November 1942.', hit: 'On the stairs, a burst from above.', miss: 'Up the stairs, grenades through the doors. By noon the building is yours. By night the Soviets have taken the attic back.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'on the stairs'); say(x, m, m => `${m.name} is killed on the stairs.`, m => `${m.name} is wounded on the stairs.`); } },
      { text: 'Talk to them through the ceiling.', show: s => has(s, 'grischa'), effects: { conscience: 3 }, squad: { grischa: { loyalty: 6 } },
        result: 'Grischa calls up through the ceiling in Russian. After a long silence, a voice answers: tobacco for bread. A bag comes down on a string; a bag goes up. For one afternoon nobody throws grenades.' }
    ] });

  ev({ id: 'c7_5a', day: 5, phase: 1, scene: 'ruins',
    title: 'The Cellar Children',
    text: 'In the deepest cellar of the building there are civilians: four women, an old man and six children, who have been living down there since August. They come up at night to scavenge. The children are grey and silent. One of them, a boy of about eight, follows your squad around asking for "khleb", bread.\n\nThe order is that civilians in the combat zone are to be sent to the rear.',
    choices: [
      { text: 'Give them bread from the squad\'s rations.', supply: { rations: -1 }, effects: { conscience: 6 },
        result: 'Half a loaf for six children. They eat it in the dark, very slowly. The boy comes back every evening after that.' },
      { text: 'Get them out to the rear, through the ruins at night.', effects: { conscience: 8, health: -3 },
        risk: { chance: 0.1, dmg: [10, 28], cause: 'Killed taking civilians out through the ruins of Stalingrad, November 1942.', hit: 'A flare goes up, and a machine gun opens on the shapes moving in the rubble.', miss: 'Through the rubble in the dark, the children holding hands. At the edge of the city you hand them to a field-kitchen sergeant who swears and then gives them soup.' } },
      { text: 'Leave them where they are. There is nothing to be done.', effects: { conscience: -3 },
        result: 'They stay in the cellar. You hear the children at night, coughing.' }
    ] });

  ev({ id: 'c7_5n', day: 5, phase: 2, scene: 'ruins', time: '22:00',
    title: 'Starck in the Ruins',
    text: s => `Starck finds you in the cellar after dark, in a fur-collared coat, shaking brick dust off his cap. ${ss(s) ? 'He has been at army headquarters.' : 'He is the SS liaison officer at corps now.'}

"The Führer said it in the Sportpalast," he says. "We will take Stalingrad. Nobody will move us from here." He looks at the ceiling, where the Russians are. "Your men look tired. Are they?"`,
    choices: [
      { text: '"They\'ll hold, Herr Hauptsturmführer."', rel: { starck: 6 }, effects: { officers: 2 }, set: { metStarck: true },
        result: '"Good." He gives you a packet of real coffee and a bottle of French brandy. "For the men." It is the most useful thing anyone has given you in weeks.', supply: { rations: 1 } },
      { text: '"They\'re finished. Half the company is dead."', rel: { starck: -6 }, effects: { suspicion: 6, conscience: 3 }, squad: { all: { loyalty: 4 } }, set: { metStarck: true },
        result: 'He looks at you for a long time. "Then the other half must fight twice as hard," he says. He leaves without giving you anything. Your men heard every word.' },
      { text: 'Ask him what happens if the Russians attack the flanks.', rel: { starck: 2 }, effects: { conscience: 1 }, set: { askedFlanks: true, metStarck: true },
        result: '"The Romanians hold the flanks." He shrugs. "They are poorly equipped. The generals have mentioned it." For the first time since you have known him, Starck looks uncertain. Then the look is gone.' }
    ] });

  // ───────────────────────── Day 6 · Thursday 19 November ─────────────────────────
  ev({ id: 'c7_6m', day: 6, phase: 0, scene: 'ruins', time: '07:30',
    title: 'Thunder in the North',
    text: 'Fog and the first snow. At half past seven a sound comes from the northwest, far away, beyond the Don: a continuous rolling thunder, on and on, for more than an hour. Thousands of guns.\n\nBy noon the rumours reach the factory: the Red Army has attacked the Romanian Third Army on the Don, and the Romanians have broken.',
    choices: [
      { text: '"The Romanians will hold. And if not, the panzers will deal with it."', effects: { morale: 3 },
        result: 'Nobody believes it, and everybody says it.' },
      { text: 'Start stockpiling: ammunition, food, anything.', supply: { ammo: 2, rations: 2 }, effects: { officers: -2 }, train: { scrounging: 1 },
        result: 'You strip the dead, the ruined depots and a Russian supply barge. Your squad hides it in the cellar. A quartermaster accuses you of looting army stores. In a week he will be starving.' },
      { text: 'Get the men winter clothing now, before it\'s too late.', winter: 1, effects: { conscience: -2 },
        result: 'Quilted Russian jackets from the dead, felt boots, fur caps. Your squad looks like partisans. In December it will be the difference.' }
    ] });

  ev({ id: 'c7_6a', day: 6, phase: 1, scene: 'factory',
    title: 'Old Comrades',
    cond: s => ss(s) ? !!(s.oldSquad || []).find(m => m.status === 'ok') : s.flags.metStarck,
    text: s => ss(s)
      ? `In the ruins of the Red October works you meet your old company. Hauptmann von Albrecht, grey-faced. ${(s.oldSquad || []).filter(m => m.status === 'ok').map(m => m.name).join(', ')}: what is left of the squad you led in Russia. They look at your black collar patches. Then ${(s.oldSquad || []).find(m => m.id === 'hartmann' && m.status === 'ok') ? 'Hartmann' : 'one of them'} holds out his hand.`
      : 'Starck\'s staff car is parked by your company command post. Through the doorway you hear him arguing with Albrecht: the SS wants the Army to take over a sector "with less sentiment". Albrecht says something you cannot hear. Starck comes out white with anger and sees you.',
    choices: [
      { text: s => ss(s) ? 'Shake his hand.' : 'Salute him correctly.', effects: { morale: 6 },
        outcome: (s, x) => { if (ss(s)) { x.rel('hartmann', 10); x.rel('albrecht', 6); x.say('For a few minutes in a ruined factory hall you are all simply soldiers. Albrecht says, "Look after yourself, Unterscharführer." He means it.'); } else { x.rel('starck', 2); x.say('"Your Hauptmann," Starck says, "has the Army\'s disease. Correctness." He gets into his car. Albrecht, in the doorway, says nothing.'); } } },
      { text: s => ss(s) ? 'Share your rations with them.' : 'Ask Albrecht what they argued about.', effects: { conscience: 3 },
        outcome: (s, x) => { if (ss(s)) { x.supply('rations', -1); x.rel('albrecht', 10); x.say('SS rations are better. You hand over what you can spare. Albrecht takes it for his men without a word.'); } else { x.rel('albrecht', 6); x.say('"Prisoners," Albrecht says. "He wants them handed to his people. I said they are prisoners of war." He lights a cigarette with steady hands. "It may not matter much longer."'); } } }
    ] });
  ev({ id: 'c7_6a_alt', day: 6, phase: 1, scene: 'factory',
    title: 'The Radio',
    text: 'The battalion radio operator has heard it on the Soviet frequencies: two Soviet spearheads, one from the north and one from the south, are racing towards each other behind the Sixth Army. If they meet, the whole army is cut off.',
    choices: [
      { text: 'Tell the men.', squad: { all: { morale: -6, loyalty: 4 } }, result: 'They take it quietly. One of them asks how far it is to Germany. Nobody answers.' },
      { text: 'Keep it to yourself.', effects: { morale: -4 }, result: 'You carry it alone through the evening. It is heavier than the MG.' }
    ] });

  SIM.EVENTS.push(...E);
  SIM.ch7 = { ss, has, first, unit, say, score };
})();
