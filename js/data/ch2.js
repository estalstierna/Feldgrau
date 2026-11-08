// Chapter II: "The Meuse" (10 – 16 May 1940). The western campaign: the Ardennes,
// the crossing of the Meuse at Dinant, and the pursuit into France.
window.SIM = window.SIM || {};

(function () {
  // ── Helpers for people whose fate depends on Chapter I ──
  const leader = s => s.flags.savedBrandt ? 'Unteroffizier Kowalczyk' : 'Unteroffizier Brandt';
  const leaderShort = s => s.flags.savedBrandt ? 'Kowalczyk' : 'Brandt';
  const vogelHere = s => !!s.flags.vogelStays;
  const leads = s => s.rank >= 2; // a Gefreiter leads the machine-gun team
  const friendHere = s => vogelHere(s) ? 'Vogel' : 'Rau';
  const speaksFrench = s => !!s.flags.educated;
  // The same score the promotion board uses.
  const score = s => (s.chMerit || 0) + (s.stats.officers - 50) / 10;
  const earnsCross = s => !s.flags.refusedOrder2 && (score(s) >= 11 || (s.flags.tankKill && score(s) >= 7));

  const DAYS = [
    { date: 'Friday, 10 May 1940',    short: 'Fri 10 May', place: 'eifel', war: true },
    { date: 'Saturday, 11 May 1940',  short: 'Sat 11 May', place: 'ardennes', war: true },
    { date: 'Sunday, 12 May 1940',    short: 'Sun 12 May', place: 'heights', war: true },
    { date: 'Monday, 13 May 1940',    short: 'Mon 13 May', place: 'dinant', war: true },
    { date: 'Tuesday, 14 May 1940',   short: 'Tue 14 May', place: 'onhaye', war: true },
    { date: 'Wednesday, 15 May 1940', short: 'Wed 15 May', place: 'flavion', war: true },
    { date: 'Thursday, 16 May 1940',  short: 'Thu 16 May', place: 'frontier', war: true }
  ];

  const PLACES = {
    eifel:    { name: 'The Eifel, on the Belgian border',           x: 286, y: 112 },
    border:   { name: 'Belgian border near St. Vith',              x: 262, y: 118 },
    ardennes: { name: 'The Belgian Ardennes',                      x: 222, y: 128 },
    heights:  { name: 'The heights above the Meuse near Dinant',   x: 163, y: 112 },
    dinant:   { name: 'The Meuse at Houx, north of Dinant',        x: 152, y: 108 },
    onhaye:   { name: 'Onhaye, west of the Meuse',                 x: 140, y: 120 },
    flavion:  { name: 'Near Flavion and Philippeville, Belgium',   x: 122, y: 130 },
    frontier: { name: 'The French border near Cerfontaine',        x: 98,  y: 146 }
  };

  // ── Chapter registration ──
  SIM.CHAPTERS.push({
    id: 'france', num: 'II', title: 'The Meuse', range: '10 – 16 May 1940', year: 1940,
    days: DAYS, places: PLACES, map: 'france',
    finalEvent: 'c2_6n',
    commander: 'Oberleutnant von Albrecht',
    hospital: 'Trier',
    deathDefault: 'Killed in Belgium, May 1940.',
    casualties: 'About 27,000 German soldiers were killed in the six weeks of the western campaign. The French army lost roughly 60,000 to 90,000 dead; Belgium, the Netherlands and Britain thousands more.',
    promoDate: '1 July 1940',
    maxRank: 3,
    meritBar: 10,
    routineReason: 'Time in service and a clean record through the western campaign.',
    meritReason: 'Recommended by Oberleutnant von Albrecht for conduct at the Meuse crossing.',
    interludeDate: 'Winter 1939/40',
    interludeTitle: 'September 1939 – May 1940',
    blackMarks: s => {
      const b = [];
      if (s.flags.refusedOrder2) b.push('You refused an order in Belgium.');
      if (s.flags.asleep_1) b.push('You were found asleep on sentry duty.');
      return b;
    },
    awards: (s, sc) => {
      const hadEk2 = s.medals.some(m => m.id === 'ek2' && m.chapter < 1);
      if (!SIM.hasMedal(s, 'ek2') && earnsCross(s)) SIM.award(s, 'ek2', 'For bravery at the crossing of the Meuse, May 1940.', 'June 1940');
      else if (hadEk2 && !s.flags.refusedOrder2 && (sc >= 15 || (s.flags.tankKill && sc >= 11))) SIM.award(s, 'ek1', 'For outstanding bravery in the Meuse bridgehead, May 1940.', 'June 1940');
    },
    ending: s => {
      if (s.stats.health < 30) return 'fr_wounded';
      if (earnsCross(s)) return 'fr_decorated';
      if (s.stats.suspicion >= 55 || s.flags.refusedOrder2) return 'fr_marked';
      if (s.stats.conscience <= 25) return 'fr_hardened';
      if (s.stats.conscience >= 70) return 'fr_witness';
      return 'fr_survivor';
    },
    // Months pass between the chapters: wounds heal, nerves settle.
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, s.ending === 'wounded' ? 78 : 88);
      s.stats.morale = Math.max(s.stats.morale, 55);
      s.stats.food = 75;
      if (s.stats.suspicion < 80) s.stats.suspicion = Math.max(0, s.stats.suspicion - 15);
      s.marks += 15; // pay for the winter
    },
    onStart: s => { s.flags.rauHere = true; },
    interlude: s => interludeItems(s),
    interludeEvent: 'i1_leave'
  });

  // ── Interlude: September 1939 – May 1940 ──
  function interludeItems(s) {
    const out = [];
    out.push({ year: 'Sep 1939', text: `On 17 September the Red Army invaded Poland from the east, as agreed in secret with Berlin. Warsaw surrendered on 27 September; the last Polish troops laid down their arms on 6 October. Poland was divided and erased from the map.

Behind the front, SS and police units began shooting Polish teachers, priests, landowners and Jews by the thousand. In the regiment, men spoke of it in low voices, if at all. General Blaskowitz, commanding in occupied Poland, protested in writing to Berlin. He was removed from his post.` });

    if (s.ending === 'wounded') out.push({ year: 'Oct 1939', text: 'You spent the autumn in a reserve hospital in Stettin. The wound healed into a white, puckered scar. You learned to walk without a limp, and to stop flinching when a door slammed. By December you were declared fit for active service.' });

    // The fates of the men from Chapter I.
    const f = [];
    if (s.flags.vogelStays) f.push(s.flags.vogelSaved ? 'Ernst Vogel is still with the squad. He has not forgotten the ditch at the border, and he follows you around like a younger brother.' : 'Ernst Vogel is still with the squad, quieter than ever. He writes to his father every Sunday.');
    else if (s.flags.vogelCaught || s.flags.vogelReported) f.push('Ernst Vogel was court-martialled for desertion. The death sentence was commuted to ten years\' penitentiary, to be served "after the war". Until then he digs peat in a punishment camp in the Emsland moors. Nobody in the squad says his name.');
    else if (s.flags.vogelDeserted) f.push('Ernst Vogel was never found. Some say a farmer near Neustettin is hiding him. Some say he drowned. His mother writes to the company every month asking for news.');
    f.push(s.flags.savedBrandt ? 'Paul Brandt came back from hospital with a limp and the rank of Feldwebel. He is now platoon sergeant. Your new squad leader is Unteroffizier Max Kowalczyk, a miner\'s son from Gelsenkirchen whose grandfather came from Poland. He jokes that he is the only man in the company who could ask the way to Warsaw.' : 'Unteroffizier Brandt is still your squad leader, older and harder.');
    f.push(s.flags.betrayedHartmann ? 'Willi Hartmann speaks to you when he has to, and not otherwise.' : (s.flags.hartmannFriend || s.flags.protectedHartmann ? 'Willi Hartmann still talks about Argentina. He has added a cattle ranch and a dancer from Buenos Aires.' : 'Willi Hartmann is still telling bad jokes, more carefully now.'));
    f.push('Karl Lenz was promoted to Gefreiter in November and wears his stripe as if it were a general\'s collar tabs.');
    f.push('Leutnant von Albrecht is now Oberleutnant and commands the company. Hauptmann Steiner went to a staff post. Nobody mentions the village in the Tuchel Heath.');
    if (s.flags.savedPole) f.push('Once, on a train through Pomerania, you saw Polish prisoners of war working in a field. You looked for a face you knew. Tadeusz was not there, or you did not recognise him.');
    out.push({ year: 'Autumn', text: f.join('\n\n') });

    out.push({ year: 'Winter', text: 'The regiment was moved west, to the Eifel hills on the Belgian border. The winter of 1939–40 was the coldest in living memory. In the trenches of the West Wall, men froze, played cards and practised crossing rivers in rubber boats on the Moselle. The French did not attack. The newspapers called it the "Sitzkrieg"; the French called it the "drôle de guerre".' });
    return out;
  }

  SIM.INTERLUDE_EVENTS = SIM.INTERLUDE_EVENTS || {};
  SIM.INTERLUDE_EVENTS.i1_leave = {
    id: 'i1_leave', scene: 'letter',
    title: 'Christmas Leave, 1939',
    text: s => `In December you were given ten days' home leave. The train to ${SIM.townName(s.char.hometown)} was full of soldiers with parcels and nobody spoke about Poland.

How did you spend it?`,
    choices: [
      { text: 'At home with your family.',
        effects: { morale: 10 },
        outcome: (s, x) => {
          const t = {
            spd: 'On the last evening your father asks, very quietly, "What did you see over there?" You tell him. Not everything. Enough. He nods for a long time and then says, "Don\'t ever let them make you into one of them." It is the most he has said to you since 1933.',
            catholic: 'Midnight Mass, the church packed and cold. Your mother holds your arm the whole way home as if you might vanish. Father Kaspar shakes your hand and asks no questions, which is a kindness.',
            party: 'Your father takes you to the Ortsgruppe Christmas party in your uniform and introduces you to everyone as "our soldier". You smile until your face hurts.',
            none: 'Your sister\'s wedding to the Lehmann boy, with ersatz coffee and a cake made of almost nothing. For three hours you forget there is a war.'
          }[s.char.family];
          x.say(t);
          if (s.char.family === 'spd') x.apply({ conscience: 5 });
          if (s.char.family === 'party') x.apply({ officers: 3, suspicion: -3 });
          x.log('Christmas at home.');
        } },
      { text: 'Dancing. You need to forget for a few nights.',
        effects: { morale: 12 },
        set: { sweetheart: true },
        result: 'A dance hall with blacked-out windows, a gramophone and too few men. Her name is Liesel. She works at the post office and laughs at the right moments. When the train leaves, she runs along the platform. You promise to write. You mean it.',
        log: 'Met Liesel at a dance. Promised to write.' },
      { text: 'Volunteer to stay at the barracks over Christmas.',
        effects: { officers: 6, merit: 1, marks: 10, morale: -4 },
        result: 'Someone has to guard the depot. A married reservist goes home to his children in your place and shakes your hand for a full minute. You spend Christmas Eve on sentry duty, watching the snow. The extra pay and the Oberleutnant\'s notice are something.' },
      { text: 'Tell an old friend the truth about what happened in Poland.',
        show: s => s.flags.firingSquad || s.flags.refusedOrder || s.flags.triedToStop || s.flags.stoppedReprisal || s.flags.lenzKilled || s.flags.shotPole,
        effects: { conscience: 6, suspicion: 10, morale: 3 },
        result: 'You meet him in a bar where the music is loud. You tell him about the village, the barn wall, the hat in the dust. He goes pale and says, "You shouldn\'t tell anyone this." Then: "Thank you for telling me." Two weeks later, someone has asked questions about you at the local Party office. You will never know if it was him.',
        log: 'Told someone the truth about Poland.' }
    ]
  };

  // ── Scripted events ──
  const E = [];

  // Day 0 · Friday 10 May
  E.push({
    id: 'c2_0m', chapter: 1, day: 0, phase: 0, scene: 'camp', time: '04:30',
    title: 'Fall Gelb',
    text: s => `The code word came last night. At dawn the company stands in the wet grass of an Eifel meadow while Oberleutnant von Albrecht reads the Führer's proclamation: "The hour of the decisive battle for the future of the German nation has come."

${s.rank > 0 ? `You are an ${SIM.RANKS[s.rank]} now` : 'You are still a Schütze'}${leads(s) ? ' and lead the machine-gun team: Hartmann on the gun, and a new boy carrying the ammunition' : ''}. The new boy is Fritz Rau, eighteen, straight from the Hitler Youth, with a face like a choirboy. ${vogelHere(s) ? 'Vogel stands next to him, trying to look like a veteran.' : ''}

Then the medical orderly comes down the line with a tin. "Pervitin," he says. "Orders from the top. Two tablets if you get tired. The tank men call it Panzer chocolate."`,
    choices: [
      { text: 'Take two tablets now.',
        effects: { morale: 10, health: -3 },
        set: { pervitin: true },
        delay: { in: 3, effects: { morale: -12, health: -6 }, note: 'The Pervitin is wearing off. Your heart races, your hands shake, and a grey exhaustion pulls at you like mud.' },
        result: 'Twenty minutes later the world becomes very sharp and very bright. You feel you could march to Paris. Your heart is beating rather fast.',
        log: 'Took Pervitin for the first time.' },
      { text: 'Pocket the tablets for later.',
        set: { pervitinSpare: true },
        result: 'You put the little tube in your breast pocket. You might need it. Everyone says the march will be long.' },
      { text: 'Refuse them.',
        effects: { conscience: 1 },
        outcome: (s, x) => {
          x.say('"I\'ll stay awake on my own, thanks." The orderly shrugs and moves on.');
          if (leads(s)) { x.apply({ comrades: 3 }); x.say('Rau, watching you, hands his tablets back too. You are not sure whether that was a good example or a bad one.'); }
        } }
    ]
  });

  E.push({
    id: 'c2_0a', chapter: 1, day: 0, phase: 1, scene: 'forest', place: 'border',
    title: 'Felled Trees',
    text: s => `The Belgian border was nothing: a barrier, a customs house, an empty road. Then the Ardennes. Steep wooded hills and a single road, already clogged with vehicles.

Around a bend, the road is blocked by felled trees, laced with wire. From the slope above, rifles crack. Belgian Chasseurs Ardennais, in green berets with the boar's head badge. They are few, and they are not running.

${leader(s)} is shouting for the machine gun.`,
    choices: [
      { text: 'Get the MG into position and give covering fire.',
        show: leads,
        effects: { merit: 2, officers: 5 },
        assault: true,
        risk: { chance: 0.11, dmg: [10, 30], cause: 'Killed in the Belgian Ardennes while giving covering fire, 10 May 1940.',
          hit: 'A Belgian marksman finds you as you set up the bipod.',
          miss: 'Hartmann sets the gun on the bank and you feed the belt. The MG 34 tears the hillside apart at nine hundred rounds a minute. The Belgian fire slackens, then stops.' },
        outcome: (s, x) => { x.apply({ comrades: 3 }); x.say('Rau, beside you, has his mouth open the whole time. Afterwards he says, "Is it always like that?" You don\'t answer.'); } },
      { text: 'Work up the slope with the riflemen.',
        effects: { merit: 2, officers: 3 },
        assault: true,
        risk: { chance: 0.17, dmg: [12, 38], cause: 'Killed on a wooded slope in the Belgian Ardennes, 10 May 1940.',
          hit: 'A rifle fires from twenty metres. You go down among the beech leaves.',
          miss: 'Tree to tree, upward. When you reach the top, the Chasseurs have gone, leaving two of their own and a coffee pot still warm.' } },
      { text: 'Stay by the trucks and help the pioneers clear the trees.',
        effects: { health: -4, comrades: 2 },
        risk: { chance: 0.06, dmg: [8, 20], cause: 'Killed clearing a roadblock in the Ardennes.',
          hit: 'A shot rings out and splinters fly from the trunk next to you. One of them is in your cheek.',
          miss: 'Saws, axes and swearing. By the time the road is open the shooting has stopped, and you are soaked in resin and sweat.' } }
    ]
  });

  // Day 1 · Saturday 11 May
  E.push({
    id: 'c2_1m', chapter: 1, day: 1, phase: 0, scene: 'road',
    title: 'The Column',
    text: s => `The panzers have the roads. The infantry gets what is left: the verges, the ditches, the forest tracks. Forty kilometres a day in full kit, in heat, in dust. Above you, the Luftwaffe; there is no sign of the French air force at all.

By mid-morning men are falling out. ${vogelHere(s) ? 'Vogel is grey in the face.' : 'Rau\'s feet are bleeding through his socks.'} A tank goes past with a dozen infantrymen clinging to its rear deck, waving.`,
    choices: [
      { text: 'March. One foot, then the other.',
        effects: { health: -8, officers: 3, merit: 1 },
        result: 'You stop thinking. You stop seeing. There is only the boot in front of you and the next kilometre stone. At dusk you are still in the column. Many are not.' },
      { text: s => `Carry ${friendHere(s)}'s pack as well as your own.`,
        effects: { health: -12, comrades: 8, merit: 1 },
        outcome: (s, x) => {
          x.say(`It nearly kills you. But ${friendHere(s)} stays in the column, and at the halt he can't find words, so he just gives you his cigarettes.`);
          if (!vogelHere(s)) s.flags.rauLoyal = true;
        } },
      { text: 'Take your spare Pervitin.',
        show: s => s.flags.pervitinSpare,
        effects: { morale: 8, health: 2 },
        delay: { in: 3, effects: { morale: -12, health: -7 }, note: 'The Pervitin is wearing off. Your heart races, your hands shake, and a grey exhaustion pulls at you like mud.' },
        outcome: (s, x) => { s.flags.pervitinSpare = false; s.flags.pervitin = true; x.say('The tiredness evaporates like water on a hot stove. You march for six hours without feeling your feet. You march past men who are sitting in the ditch. You feel invincible, and somewhere underneath, you know you are not.'); } },
      { text: 'Hitch a ride on a passing tank.',
        outcome: (s, x) => {
          x.apply({ health: 4 });
          if (x.roll(0.45)) { x.apply({ officers: -8 }); x.say(`Ten glorious kilometres. Then the tank stops right beside ${leaderShort(s)}, who is waiting with his hands on his hips. You walk the rest of the day at the head of the column, carrying the heaviest ammunition box in the platoon.`); }
          else x.say('Ten glorious kilometres sitting on the warm engine deck, sharing a cigarette with a tank gunner from Swabia. You jump off before your company catches up. Nobody saw.');
        } }
    ]
  });

  E.push({
    id: 'c2_1a', chapter: 1, day: 1, phase: 1, scene: 'village',
    title: 'The Widow of 1914',
    text: s => `A Belgian village of grey stone. The people stand in their doorways and watch the column pass in silence. A farmer is selling eggs and bread from a cart; he wants Reichsmarks or the new occupation notes.

An old woman in black steps into the road and says something in French. Then she spits at your boots.

${speaksFrench(s) ? 'You understand her. "In 1914 you shot my husband against the wall of the church at Dinant. Six hundred of us. Now you are back."' : 'Someone who speaks French translates: in 1914 the Germans shot her husband in Dinant, with six hundred other civilians.'} It is true. You learned nothing about it at school.

Lenz grabs her arm. "Somebody needs to teach this old witch some respect."`,
    choices: [
      { text: 'Pull Lenz off her. "Leave it, Karl."',
        effects: { conscience: 6, comrades: -2 },
        outcome: (s, x) => {
          if (leads(s) || s.stats.comrades >= 55) { x.apply({ officers: 2 }); x.say('Lenz shakes you off but lets her go. "Soft," he says. "You\'ve always been soft." The old woman looks at you without gratitude. Why should she be grateful?'); }
          else { x.apply({ suspicion: 4 }); x.say('Lenz shoves her into the ditch before he lets go. Then he looks at you, long and thoughtful, the way he looked at you in Pomerania.'); }
        } },
      { text: 'Apologise to her, in whatever French you have.',
        effects: { conscience: 8, suspicion: 3 },
        outcome: (s, x) => {
          x.say(speaksFrench(s)
            ? '"Pardon, madame. Je suis désolé." Her eyes narrow. "Désolé," she repeats, as if testing a coin for fake metal. Then she goes back into her house and closes the door.'
            : '"Pardon," you say. It\'s the only word you know. She stares at you. Then she goes back into her house and closes the door.');
          x.log('Apologised to a Belgian widow for 1914.');
        } },
      { text: 'Buy bread and eggs from the farmer (3 RM).',
        req: s => s.marks >= 3, reqText: 'You need 3 RM.',
        effects: { marks: -3, food: 25 },
        result: 'He takes your money without looking at you. The bread is white, real white bread, the first you have seen since the war began. Behind you, Lenz is still shouting at the old woman.' },
      { text: 'Keep walking. It isn\'t your business.',
        effects: { conscience: -4 },
        result: 'You hear Lenz laughing behind you, and something falling. You don\'t turn around.' }
    ]
  });

  // Day 2 · Sunday 12 May
  E.push({
    id: 'c2_2m', chapter: 1, day: 2, phase: 0, scene: 'river',
    title: 'Above the Meuse',
    text: s => `The forest ends at the edge of a gorge. Below you, a hundred metres down, the Meuse: broad, green and slow, with grey limestone cliffs and the town of Dinant along the bank. The bridges are gone, blown by the French. On the far side, in bunkers and houses, French machine guns are waiting.

Oberleutnant von Albrecht gathers the platoon leaders. When he comes back he looks younger and older at once.

"We cross tonight or at first light. Rubber boats. The pioneers paddle, we fight. I need volunteers for the first wave."`,
    choices: [
      { text: 'Volunteer for the first wave.',
        effects: { officers: 8, merit: 2, morale: -3 },
        set: { firstWave: true },
        result: 'Albrecht writes your name down and looks at you for a moment. "Thank you," he says, which is not something officers say.',
        log: 'Volunteered for the first wave across the Meuse.' },
      { text: 'Ask about cover for the crossing: smoke, artillery, anything.',
        effects: { officers: 3, merit: 1 },
        set: { askedSmoke: true },
        result: '"The artillery is stuck on the roads behind us," Albrecht says. "Smoke shells too. We\'ll have to make our own smoke." You don\'t understand what he means until later.' },
      { text: 'Keep quiet and stay with the second wave.',
        result: 'Nobody looks at you. Plenty of men are keeping quiet. The second wave is not much safer, everyone knows that, but it feels safer.' }
    ]
  });

  E.push({
    id: 'c2_2a', chapter: 1, day: 2, phase: 1, scene: 'village', place: 'heights',
    title: 'Smoke',
    text: s => `The answer comes down from divisional command: to blind the French gunners on the far bank, the houses along the river are to be set on fire. The smoke will cover the boats.

Your squad is given a street of stone houses in the valley. Petrol cans and straw. ${leader(s)} hands out matches. "Get on with it. The wind's right."

Some houses are empty. In others, you are not sure. A curtain moves in an upstairs window.`,
    choices: [
      { text: 'Do it. Fast. The crossing depends on it.',
        effects: { conscience: -7, officers: 4, merit: 1 },
        result: 'The flames take quickly in the old timber. The smoke rolls down over the river exactly as planned. You don\'t go back to look at the window with the curtain.' },
      { text: 'Check every house before you light it.',
        effects: { conscience: 6, officers: -2, health: -3 },
        set: { checkedHouses: true },
        risk: { chance: 0.09, dmg: [10, 25], cause: 'Killed by French fire from across the Meuse while searching houses at Dinant.',
          hit: 'A French machine gun across the river sees you crossing a street and fires.',
          miss: 'In the house with the curtain you find an old man and his granddaughter hiding under the stairs. You walk them up the hill yourself, shouting "Civilians!" at every German you meet. Then you go back and burn their house.' },
        log: 'Checked the houses before we burned them. Found an old man and a girl.' },
      { text: 'Refuse. "I won\'t burn people out of their homes."',
        effects: { conscience: 10, suspicion: 15, officers: -12, merit: -2 },
        set: { refusedOrder2: true },
        result: `The words hang in the air. Your squad leader stares at you, then gives the matches to someone else without a word. The houses burn anyway. That evening your name goes up the chain of command, with a note.`,
        log: 'Refused to burn the houses at Dinant.' }
    ]
  });

  E.push({
    id: 'c2_2n', chapter: 1, day: 2, phase: 2, scene: 'river', time: '22:00',
    title: 'The Night Before the River',
    text: s => `The valley is full of smoke and the glow of burning houses. Down by the water, pioneers are inflating rubber boats with foot pumps, cursing in whispers. The French fire flares at anything that moves.

${s.flags.firstWave ? 'You are in the first wave. Boat number four.' : 'You will cross in the second wave, if there is still a crossing.'} The night is short and nobody sleeps.`,
    choices: [
      { text: 'Write to Liesel.',
        show: s => s.flags.sweetheart,
        effects: { morale: 8 },
        result: 'You write about the river, the cliffs, the white bread in Belgium. You do not write about tomorrow. At the end you write "your" before your name, and look at it for a long time before you leave it there.' },
      { text: 'Write a letter to be sent if you don\'t come back.',
        effects: { morale: 5 },
        set: { lastLetter: true },
        result: 'You have done this before. It is shorter this time.' },
      { text: 'Sit with Rau. He is terrified.',
        effects: { comrades: 5, morale: 2 },
        set: { rauLoyal: true },
        outcome: (s, x) => {
          x.say('He asks you what it was like in Poland. You decide what to tell him.');
          if (s.flags.firingSquad || s.flags.shotPole) x.say('You tell him about the fighting. You do not tell him the rest. You hope he never needs to know.');
          else x.say('"Stay low in the boat," you tell him. "Keep paddling. Don\'t look at the water." It\'s all anyone can tell anyone.');
        } },
      { text: 'Pray.',
        outcome: (s, x) => {
          if (s.flags.catholic || s.flags.rosary) { x.apply({ morale: 9 }); x.say('The rosary from your mother, worn smooth now. Hail Mary, full of grace. On the river, the burning houses reflect in the water like candles.'); }
          else { x.apply({ morale: 4 }); x.say('You still don\'t know how. You try anyway.'); }
        } },
      { text: 'Sleep in the ditch. You need it.',
        effects: { health: 6 },
        result: 'Two hours of black, dreamless sleep in a ditch full of nettles. It is enough.' }
    ]
  });

  // Day 3 · Monday 13 May — the crossing
  E.push({
    id: 'c2_3m', chapter: 1, day: 3, phase: 0, scene: 'river', time: '05:10',
    title: 'Rubber Boats',
    text: s => `The boats go into the water at first light. Six men and two pioneers to a boat. The smoke is thinning.

Halfway across, the French open fire. Machine guns from the bunkers, rifles from the houses. Bullets slap into the water like hail. A boat to your left folds up and sinks; men in full kit go under and do not come up.

${s.flags.firstWave ? 'You are in the first wave. There is nothing between you and the far bank but water.' : 'The first wave is pinned against the far bank. Now it is your turn.'} In the stern, the pioneer who was paddling slumps forward.`,
    choices: [
      { text: 'Grab his paddle and drive the boat on.',
        effects: { merit: 3, officers: 6 },
        assault: true,
        set: { tookBoat: true },
        risk: { chance: s => s.flags.firstWave ? 0.2 : 0.15, dmg: [15, 42], cause: 'Killed in a rubber boat on the Meuse at Houx, 13 May 1940.',
          hit: 'You are three strokes from the bank when it hits you, a blow like a horse\'s kick. Someone drags you onto the shingle.',
          miss: 'You paddle like a madman, shouting at the others to paddle with their rifle butts, their hands, anything. The boat grinds onto the shingle. You are the first man out.' },
        log: 'Took over the paddle when the pioneer was hit. Got the boat across.' },
      { text: s => `Keep your head down and hold on to ${friendHere(s)}.`,
        effects: { merit: 1, comrades: 4 },
        assault: true,
        risk: { chance: s => s.flags.firstWave ? 0.12 : 0.09, dmg: [12, 32], cause: 'Killed in a rubber boat on the Meuse at Houx, 13 May 1940.',
          hit: 'You are holding his collar when the burst sweeps the boat.',
          miss: 'You lie flat, holding on to him, while someone else takes the paddle. The boat spins, straightens, and grinds into the far bank.' } },
      { text: 'Jump in after a man who has gone overboard.',
        effects: { conscience: 6, comrades: 8, merit: 2, health: -5 },
        risk: { chance: 0.17, dmg: [12, 35], fatal: 0.2, cause: 'Drowned in the Meuse at Houx, trying to save a comrade, 13 May 1940.',
          hit: 'The current and the weight of your kit pull you down. You swallow green water. Somebody grabs your harness.',
          miss: 'You get him by the collar, a boy from another company, and kick for the bank. Somehow, both of you make it.' },
        log: 'Went into the Meuse after a man who fell overboard.' }
    ]
  });

  E.push({
    id: 'c2_3a', chapter: 1, day: 3, phase: 1, scene: 'village', place: 'dinant',
    title: 'Prisoners on the Far Bank',
    text: s => `By midday there is a bridgehead: a few hundred metres of riverbank, a ruined hotel, a road up the cliff. A French bunker that held you up for an hour has finally surrendered. Seven men come out with their hands on their heads, one of them a lieutenant with a bandaged face.

A pioneer whose friend drowned this morning walks up to the lieutenant with his rifle raised. "This is the one. He was the one firing."

The French officer says, in careful German: "We are prisoners of war. We have surrendered."`,
    choices: [
      { text: 'Step between them. "They\'ve surrendered. Prisoners go to the rear."',
        effects: { conscience: 8, officers: 3 },
        outcome: (s, x) => {
          x.say('For a moment the pioneer looks as if he will shoot through you. Then he lowers the rifle and walks off and sits down on the riverbank and cries. The French lieutenant says "Merci" and you take them to the collection point.');
          if (s.rank >= 2) { x.apply({ merit: 1 }); x.say('Your stripe helps. People listen to a Gefreiter.'); }
          x.log('Stopped a pioneer from shooting French prisoners.');
        } },
      { text: 'Take the lieutenant\'s watch and pistol before anyone else does.',
        effects: { marks: 6, conscience: -4 },
        result: 'A good Swiss watch and a little Browning pistol. "Spoils of war," you tell yourself. The pioneer, robbed of his moment, lowers his rifle. In a way, you have saved the man\'s life. In a way.' },
      { text: 'It isn\'t your business. Walk away.',
        effects: { conscience: -10, morale: -6 },
        result: 'Behind you, one shot. Then shouting, and Albrecht\'s voice, furious. When you look back the lieutenant is lying on the shingle and the pioneer is being disarmed. Nobody will be punished. Everyone will say it was the heat of battle.',
        log: 'Walked away. A French officer was shot after he surrendered.' }
    ]
  });

  // Day 4 · Tuesday 14 May
  E.push({
    id: 'c2_4m', chapter: 1, day: 4, phase: 0, scene: 'field', time: '07:00',
    title: 'Onhaye',
    text: s => `The bridgehead has been pushed out to the village of Onhaye on the plateau. At dawn the French counterattack: infantry in long khaki coats, and behind them, tanks. Three small, squat Hotchkiss tanks rolling through the wheat.

The company's anti-tank rifles plink uselessly off their armour. One of the tanks is heading straight for your hedge line.

${leader(s)} is tying stick grenades together around a single charge: a "geballte Ladung". He looks around for someone to carry it.`,
    choices: [
      { text: 'Take the charge and go for the tank.',
        effects: { merit: 5, officers: 10 },
        assault: true,
        risk: { chance: 0.29, dmg: [20, 50], fatal: 0.25, cause: 'Killed attacking a French tank with a bundle of grenades at Onhaye, 14 May 1940.',
          hit: 'You are five metres away when the tank\'s machine gun finds you.',
          miss: 'You crawl through the wheat until the tank fills the sky, jam the bundle between the track and the hull, pull the cord and roll away. The explosion lifts the tank and drops it. The hatch opens. The crew climb out with their hands up.' },
        outcome: (s, x) => { if (s.stats.health > 0 && !x.wasHit) s.flags.tankKill = true; },
        log: 'Went for a French tank with a bundle of grenades.' },
      { text: 'Hold the hedge and fire at the infantry behind the tanks.',
        show: s => !leads(s),
        effects: { merit: 2 },
        assault: true,
        risk: { chance: 0.12, dmg: [10, 30], cause: 'Killed holding a hedge line at Onhaye, 14 May 1940.',
          hit: 'Fragments from a tank shell whip through the hedge.',
          miss: 'You shoot until your rifle is too hot to hold. The French infantry go to ground. Without them, the tanks hesitate and finally turn back.' } },
      { text: 'Keep the MG firing at the infantry. Separate them from the tanks.',
        show: leads,
        effects: { merit: 3, officers: 5 },
        assault: true,
        risk: { chance: 0.13, dmg: [10, 30], cause: 'Killed at the machine gun at Onhaye, 14 May 1940.',
          hit: 'A tank turns its gun on the muzzle flashes. The world turns over.',
          miss: 'You direct Hartmann\'s fire in short bursts: the gaps between the tanks, the men behind them. Without infantry, the tanks hesitate. Then they turn. It is the coolest thing you have ever done, and your hands only shake afterwards.' } },
      { text: 'Fall back to the village.',
        effects: { officers: -8, morale: -4 },
        risk: { chance: 0.08, dmg: [10, 25], cause: 'Killed retreating across a field at Onhaye, 14 May 1940.',
          hit: 'Running across open ground was the most dangerous thing you could do. Something hits you in the back.',
          miss: 'You make it to the village. Half an hour later the French attack has broken down, and you have to walk back to the hedge past the men who stayed.' } }
    ]
  });

  E.push({
    id: 'c2_4a', chapter: 1, day: 4, phase: 1, scene: 'village', place: 'onhaye',
    title: 'The Man in the Cellar',
    text: s => `House-to-house search in Onhaye. In a farmhouse cellar, behind the potato bins, you find a Belgian family: a farmer, his wife, two children. And a young man in a farmer's jacket with soldier's boots and a soldier's haircut.

He is a French soldier in civilian clothes. Under the laws of war, a soldier out of uniform can be shot as a spy. And the family hiding him can be punished too.

${speaksFrench(s) ? 'The wife whispers to you in French: "He is only a boy. He was lost. Please."' : 'The wife is pleading with you in French. You understand only "s\'il vous plaît".'}`,
    choices: [
      { text: 'Report him.',
        effects: { officers: 4, conscience: -10 },
        result: 'You call for the Feldwebel. They take the young man out to the yard. You do not stay to see what happens, and nobody tells you. The farmer\'s wife does not look at you again.',
        log: 'Reported a French soldier hiding in civilian clothes.' },
      { text: 'Find his uniform and make him put it on. Then take him prisoner properly.',
        effects: { conscience: 9, merit: 1 },
        outcome: (s, x) => {
          if (x.roll(0.75)) { x.say('His tunic is stuffed behind the bins. You make him put it on in front of you. Now he is a prisoner of war, and the laws protect him. You walk him to the collection point. The family is left alone.'); x.log('Put a French boy back into uniform so that he could be taken prisoner.'); }
          else { x.apply({ suspicion: 10 }); x.say('He changes into his tunic, but the Feldwebel sees you coming out with him. "In civvies, was he? And you dressed him up?" He lets it go, barely. But he remembers your name.'); }
        } },
      { text: 'Close the cellar door and say it was empty.',
        effects: { conscience: 8 },
        outcome: (s, x) => {
          if (x.roll(0.3)) { x.apply({ suspicion: 22, officers: -10 }); x.say('Ten minutes later another squad searches the same farm. They find him. And they know who searched it first.'); x.log('Covered for a French soldier hiding in a cellar. They found him anyway.'); }
          else { x.say('"Empty," you tell your squad leader. Nobody checks. You will never know what happened to him, but you will think of him sometimes, a boy in a farmer\'s jacket, walking south at night.'); x.log('Said a cellar was empty. It wasn\'t.'); }
        } }
    ]
  });

  // Day 5 · Wednesday 15 May
  E.push({
    id: 'c2_5m', chapter: 1, day: 5, phase: 0, scene: 'field',
    title: 'Flavion',
    text: `The panzers have caught a French armoured division refuelling near Flavion and smashed it. Your company follows behind, through the wreckage: enormous French Char B tanks, abandoned with empty tanks, others burned out, their crews lying beside them.

One tank is still burning. From inside, someone is screaming. The hatch is jammed. The ammunition inside could go up at any moment.`,
    choices: [
      { text: 'Climb up and try to force the hatch.',
        effects: { conscience: 10, merit: 2 },
        risk: { chance: 0.15, dmg: [12, 32], cause: 'Killed when a burning French tank exploded near Flavion, 15 May 1940.',
          hit: 'You are levering at the hatch with your bayonet when the ammunition cooks off. The blast throws you off the hull.',
          miss: 'You and Hartmann lever the hatch open with a bayonet and a tyre iron. You pull out a man whose hands are badly burned. He lives. He keeps saying "camarade, camarade". Thirty seconds later the tank blows up.' },
        outcome: (s, x) => { if (!x.wasHit) s.flags.pulledTanker = true; },
        log: 'Pulled a French tank man out of a burning tank.' },
      { text: 'Shoot into the hatch to end it.',
        effects: { conscience: -3, morale: -8 },
        result: 'You fire through the vision slit until the screaming stops. You tell yourself it was mercy. Perhaps it was. You will never be sure.' },
      { text: 'Keep walking. You can\'t help him.',
        effects: { morale: -6, conscience: -4 },
        result: 'The screaming follows you for two hundred metres. Then the tank explodes, and it stops.' }
    ]
  });

  E.push({
    id: 'c2_5a', chapter: 1, day: 5, phase: 1, scene: 'road', place: 'flavion',
    title: 'Tirailleurs',
    text: s => `Near Philippeville, a group of French colonial soldiers surrenders: tirailleurs from West Africa, in khaki with red fezzes, twenty or so, exhausted and out of ammunition.

The French prisoners are being marched to the rear. But a Feldwebel from another company is separating the Africans from the white Frenchmen and pushing them toward a quarry. "No prisoners from these," he says. "They cut the ears off our men in the last war. Everybody knows." Lenz is nodding.

Everybody knows. Nobody has seen it. The propaganda has been saying it for twenty years.

The Africans can see where this is going. One of them, older, with sergeant's stripes, looks straight at you.`,
    choices: [
      { text: 'Fetch Oberleutnant von Albrecht. Now.',
        outcome: (s, x) => {
          const p = 0.25 + s.stats.officers / 130 + (s.rank >= 2 ? 0.1 : 0) + (s.flags.stoppedReprisal ? 0.1 : 0);
          if (x.roll(p)) {
            s.flags.savedTirailleurs = true;
            x.apply({ conscience: 14, officers: 2, suspicion: 4 });
            x.say('You run. Albrecht comes at a fast walk, pistol holster unbuttoned. He doesn\'t argue with the Feldwebel. He simply says, "These men are prisoners of the German Army. Anyone who harms them answers to a court-martial. I will see to it personally." The Africans join the column to the rear. The sergeant with the stripes nods to you as he passes.');
            x.log('Fetched Albrecht. The African prisoners were taken to the rear.');
          } else {
            x.apply({ conscience: 6, morale: -12 });
            x.say('By the time you find Albrecht and come back, it is over. The quarry is quiet. Albrecht stands at the edge for a long time, and then he goes to find the Feldwebel\'s company commander. Nothing will come of it. You both know that.');
            x.log('Ran for Albrecht at the quarry near Philippeville. Too late.');
          }
        } },
      { text: 'Order them into your own prisoner column and march them away yourself.',
        show: s => s.rank >= 2,
        effects: { conscience: 12, suspicion: 8, officers: -2 },
        set: { savedTirailleurs: true },
        result: '"These are my prisoners, Herr Feldwebel. I\'m taking them to the collection point." You say it in your best parade-ground voice, with Hartmann and the MG at your back. The Feldwebel outranks you, and he knows it, and he also knows what a written report could do. He spits and lets them go. You march twenty men eight kilometres to the rear.',
        log: 'Marched twenty African prisoners to the rear myself.' },
      { text: 'Look away. This is not your company and not your Feldwebel.',
        effects: { conscience: -14, morale: -10 },
        set: { quarry: true },
        result: 'You march on. Behind you, after a while, the machine gun. Hartmann, beside you, says nothing for an hour. Then he says, "That was murder," very quietly, and nothing else for the rest of the day.',
        log: 'Marched past the quarry near Philippeville.' }
    ]
  });

  // Day 6 · Thursday 16 May
  E.push({
    id: 'c2_6m', chapter: 1, day: 6, phase: 0, scene: 'river', place: 'frontier',
    title: 'A Morning by the River',
    text: s => `For the first time in a week: a halt. The company washes in a stream, naked and white, laughing like boys. Someone has found a crate of Belgian beer. The radio says Holland surrendered yesterday after Rotterdam was bombed. The panzers are already deep in France.

Hartmann ${s.flags.betrayedHartmann ? 'sits alone, smoking.' : 'flicks water at you. "Argentina," he says. "I swear, after this one."'} Rau ${s.flags.rauLoyal ? 'sticks close to you, as he has all week.' : 'is asleep in the grass with his mouth open.'}`,
    choices: [
      { text: 'Swim and drink and forget, for an hour.',
        effects: { morale: 12, health: 5, comrades: 4 },
        result: 'The water is so cold it hurts. The beer is warm. For one hour you are twenty-one years old and alive on a spring morning, and that is everything.' },
      { text: s => s.flags.sweetheart ? 'Write to Liesel.' : 'Write home.',
        effects: { morale: 8 },
        outcome: (s, x) => x.say(s.flags.sweetheart ? 'Six pages. You tell her about the river and the beer and the swimming. You promise her a trip to the sea after the war. You do not mention the Meuse.' : 'You tell them you are well and that the Belgians have white bread. Your mother will read it to the neighbours.') },
      { text: 'Clean the MG and check the ammunition. The war is not over.',
        show: leads,
        effects: { officers: 5, merit: 1, comrades: 2 },
        result: 'Barrel change, oil, belts. Hartmann grumbles and helps. When Albrecht comes past, he stops, looks, and nods. You notice that Rau is copying everything you do.' },
      { text: s => s.flags.betrayedHartmann ? 'Go and sit with Hartmann. It is time.' : 'Sit by yourself and think about the week.',
        outcome: (s, x) => {
          if (s.flags.betrayedHartmann) { x.apply({ comrades: 8, morale: 4 }); s.flags.betrayedHartmann = false; s.flags.reconciled = true; x.say('You sit down next to him. Neither of you says anything about Pomerania. After a while he offers you a cigarette. "Idiot," he says, without heat. It is enough.'); x.log('Made peace with Hartmann by a river in Belgium.'); }
          else { x.apply({ conscience: 3, morale: -2 }); x.say('Houses burning at Dinant. A boy in a farmer\'s jacket. A tank, screaming. You try to put them in some kind of order and fail.'); }
        } }
    ]
  });

  E.push({
    id: 'c2_6a', chapter: 1, day: 6, phase: 1, scene: 'road', place: 'frontier',
    title: 'Encore',
    text: `In the afternoon the company crosses into France. A painted post, a customs house, a road between poplars. French refugees are coming the other way, and French prisoners, thousands of them, walking east without guards.

An old French farmer leans on his gate and watches you pass. "Encore," he says, to nobody in particular. Again. 1870. 1914. 1940.

Lenz laughs. "This time we finish it."`,
    choices: [
      { text: '"This time it will be over by summer."',
        effects: { morale: 5 },
        result: 'And this time, you think, you might even be right. The French army seems to be dissolving. Perhaps there is something to the whole thing after all.' },
      { text: 'Look at the farmer. Wonder how many times he has seen this.',
        effects: { conscience: 3, morale: -2 },
        result: 'Three wars in one old man\'s lifetime. You wonder whether your own grandson will stand at a gate one day and watch the French march east.' },
      { text: 'Hand a French prisoner some water.',
        effects: { conscience: 4 },
        result: 'He drinks half and passes the canteen on. It goes down a line of twenty men before it comes back empty. One of them salutes you, half mocking, half not.' }
    ]
  });

  E.push({
    id: 'c2_6n', chapter: 1, day: 6, phase: 2, scene: 'camp', time: '21:30',
    title: 'Taking Stock',
    text: s => `Night in a French farmyard. The company is a third smaller than it was a week ago. Albrecht goes from man to man with his notebook, as he did on the Vistula. This time there are more names to write in the column for the dead.

${s.flags.refusedOrder2 ? 'He stops in front of you and says nothing at all, and then moves on.' : 'When he reaches you, he looks at you for a moment as if he is trying to remember who you were in Poland.'}`,
    choices: [
      { text: 'Wait for your name.',
        result: 'Somewhere to the west, the guns are still firing. The war has moved on without you for a night.' }
    ]
  });

  SIM.EVENTS.push(...E);

  // ── Random events for this chapter ──
  SIM.POOL.push(
    {
      id: 'f_cellar', chapters: [1], phases: [2], scene: 'village',
      title: 'The Wine Cellar',
      text: 'Hartmann has found a wine cellar under an empty château. Bordeaux, Burgundy, Champagne: more bottles than the whole company could drink in a month. Half the platoon is down there already.',
      choices: [
        { text: 'Drink with them.',
          outcome: (s, x) => {
            x.apply({ morale: 10, health: -4, comrades: 5 });
            if (x.roll(0.3)) { x.apply({ officers: -8 }); x.say('Champagne out of a helmet. At two in the morning the Feldwebel finds you singing on a table. The next day is very, very long.'); }
            else x.say('Champagne out of a helmet. Somebody sings "Lili Marleen"; somebody else cries. You sleep on a pile of sacks, happy.');
          } },
        { text: 'Take two bottles for later and go to sleep.',
          effects: { morale: 4, health: 3 },
          result: 'A sensible decision. The two bottles clink in your pack for days and buy you a great deal of goodwill.' }
      ]
    },
    {
      id: 'f_dead_letter', chapters: [1], phases: [2], scene: 'letter',
      title: 'A Letter in French',
      text: s => `Searching a dead French soldier for papers, you find a letter in his pocket, half-written, addressed to "ma chère Hélène". ${speaksFrench(s) ? 'You can read it. He was a schoolteacher from Lyon. He was writing that the Germans could never get through the Ardennes.' : 'You can\'t read it, but you can see the drawing at the bottom: a little house, a tree, a child\'s stick figure.'}`,
      choices: [
        { text: 'Give it to the company clerk, to be sent through the Red Cross.',
          effects: { conscience: 5 },
          result: 'The clerk looks at you oddly but takes it. Some of these letters get through. Most probably don\'t.' },
        { text: 'Keep it.',
          effects: { morale: -3, conscience: 2 },
          result: 'You fold it into your paybook. You are not sure why. Perhaps so that somebody remembers.' },
        { text: 'Leave it with him.',
          effects: { morale: -2 },
          result: 'You put it back in his pocket and close his tunic.' }
      ]
    },
    {
      id: 'f_rau', chapters: [1], phases: [2], cond: s => s.rank >= 2, scene: 'camp',
      title: 'The Choirboy',
      text: 'Rau comes to you after dark. He has been crying and is ashamed of it. "In the Hitler Youth they told us war was glorious," he says. "Is it? Is it supposed to feel like this?"',
      choices: [
        { text: 'Tell him the truth: it isn\'t, and it never was.',
          effects: { conscience: 4, comrades: 4, suspicion: 4 },
          set: { rauLoyal: true },
          result: 'You talk for an hour. You tell him about Poland, some of it. He listens like a boy hearing about sex for the first time: shocked, fascinated, relieved that someone will tell him.' },
        { text: 'Tell him to pull himself together. That\'s what soldiers do.',
          effects: { officers: 2, comrades: -2 },
          result: s => `"Yes, Herr ${SIM.RANKS[s.rank]}." He wipes his face and goes back to his blanket. You lie awake and wonder if you have done him a favour.` }
      ]
    },
    {
      id: 'f_stuka', chapters: [1], phases: [2], scene: 'field',
      title: 'Stukas at Dusk',
      text: 'At dusk, a flight of Stukas goes over to dive on a French column somewhere ahead. The sirens howl as they dive. Everyone stops to watch. Some of the men cheer.',
      choices: [
        { text: 'Cheer with them.',
          effects: { morale: 5, conscience: -1 },
          result: 'It is a magnificent and terrible sight. You cheer until the smoke rises over the horizon.' },
        { text: 'Think of the people on that road.',
          effects: { conscience: 3, morale: -3 },
          result: 'Soldiers, yes. And the refugees who were on every road you marched along today.' }
      ]
    },
    {
      id: 'f_crash', chapters: [1], phases: [2], cond: s => s.flags.pervitin, weight: 2, scene: 'camp',
      title: 'Awake',
      text: 'You can\'t sleep. Your heart is pounding, your jaw aches from clenching, and the stars seem far too bright. The Pervitin. Men all around you are lying awake in the same way, staring at nothing.',
      choices: [
        { text: 'Take another tablet. You have to be fit tomorrow.',
          effects: { morale: 6, health: -6 },
          delay: { in: 3, effects: { morale: -14, health: -8 }, note: 'The second dose of Pervitin is wearing off. You feel hollowed out.' },
          result: 'The jitters smooth out into a clear, cold alertness. You are aware, somewhere, that you are borrowing against something.' },
        { text: 'Lie still and wait for it to pass.',
          effects: { health: -3, morale: -3 },
          result: 'It passes, near dawn. You get one hour of sleep. It is better than nothing.' }
      ]
    }
  );

  // ── Chapter II endings ──
  const nextNote = 'France signed an armistice on 22 June 1940, in the same railway carriage at Compiègne where Germany had signed in 1918. In Germany the church bells rang for a week.';
  Object.assign(SIM.ENDINGS, {
    fr_wounded: {
      title: 'Hospital Train',
      text: s => `Your wound gets you out again. A hospital train to Trier, clean sheets, a nurse from Cologne who calls everyone "Jung". You read about the fall of France in the newspapers, in a bed by a window.

${nextNote}

The men in your ward agree: it is over. England will make peace. Nobody asks what happens if England does not.`
    },
    fr_decorated: {
      title: 'Victory',
      text: s => `${SIM.hasMedal(s, 'ek1') ? 'In June, Oberleutnant von Albrecht pins the Iron Cross, 1st Class, on your breast pocket in front of the whole company. Enlisted men with that cross are rare. Men look at you differently now.' : (s.medals.some(m => m.id === 'ek2' && m.chapter === 1) ? 'In June, your name is read out. The Iron Cross, 2nd Class, for the crossing of the Meuse.' : 'In June, your name is read out again, for the crossing of the Meuse. The black, white and red ribbon in your buttonhole has been joined by a recommendation that follows you in your file.')} ${s.flags.tookBoat ? 'The paddle in the boat at Houx is part of the story now; you hear men in other companies tell it wrong.' : ''}

${nextNote}

You march in a victory parade through a small French town while the French watch from behind shutters. ${s.stats.conscience < 40 ? 'You feel nothing at all, which is perhaps the strangest thing.' : 'You think of the quarry, the cellar, the burning houses, and you march in step anyway.'}`
    },
    fr_marked: {
      title: 'Under Observation',
      text: s => `France falls. You survive it. But your file has grown thicker: ${s.flags.refusedOrder2 ? 'a refused order at Dinant' : 'remarks, reports, a pattern'}, on top of whatever was already there from Poland.

${nextNote}

Albrecht calls you in after the armistice. "I have kept you out of trouble twice," he says. "I cannot promise a third time. Be careful, ${s.char.last}. Be very careful."`
    },
    fr_hardened: {
      title: 'The Veteran',
      text: s => `Two campaigns. You know how to march, how to cross a river under fire, how to stop listening to screaming. The new men look at you the way you looked at Brandt in Pomerania.

${nextNote}

At night, sometimes, you take out the photographs in your paybook and try to remember who is in them.`
    },
    fr_witness: {
      title: 'What You Saw',
      text: s => `France falls in six weeks, and you are still the man who notices. ${[
        s.flags.savedTirailleurs && 'African prisoners walked to a camp instead of a quarry because of you.',
        s.flags.checkedHouses && 'An old man and a girl came out from under the stairs in Dinant.',
        s.flags.pulledTanker && 'A French tank man with burned hands is alive.'
      ].filter(Boolean).join(' ') || 'You remember every face.'}

${nextNote}

In June and July, German troops will murder at least 1,500 and possibly 3,000 captured black French soldiers. You know now that it was not one Feldwebel and one quarry. You know, and you are still wearing the uniform.`
    },
    fr_survivor: {
      title: 'Six Weeks',
      text: s => `You survive the western campaign. You did not distinguish yourself and you did not disgrace yourself. You crossed the river, you marched, you stayed alive.

${nextNote}

That summer the regiment is quartered in a French village with orchards and a café. For a few months, the war almost feels like a holiday. Across the Channel, England has not made peace.`
    }
  });
})();
