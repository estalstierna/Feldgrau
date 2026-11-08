// Chapter V, part two: the Soviet counteroffensive, the retreat, the halt order and Christmas 1941.
window.SIM = window.SIM || {};

(function () {
  const { has, first, starck, informed, say, score } = SIM.ch5;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 4 }, o));

  // ───────────────────────── Day 6 · Friday 5 December ─────────────────────────
  ev({ id: 'c5_6m', day: 6, phase: 0, scene: 'field', time: '06:00',
    title: '5 December',
    text: 'Minus thirty-eight. At dawn the world explodes. Out of the forest come men in white on skis, and behind them white-painted T-34s, and behind them more men than you have ever seen: fresh Siberian divisions, well fed, in fur caps and quilted jackets, whose rifles work in the cold. The Red Army is counterattacking along the whole front before Moscow.',
    choices: [
      { text: 'Hold as long as you can, then pull back in order.', effects: { merit: 4, officers: 6 }, assault: true, train: { leadership: 1 },
        risk: { chance: 0.2, dmg: [14, 40], cause: 'Killed on 5 December 1941, the first day of the Soviet counteroffensive before Moscow.', hit: 'A T-34 shell bursts on the parapet.', miss: 'You hold for an hour. Then, on your command, the squad pulls back by pairs, covering each other, and nobody runs.' },
        outcome: (s, x) => { s.flags.heldLine5 = true; const m = x.casualty(0.26, 'in the Soviet counteroffensive'); say(x, m, m => `${m.name} is killed when the T-34s reach the line.`, m => `${m.name} is wounded when the T-34s reach the line.`); } },
      { text: 'Get out now. Everyone back to the village.', effects: { officers: -4 }, squad: { all: { loyalty: 2 } },
        risk: { chance: 0.1, dmg: [10, 30], cause: 'Killed in the retreat on 5 December 1941.', hit: 'Running through deep snow, you are a target.', miss: 'You run, and the squad runs with you.' },
        outcome: (s, x) => { const m = x.casualty(0.16, 'running through the deep snow'); say(x, m, m => `${m.name} falls in the deep snow and the ski troops reach him.`, m => `${m.name} is wounded running through the deep snow.`); } }
    ] });

  ev({ id: 'c5_6a', day: 6, phase: 1, scene: 'road', time: '15:00',
    title: 'Leave Nobody',
    text: s => {
      const w = (s.squad || []).find(m => m.status === 'wounded' && (s.losses || []).some(l => l.id === m.id && l.chapter === 4));
      return `The order to withdraw. There is no transport. The wounded must walk, or be pulled on sledges, or be left behind.

${w ? `${w.name} cannot walk.` : 'A wounded man from the next squad lies in the snow, a boy you do not know, holding out his hand.'} Minus thirty-eight. Behind you the Soviet ski troops are a kilometre away and coming.`;
    },
    choices: [
      { text: 'Pull him yourself, on a sledge made from a door.', effects: { warmth: -12, health: -6, conscience: 8, merit: 2 }, set: { carriedWounded5: true }, squad: { all: { loyalty: 6 } },
        risk: { chance: 0.12, dmg: [10, 28], cause: 'Killed pulling a wounded comrade through the snow, December 1941.', hit: 'A ski patrol catches you on the open road.', miss: 'Twelve kilometres, pulling a door through the snow on a rope. When you reach the aid post, your hands are frozen to the rope and they have to pour warm water on them to let go.' },
        log: 'Pulled a wounded man twelve kilometres through the snow on a door.' },
      { text: 'Leave him, with a pistol.', effects: { conscience: -12, morale: -10 },
        result: 'You give him a pistol with two rounds. Everybody knows what the Soviets do with German wounded, or says they do. Everybody knows what the Germans do with theirs. You do not look back. You hear one shot, later.' },
      { text: 'Leave him in a house with a Red Cross flag, and hope.', effects: { conscience: -4, morale: -6 },
        result: 'A bedsheet with a cross painted in blood on the door. Perhaps. You will never know.' }
    ] });

  // ───────────────────────── Day 7 · Sunday 7 December ─────────────────────────
  ev({ id: 'c5_7m', day: 7, phase: 0, scene: 'village',
    title: 'Scorched Earth',
    text: s => `The order comes down: everything the Red Army could use is to be destroyed in the retreat. Houses, barns, wells. The villages are to be burned; the inhabitants driven out. Starck's SS men are already at work in the next village; you can see the smoke.

In your village, people stand in front of their houses with bundles, watching you.`,
    choices: [
      { text: 'Burn the empty houses. Leave the ones with people in them.', effects: { conscience: 4, suspicion: 6 }, rel: { starck: -6 },
        outcome: (s, x) => { x.say('You burn the barns and the empty houses, enough smoke to look like obedience. Seven houses are left standing with families inside them.'); if (informed(s, x, 0.3)) { x.apply({ suspicion: 10 }); x.rel('starck', -10); x.say('Starck drives past in the afternoon and counts the houses.'); } } },
      { text: 'Warn them first. Give them time to take what they can.', effects: { conscience: 3 },
        result: 'Ten minutes. They carry out bedding, icons, a sewing machine, a samovar. Then you burn it all. A grandmother sits on her trunk in the snow and watches her house go.' },
      { text: 'Burn everything, as ordered.', effects: { conscience: -16, warmth: 8 }, rel: { starck: 8 }, set: { burnedVillages5: true },
        result: 'You warm your hands at it. You are not proud of that. You do it anyway, and so does everyone.',
        log: 'Burned a village in the retreat and drove the people into the snow.' },
      { text: 'Refuse. "There are children in those houses."', effects: { conscience: 12, suspicion: 15, officers: -8 }, rel: { starck: -18 }, set: { refusedOrder5: true },
        outcome: (s, x) => {
          if (SIM.rel(s, 'albrecht') >= 45) { x.apply({ suspicion: -6 }); x.say('Albrecht arrives before Starck does. "This village has no military value," he says loudly, for the record. "We will not waste time on it." He looks at you. "Next time, let me be the one who refuses."'); }
          else x.say('Another squad burns it an hour later. Your name goes into Starck\'s notebook. He does not shout. He only writes.');
          x.log('Refused to burn a village in the retreat.');
        } }
    ] });

  ev({ id: 'c5_7a', day: 7, phase: 1, scene: 'road', time: '21:00',
    title: 'The Night March',
    text: 'All night, west along a road choked with abandoned trucks, frozen horses and guns without tractors. Minus thirty. Men fall asleep walking, and some of them fall down and do not get up again.',
    choices: [
      { text: 'Keep them moving. Nobody sleeps, nobody stops.', squad: { all: { loyalty: 2, morale: -4 } }, effects: { warmth: 4, health: -4 }, train: { leadership: 1 },
        result: 'You walk up and down the column all night, shaking men, slapping faces, swearing. In the morning everybody is still there.' },
      { text: 'Take your Pervitin to keep going.', show: s => SIM.has(s, 'pervitin'), items: { pervitin: -1 }, effects: { warmth: 6, morale: 6 },
        delay: { in: 3, effects: { morale: -12, health: -6 }, note: 'The Pervitin is wearing off. The cold is worse than ever.' },
        result: 'The night becomes sharp and clear. You do not feel the cold, which is dangerous, because the cold is still there.' },
      { text: 'Stop in a burning village and let the men warm up.', effects: { warmth: 14 }, squad: { all: { morale: 4 } },
        outcome: (s, x) => { const m = x.casualty(0.08, 'when a Soviet patrol found the burning village'); say(x, m, m => `A Soviet patrol finds you by the light of the fires. ${m.name} is killed.`, m => `A Soviet patrol finds you by the light of the fires. ${m.name} is wounded.`); if (!m) x.say('Twenty minutes by the flames. It saves somebody\'s feet, probably. You do not stay longer.'); } }
    ] });

  // ───────────────────────── Day 8 · Thursday 11 December ─────────────────────────
  ev({ id: 'c5_8m', day: 8, phase: 0, scene: 'camp',
    title: 'The Whole World',
    text: s => `News travels even here. On 7 December Japan attacked the American fleet at Pearl Harbor. Today, 11 December, Germany has declared war on the United States.

Starck is jubilant: "Now the Americans will have their hands full in the Pacific." ${has(s, 'hartmann') ? 'Hartmann, beside you, says quietly: "England, Russia, America. Now it\'s the whole world against us."' : 'A Gefreiter beside you says quietly: "England, Russia, America. Now it\'s the whole world against us."'}`,
    choices: [
      { text: '"The Führer knows what he is doing."', effects: { morale: 3, suspicion: -4 }, rel: { starck: 5 },
        result: 'You say it loudly enough for Starck to hear. He nods. Hartmann looks at you as if he has never seen you before.' },
      { text: 'Say nothing. Look at the map in your head.', effects: { morale: -4, conscience: 2 },
        result: 'America. You saw a newsreel once: Detroit, a factory as big as a town, cars coming off the line one every minute.' },
      { text: '"He\'s right, Herr Hauptsturmführer. It is the whole world."', effects: { suspicion: 10, conscience: 3 }, rel: { starck: -12 }, squad: { all: { loyalty: 3 } },
        result: s => `Starck turns slowly. "Defeatism is a crime, ${SIM.RANKS[s.rank]}." Then he smiles. "But I will put it down to the cold. This time."` }
    ] });

  ev({ id: 'c5_8a', day: 8, phase: 1, scene: 'camp',
    title: 'The Search',
    text: s => `Lenz and two Feldgendarmes arrive at the dugout with Starck. "A report," Lenz says, "of defeatist material in this squad. Everyone turns out their packs."${s.flags.kuehnRecord ? ' Behind them, Kühn does not meet your eyes.' : ''}

${SIM.has(s, 'film') ? 'In the lining of your pack is the roll of film from Białystok.' : SIM.has(s, 'heine') ? 'In your pack is the little book of Heine poems from Paris.' : 'You have nothing to hide. You are not sure about the others.'}`,
    choices: [
      { text: 'Hide it in the snow outside before they reach you.', show: s => SIM.has(s, 'film') || SIM.has(s, 'heine'),
        outcome: (s, x) => {
          const id = SIM.has(s, 'film') ? 'film' : 'heine';
          if (x.roll(0.6 + SIM.skill(s, 'scrounging') * 0.05)) { x.say('A handful of snow, a mark on a birch tree. They find nothing in your pack. Afterwards, at night, you dig it out again with numb fingers.'); }
          else { x.item(id, -1); x.apply({ suspicion: 15 }); x.rel('starck', -15); s.flags.starckFound = id; x.say(`Starck watches you from the doorway as you come back in. He walks out, kicks at the snow where you were, and holds up the ${id === 'film' ? 'roll of film' : 'book'}. "Interesting," he says.`); }
        } },
      { text: 'Give it to Brenner to hide. Nobody searches Brenner.', show: s => (SIM.has(s, 'film') || SIM.has(s, 'heine')) && has(s, 'brenner'),
        outcome: (s, x) => { x.squadMod('brenner', { loyalty: 6 }); x.say('Brenner takes it without a word and puts it inside his shirt. They search his pack and find a rosary and a photograph of twelve cows. He gives it back to you that night. "I didn\'t look at it," he says.'); } },
      { text: 'Burn it in the stove.', show: s => SIM.has(s, 'film') || SIM.has(s, 'heine'), effects: { conscience: -4, suspicion: -3 },
        outcome: (s, x) => { const id = SIM.has(s, 'film') ? 'film' : 'heine'; x.item(id, -1); x.say(id === 'film' ? 'The celluloid flares and shrivels in a second. Białystok is gone. Only you remember it now.' : 'Heine burns slowly, page by page. "Where they burn books, they will in the end burn people," he wrote, a hundred years ago.'); } },
      { text: 'Leave it where it is. They won\'t look in the lining.', show: s => SIM.has(s, 'film') || SIM.has(s, 'heine'),
        outcome: (s, x) => {
          const id = SIM.has(s, 'film') ? 'film' : 'heine';
          if (x.roll(0.5)) { x.say('Lenz goes through your pack, sniffing. He finds cigarettes, letters, socks. Not the lining.'); return; }
          s.flags.starckFound = id;
          x.item(id, -1);
          if (starck(s) >= 40) { s.flags.starckHasLeverage = true; x.apply({ suspicion: 4 }); x.say(`Lenz finds it and holds it up in triumph. Starck takes it from his hand, looks at it, and puts it in his own pocket. "I will deal with this personally, Gefreiter," he says. Lenz opens his mouth and shuts it again. Outside, Starck says to you: "You owe me now. I always collect."`); x.log(`Starck took the ${id === 'film' ? 'film' : 'Heine book'} from Lenz and kept it.`); }
          else { x.apply({ suspicion: 22, morale: -8 }); x.rel('starck', -15); s.flags.starckEnemy = true; x.say(`Lenz finds it and holds it up in triumph. Starck looks at it for a long time. "So this is who you are," he says. He writes a report that night. It goes to the SD.`); x.log(`The ${id === 'film' ? 'film from Białystok' : 'Heine book'} was found. Starck has filed a report.`); }
        } },
      { text: 'Turn out your pack.', show: s => !SIM.has(s, 'film') && !SIM.has(s, 'heine'),
        outcome: (s, x) => {
          if (has(s, 'hartmann') && x.roll(0.5)) {
            x.say('They find nothing in yours. In Hartmann\'s, Lenz finds a British leaflet, folded small. "Well, well," says Lenz.');
            s.flags.hartmannLeaflet = true;
          } else x.say('They find nothing. Lenz is disappointed. Starck is not; he seems almost pleased with you.');
        } }
    ] });

  ev({ id: 'c5_8b', day: -1, phase: 1, scene: 'camp',
    title: 'Hartmann\'s Leaflet',
    text: 'Lenz holds up the leaflet. "Enemy propaganda. Possession is a court-martial offence." Hartmann has gone white. Starck looks at you. "Your man, Unteroffizier. What do you say?"',
    choices: [
      { text: '"It\'s mine. I gave it to him to use as toilet paper."', effects: { suspicion: 15, comrades: 8 }, rel: { hartmann: 25, starck: -8 },
        result: 'A long silence. Then Starck laughs, a short bark. "Toilet paper. Yes. That is all it is good for." He drops it in the stove. Lenz is furious. Hartmann will never forget it.',
        log: 'Took the blame for Hartmann\'s leaflet.' },
      { text: '"He\'s a good soldier. Let me deal with it."', outcome: (s, x) => { if (starck(s) >= 25) { x.rel('hartmann', 10); x.say('"Deal with it, then," says Starck, and drops the leaflet in the stove. Lenz looks at him with something like hatred.'); } else { x.lose('hartmann', 'gone', 'arrested by the Feldgendarmerie'); SIM.man(s, 'hartmann').fate = 'Arrested, December 1941. Sent to a penal unit.'; x.apply({ morale: -12 }); x.say('"No," says Starck. "You will not." They take Hartmann away. He looks back at you once from the sledge.'); } } },
      { text: 'Say nothing.', effects: { conscience: -10 }, rel: { hartmann: -40 },
        outcome: (s, x) => { x.lose('hartmann', 'gone', 'arrested by the Feldgendarmerie'); SIM.man(s, 'hartmann').fate = 'Arrested, December 1941. Sent to a penal unit.'; x.apply({ morale: -12 }); x.say('They take Hartmann away on the Feldgendarmerie sledge. He does not look back.'); x.log('Said nothing when they arrested Hartmann.'); } }
    ] });

  // ───────────────────────── Day 9 · Tuesday 16 December ─────────────────────────
  ev({ id: 'c5_9m', day: 9, phase: 0, scene: 'field', time: '07:00',
    title: 'Not One Step Back',
    text: s => {
      const w = SIM.weakestMan(s);
      return `The Führer's order of 16 December: no more retreat. Every position is to be held "with fanatical resistance". Officers are authorised to use any means.

In the night the Soviets attacked again and the line held, barely. At dawn Starck's men bring a soldier to you, hands tied behind his back: ${w ? w.name : 'a man from your squad'}. They found him two kilometres behind the line. Starck has a pistol in his hand.

"Cowardice in the face of the enemy. Under the Führer's order, I can shoot him here. He is your man. You may do it yourself, if you prefer."`;
    },
    choices: [
      { text: 'Plead for him. "He was sent back with a message. My order."', outcome: (s, x) => {
          const w = SIM.weakestMan(s);
          const p = 0.25 + Math.max(0, starck(s)) / 100 + SIM.skill(s, 'leadership') * 0.06;
          if (!w) return;
          if (x.roll(p)) { x.apply({ suspicion: 6, conscience: 6 }); x.squadMod(w.id, { loyalty: 25 }); x.say(`Starck looks at you, then at ${first(w)}. He knows you are lying. You both know it. "A message," he says. "Of course." He holsters the pistol. "Do not lie to me again, ${SIM.RANKS[s.rank]}." ${first(w)} is untied. He sits in the snow and shakes.`); x.log(`Lied to Starck to save ${w.name}.`); }
          else { x.lose(w.id, 'killed', 'shot by the SS for cowardice'); SIM.man(s, w.id).fate = 'Shot for cowardice, 16 December 1941'; x.apply({ morale: -15, conscience: 2 }); x.rel('starck', -8); x.say(`"No," says Starck, "he was not." He fires once. Your squad is standing ten metres away, watching.`); x.log(`${w.name} was shot by Starck on 16 December.`); }
        } },
      { text: 'Take the blame. "I ordered him back. Punish me."', effects: { suspicion: 15, conscience: 10 }, set: { tookBlame5: true },
        outcome: (s, x) => {
          const w = SIM.weakestMan(s); if (!w) return;
          x.squadMod('all', { loyalty: 10 });
          if (starck(s) >= 10) { x.rel('starck', 6); x.say(`Starck looks at you for a long time. "You would take a bullet for this man?" You do not answer. He holsters the pistol. "Loyalty," he says. "At least you have that." He writes your name in his notebook, with a different kind of note.`); }
          else { x.apply({ officers: -10 }); x.rel('starck', -6); x.say('Starck reports you to battalion. Albrecht absorbs it, somehow; you are reprimanded in writing. But the man lives.'); }
          x.log('Took the blame to save one of my men from Starck.');
        } },
      { text: 'Let Starck do as he wants.', effects: { conscience: -15, morale: -10 }, rel: { starck: 4 },
        outcome: (s, x) => { const w = SIM.weakestMan(s); if (!w) return; x.lose(w.id, 'killed', 'shot by the SS for cowardice'); SIM.man(s, w.id).fate = 'Shot for cowardice, 16 December 1941'; x.squadMod('all', { loyalty: -12 }); x.say('You look away. One shot. Your men will not look at you for days.'); x.log(`Let Starck shoot ${w.name}.`); } },
      { text: 'Do it yourself.', effects: { conscience: -30, morale: -15, officers: 2 }, rel: { starck: 15 },
        outcome: (s, x) => { const w = SIM.weakestMan(s); if (!w) return; x.lose(w.id, 'killed', 'shot by his own squad leader'); SIM.man(s, w.id).fate = 'Shot for cowardice by his squad leader, 16 December 1941'; x.squadMod('all', { loyalty: -25 }); s.flags.shotOwnMan = true; x.say('Starck hands you the pistol, butt first. Afterwards he says, "Now you understand what this war is." You do. That is what you will never forgive yourself for.'); x.log(`Shot ${w.name} myself, on Starck's order.`); } }
    ] });

  ev({ id: 'c5_9a', day: 9, phase: 1, scene: 'camp',
    title: 'Holding',
    text: 'The line holds, after a fashion. Your squad digs into the frozen earth with explosives, because picks will not go in. A dugout: logs, earth, a stove made from a petrol can. Shelter.',
    choices: [
      { text: 'Build it properly, deep, with a log roof.', shelter: 2, effects: { warmth: 10, health: -4 }, squad: { all: { morale: 6 } }, train: { leadership: 1 },
        result: 'Two days of work. When it is done, eight men can sleep in it, and the stove glows red. It will stand until spring.' },
      { text: 'A quick shelter now. Rest the men.', shelter: 1, effects: { warmth: 6, health: 4 }, squad: { all: { morale: 3 } },
        result: 'A hole in the snow with a tent-square over it and a candle. Better than nothing.' }
    ] });

  // ───────────────────────── Day 10 · Saturday 20 December ─────────────────────────
  ev({ id: 'c5_10m', day: 10, phase: 0, scene: 'letter',
    title: 'Wool for the Front',
    text: s => `On the radio: Goebbels appeals to the German people to give their furs, woollens and skis for the soldiers in the East. Your mother writes that she has given your father's winter coat, and your old skiing sweater.

On the same day you hear that Field Marshal von Brauchitsch, the commander-in-chief of the Army, has been dismissed. The Führer himself has taken command.`,
    choices: [
      { text: 'Write home and thank her.', effects: { morale: 6 }, result: 'You write that the clothes will reach you soon. You know they will not, not this winter. It does not matter. What matters is that she gave them.' },
      { text: 'Laugh with the men about it. Bitterly.', effects: { morale: 2 }, squad: { all: { loyalty: 3 } }, result: '"A lady\'s fur stole for the Russian front," someone says, and everyone laughs too long.' }
    ] });

  ev({ id: 'c5_10a', day: 10, phase: 1, scene: 'camp', time: '20:00',
    title: 'Starck\'s Question',
    text: s => `Starck comes to your dugout with a bottle of French cognac. He has never done that before. He sits on an ammunition box, takes his cap off, and pours.

"I was a schoolteacher," he says. "Brunswick. History and German. I taught boys like your men about Frederick the Great and the Teutonic Knights." He drinks. "${s.flags.starckHasLeverage ? 'I still have your little souvenir, by the way. I have not decided what to do with it.' : 'I have watched you for five weeks.'}" He looks at you. "Tell me honestly. Do you believe? In all this. In what we are doing."`,
    choices: [
      { text: '"Yes, Herr Hauptsturmführer. I believe."', effects: { suspicion: -8, conscience: -4 }, rel: { starck: 15 }, set: { toldStarckBelieve: true },
        result: '"Good," he says. "Then we will see each other again. I will see to it." He leaves the bottle.' },
      { text: '"I believe in my men. The rest, I don\'t know."', rel: { starck: 2 }, set: { toldStarckMen: true },
        result: 'He is silent for a long time. "That is the Army\'s disease," he says at last. "Loyalty without faith. It will not be enough." But he leaves the bottle.' },
      { text: '"No."', effects: { suspicion: 12, conscience: 6 }, rel: { starck: -12 }, set: { toldStarckNo: true },
        result: 'He finishes his glass slowly. "Thank you for your honesty," he says. "It is rarer than courage." He puts his cap back on. "I will not forget it." You do not know whether that is a threat.' },
      { text: 'Turn it round: "Do you, still? After Białystok, after the villages?"', effects: { conscience: 4, suspicion: 5 }, rel: { starck: 4 }, set: { askedStarck: true },
        result: 'Something moves in his face, and then it is gone. "Every day," he says. "Every single day. Do you think that is easy?" He leaves without his bottle.' }
    ] });

  // ───────────────────────── Day 11 · Wednesday 24 December ─────────────────────────
  ev({ id: 'c5_11m', day: 11, phase: 0, scene: 'camp',
    title: 'The Offer',
    text: s => `Christmas Eve morning. Starck, at the dugout entrance, in his fur-lined coat.

"I am going back to my division. We are rebuilding, and we need NCOs who do not flinch. ${starck(s) >= 30 ? 'You do not flinch. Mostly.' : 'I am told you have potential.'} I can arrange a transfer to the Waffen-SS. Better rations, better equipment. Real comrades. And a future, after the victory."`,
    choices: [
      { text: 'Accept.', effects: { suspicion: -15, conscience: -10, officers: 5 }, rel: { starck: 20, albrecht: -15 }, set: { joinedSS: true }, squad: { all: { loyalty: -15 } },
        result: '"I knew it," says Starck, and shakes your hand. When you tell your squad, nobody says anything at all. Albrecht signs the transfer papers without looking up.',
        log: 'Accepted Starck\'s offer of a transfer to the Waffen-SS.' },
      { text: '"My place is with my squad."', rel: { starck: 2 }, squad: { all: { loyalty: 8 } },
        result: 'Starck nods slowly, as if he had expected it. "Loyalty," he says again. "Remember that I offered." He salutes, the old-fashioned Army way, which surprises you, and goes.' },
      { text: '"I would rather freeze, Herr Hauptsturmführer."', effects: { suspicion: 8, morale: 4 }, rel: { starck: -15 }, set: { starckEnemy: true }, squad: { all: { loyalty: 6 } },
        result: 'His face does not change at all. "As you wish," he says. "We will meet again. I am a patient man."' }
    ] });

  ev({ id: 'c5_11n', day: 11, phase: 2, scene: 'camp', time: '22:00',
    title: 'Christmas Eve, 1941',
    text: s => {
      const alive = SIM.squadMen(s), lost = (s.losses || []).filter(l => l.chapter === 4);
      return `In the dugout, a candle on an upturned ration tin and a branch of fir with a strip of silver paper from a cigarette packet. Someone has a mouth organ. "Stille Nacht." On the other side of the frozen field, five hundred metres away, the Russians are singing too, something slow and sad, and then a machine gun fires a long burst into the air at midnight. Nobody knows which side.

Albrecht comes round with his notebook, as he did on the Vistula.

Still with you: ${alive.length ? alive.map(m => m.name).join(', ') : 'nobody'}.${lost.length ? `\n\nNot any more: ${lost.map(l => `${l.name} (${l.status === 'gone' ? 'arrested' : l.status})`).join(', ')}.` : ''}`;
    },
    choices: [ { text: 'Give him the names. Then sing.', result: 'Stille Nacht, heilige Nacht. Thirty degrees below zero. Moscow is behind you, and it is never going to be in front of you again.' } ] });

  SIM.EVENTS.push(...E);

  // The leaflet event follows the search.
  const search = E.find(e => e.id === 'c5_8a');
  const turnOut = search.choices.find(c => typeof c.text === 'string' && c.text.startsWith('Turn out your pack'));
  const old = turnOut.outcome;
  turnOut.outcome = (s, x) => { old(s, x); if (s.flags.hartmannLeaflet) x.next('c5_8b'); };

  // ───────────────────────── Random events (nights) ─────────────────────────
  const ch5 = s => s.chapter === 4;
  SIM.POOL.push(
    { id: 'wx_stove', chapters: [4], phases: [2], cond: ch5, scene: 'camp',
      title: 'The Stove',
      text: 'One stove, eight men, and not enough room for everyone to be near it. Who sleeps closest to the heat tonight?',
      choices: [
        { text: 'The wounded and the youngest.', effects: { warmth: -6, conscience: 2 }, squad: { all: { loyalty: 5 } }, result: 'You sleep by the door, where the cold comes in under the tent-square. The men see it.' },
        { text: 'You. You need to be sharp tomorrow.', effects: { warmth: 12, health: 3 }, squad: { all: { loyalty: -4 } }, result: 'You sleep warm. In the morning one of the men by the door has white toes, and everyone knows why.' },
        { text: 'Rotate every hour.', effects: { warmth: 4, health: -2 }, squad: { all: { loyalty: 2 } }, train: { leadership: 1 }, result: 'Nobody sleeps much. Nobody freezes either.' }
      ] },
    { id: 'wx_sentry', chapters: [4], phases: [2], cond: ch5, scene: 'field',
      title: 'Two Hours',
      text: 'Sentry duty at minus thirty: two hours is the most a man can stand. Who goes out first?',
      choices: [
        { text: 'You go first.', effects: { warmth: -10, health: -2 }, squad: { all: { loyalty: 4 } }, result: 'Two hours staring at the white field under a white moon. You stamp, you count, you recite poems you learned at school. You come back in without feeling in your face.' },
        { text: 'Draw lots.', effects: { warmth: -3 }, result: 'Fair is fair. Nobody complains, except the man who draws it.' },
        { text: 'Cut the watches to one hour.', effects: { warmth: -5, officers: -2 }, squad: { all: { morale: 3 } }, result: 'Against regulations, and the reason everybody in your squad still has ten toes.' }
      ] },
    { id: 'wx_ski', chapters: [4], phases: [2], cond: ch5, scene: 'forest',
      title: 'Ski Troops',
      text: 'In the night, silent shapes in white glide past your position on skis. A Soviet ski patrol, behind your lines.',
      choices: [
        { text: 'Open fire.', effects: { merit: 1 }, risk: { chance: 0.12, dmg: [10, 28], cause: 'Killed by a Soviet ski patrol, December 1941.', hit: 'They fire back from the dark.', miss: 'They vanish into the forest. In the morning there is one ski track with blood beside it.' },
          outcome: (s, x) => { const m = x.casualty(0.1, 'in a firefight with ski troops'); say(x, m, m => `${m.name} is killed in the exchange.`, m => `${m.name} is wounded in the exchange.`); } },
        { text: 'Let them pass. Stay quiet.', effects: { morale: -3 }, result: 'Twelve men. You count them. In the morning you hear that they cut the telephone line to battalion and killed a sentry two kilometres back.' }
      ] },
    { id: 'wx_parcel', chapters: [4], phases: [2], cond: ch5, scene: 'letter',
      title: 'A Parcel',
      text: 'The field post brings a parcel from home: knitted socks, a scarf, a tin of biscuits, a bar of chocolate, frozen hard.',
      choices: [
        { text: 'Keep the socks. Share the rest.', effects: { warmth: 8, food: 8 }, squad: { all: { morale: 4 } }, result: 'Dry wool socks. You put them on and nearly weep.' },
        { text: 'Give the socks to the man with the worst feet.', effects: { conscience: 3, food: 8 }, winter: 1, squad: { all: { loyalty: 4 } }, result: 'He takes them as if you had given him a medal.' }
      ] },
    { id: 'wx_lice', chapters: [4], phases: [2], cond: ch5, scene: 'camp',
      title: 'Warm Enough for Lice',
      text: 'In the dugout, as soon as it is warm, the lice wake up. Everyone scratches until they bleed.',
      choices: [
        { text: 'Hang your shirt outside to freeze them.', effects: { warmth: -6, health: 3 }, result: 'Ten minutes at minus thirty and they are dead. So, almost, are you.' },
        { text: 'Put up with it.', effects: { health: -3, morale: -3 }, result: 'You scratch all night.' }
      ] },
    { id: 'wx_dead', chapters: [4], phases: [2], cond: ch5, scene: 'field',
      title: 'The Frozen',
      text: 'The ground is too hard to dig graves. The dead, German and Russian, lie where they fell, frozen into strange shapes. The men have started to give them names.',
      choices: [
        { text: 'Bury your own in the snow, at least.', effects: { warmth: -6, morale: -4, conscience: 3 }, squad: { all: { loyalty: 3 } }, result: 'A mound of snow and a helmet on a rifle. In spring, someone will find them. You write the positions down.' },
        { text: 'Leave them. Nothing can be done.', effects: { morale: -3, conscience: -2 }, result: 'You walk past them every morning to the latrine. After a week you stop seeing them.' }
      ] },
    { id: 'wx_vodka', chapters: [4], phases: [2], cond: s => ch5(s) && SIM.has(s, 'vodka'), scene: 'camp',
      title: 'Vodka',
      text: 'The bottle of vodka from the summer. Alcohol warms for ten minutes and then makes the cold worse; every soldier knows this, and every soldier drinks anyway.',
      choices: [
        { text: 'Share it round.', items: { vodka: -1 }, effects: { warmth: 4, morale: 6 }, squad: { all: { morale: 8 } }, result: 'Eight men, one bottle. For ten minutes everyone is warm and laughing.' },
        { text: 'Keep it for a worse night.', result: 'There will be worse nights.' }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  const after = 'In January the Soviet offensive pushed the German army back a hundred and fifty kilometres from Moscow before it stalled in the snow. The front froze where it stood until the spring.\n\nThe war would go on for another three and a half years.';
  SIM.ch5Ending = function (s) {
    const killed = (s.losses || []).filter(l => l.chapter === 4 && l.status === 'killed').length;
    if (s.flags.joinedSS) return 'wi_ss';
    if (s.stats.health < 30 || (s.frostbites || 0) >= 2) return 'wi_frostbite';
    if (s.flags.starckEnemy && s.stats.suspicion >= 55) return 'wi_marked';
    if (s.stats.suspicion >= 70) return 'wi_marked';
    if (SIM.earnsCross5(s)) return 'wi_decorated';
    if (killed >= 2) return 'wi_losses';
    if (s.stats.conscience <= 25) return 'wi_hardened';
    if (s.stats.conscience >= 70) return 'wi_witness';
    if (SIM.squadLoyalty(s) >= 65) return 'wi_brothers';
    return 'wi_survivor';
  };
  Object.assign(SIM.ENDINGS, {
    wi_ss: { title: 'The Black Uniform', text: s => `In January you report to an SS division being rebuilt behind the lines. Better boots. Better rations. Starck shakes your hand in front of the new men and calls you "one of us".\n\nYour old squad stays behind on the Ruza. ${has(s, 'hartmann') ? 'Hartmann does not come to say goodbye.' : ''} You tell yourself that it is the same war, and the same Germany.\n\nIt is not the same uniform.\n\n${after}` },
    wi_frostbite: { title: 'Frozen', text: s => `${(s.frostbites || 0) >= 2 ? 'The frostbite takes two toes from your left foot and the tip of a finger.' : 'Your wounds, and the cold, are enough.'} A hospital train to Smolensk, wounded men packed on straw in unheated goods wagons. Some of them are dead when the doors open.\n\nIn the hospital they call it the "Gefrierfleischorden", the frozen meat medal, and laugh, and do not stop laughing for a long time.\n\n${after}` },
    wi_marked: { title: 'In the SD\'s Files', text: s => `Starck's report reaches the SD, the security service of the SS. It is added to everything else: Pomerania, Dinant, the Cher, the Bug.${s.flags.starckFound === 'film' ? ' And a roll of film, developed now, with your name attached to it.' : ''}\n\nNothing happens. Not yet. But in Berlin, a file with your name on it has moved from one drawer to another.\n\n${after}` },
    wi_decorated: { title: 'The Winter Battle', text: s => `You held when others ran. Albrecht writes it into the war diary, and the decoration follows in January: pinned on in a dugout by a battalion commander with frostbitten ears.\n\nStarck, passing through, sees it and nods. "Good," he says. "We need men like you." You are not sure, any more, whether that is praise.\n\n${after}` },
    wi_losses: { title: 'The Snow Graves', text: s => `${(s.losses || []).filter(l => l.chapter === 4 && l.status === 'killed').map(l => l.name).join(', ')}. You write down where you left them, the positions in the snow, so that someone can find them in the spring. Nobody ever will.\n\n${after}` },
    wi_hardened: { title: 'Ice', text: s => `Something in you froze that December and did not thaw. You burned the villages, you drove the families into the snow, you looked away. It was easier each time.\n\nStarck, who notices such things, says you have become "a real soldier". He means it as the highest praise he knows.\n\n${after}` },
    wi_witness: { title: 'Stille Nacht', text: s => `You came through the winter with your conscience, more or less, and that cost you things: warmth, rations, standing with men like Starck. ${s.flags.tookBlame5 ? 'A man in your squad is alive because you took his blame.' : ''}\n\nOn Christmas Eve, in a dugout in the snow, you sang "Stille Nacht" and meant every word, which may be the strangest thing you have done in this war.\n\n${after}` },
    wi_brothers: { title: 'The Dugout', text: s => `Eight men in a hole in the ground at minus thirty, sharing one stove and one bottle and one candle. ${SIM.squadMen(s).map(first).join(', ')}. You would die for any of them now, and they for you. That is what the winter did.\n\n${after}` },
    wi_survivor: { title: 'Alive in the Spring', text: s => `You survived the winter before Moscow. That is all, and in that winter it is everything. Half the men who started the offensive with you in November did not.\n\n${after}` }
  });
})();
