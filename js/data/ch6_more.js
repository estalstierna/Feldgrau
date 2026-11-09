// Chapter VI, part two: the wedding, the film, Starck or Albrecht, farewell. Random events and endings.
window.SIM = window.SIM || {};

(function () {
  const { ss, town, bombed, fam, has, fallen, knows, rank } = SIM.ch6;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 5 }, o));

  // ───────────────────────── Day 4 · Friday 24 April ─────────────────────────
  ev({ id: 'c6_4m', day: 4, phase: 0, scene: 'street', cond: s => !!(s.oldSquad || s.squad || []).find(m => m.id === 'hartmann' && m.status === 'ok'),
    title: 'Hartmann on Leave',
    text: s => `A knock at the door: Willi Hartmann, on leave in ${town(s) === 'Hamburg' ? 'his own city' : `${town(s)} on his way home to Hamburg`}, with a bottle under his arm.

${ss(s) ? 'He sees your collar patches and stops in the doorway. "So it\'s true," he says. "I didn\'t believe them."' : '"I wasn\'t going to sit on a train for twelve hours without seeing your ugly face," he says.'}`,
    choices: [
      { text: 'Drink with him like old times.', effects: { morale: 10, health: -3 }, rel: { hartmann: 10 },
        outcome: (s, x) => x.say(ss(s) ? 'It is not like old times. He drinks, and talks about the company, about Brenner and Rau and the dugout, and carefully not about you. At the door he says: "Look after yourself in that lot. They\'ll eat you."' : 'Argentina, again. Cattle ranches. Dancers. For one evening the war is a long way away.') },
      { text: 'Tell him about Starck, and the offer, and why.', show: ss, effects: { conscience: 3 }, rel: { hartmann: 8 },
        result: 'He listens. "Warm boots," he says at last. "You did it for warm boots." It is not quite true and not quite false. He shakes your hand when he leaves, which he did not have to do.' }
    ] });
  ev({ id: 'c6_4m_alt', day: 4, phase: 0, scene: 'street',
    title: 'Rostock',
    text: 'The radio and the newspapers are full of it: for the second night running, British bombers have attacked Rostock on the Baltic. The old town is burning. Goebbels speaks of "terror bombing" and promises revenge. In the queue at the butcher\'s, the women talk about nothing else.',
    choices: [
      { text: 'Help your mother queue.', effects: { food: 10, morale: 3 }, rel: { mother: 5 },
        result: 'Two hours in the queue for a quarter-pound of sausage. The women look at your uniform and stop complaining while you are there.' },
      { text: 'Go to the cinema: the newsreel.', effects: { morale: 2 },
        result: 'The Wochenschau: smiling soldiers in white snowsuits, victorious, warm. You recognise the place. You were there. It did not look like that.' }
    ] });

  ev({ id: 'c6_4a', day: 4, phase: 1, scene: 'church', cond: s => s.flags.weddingPlanned,
    title: 'The Wedding',
    text: s => `Saturday comes a day early: the registry office had a free slot on Friday afternoon. Liesel in a borrowed suit, with a bunch of lilies of the valley. You in uniform. ${ss(s) ? 'No SS approval. You know what that may cost.' : 'Your commander\'s permission, folded in your breast pocket.'}

The registrar reads the formula and hands you, as a gift from the state, a copy of "Mein Kampf", as he hands it to every married couple in the Reich. ${fam(s) === 'catholic' ? 'Afterwards Father Kaspar marries you again, properly, in Saint Joseph\'s, with your mother crying in the front pew.' : ''}`,
    choices: [
      { text: 'Kiss your wife.', effects: { morale: 20 }, rel: { liesel: 20 }, set: { married: true },
        outcome: (s, x) => { x.say('Two days of marriage, in her mother\'s spare room, with the blackout curtains drawn. You will remember them in places you cannot yet imagine.'); x.log('Married Liesel.'); } }
    ] });
  ev({ id: 'c6_4a_alt', day: 4, phase: 1, scene: 'street',
    title: 'The Park',
    text: 'A warm afternoon. The chestnut trees in the park are in flower. Children play soldiers with wooden rifles. A boy of about eight runs up to you and asks if you have killed many Russians.',
    choices: [
      { text: '"Go and play football."', effects: { morale: 3, conscience: 2 }, result: 'He looks at you as if you had said something in a foreign language. Then he runs off.' },
      { text: 'Sit on a bench and watch the children.', effects: { morale: 6 }, result: 'For an hour you do nothing at all. It is the strangest feeling you have had in three years.' }
    ] });

  ev({ id: 'c6_4n', day: 4, phase: 2, scene: 'cellar', time: '23:40', cond: bombed,
    title: 'The Raid',
    text: s => `This time it is your street. The sirens, the cellar, and then the bombs walking towards you across the district: one, two, three, each closer. The building above you shakes like a ship. The lights go out. A child is screaming.

Then the fourth bomb, and the cellar wall on the far side cracks, and dust and smoke pour in.`,
    choices: [
      { text: 'Get everyone out through the emergency breach to the next cellar.', effects: { merit: 1, conscience: 4 }, train: { leadership: 1 },
        risk: { chance: 0.14, dmg: [10, 30], fatal: 0.2, cause: `Killed in an air raid on your own street, on leave, April 1942.`, hit: 'A beam comes down as you push the last of them through.', miss: 'You find the breach in the dark by feel, knock out the thin bricks with your boot, and pass the children through one by one. Everyone gets out. Behind you the cellar fills with smoke.' },
        outcome: (s, x) => { x.rel('mother', 6); x.log('Got everyone out of the cellar during the raid.'); } },
      { text: 'Hold your mother and wait.', effects: { morale: -6 },
        risk: { chance: 0.06, dmg: [8, 22], fatal: 0.2, cause: `Killed in an air raid on your own street, on leave, April 1942.`, hit: 'The ceiling comes down in the corner.', miss: 'The wall holds. At three in the morning the all-clear sounds. Your street is on fire at both ends. Your house is still standing.' } }
    ] });

  // ───────────────────────── Day 5 · Saturday 25 April ─────────────────────────
  ev({ id: 'c6_5m_film', day: 5, phase: 0, scene: 'kitchen', cond: s => SIM.has(s, 'film'),
    title: 'The Film',
    text: 'The roll of film from Białystok is still sewn into the lining of your pack. It has crossed Russia with you. If the Gestapo find it at the front, you are dead. If you leave it here, your family is in danger instead.\n\nThere is a chemist two streets away who used to develop your holiday photographs.',
    choices: [
      { text: 'Hide it in your parents\' attic, under the floorboards.', items: { film: -1 }, set: { filmHidden: true }, effects: { suspicion: -3 },
        result: 'Under the third floorboard from the chimney, wrapped in oilcloth inside a tobacco tin. You do not tell your parents. If you do not come back, perhaps one day someone will find it.',
        log: 'Hid the film from Białystok under the floor of my parents\' attic.' },
      { text: 'Have it developed. You need to know what is on it.', effects: { suspicion: 10, conscience: 4 }, set: { filmDeveloped: true },
        outcome: (s, x) => {
          if (x.roll(0.65)) { x.say('The chemist is an old man who looks at you for a long time. He develops it himself, at night, and gives you the prints in an envelope without a word. You look at them once. You will not need to look again.'); x.log('Had the film from Białystok developed.'); }
          else { x.apply({ suspicion: 20 }); s.flags.gestapoFile = true; x.say('The chemist looks at the negatives and turns pale. Two days later a man in a grey suit asks your mother where you are. You are already on the train.'); }
        } },
      { text: 'Give it to Father Kaspar. The Church keeps records.', show: s => fam(s) === 'catholic', items: { film: -1 }, set: { filmChurch: true }, effects: { conscience: 6 },
        result: 'The old priest takes it in the sacristy and puts it in the tabernacle safe without asking what it is. "Some things," he says, "should be kept for a judgement." You are not sure which judgement he means.' },
      { text: 'Burn it.', items: { film: -1 }, effects: { suspicion: -5, conscience: -6 },
        result: 'It flares in the kitchen stove and is gone in a second. Now only you remember Białystok. Only you, and everyone who was there.' }
    ] });
  ev({ id: 'c6_5m_starck', day: 5, phase: 0, scene: 'street', cond: ss,
    title: 'Starck in Town',
    text: s => `A black car stops outside your building. Starck, in his summer uniform, on his way from Berlin to the division. He has come to collect you a day early: the division is moving.

He comes upstairs. He is charming to your mother, kisses her hand, admires the photographs on the dresser. ${fam(s) === 'party' ? 'Your father is beside himself with pride.' : fam(s) === 'spd' ? 'Your father stays in the bedroom with the door shut.' : 'Your father shakes his hand stiffly.'} Then he looks out of the window at the empty flat on the second floor.

"The Jews are gone from this building, I see," he says pleasantly. "Good."`,
    choices: [
      { text: 'Agree with him.', effects: { conscience: -6 }, rel: { starck: 8, mother: -8 },
        result: '"Good riddance," you say. Your mother puts down the coffee pot very carefully. Starck smiles.' },
      { text: 'Change the subject.', rel: { starck: -2 },
        result: '"More coffee, Hauptsturmführer?" Starck notices. He always notices. He takes the coffee.' },
      { text: '"Dr. Rosenthal set my arm when I was nine."', effects: { conscience: 6, suspicion: 8 }, rel: { starck: -10, mother: 10 },
        result: 'The room is very quiet. Starck looks at you, then at your mother. "Sentiment," he says. "We all have it. We grow out of it." He finishes his coffee and goes down to the car to wait.' }
    ] });
  ev({ id: 'c6_5m_albrecht', day: 5, phase: 0, scene: 'kitchen',
    title: 'A Letter from Albrecht',
    text: s => `A field post letter in Hauptmann von Albrecht's careful hand.

"The company is out of the line and is being rebuilt. We are to go south in the summer, I am told; I am told nothing else. ${has(s, 'brenner') ? 'Brenner asks after you. ' : ''}${has(s, 'rau') ? 'Rau has been made Gefreiter and is unbearable. ' : ''}${s.flags.savedBrandt ? 'Brandt has been sent home to train recruits; his leg never healed. ' : ''}I do not know what this summer will bring. Come back to us in one piece.\n\nP.S. If you see my mother in Potsdam, do not mention the winter."`,
    choices: [
      { text: 'Write back at once.', effects: { morale: 6 }, rel: { albrecht: 8 },
        result: 'You write four pages: about home, the empty flat, the foreign workers, the raid. You tear up three of them and send one.' },
      { text: 'Read it twice and put it in your paybook.', effects: { morale: 3 },
        result: 'South. It is the first time anyone has said where. You look at the map in your father\'s atlas. The Caucasus. The Volga.' }
    ] });

  ev({ id: 'c6_5a', day: 5, phase: 1, scene: 'kitchen', time: '19:00',
    title: 'The Last Evening',
    text: s => `The last evening. Your mother has used the last of the month's coupons. ${s.flags.married ? 'Liesel is at the table, wearing her ring.' : ''} Afterwards she gives you a parcel for the train: socks, a cake made with saved sugar, and ${fam(s) === 'catholic' ? 'a new rosary' : 'a photograph of the family taken at the studio on Tuesday'}.

Then she asks the question she has not asked all week.

"Will you come back?"`,
    choices: [
      { text: '"Yes."', effects: { morale: 6 }, rel: { mother: 8 },
        outcome: (s, x) => { if (fam(s) === 'catholic' && !SIM.has(s, 'rosary')) x.item('rosary', 1); if (!SIM.has(s, 'photo')) x.item('photo', 1); x.say('She nods as if you had promised. You had.'); } },
      { text: '"I don\'t know, Mother."', effects: { conscience: 3 }, rel: { mother: 4 },
        result: 'She takes your face in both hands and looks at it for a long time, as if she were learning it by heart.' },
      { text: 'Tell her what you have seen. All of it.', show: knows, effects: { conscience: 8, morale: -6 }, rel: { mother: 6 },
        result: 'You tell her about Białystok, the villages, the pits. She does not interrupt. When you are finished she says, very quietly: "Then God help us all, when it is over." She never mentions it again, as long as she lives.' }
    ] });

  // ───────────────────────── Day 6 · Sunday 26 April ─────────────────────────
  ev({ id: 'c6_6m', day: 6, phase: 0, scene: 'kitchen', time: '15:00',
    title: 'The Supreme Judge',
    text: 'The radio, Sunday afternoon: the Führer speaks to the Reichstag. The Reichstag votes him the power to remove any judge, any official, any officer from office, without process. He is now, the announcer says, "the Supreme Judge of the German people". The deputies cheer for a long time.',
    choices: [
      { text: 'Listen to the end.', effects: { morale: -2 },
        outcome: (s, x) => x.say(fam(s) === 'spd' ? 'Your father switches it off. "There," he says. "Now there is no law at all. Only him." He goes out into the yard.' : fam(s) === 'party' ? 'Your father applauds the radio. "Now he can deal with the saboteurs at home," he says.' : 'Nobody in the kitchen says anything. Your mother goes on packing your parcel.') },
      { text: 'Switch it off and pack.', effects: { morale: 2 }, result: 'You pack: socks, cake, photographs, the letters for your squad. Fourteen days, and it is over.' }
    ] });

  ev({ id: 'c6_6a', day: 6, phase: 1, scene: 'station', time: '18:30',
    title: 'The Platform',
    text: s => `The station. The leave train east, full of men going back. Mothers, wives, children on the platform, nobody crying until the train moves.${s.flags.married ? ' Liesel holds your hand through the window until the last moment.' : ''}${ss(s) ? ' Starck is in the first-class compartment. Your section is in the next carriage: Voss, Wendt, Mayr, Brück, Nowak, Haas.' : ''}`,
    choices: [
      { text: s => s.flags.married ? 'Hold Liesel until the whistle.' : 'Hold your mother until the whistle.', effects: { morale: 8 },
        outcome: (s, x) => { x.rel(s.flags.married ? 'liesel' : 'mother', 6); x.say('The whistle. The train moves. A hand, waving, getting smaller. Then the platform is gone.'); } },
      { text: 'Get on without looking back. It is easier.', effects: { morale: 2, conscience: -1 },
        result: 'You climb in and sit down facing east, and do not go to the window. You hear your name called once. You do not turn round.' }
    ] });

  ev({ id: 'c6_6n', day: 6, phase: 2, scene: 'station', time: '23:00',
    title: 'The Train East',
    text: s => `The train rattles east through the dark: Berlin, Warsaw, then the endless plain. Fourteen days. Your mother's cake in your pack, ${s.flags.married ? 'a ring on your finger, ' : ''}a photograph in your paybook.

${ss(s) ? 'Across the carriage, Voss is reading a pamphlet about "the eastern territories after the victory". Nowak is looking out of the window into the dark. Haas is asleep with his mouth open.' : 'Your squad is waiting for you somewhere ahead, in a rebuilt company, with orders to go south.'}`,
    choices: [ { text: 'Close your eyes.', result: 'Somewhere ahead is the summer of 1942: the steppe, the Don, the Volga. A city whose name you have not yet heard.' } ] });

  SIM.EVENTS.push(...E);

  // ───────────────────────── Random events (nights) ─────────────────────────
  const home = s => s.chapter === 5;
  SIM.POOL.push(
    { id: 'hx_rations', chapters: [5], phases: [2], cond: home, scene: 'kitchen',
      title: 'Ration Cards',
      text: 'Your mother counts the ration coupons at the kitchen table: meat, fat, bread, sugar. Soldiers on leave get a special card. She has been hiding how little there is.',
      choices: [
        { text: 'Give her all your leave coupons.', effects: { food: -10, conscience: 2 }, rel: { mother: 8 }, result: 'She protests, then takes them. The next day there is meat in the soup.' },
        { text: 'Buy something on the black market (8 RM).', req: s => s.marks >= 8, reqText: 'You need 8 RM.', effects: { marks: -8, food: 15, suspicion: 2 }, rel: { mother: 4 }, result: 'A pound of butter from a man in a doorway. Your mother looks at it as if it were gold.' }
      ] },
    { id: 'hx_cinema', chapters: [5], phases: [2], cond: home, scene: 'street',
      title: 'The Cinema',
      text: 'The cinema is showing a comedy with Heinz Rühmann. Before it, the newsreel: Rommel in the desert, U-boats, smiling soldiers in the East.',
      choices: [
        { text: 'Laugh at the comedy.', effects: { morale: 6, marks: -1 }, result: 'For ninety minutes you laugh like everyone else. Then the lights come up and you remember.' },
        { text: 'Walk out during the newsreel.', effects: { conscience: 2, suspicion: 2 }, result: 'You cannot watch it. An usher notes that a soldier walked out.' }
      ] },
    { id: 'hx_pub', chapters: [5], phases: [2], cond: home, scene: 'street',
      title: 'The Corner Pub',
      text: s => `The corner pub, full of old men and soldiers on leave. Someone recognises your ${ss(s) ? 'collar patches' : 'Iron Cross ribbon'} and buys you a beer. Then a man at the bar says loudly that the war will be over by Christmas.`,
      choices: [
        { text: '"Which Christmas?"', effects: { suspicion: 5, morale: 3 }, result: 'The pub goes quiet. Then someone laughs, and then everyone does, too loudly.' },
        { text: 'Drink your beer and say nothing.', effects: { morale: 4 }, result: 'Beer, smoke, voices. For an hour you are nobody in particular.' }
      ] },
    { id: 'hx_sleep', chapters: [5], phases: [2], cond: home, scene: 'kitchen',
      title: 'Sleep',
      text: 'For the first time since 1939, you sleep through the night.',
      choices: [ { text: 'Sleep.', effects: { health: 8, morale: 4 }, result: 'Nine hours. You wake up and do not know where you are, and then you do, and you lie very still and listen to your mother in the kitchen.' } ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  const next = 'The next chapter is the summer of 1942: the offensive towards the Volga and a city called Stalingrad.';
  SIM.ch6Ending = function (s) {
    if (s.flags.gestapoFile && s.stats.suspicion >= 70) return 'hl_marked';
    if (ss(s)) return s.flags.defiedRusha && s.flags.married ? 'hl_ss_married' : 'hl_ss';
    if (s.flags.married) return 'hl_married';
    if (s.stats.conscience <= 25) return 'hl_stranger';
    if (s.stats.conscience >= 70) return 'hl_knowing';
    return 'hl_fourteen';
  };
  Object.assign(SIM.ENDINGS, {
    hl_married: { title: 'Two Days', text: s => `You go back to the war a married man. Liesel's letters will follow you east, every week, on blue paper that smells of soap. You will read each of them until it falls apart.\n\n${next}` },
    hl_ss: { title: 'The Black Collar', text: s => `You go back east in the black collar patches, with a section of strangers and Starck in the next carriage. At home they looked at your uniform the way you once looked at Starck's. ${fam(s) === 'party' ? 'Your father is the only one who was proud.' : ''}\n\n${next}` },
    hl_ss_married: { title: 'Without Permission', text: s => `You married Liesel without the SS Race Office's approval. Starck has heard. He says nothing about it on the train, which is how you know he will say something later.\n\n${next}` },
    hl_marked: { title: 'The Grey Suit', text: s => `The Gestapo man's file goes east with you, by a different route. At home, your mother gets a visit every few weeks from a polite man who asks whether she has heard from you.\n\n${next}` },
    hl_stranger: { title: 'A Stranger at Home', text: s => `Your mother said, on the last evening, that you had changed. She did not say how. You know how. At home you were a stranger in your own kitchen, and you were relieved to be back on the train.\n\n${next}` },
    hl_knowing: { title: 'What You Know', text: s => `You came home knowing things that nobody at home wanted to know. ${s.flags.filmHidden ? 'Under the floor of your parents\' attic, wrapped in oilcloth, there is a roll of film that proves it.' : ''} You go back east carrying it, and carrying them.\n\n${next}` },
    hl_fourteen: { title: 'Fourteen Days', text: s => `Fourteen days: a soft bed you could not sleep in, your mother's cooking, a cellar during an alarm, an empty flat on the second floor. Then the train east again. You were home. You are not sure you will ever really be home again.\n\n${next}` }
  });
})();
