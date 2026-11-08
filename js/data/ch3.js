// Chapter III: "The Line" — occupied France, July – November 1940.
// Paris (5 days) → NCO course or the Channel coast (2 days) → a town on the demarcation line (7 days).
// Town events, random events and endings live in ch3_town.js.
window.SIM = window.SIM || {};

(function () {
  const course = s => !!s.flags.ncoCourse;
  const vogelHere = s => !!s.flags.vogelStays;

  const DAYS = [
    { date: 'Friday, 12 July 1940',     short: 'Fri 12 Jul', place: 'paris' },
    { date: 'Saturday, 13 July 1940',   short: 'Sat 13 Jul', place: 'paris' },
    { date: 'Sunday, 14 July 1940',     short: 'Sun 14 Jul', place: 'paris' },
    { date: 'Monday, 15 July 1940',     short: 'Mon 15 Jul', place: 'paris' },
    { date: 'Tuesday, 16 July 1940',    short: 'Tue 16 Jul', place: 'paris' },
    { date: 'Monday, 16 September 1940', short: 'Mon 16 Sep', place: s => course(s) ? 'course' : 'boulogne', war: true },
    { date: 'Friday, 4 October 1940',   short: 'Fri 4 Oct', place: s => course(s) ? 'course' : 'boulogne' },
    { date: 'Sunday, 10 November 1940', short: 'Sun 10 Nov', place: 'town' },
    { date: 'Monday, 11 November 1940', short: 'Mon 11 Nov', place: 'town' },
    { date: 'Tuesday, 12 November 1940', short: 'Tue 12 Nov', place: 'town' },
    { date: 'Wednesday, 13 November 1940', short: 'Wed 13 Nov', place: 'town' },
    { date: 'Thursday, 14 November 1940', short: 'Thu 14 Nov', place: 'town' },
    { date: 'Friday, 15 November 1940', short: 'Fri 15 Nov', place: 'town' },
    { date: 'Saturday, 16 November 1940', short: 'Sat 16 Nov', place: 'town' }
  ];

  const PLACES = {
    paris:    { name: 'Paris',                                         x: 168, y: 72 },
    course:   { name: 'Divisional NCO course near Fontainebleau',      x: 176, y: 92 },
    boulogne: { name: 'The invasion harbour at Boulogne-sur-Mer',      x: 120, y: 18 },
    town:     { name: 'Saint-Avit-sur-Cher, on the demarcation line',  x: 140, y: 150 }
  };

  SIM.CHAPTERS.push({
    id: 'occupation', num: 'III', title: 'The Line', range: '12 July – 16 November 1940', year: 1940, start: [1940, 7],
    days: DAYS, places: PLACES, map: 'occupied',
    finalEvent: 'c3_13n',
    commander: 'Oberleutnant von Albrecht',
    hospital: 'Paris (Hôpital de la Pitié, requisitioned)',
    deathDefault: 'Killed in France, 1940.',
    casualties: 'Most of the soldiers who died in France between the armistice and the summer of 1941 died in accidents, in air raids on the Channel coast, or by their own hand. They are buried in the same cemeteries as the men who fell in May.',
    promoDate: '1 April 1941',
    maxRank: s => s.flags.passedCourse ? 4 : 3,
    meritBar: 7,
    kitchenNote: 'A hot meal in the evening: soup, bread and, now and then, French cheese.',
    foodDrain: -3, // occupation rations: regular meals, no front-line hunger
    routineReason: 'Time in service and a clean record during the occupation.',
    meritReason: 'Recommended by Oberleutnant von Albrecht for the conduct of your post on the demarcation line.',
    interludeDate: 'Summer 1940',
    interludeTitle: 'May – July 1940',
    blackMarks: s => {
      const b = [];
      if (s.flags.blackMarketCaught) b.push('Investigated for black-market dealing.');
      if (s.flags.lostRifleReported) b.push('A rifle was lost from your post.');
      if (s.flags['asleep_2']) b.push('You were found asleep on sentry duty.');
      return b;
    },
    awards: (s) => {
      if (s.flags.fireRescue) SIM.award(s, 'kvk2ns', 'For rescuing a family from a house fire at Saint-Avit, November 1940.', 'January 1941');
    },
    ending: s => SIM.ch3Ending(s),
    onInterlude: s => {
      s.stats.health = Math.max(s.stats.health, s.ending === 'fr_wounded' ? 75 : 88);
      s.stats.morale = Math.max(s.stats.morale, 60);
      s.stats.food = 85;
      if (s.stats.suspicion < 80) s.stats.suspicion = Math.max(0, s.stats.suspicion - 10);
      s.marks += 25;
      SIM.syncKit(s);
      SIM.give(s, 'cigarettes', 4);
    },
    interlude: s => interludeItems(s),
    interludeEvents: ['i2_photo']
  });

  function interludeItems(s) {
    const out = [];
    if (s.ending === 'fr_wounded') out.push({ year: 'June 1940', text: 'You followed the fall of France from a hospital bed in Trier. By the time you rejoined the company in July, the war in the west was over and the company was in Paris.' });
    out.push({ year: '22 June', text: 'France signed the armistice at Compiègne. The north and the whole Atlantic coast were occupied by Germany. The south was left to a French government in the spa town of Vichy, under the old Marshal Pétain. Between them ran the demarcation line: 1,200 kilometres of checkpoints, barbed wire and rivers, across farms, villages and families.' });
    out.push({ year: '23 June', text: 'Hitler toured Paris at dawn for three hours: the Opéra, the Eiffel Tower, Napoleon\'s tomb. He never came back.' });
    out.push({ year: 'July', text: `The division was given occupation duty in and around Paris. For the first time in a year, nobody was shooting at you. The men were issued a soldiers' guidebook to Paris and told to behave "correctly".

${s.flags.savedBrandt ? 'Feldwebel Brandt says that this is the most dangerous kind of peace: the kind that makes soldiers soft.' : 'Brandt says that this is the most dangerous kind of peace: the kind that makes soldiers soft.'} Lenz has applied to transfer to the Feldgendarmerie, the military police. Nobody is surprised.` });
    s.flags.lenzFeldgendarm = true;
    return out;
  }

  SIM.INTERLUDE_EVENTS.i2_photo = {
    id: 'i2_photo', scene: 'city',
    title: 'The Company Photograph',
    text: 'A photographer from a propaganda company comes to take a picture of the company for a magazine: victorious German soldiers in front of a Paris café. Everyone jostles for a place. Who do you stand next to?',
    choices: [
      { text: 'Hartmann. He makes rabbit ears behind your head.', rel: { hartmann: 10 }, effects: { morale: 4 },
        result: 'The photographer is furious. The picture is never published. Hartmann gets a print anyway and gives it to you.' },
      { text: 'Rau. He wants to look like a veteran.', rel: { rau: 12 },
        result: 'He stands as straight as a ramrod. Afterwards he asks for a copy to send to his mother.' },
      { text: s => vogelHere(s) ? 'Vogel, who hates having his picture taken.' : 'Brandt, who hates having his picture taken.',
        outcome: (s, x) => { const id = vogelHere(s) ? 'vogel' : 'brandt'; x.rel(id, 12); x.say('He scowls at the camera the whole time. Afterwards he says, gruffly, "Thank you for standing with me." You aren\'t sure why it matters to him. It does.'); } },
      { text: 'Lenz. It doesn\'t hurt to have friends in the military police.', rel: { lenz: 15, hartmann: -5 }, effects: { suspicion: -4 },
        result: 'Lenz puts his arm around your shoulders for the picture. It is published in the magazine. Your father would be proud, if he were the kind of father who would be.' }
    ]
  };

  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 2 }, o));

  // ───────────────────────── PARIS ─────────────────────────
  ev({ id: 'c3_0m', day: 0, phase: 0, scene: 'city', time: '09:00',
    title: 'Tourists in Field Grey',
    text: `Paris in July. The city is half empty: two million people fled in June, and only some have come back. The cafés are open, the shops are open, and the streets are full of German soldiers with cameras.

You have a free day and a soldiers' guidebook that recommends the Eiffel Tower, the Louvre and Napoleon's tomb, and warns about venereal disease. The exchange rate has been fixed at twenty francs to the Reichsmark. Everything is cheap for you. For the French, nothing is.`,
    choices: [
      { text: 'Take the squad to the Eiffel Tower for a photograph.', effects: { morale: 6 }, items: { photo: 1 }, rel: { hartmann: 5, rau: 5 },
        result: 'The lifts have been sabotaged, so you climb. A street photographer takes your picture at the bottom: six men in field grey grinning in the sun. It costs you almost nothing.' },
      { text: 'Go to the Louvre.', train: { french: 1 }, effects: { conscience: 2 },
        outcome: (s, x) => x.say(`The great halls are empty: the paintings were evacuated before the war. The Mona Lisa is somewhere in a château in the south. ${x.skill('french') >= 2 ? 'An elderly guard, pleased that you speak French, tells you this with obvious satisfaction.' : 'An elderly guard tells you something in French, with obvious satisfaction. You understand only "Joconde".'} You walk past empty frames for an hour. It is the strangest museum you have ever seen.`) },
      { text: 'Go shopping. Silk stockings and perfume to send home.', req: s => s.marks >= 6, reqText: 'You need 6 RM.', effects: { marks: -6, morale: 3 }, items: { stockings: 2, perfume: 1 }, train: { scrounging: 1 },
        result: 'The shopgirl smiles at you with her mouth and not her eyes. The stockings would cost a week\'s wages in Germany. Here they cost three marks. Every German in Paris is doing the same; the shops are being emptied one soldier at a time.' }
    ] });

  ev({ id: 'c3_0a', day: 0, phase: 1, scene: 'city',
    title: 'The Bouquiniste',
    text: 'Along the Seine, the green boxes of the booksellers are open. An old man in a beret watches you browse. Between the postcards and the Balzac you find a small volume in German: "Buch der Lieder", by Heinrich Heine. Heine was a Jew. His books were burned in Germany in 1933.',
    choices: [
      { text: 'Buy it (1 RM). Nobody needs to know.', req: s => s.marks >= 1, reqText: 'You need 1 RM.', effects: { marks: -1, conscience: 3 }, items: { heine: 1 },
        outcome: (s, x) => { x.say('"Die Lorelei," the old man says, tapping the cover. "Even you Germans still sing it. You just say the poet is unknown." He wraps it in newspaper for you.'); if (s.char.family === 'spd') x.say('Your father had this book once. You remember the night he burned it in the stove himself, before someone else could find it.'); } },
      { text: 'Talk to the old man in French.', train: { french: 1 },
        outcome: (s, x) => { if (x.skill('french') >= 2) { x.apply({ conscience: 3, morale: 3 }); x.say('He fought at Verdun. So did your grandfather, perhaps against him. You talk for half an hour about books, and about nothing. When you leave he says, "You are a strange German." You decide to take it as a compliment.'); } else x.say('You manage "bonjour" and "combien". He answers slowly, as if to a child. It is a start.'); } },
      { text: 'Walk on. That book could get you into real trouble.', effects: { suspicion: -1 },
        result: 'You put it back exactly where you found it. The old man shrugs. The Seine goes on flowing.' }
    ] });

  ev({ id: 'c3_0n', day: 0, phase: 2, scene: 'city', time: '22:00',
    title: 'Pigalle',
    text: s => `Hartmann has a plan for the evening, and the plan is Pigalle: cabarets, bars, and the brothels that the army has taken over and inspects for hygiene. Rau, nineteen, is trying to look as if he goes to such places every week.

Curfew is at eleven for the French and midnight for German soldiers. The Feldgendarmerie patrols the streets with torches.`,
    choices: [
      { text: 'Go with Hartmann to a cabaret. Just a drink.', effects: { morale: 8, marks: -2 }, rel: { hartmann: 8 },
        outcome: (s, x) => { if (x.roll(0.3)) { x.apply({ officers: -5 }); x.say('Just a drink becomes six. You run for the barracks at five past midnight and a Feldgendarm takes your names. A week of extra duties.'); } else x.say('A singer in a sequinned dress sings "J\'attendrai" to a room full of German soldiers. I will wait for you. Nobody in the room seems to notice what the song is about.'); } },
      { text: 'Keep Rau out of trouble. Take him to a café instead.', rel: { rau: 12 }, effects: { morale: 3 }, train: { leadership: 1 },
        result: 'You sit at a pavement café and drink terrible beer while Rau talks about his mother, the Hitler Youth, and a girl in his village who never noticed him. At half past eleven you walk him home. He says it was the best evening he has had in the army.' },
      { text: 'Stay in the barracks and write letters.', effects: { morale: 4, health: 3 },
        outcome: (s, x) => x.say(s.flags.sweetheart ? 'You write to Liesel about Paris. You describe the Seine at sunset and leave out Pigalle entirely.' : 'You write home about the Eiffel Tower. Your mother will show the letter to the whole street.') }
    ] });

  ev({ id: 'c3_1m', day: 1, phase: 0, scene: 'city',
    title: 'The Exchange Rate',
    text: `In the barracks courtyard, a Gefreiter from the 2nd Company is selling coffee beans out of a suitcase. His name is Bruno Sattler, he is from Berlin-Wedding, and he has the air of a man who has never paid full price for anything.

"Real coffee, comrades. Fifty pfennig a bag here. In Germany? Five marks, if you can find it. Down south, past the line, the French pay anything. Think about it."`,
    choices: [
      { text: 'Buy three bags (2 RM). Think of it as an investment.', req: s => s.marks >= 2, reqText: 'You need 2 RM.', effects: { marks: -2 }, items: { coffee: 3 }, set: { metSattler: true }, rel: { sattler: 10 }, train: { scrounging: 1 },
        result: 'Sattler winks. "A man of business. I\'ll remember you." Somehow you are sure that he will.' },
      { text: 'Ask him how the business works.', set: { metSattler: true }, rel: { sattler: 5 }, train: { scrounging: 1 },
        result: '"Simple. Germans buy everything in Paris with cheap francs. Germans in the provinces have nothing to spend money on. The French have nothing at all. I stand in the middle." He grins. "Everybody wins. Except the French, a bit."' },
      { text: 'Tell him to clear off before the Feldwebel sees him.', set: { metSattler: true }, rel: { sattler: -10 }, effects: { officers: 2 },
        result: 'He shrugs and snaps the suitcase shut. "Your loss, comrade."' }
    ] });

  ev({ id: 'c3_1a', day: 1, phase: 1, scene: 'city',
    title: 'The Woman with the Photograph',
    text: s => `Outside the Kommandantur in the Hôtel Majestic, a queue of French women waits all day for news. One of them steps in front of you and holds up a photograph: a man in French uniform. ${SIM.skill(s, 'french') >= 2 ? '"My husband. Prisoner. Since June. Nobody tells us where. Please, monsieur, you are German, you can ask."' : 'She says something fast in French. You catch "mari" and "prisonnier".'}

Nearly two million French soldiers are in German camps.`,
    choices: [
      { text: 'Go inside and try to find out for her.', train: { french: 1 }, effects: { conscience: 5 },
        outcome: (s, x) => {
          if (x.skill('french') >= 2 || x.roll(0.35)) { x.apply({ morale: 4 }); x.say('An hour of corridors, a bored clerk, a ledger. Stalag XII-A, near Limburg. You write it on the back of the photograph. She reads it three times and then she kisses your hand, which is the most embarrassing thing that has ever happened to you.'); x.log('Found out where a French woman\'s husband is held.'); }
          else { x.apply({ morale: -2 }); x.say('An hour of corridors and nobody can help, or will. When you come out, she reads the answer in your face before you say anything.'); }
        } },
      { text: 'Offer to ask, for a little something.', effects: { marks: 3, conscience: -6, suspicion: 4 },
        result: 'She gives you a ring without hesitating, as if she expected it. You find out nothing. You keep the ring anyway, and sell it to Sattler for three marks.' },
      { text: '"I\'m sorry. I can\'t help."', effects: { conscience: -1 },
        result: 'It\'s true, probably. She nods and goes back to the queue.' }
    ] });

  ev({ id: 'c3_2m', day: 2, phase: 0, scene: 'city', time: '10:00',
    title: 'Quatorze Juillet',
    text: `The fourteenth of July, Bastille Day, the French national day. This year there is no parade and the celebrations are forbidden. Your squad is on guard at the Arc de Triomphe, where the Unknown Soldier of the last war lies under an eternal flame.

An old man in a threadbare coat, with a row of medals from 1914–18, comes up the avenue alone, carrying a small bunch of flowers. He stops at the cordon. Kühn, a new man in the platoon who was a Hitler Youth leader, puts his hand on his rifle.`,
    choices: [
      { text: 'Let him through to lay his flowers.', effects: { conscience: 5, suspicion: 3 }, rel: { albrecht: 5 },
        result: 'He walks to the flame, lays the flowers down, and stands at attention for a full minute, alone in the empty square. Then he turns, looks at your squad, and nods once. Kühn writes something in his notebook.' },
      { text: 'Salute the tomb with him. One old soldier to another.', effects: { conscience: 6, suspicion: 8, morale: 4 }, rel: { albrecht: 8, lenz: -10 },
        result: 'You come to attention beside him and salute. After a moment Hartmann does too, and then the others, even Kühn, uncertainly. The old man\'s face does something complicated. Later, a Feldgendarmerie report notes "unusual fraternisation".',
        log: 'Saluted the Unknown Soldier with an old French veteran on 14 July.' },
      { text: 'Turn him away. Orders are orders.', effects: { officers: 3, conscience: -3 }, rel: { lenz: 5 },
        result: 'He looks at you for a long moment. Then he lays the flowers on the pavement in front of the cordon and walks away. Nobody picks them up all day.' }
    ] });

  ev({ id: 'c3_2a', day: 2, phase: 1, scene: 'city',
    title: 'Rue des Rosiers',
    text: `In the afternoon, Lenz takes you and two others through the Marais, the old Jewish quarter. "I want to see them," he says. "The ones who started all this."

In a narrow street, a man with a skullcap is closing the shutters of a small grocery. Lenz stops. "Open up, Jew. We want to buy something." He laughs. The man's hands are shaking.`,
    choices: [
      { text: 'Pull Lenz away. "Leave it, Karl. We\'re not here for this."', effects: { conscience: 7, suspicion: 5 }, rel: { lenz: -15 },
        result: 'Lenz shakes your hand off. "You were always soft on them, too." But he walks on. Behind you the shutters come down fast. You know he will remember this.',
        log: 'Pulled Lenz away from a Jewish grocer in the Marais.' },
      { text: 'Buy something, pay properly, and leave.', effects: { conscience: 4, marks: -1 }, rel: { lenz: -5 },
        result: 'You put a coin on the counter and take a bag of dates. "Merci," the grocer whispers. Lenz laughs and calls you a philanthropist. It\'s a small thing. It\'s what you could do.' },
      { text: 'Laugh along with Lenz.', effects: { conscience: -8, suspicion: -4 }, rel: { lenz: 10 },
        result: 'Lenz takes a handful of olives without paying and you all walk on, laughing. The grocer doesn\'t say a word. That evening the laughter sounds different in your head.' }
    ] });

  ev({ id: 'c3_3m', day: 3, phase: 0, scene: 'city',
    title: 'Sattler\'s Offer',
    cond: s => s.flags.metSattler && SIM.rel(s, 'sattler') >= 0,
    text: s => `Sattler finds you at breakfast. "Word is, your company's going south in the autumn. To the demarcation line." He lowers his voice. "I'm going with you: transferred, would you believe it. Now, a man on the line, at a checkpoint... that man could make us both rich. Coffee south, wine and tobacco north. Nobody gets hurt."

${SIM.has(s, 'coffee') ? 'He nods at the coffee bags in your kit. "You\'ve already started."' : ''}`,
    choices: [
      { text: 'Shake his hand. Partners.', set: { sattlerPartner: true, blackMarket: true }, rel: { sattler: 20 }, effects: { conscience: -3, marks: 4 }, train: { scrounging: 1 },
        result: '"Smart man." He presses four marks into your hand as an advance. "For the friendship."',
        log: 'Agreed to work with Sattler on the black market.' },
      { text: '"Maybe. Ask me when we\'re there."', rel: { sattler: 5 },
        result: '"I like a careful man." He taps his nose. "I\'ll ask."' },
      { text: '"No. And if I catch you at it on my post, I\'ll report you."', rel: { sattler: -20 }, effects: { officers: 2, conscience: 2 },
        result: 'His smile doesn\'t move, but his eyes do. "Understood, comrade. Understood."' }
    ] });
  ev({ id: 'c3_3m_alt', day: 3, phase: 0, scene: 'city',
    title: 'Laundry Day',
    text: 'A morning of kit inspection, boot polish and washing. The company is restless: the rumour is that you will be moved out of Paris soon, south, to the new border between occupied and unoccupied France.',
    choices: [
      { text: 'Help Hartmann with his kit before inspection.', rel: { hartmann: 6 }, effects: { officers: 1 }, result: 'His boots are a disgrace. Together, you turn them into a smaller disgrace.' },
      { text: 'Study the French phrasebook from the guidebook.', train: { french: 2 }, result: '"Où est la gare?" "Vos papiers, s\'il vous plaît." You feel ridiculous, and you keep going.' }
    ] });

  ev({ id: 'c3_3a', day: 3, phase: 1, scene: 'city',
    title: 'A Statement',
    text: s => `Lenz has his transfer: from next month he will wear the metal gorget of the Feldgendarmerie. Before he goes, he comes to you with a typed sheet of paper.

"Hartmann," he says. "Defeatist talk since Pomerania. Jokes about the Führer. Listening to London. I need a second witness, and you've heard more than anyone. Sign, and I'll remember it. Don't sign, and I'll remember that too."`,
    choices: [
      { text: 'Sign it.', effects: { suspicion: -10, conscience: -15, officers: 2 }, rel: { lenz: 25, hartmann: -40 }, set: { signedAgainstHartmann: true },
        result: 'Your signature looks like someone else\'s. Lenz folds the paper carefully into his breast pocket. "You won\'t regret it." Hartmann is called to the battalion office the next day and comes back grey. He doesn\'t know who signed. Not yet.',
        log: 'Signed Lenz\'s statement against Hartmann.' },
      { text: 'Refuse. "I\'ve never heard Hartmann say anything."', effects: { suspicion: 8, conscience: 5 }, rel: { lenz: -20, hartmann: 5 },
        result: '"Liar," Lenz says pleasantly. "But a loyal liar. I can respect that, almost." He puts the sheet away. Without a second witness, there is no case. For now.' },
      { text: 'Refuse, and warn Hartmann tonight.', effects: { suspicion: 10, conscience: 6 }, rel: { lenz: -20, hartmann: 20 }, set: { warnedHartmann: true },
        result: 'That night you tell Hartmann everything. He sits very still. Then he says, "Thanks, mate," and from that day on he stops making jokes when Lenz is in earshot, and listens to London only under a blanket.',
        log: 'Warned Hartmann about Lenz\'s statement.' }
    ] });

  ev({ id: 'c3_4m', day: 4, phase: 0, scene: 'city', time: '11:30',
    title: 'The Daily Parade',
    text: 'Every day at noon a German unit marches down the Champs-Élysées behind a military band, from the Arc de Triomphe to the Place de la Concorde. Today it is your company. The Parisians on the pavements look at the shop windows, at the sky, at anything but you.',
    choices: [
      { text: 'March with your chin up. You earned this.', effects: { morale: 6, officers: 3, conscience: -2 },
        result: 'The band plays "Preußens Gloria" and your boots ring on the cobbles. It is a magnificent feeling, and you are almost ashamed of how magnificent.' },
      { text: 'Watch the faces on the pavement as you pass.', effects: { conscience: 3, morale: -2 }, train: { french: 1 },
        result: 'A boy of about ten stares at you with pure hatred. An old woman is crying without making a sound. A young man in a good suit turns his back, very deliberately, and a policeman pretends not to see.' }
    ] });

  ev({ id: 'c3_4a', day: 4, phase: 1, scene: 'camp', time: '15:00',
    title: 'Orders',
    text: s => {
      const elig = s.flags.ncoCandidate || s.rank >= 3 || (s.rank >= 2 && s.stats.officers >= 60);
      return `Oberleutnant von Albrecht calls you into his office in a requisitioned schoolhouse.

"The company is moving south in November, to the demarcation line on the Cher. Before that, there are other duties." He looks at a list. ${elig
        ? `"You have been recommended for the divisional NCO course at Fontainebleau. Six weeks. If you pass, you come back as an Unteroffizier with a squad of your own."`
        : `"You are posted with a detachment to the Channel coast for the autumn. The navy needs men to guard the invasion barges at Boulogne. Then you rejoin us on the Cher."`}`;
    },
    choices: [
      { text: '"Jawohl, Herr Oberleutnant."', show: s => s.flags.ncoCandidate || s.rank >= 3 || (s.rank >= 2 && s.stats.officers >= 60),
        set: { ncoCourse: true }, effects: { morale: 6 }, rel: { albrecht: 5 },
        result: 'Albrecht nods. "Don\'t disappoint me. I put your name forward myself." It is the first time you have heard that.' },
      { text: '"Jawohl, Herr Oberleutnant."', show: s => !(s.flags.ncoCandidate || s.rank >= 3 || (s.rank >= 2 && s.stats.officers >= 60)),
        effects: { morale: -2 },
        result: '"The coast is quiet," Albrecht says. "Mostly." He doesn\'t sound as if he believes it.' },
      { text: 'Ask him to recommend Hartmann for the course too.', show: s => s.flags.ncoCandidate || s.rank >= 3,
        set: { ncoCourse: true }, rel: { hartmann: 10, albrecht: -3 },
        result: 'Albrecht almost laughs. "Hartmann? He would teach the recruits to play skat." But he writes the name down, and he puts yours on the list as well.' }
    ] });

  ev({ id: 'c3_4n', day: 4, phase: 2, scene: 'city', time: '21:00',
    title: 'Last Night in Paris',
    text: 'The last free evening before the company scatters. The city is warm and the blackout makes the stars visible above the Seine. Who do you spend it with?',
    choices: [
      { text: 'Hartmann, on a bench by the river with a bottle.', rel: { hartmann: 10 }, effects: { morale: 6 }, items: { schnapps: -1 }, show: s => SIM.has(s, 'schnapps'),
        result: 'You drink your schnapps. He talks about Argentina. You let him.' },
      { text: 'Hartmann, at a bar. You buy.', rel: { hartmann: 10 }, effects: { morale: 6, marks: -2 }, show: s => !SIM.has(s, 'schnapps'),
        result: 'He talks about Argentina, and about his father, who has been out of the camp at Fuhlsbüttel for four years and still flinches at a knock on the door.' },
      { text: 'Rau. Show him Montmartre.', rel: { rau: 10 }, effects: { morale: 5 }, train: { leadership: 1 },
        result: 'Sacré-Cœur in the moonlight, the city spread out below. Rau is quiet for a long time. "My mother will never believe this," he says.' },
      { text: s => vogelHere(s) ? 'Vogel. He wants to light a candle in Notre-Dame.' : 'Alone. Walk until curfew.',
        outcome: (s, x) => {
          if (vogelHere(s)) { x.rel('vogel', 12); x.apply({ conscience: 3, morale: 4 }); x.say('The cathedral is dark and enormous. Vogel lights a candle for his father, and then, after a moment, one for "the ones in Poland". He does not explain which ones.'); }
          else { x.apply({ morale: 3 }); x.train('french', 1); x.say('You walk along the Seine, past the shuttered bookstalls, and read the posters on the walls by moonlight: proclamations, curfews, lists of names. You understand more of them than you did a week ago.'); }
        } }
    ] });

  // ───────────────────────── AUTUMN: COURSE or COAST ─────────────────────────
  ev({ id: 'c3_5m_course', day: 5, phase: 0, scene: 'field', cond: course,
    title: 'The NCO Course',
    text: `Fontainebleau. A château in the forest, a parade ground, and forty Gefreiter and Obergefreiter from across the division who all think they are the best soldier in their company. The instructors are hard-bitten Feldwebel who spend the first week proving that you are not.

Six weeks of tactics, map-reading, drill, weapons, and how to make ten men do something they don't want to do. What do you put your effort into?`,
    choices: [
      { text: 'Tactics and map-reading. Brains keep men alive.', train: { leadership: 1, shooting: 1 }, set: { courseFocus: 'tactics' }, effects: { officers: 3 },
        result: 'You spend your evenings over maps and sand tables. The tactics instructor, a veteran of 1918 with one eye, starts calling on you when the others have no answer.' },
      { text: 'Drill and bearing. Look like an NCO and they\'ll treat you like one.', train: { leadership: 1 }, set: { courseFocus: 'drill' }, effects: { officers: 5, morale: -2 },
        result: 'Your voice gets louder and your boots get shinier. By the third week you can stop a platoon at fifty metres with one word.' },
      { text: 'The men. Watch how the good instructors handle people.', train: { leadership: 2 }, set: { courseFocus: 'men' }, effects: { conscience: 2 },
        result: 'You notice which instructors get the best from tired men, and how: a word at the right time, a cigarette, never humiliating anyone in front of the others. You write it all down.' }
    ] });

  ev({ id: 'c3_5a_course', day: 5, phase: 1, scene: 'forest', cond: course,
    title: 'Live Grenade Drill',
    text: 'Grenade practice in a sandpit. One by one, each candidate pulls the cord, counts, and throws. The man in front of you, a nervous Obergefreiter from Stettin, pulls the cord, and drops the grenade at his feet.',
    choices: [
      { text: 'Grab it and throw it out of the pit.', effects: { officers: 10, merit: 2 }, train: { leadership: 1 }, rel: { albrecht: 5 },
        risk: { chance: 0.15, dmg: [15, 40], fatal: 0.15, cause: 'Killed by a grenade during a training exercise at Fontainebleau, September 1940.',
          hit: 'You throw. It bursts in the air just over the rim, and something red-hot tears across your arm and face.',
          miss: 'You snatch it up and hurl it over the wall. It bursts on the far side, harmlessly, showering sand. The Obergefreiter is sitting on the ground, white as paper. The instructor looks at you and says, "Well. That\'s one of you who\'ll pass."' },
        log: 'Threw a dropped grenade out of the pit at Fontainebleau.' },
      { text: 'Throw the man down and cover him.', effects: { officers: 6, merit: 1, conscience: 3 },
        risk: { chance: 0.25, dmg: [10, 30], fatal: 0.08, cause: 'Killed by a grenade during a training exercise at Fontainebleau, September 1940.',
          hit: 'The blast lifts you both. Fragments hit your back and legs.',
          miss: 'The blast throws sand over you both. The fragments go up and out. Neither of you is hurt.' } },
      { text: 'Dive for the trench.', effects: { officers: -3 },
        risk: { chance: 0.1, dmg: [8, 20], cause: 'Killed by a grenade during a training exercise at Fontainebleau, September 1940.',
          hit: 'You are fast, but not quite fast enough.',
          miss: 'You hit the bottom of the trench as it goes off. The Obergefreiter is wounded in the legs. An instructor asks you, afterwards, why you didn\'t do anything. You have no answer.' } }
    ] });

  ev({ id: 'c3_5n_course', day: 5, phase: 2, scene: 'camp', cond: course,
    title: 'Political Instruction',
    text: s => `Every Tuesday evening, an officer from the division staff lectures the candidates on "the National Socialist worldview and the duties of the NCO". Tonight's subject: "The Jewish Question and the Soldier".

At the end, he asks questions. He points at you. "You were in Poland. Tell the class what you learned there about the enemy."`,
    choices: [
      { text: 'Give him the answer he wants.', effects: { officers: 4, suspicion: -6, conscience: -6 },
        result: 'You say the words. They come out easily; you have heard them a hundred times. He nods, satisfied, and moves on. Later, in bed, you remember the faces of the men at the barn wall, and you cannot remember a single word you said.' },
      { text: 'Talk only about the Polish army: brave, badly equipped, outnumbered.', effects: { conscience: 3, suspicion: 3 }, train: { leadership: 1 },
        result: 'He frowns. "That is not quite the point, candidate." But he can hardly fault you for respecting the enemy\'s soldiers; the textbooks say the same. He moves on.' },
      { text: 'Tell the truth about what you saw.', show: s => s.flags.firingSquad || s.flags.refusedOrder || s.flags.stoppedReprisal || s.flags.triedToStop || s.flags.lenzKilled,
        effects: { conscience: 10, suspicion: 22, officers: -10 },
        result: 'You tell them about the village. The room goes very quiet. The officer lets you finish, then says, "Thank you, candidate. That will be all," and writes for a long time in his notebook.',
        log: 'Told the NCO course what happened in the village in Poland.' }
    ] });

  ev({ id: 'c3_6m_course', day: 6, phase: 0, scene: 'field', cond: course,
    title: 'Final Examination',
    text: 'The last day. A field exercise in the forest: you lead a squad of candidates in an attack on a farmhouse defended by the instructors. They will judge everything: your orders, your map, your voice, your men.',
    choices: [
      { text: 'A careful flanking attack, properly briefed.',
        outcome: (s, x) => examine(s, x, s.flags.courseFocus === 'tactics' ? 1.2 : 0.4) },
      { text: 'A fast, loud frontal assault. Show them some fire.',
        outcome: (s, x) => examine(s, x, s.flags.courseFocus === 'drill' ? 1 : 0.2) },
      { text: 'Ask your "men" for ideas first, then decide.',
        outcome: (s, x) => examine(s, x, s.flags.courseFocus === 'men' ? 1.2 : 0.3) }
    ] });

  function examine(s, x, bonus) {
    const score = SIM.skill(s, 'leadership') + s.stats.officers / 30 + Math.random() * 2 + bonus - (s.stats.suspicion >= 50 ? 1 : 0);
    if (score >= 3.2) {
      s.flags.passedCourse = true;
      const from = s.rank;
      s.rank = 4;
      s.rankHistory.push({ rank: 4, date: '4 October 1940' });
      x.apply({ morale: 12, officers: 5 });
      x.train('leadership', 1);
      x.say(`You pass${score >= 4.5 ? ', third in the course' : ''}. The commandant pins on your new shoulder straps with the silver braid himself. Unteroffizier ${s.char.last}. ${from < 3 ? 'You have jumped a rank; that happens when the army needs NCOs.' : ''}`);
      x.log('Passed the NCO course. Promoted to Unteroffizier.');
    } else {
      s.flags.failedCourse = true;
      x.apply({ morale: -10 });
      x.train('leadership', 1);
      x.say('You fail, narrowly. "Too much hesitation," the report says, or perhaps "not enough". You go back to the company with the same rank and a lesson about how it feels to fail in front of forty men. Albrecht says you can try again next year.');
      x.log('Failed the NCO course.');
    }
  }

  // The coast path.
  ev({ id: 'c3_5m_coast', day: 5, phase: 0, scene: 'river', cond: s => !course(s), place: 'boulogne',
    title: 'The Barges',
    text: `Boulogne. The harbour is jammed with river barges brought from the Rhine and the canals of Belgium, hundreds of them, fitted with ramps for an invasion of England that everyone talks about and nobody believes in. The navy needs soldiers to guard them, load them and practise landings in them.

Above, the Luftwaffe and the RAF fight over the Channel. At night, the RAF comes to Boulogne.`,
    choices: [
      { text: 'Volunteer for the landing exercises.', effects: { officers: 5, merit: 2 },
        risk: { chance: 0.12, dmg: [10, 30], fatal: 0.3, cause: 'Drowned when an invasion barge capsized during an exercise off Boulogne, September 1940.',
          hit: 'The barge swings broadside in the swell and turns over. You come up under the hull in black water.',
          miss: 'The barges wallow like bathtubs. Half the men are seasick before they leave the harbour. You are not, and the naval officer notices.' } },
      { text: 'Guard duty on the quay. Keep your head down.', effects: { morale: -2 },
        result: 'Twelve hours a day watching barges. You learn more about knots than you ever wanted to know.' },
      { text: 'Make friends with the navy cooks.', train: { scrounging: 2 }, effects: { food: 15 }, items: { coffee: 1 },
        result: 'The navy eats better than the army. Two packets of cigarettes and some flattery get you fed for a week, and a bag of coffee besides.' }
    ] });

  ev({ id: 'c3_5a_coast', day: 5, phase: 1, scene: 'field', cond: s => !course(s), place: 'boulogne',
    title: 'Battle in the Sky',
    text: 'A cloudless afternoon. High over the Channel, white contrails twist and loop as fighters duel. A plane comes down trailing smoke, then another. One parachute opens, then drifts out to sea. Everyone on the quay stops working to watch.',
    choices: [
      { text: 'Watch, and cheer each one that falls.', effects: { morale: 3 }, result: 'You cheer. You have no idea which side any of them are on.' },
      { text: 'Help the navy launch a boat for the parachutist.', effects: { conscience: 4, merit: 1 }, train: { medicine: 1 },
        outcome: (s, x) => { if (x.roll(0.5)) x.say('He is an RAF pilot, about your age, with a broken leg and a frozen grin. You splint the leg on the bottom of the boat. "Cheers, Jerry," he says through chattering teeth, and is taken off to a prison camp.'); else x.say('He is a Luftwaffe pilot, unconscious and blue with cold. You rub his hands all the way back to the quay. He lives.'); } }
    ] });

  ev({ id: 'c3_5n_coast', day: 5, phase: 2, scene: 'river', time: '23:40', cond: s => !course(s), place: 'boulogne',
    title: 'Air Raid',
    text: 'The sirens start just before midnight. Then the drone of bombers, and the searchlights sweeping. Bombs begin to fall on the harbour, on the barges, on the quay where you are on watch. A fuel barge goes up in a sheet of flame.',
    choices: [
      { text: 'Run for the shelter.',
        risk: { chance: 0.12, dmg: [10, 30], cause: 'Killed in an RAF air raid on the harbour at Boulogne, September 1940.',
          hit: 'A bomb lands on the quay behind you. You are lifted and thrown into a wall.',
          miss: 'You make it into the concrete shelter and sit with your hands over your ears while the ground shakes.' } },
      { text: 'Help drag the wounded off the burning barges.', effects: { merit: 3, conscience: 4, officers: 4 }, train: { medicine: 1 },
        risk: { chance: 0.25, dmg: [12, 35], cause: 'Killed rescuing wounded men during an RAF raid on Boulogne, September 1940.',
          hit: 'You are pulling a sailor from the water when the second wave comes over.',
          miss: 'You pull three men out of the burning water. One of them is dead by morning. The other two will live.' },
        outcome: (s, x) => { if (!x.wasHit) s.flags.raidRescue = true; } }
    ] });

  ev({ id: 'c3_6m_coast', day: 6, phase: 0, scene: 'river', cond: s => !course(s), place: 'boulogne',
    title: 'Postponed',
    text: 'In October the word comes down quietly: the invasion of England is "postponed". The barges are to be dispersed back to the rivers. Nobody says "cancelled". Everybody knows.',
    choices: [
      { text: 'Relief. Nobody wanted to cross the Channel in a bathtub.', effects: { morale: 8 }, result: 'The men laugh and joke. Somebody paints "Bon voyage, Tommy" on a barge and the navy makes him paint it out.' },
      { text: 'Disquiet. If England won\'t make peace, then where?', effects: { morale: -3, conscience: 2 }, result: 'England has not made peace, and cannot be invaded. The war is not over. You wonder where they will send you instead. You look at the map, east, and stop yourself.' }
    ] });

  // Both paths: the squad.
  ev({ id: 'c3_6a', day: 6, phase: 1, scene: 'camp',
    title: 'Your Own Squad',
    text: s => `${s.flags.passedCourse ? 'Back at the company, Albrecht gives you a squad of your own.' : 'Back at the company, Albrecht calls you in. "The company is spread thin along the line. Every bridge needs a post, and I have more bridges than NCOs. You will command the post at Saint-Avit until further notice."'} Seven men, a bridge on the Cher, and the demarcation line.

He hands you the list.

Hartmann, Rau${vogelHere(s) ? ', Vogel' : ''}, and new men: Gustav Pohl, a 41-year-old reservist from Leipzig with four children; Heinz Kühn, a 20-year-old former Hitler Youth leader who reports everything to everyone; Bruno Sattler from Berlin, who has a gift for getting things; and Josef Brenner, a Bavarian farmhand built like a barn door.

"Look after them," Albrecht says. "And watch them."`,
    choices: [
      { text: 'Take the list.',
        outcome: (s, x) => { SIM.makeSquad(s); s.flags.hasSquad = true; s.flags.metSattler = true; x.say('Your squad is now listed in your kit: open the "Squad" tab to see your men, their morale and their loyalty. From now on, some orders will ask you to choose which man to send.'); } }
    ] });

  ev({ id: 'c3_6n', day: 6, phase: 2, scene: 'camp', time: '20:00',
    title: 'A Deputy',
    text: 'Every squad needs a second in command: the man who takes over if you are hit, and who keeps the others in line when you are not looking. Who do you choose?',
    choices: [
      { text: 'Choose your deputy.', assign: true, assignPrompt: 'Who will be your deputy?',
        outcome: (s, x) => {
          const m = x.man;
          s.flags.deputy = m.id;
          x.squadMod(m.id, { loyalty: 15, morale: 10 });
          const t = {
            hartmann: 'Hartmann laughs, then stops laughing when he sees you mean it. "God help the German army," he says, and takes it seriously from that moment on.',
            rau: 'Rau goes red to the ears. The older men exchange looks: a nineteen-year-old as deputy. You will have to back him up.',
            vogel: 'Vogel looks terrified, and then, slowly, proud. "I won\'t let you down." You believe him.',
            pohl: 'Pohl nods slowly. "Someone with sense, at last." The others respect him; he was at the Somme.',
            kuehn: 'Kühn snaps to attention, delighted. You have given the man who watches everyone the right to watch everyone. Sattler looks at you as if you have lost your mind.',
            sattler: 'Sattler grins. "You won\'t regret it, boss." Pohl mutters something about foxes and henhouses.',
            brenner: 'Brenner nods once. "Jawohl." He says nothing more, but the next morning the whole squad is on parade two minutes early.'
          }[m.id];
          x.say(t);
          if (m.id === 'kuehn') x.squadMod('sattler', { loyalty: -10 });
          if (m.id === 'rau') x.squadMod('pohl', { loyalty: -5 });
          if (m.id === 'sattler') x.squadMod('pohl', { loyalty: -8 });
          x.log(`Chose ${m.name} as deputy.`);
        } }
    ] });

  SIM.EVENTS.push(...E);
})();
