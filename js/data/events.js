// Scripted story events for Chapter I: "The Corridor" (28 Aug – 3 Sep 1939).
// Each event: { id, day, phase, cond?, scene, time?, title, text, choices[] }
// Choice: { text, show?, req?, reqText?, effects?, set?, result?, risk?, outcome?, log?, next?, end? }
window.SIM = window.SIM || {};

SIM.EVENTS = [
  // ───────────────────────── DAY 0 · Monday 28 August ─────────────────────────
  {
    id: 'd0m', day: 0, phase: 0, scene: 'camp', time: '06:00',
    title: 'Roll Call in the Pines',
    text: s => `The company has been in the forest for two days. Tents under the pines, trucks hidden beneath branches, no fires after dark. Nobody has told you why.

Unteroffizier Paul Brandt walks the line of your squad. He is a twelve-year Reichswehr man with a face like a closed door. "Hartmann. Lenz. Vogel. ${s.char.last}." He stops. "I need one man to haul ammunition crates to the company truck. The rest of you dig latrines."

Willi Hartmann, a docker's son from Hamburg, rolls his eyes. Karl Lenz, a former Hitler Youth leader who wears his ambition like a medal, is already half a step forward. Beside you, Ernst Vogel, a farm boy from Swabia, is still fumbling with the straps of a pack he has packed wrong.`,
    choices: [
      { text: 'Step forward for the ammunition detail.',
        effects: { officers: 5, merit: 1, health: -3, food: -5 },
        set: { lenzRival: true },
        result: 'You get there half a step before Lenz. Brandt nods once. The crates weigh thirty kilos each and the sand swallows your boots, but by noon Brandt knows your name. Lenz does too, and not kindly.',
        log: 'Volunteered for the ammunition detail. Lenz did not like it.' },
      { text: 'Keep your head down and dig latrines.',
        effects: { morale: 2, comrades: 2 },
        result: 'An old soldier\'s rule: never volunteer. You dig in the sand with Hartmann, who narrates the whole job like a football match. It is almost fun.' },
      { text: 'Quietly help Vogel repack his kit before Brandt notices.',
        effects: { comrades: 6, officers: -3 },
        set: { vogelFriend: true },
        result: 'You fix his straps in twenty seconds. Brandt notices you out of line and gives you a look that costs you, but Vogel whispers "Danke" as if you had pulled him from a river.',
        log: 'Helped Ernst Vogel with his kit. He will remember.' }
    ]
  },
  {
    id: 'd0a', day: 0, phase: 1, scene: 'camp',
    title: 'The Captain\'s Address',
    text: `The company forms a square in a clearing. Hauptmann Steiner, the company commander, reads from a sheet of paper. Ethnic Germans in Poland are being beaten, driven from their farms, murdered. The Polish army is mobilising. Polish soldiers have fired across the border.

"The Führer's patience," he says, "is exhausted."

Someone shouts "Sieg Heil!" and the company takes it up. The sound rolls through the trees. You notice that the captain does not look up from his paper.`,
    choices: [
      { text: 'Shout with the others.',
        effects: { morale: 5, officers: 2, conscience: -2 },
        result: 'Your voice disappears into the roar. For a moment you feel enormous, part of something. Afterwards your throat is sore and you are not sure what you cheered for.' },
      { text: 'Stand silent. Something in it sounds rehearsed.',
        effects: { conscience: 3, morale: -2 },
        outcome: (s, x) => {
          if (s.flags.educated) x.say('You have read newspapers from 1914. The same words, the same outrage, the same "patience exhausted". You keep your mouth shut and your arm at your side, and nobody seems to notice.');
          else x.say('You cannot say what bothers you. Perhaps it is how neatly it all fits. You keep your mouth shut, and nobody seems to notice.');
        } },
      { text: 'Whisper to Hartmann: "Same speech they gave about the Czechs last year."',
        effects: { suspicion: 8, comrades: 4 },
        set: { lenzHeard: true },
        result: 'Hartmann snorts and hides it in a cough. Then you see Lenz, two places down, looking straight at you. He says nothing. He doesn\'t have to.',
        log: 'Made a remark during the captain\'s address. Lenz heard it.' }
    ]
  },
  {
    id: 'd0n', day: 0, phase: 2, scene: 'camp',
    title: 'First Night',
    text: `No fires, but the field kitchen has made pea soup, and there is a ration of bread and sausage. The forest is dark and loud with crickets. Somewhere to the east, beyond the trees, is Poland.

You have an hour before lights out.`,
    choices: [
      { text: 'Write a letter home.',
        effects: { morale: 6 },
        outcome: (s, x) => x.say(`You write to your mother in ${SIM.townName(s.char.hometown)} by the light of a shaded torch. You tell her the food is good and the weather is fine. Both are true. You leave out everything else.`),
        log: 'Wrote home. Told them the weather was fine.' },
      { text: 'Play skat with Hartmann and the reservists (stake 2 RM).',
        req: s => s.marks >= 2, reqText: 'You need 2 RM.',
        outcome: (s, x) => {
          if (x.roll(0.5)) { x.apply({ marks: 3, comrades: 4, morale: 3 }); x.say('You take three tricks in a row off a reservist from Köslin who swears he has never seen such luck. Hartmann claims half the credit.'); }
          else { x.apply({ marks: -2, comrades: 4 }); x.say('Hartmann cleans you out with a grand hand and a grin. It is worth the two marks just to hear the reservists laugh.'); }
        } },
      { text: 'Clean your rifle until it shines.',
        effects: { officers: 3, merit: 1 },
        set: { cleanRifle: true },
        result: 'Kar98k, serial number memorised. You oil the bolt and run the pull-through until the barrel gleams. Brandt passes by, glances at it and grunts. From him, that is praise.' },
      { text: 'Sleep while you can.',
        effects: { health: 6 },
        result: 'An old soldier told you once: sleep is ammunition. You are out before the crickets stop.' }
    ]
  },

  // ───────────────────────── DAY 1 · Tuesday 29 August ─────────────────────────
  {
    id: 'd1m', day: 1, phase: 0, scene: 'field',
    title: 'Digging In',
    text: `A field exercise in the sand at the edge of the forest: dig a foxhole, standing depth, against the clock. The sun is up early and it is already hot. Brandt walks along the line with a stopwatch.

"In Poland," he says, "the man who digs fastest lives longest. Begin."`,
    choices: [
      { text: 'Dig like your life depends on it.',
        effects: { health: -5, food: -6, officers: 4, merit: 1 },
        set: { trainedDig: true },
        result: 'You finish second in the platoon, behind a miner\'s son from the Ruhr. Your hands are raw. Brandt writes something in his notebook.' },
      { text: 'Pace yourself. It is only an exercise.',
        result: 'You finish in the middle. Nobody notices you, which is the point.' },
      { text: 'Let Vogel dig the heavy part of your shared hole while you "supervise".',
        effects: { health: 3, comrades: -6, conscience: -3 },
        outcome: (s, x) => {
          x.say('Vogel doesn\'t complain. He never complains. But Hartmann sees it and says loudly, "Look at the general," and the squad laughs, and it isn\'t a friendly laugh.');
          if (s.flags.vogelFriend) { x.say('Vogel looks at you as if he has learned something.'); s.flags.vogelFriend = false; }
        } }
    ]
  },
  {
    id: 'd1a', day: 1, phase: 1, scene: 'letter',
    title: 'Feldpost',
    text: s => {
      const town = SIM.townName(s.char.hometown);
      const intro = `The mail arrives with the supply truck. There is a letter for you from ${town}, in your mother's careful hand.\n\n`;
      const ration = 'Ration cards were introduced yesterday. Meat, fat, sugar, soap. "They say it is only a precaution," she writes.';
      const body = {
        spd: `"${ration} Your father is well. He says nothing, but at night he listens to the radio with a blanket over the set, and he does not let me sit with him. Please be careful what you write, my boy."`,
        catholic: `"${ration} Father Kaspar says a Mass every morning now for the boys at the border. I have put a rosary in with this letter. Promise me you will keep it with you."`,
        party: `"${ration} Your father is so proud. He says that if there is a fight, you must be the first to win the Iron Cross, like your grandfather at Verdun. He has told the whole Ortsgruppe."`,
        none: `"${ration} Your sister is engaged to the Lehmann boy, imagine. Everyone is buying sugar while they can. Nobody here talks about war, only about prices."`
      }[s.char.family];
      return intro + body;
    },
    choices: [
      { text: 'Write back that all is well. Don\'t worry them.',
        effects: { morale: 4 },
        result: 'You write two pages about pea soup and pine trees. Lying to your mother is easier on paper.' },
      { text: 'Write honestly about the rumours of war.',
        effects: { morale: 2, suspicion: 3, conscience: 2 },
        result: 'You write that everyone thinks it will start any day. Then you remember that letters can be read by others, and you cross nothing out. Let them read.' },
      { text: 'Burn the letter in the field kitchen stove.',
        show: s => s.char.family === 'spd',
        effects: { suspicion: -6, morale: -4 },
        result: 'A letter that mentions a radio under a blanket is a letter that could hang your father. You watch it curl and blacken. You remember every word anyway.',
        log: 'Burned my mother\'s letter. Too dangerous to keep.' },
      { text: 'Put the rosary in your breast pocket.',
        show: s => s.char.family === 'catholic',
        effects: { morale: 6, conscience: 2 },
        set: { rosary: true },
        items: { rosary: 1 },
        result: 'The beads are cool against your chest. You feel foolish, and then you don\'t.' },
      { text: 'Show the letter to Lenz. Let him see where you come from.',
        show: s => s.char.family === 'party',
        effects: { suspicion: -5, comrades: -2, officers: 2 },
        set: { lenzAlly: true },
        result: 'Lenz reads it twice and claps you on the shoulder. "Your father is a real German." Hartmann, watching, says nothing at all.' }
    ]
  },

  // ───────────────────────── DAY 2 · Wednesday 30 August ─────────────────────────
  {
    id: 'd2m', day: 2, phase: 0, scene: 'camp',
    title: 'A Joke Too Far',
    text: `Breakfast: ersatz coffee and black bread. Hartmann holds up his slice. "One People, one Reich, one ration card," he announces. "And one slice of bread for the lot of us."

The reservists laugh. Lenz doesn't. He sets down his mug.

"That," he says quietly, "is Wehrkraftzersetzung. Undermining the fighting spirit. Since Saturday that's a court-martial offence. I'm reporting it."

The table goes silent. Everyone is looking at you, because you are sitting between them.`,
    choices: [
      { text: 'Side with Lenz: "He\'s right, Willi. It isn\'t funny anymore."',
        effects: { officers: 3, comrades: -8, conscience: -5, suspicion: -4 },
        set: { lenzAlly: true, betrayedHartmann: true },
        result: 'Lenz nods, satisfied, and decides that a warning will do, this time. Hartmann looks at you for a long second, then goes back to his bread. He doesn\'t speak to you for the rest of the day.',
        log: 'Sided with Lenz against Hartmann.' },
      { text: 'Laugh it off and change the subject.',
        effects: { comrades: 4, suspicion: 3 },
        result: '"Karl, if they court-martialled every bad joke, Willi would have been shot in 1936." Even Lenz\'s mouth twitches. The moment passes. But he has noticed which side you laughed on.' },
      { text: 'Take Lenz aside: "Report him and the whole squad pays for it."',
        outcome: (s, x) => {
          const p = 0.35 + s.stats.comrades / 200 + (s.flags.lenzAlly ? 0.2 : 0) - (s.flags.lenzRival ? 0.15 : 0);
          if (x.roll(p)) {
            x.apply({ comrades: 8, conscience: 3 });
            s.flags.protectedHartmann = true;
            x.say('"Brandt will have every one of us cleaning latrines until Christmas. And he\'ll know who started it." Lenz hesitates, then shrugs. "Fine. This time." Hartmann never thanks you, but at lunch you find an extra sausage in your mess tin.');
            x.log('Talked Lenz out of reporting Hartmann.');
          } else {
            x.apply({ suspicion: 12, comrades: 4, officers: -4 });
            x.say('Lenz looks at you coldly. "Interesting that you\'d defend him." That afternoon Brandt calls you and Hartmann in and reads you both a lecture on the new decree. Your names are written down.');
            x.log('Tried to protect Hartmann. Both our names were written down.');
          }
        } },
      { text: 'Say nothing. Eat your bread.',
        effects: { conscience: -2, comrades: -2 },
        result: 'The silence stretches until Brandt shouts for the squad to fall in. Lenz files a report. Hartmann gets three days of extra duty. Nobody asks what you think.' }
    ]
  },
  {
    id: 'd2a', day: 2, phase: 1, scene: 'village',
    title: 'Frau Kruse\'s Eggs',
    text: s => `During an hour off duty you walk to the edge of the camp. A farm widow from the nearby village has set up a table with eggs, bread and smoked sausage. Her name is Frau Kruse, and her own son is in another regiment somewhere along this border.${s.flags.local ? '\n\nWhen she hears your Pomeranian accent she stops. "Stolp? Then you know the Lehmanns from Schmolsin? My cousin married one." For a minute you are not a soldier at all.' : ''}

You have ${s.marks} RM.`,
    choices: [
      { text: 'Buy bread and sausage for yourself (2 RM).',
        req: s => s.marks >= 2, reqText: 'You need 2 RM.',
        effects: { marks: -2, food: 25, morale: 3 },
        result: 'Real bread, still warm. Sausage with garlic. You eat it sitting on a fence, slowly.' },
      { text: 'Buy enough for the whole squad (5 RM).',
        req: s => s.marks >= 5, reqText: 'You need 5 RM.',
        effects: { marks: -5, food: 18, comrades: 10, morale: 4 },
        set: { boughtForSquad: true },
        result: 'You carry it back in your helmet. Even Lenz says thank you. Hartmann makes a speech in your honour, which is mostly insults.',
        log: 'Bought food for the whole squad.' },
      { text: 'Ask her about the Poles across the border.',
        effects: { conscience: 4 },
        set: { heardKruse: true },
        result: '"The Poles?" She wipes her hands. "We went to their market in Konitz every month. My husband played cards with a Polish customs officer for twenty years." She looks toward the east. "Now the radio says they are murderers. I don\'t know what is true any more. I only know who will be doing the dying."' },
      { text: 'Walk on.',
        result: 'You keep your money. You may need it more later.' }
    ]
  },

  // ───────────────────────── DAY 3 · Thursday 31 August ─────────────────────────
  {
    id: 'd3m', day: 3, phase: 0, scene: 'camp',
    title: 'Live Ammunition',
    text: `Something has changed. Live ammunition is handed out from the crates: sixty rounds per man, two stick grenades, a field dressing. And the "iron ration": a tin of meat and a bag of hard biscuit, not to be eaten except on an officer's order.

Brandt spreads a map on the bonnet of a truck. A border, a road, a forest, a town called Konitz. He doesn't say "war". He says "tomorrow, maybe".`,
    choices: [
      { text: 'Study the map and ask Brandt sensible questions.',
        effects: { officers: 4, merit: 1 },
        set: { knowsTerrain: true },
        outcome: (s, x) => {
          if (s.flags.educated) x.say('You ask about the railway embankment and the stream beyond it. Brandt raises his eyebrows. "Abitur, eh?" Then he answers you properly, and you memorise every contour.');
          else x.say('You ask where the cover is between the border and the first village. Brandt answers you seriously, as if you were an adult. You memorise every line.');
        } },
      { text: 'Eat half of the iron ration now. Who will know?',
        outcome: (s, x) => {
          x.apply({ food: 22 });
          if (x.roll(0.4)) { x.apply({ officers: -8, morale: -2 }); x.say('Brandt finds the open tin during kit inspection. You spend the afternoon running laps with a full pack and an empty stomach. It is still more food than you have had in days.'); }
          else x.say('Cold meat and biscuit, wolfed down behind a truck. Nobody notices. You feel slightly sick, and slightly better.');
        } },
      { text: 'Check Vogel\'s equipment for him.',
        effects: { comrades: 3 },
        set: { vogelFriend: true },
        result: 'His grenades are clipped on wrong. He would have lost them on the first run. He looks at you strangely, as if he wants to say something, and doesn\'t.' }
    ]
  },
  {
    id: 'd3a', day: 3, phase: 1, scene: 'forest',
    title: 'Vogel\'s Secret',
    text: s => `${s.flags.vogelFriend ? 'Vogel finds you behind the field kitchen. He trusts you; that is the problem.' : 'You find Vogel behind the field kitchen, alone, shaking.'}

"I'm going home tonight," he whispers. "I've worked it out. Through the forest to the railway, and then west. My father needs me for the harvest. I can't shoot anybody. I can't." His eyes are wet. "You won't tell, will you?"

You know what happens to deserters. Everyone does.`,
    choices: [
      { text: 'Talk him out of it. Promise to look out for him.',
        outcome: (s, x) => {
          const p = 0.5 + (s.flags.vogelFriend ? 0.25 : 0) + s.stats.comrades / 400;
          if (x.roll(p)) {
            s.flags.vogelStays = true; s.flags.vogelPromise = true;
            x.apply({ conscience: 3, comrades: 3 });
            x.say('"They\'ll catch you before Neustettin, Ernst. And then they\'ll shoot you, and your father will have no son at all." He cries for a while, quietly. Then he nods. "You\'ll stay near me?" You promise.');
            x.log('Talked Vogel out of deserting. Promised to look after him.');
          } else {
            s.flags.vogelDeserted = true;
            x.apply({ morale: -3 });
            x.say('He listens. He nods. He says you are right. And you can see in his eyes that he has not changed his mind at all.');
            x.log('Tried to stop Vogel from deserting. I don\'t think I did.');
          }
        } },
      { text: 'Report him to Brandt.',
        effects: { officers: 6, merit: 1, conscience: -12, morale: -4 },
        set: { vogelReported: true },
        outcome: (s, x) => {
          x.say('Brandt listens without expression. Two Feldgendarmes take Vogel from his tent an hour later. He doesn\'t struggle. He doesn\'t look at you.');
          x.say('Brandt says, "You did your duty." It doesn\'t sound like praise. You will learn later that a court-martial has been convened.');
          if (x.roll(0.5)) { x.apply({ comrades: -12 }); x.say('Somehow the squad knows by evening. Hartmann spits on the ground near your boots.'); }
          x.log('Reported Ernst Vogel. The Feldgendarmerie took him.');
        } },
      { text: 'Go with him.',
        effects: { conscience: 5 },
        result: 'You look east, toward Poland, and then west, toward home. "Tonight," you say. "Both of us."',
        log: 'Decided to desert with Vogel.',
        end: 'desertion' },
      { text: 'Pretend you heard nothing.',
        effects: { conscience: -2 },
        set: { vogelDeserted: true },
        result: '"I didn\'t hear anything, Ernst." You walk away. Behind you he says, "Thank you," and you hate how grateful he sounds.' }
    ]
  },
  {
    id: 'd3n_missing', day: 3, phase: 2, scene: 'camp', time: '20:00',
    cond: s => s.flags.vogelDeserted,
    title: 'A Man Missing',
    text: `Evening roll call. "Vogel." Silence. "Vogel!" Silence.

Within minutes the camp is alive with torches. Feldgendarmes with metal gorgets on their chests. Brandt comes straight to you.

"You two were thick as thieves. Where is he?"`,
    choices: [
      { text: '"I don\'t know, Herr Unteroffizier."',
        outcome: (s, x) => {
          if (x.roll(0.5)) {
            s.flags.vogelCaught = true;
            x.apply({ suspicion: 18, officers: -6, morale: -6 });
            x.say('They bring Vogel back at midnight, muddy, his hands tied. He was found on the railway line two kilometres west. Under questioning he says nothing about you. But Brandt looks at you for a long time, and then writes something down.');
          } else {
            x.apply({ suspicion: 6, conscience: 2 });
            x.say('Brandt holds your eyes. Then he turns away. The search goes on until midnight. They do not find him. Somewhere in the dark, Ernst Vogel is walking west.');
          }
        } },
      { text: 'Tell them the route he planned to take.',
        effects: { officers: 5, conscience: -14, morale: -6 },
        set: { vogelCaught: true, vogelReported: true },
        result: 'They find him on the railway line within the hour. As they march him past, his eyes find yours. He doesn\'t say anything. He doesn\'t have to.',
        log: 'Told the Feldgendarmerie where to find Vogel.' }
    ],
    after: 'd3n'
  },
  {
    id: 'd3n', day: 3, phase: 2, scene: 'camp', time: '22:00',
    title: 'The Order',
    text: s => `Leutnant von Albrecht, your platoon leader, gathers the men in the dark. He is twenty-three, a Junker's son with a duelling scar and impeccable manners.

"The Poles attacked a German radio station at Gleiwitz this evening," he says. "The Führer has given the order. We cross the border at 04:45."

A reservist mutters, "Attacked a radio station? What for?" Nobody answers him.${s.flags.vogelCaught ? '\n\nVogel is under guard in a truck at the edge of camp. You can hear him crying.' : ''}

Four hours until the trucks move. What do you do with them?`,
    choices: [
      { text: 'Write a letter to be sent if you don\'t come back.',
        effects: { morale: 6, conscience: 2 },
        set: { lastLetter: true },
        result: 'You give it to the company clerk, sealed. It is short. You find you have very little to say, and all of it matters.',
        log: 'Wrote a last letter, just in case.' },
      { text: 'Pray.',
        outcome: (s, x) => {
          if (s.flags.catholic || s.flags.rosary) { x.apply({ morale: 9, conscience: 3 }); x.say('Hail Mary, full of grace. The rosary beads click between your fingers. A reservist in the next tent hears you and joins in, then another.'); }
          else { x.apply({ morale: 4, conscience: 2 }); x.say('You are not sure you know how anymore. You try anyway, clumsily, to whoever is listening.'); }
        } },
      { text: 'Share Hartmann\'s schnapps.',
        outcome: (s, x) => {
          x.apply({ morale: 7, health: -3, comrades: 5 });
          if (s.flags.betrayedHartmann) x.say('Hartmann hesitates, then passes you the bottle. "Tomorrow we\'re all in the same shit," he says. That\'s as close to forgiveness as you will get.');
          else x.say('Korn, cheap and fierce. Hartmann tells a story about a Portuguese sailor and a goat, and for an hour nobody thinks about 04:45.');
          if (x.roll(0.25)) { x.apply({ officers: -5 }); x.say('Brandt smells it on you at the trucks. "Tomorrow," he says, "you\'d better be sober enough to shoot."'); }
        } },
      { text: 'Lie awake and stare at the canvas.',
        effects: { health: -4, morale: -3 },
        result: 'The trucks are already moving in the dark. Their engines sound like breathing. You don\'t sleep at all.' }
    ]
  },

  // ───────────────────────── DAY 4 · Friday 1 September ─────────────────────────
  {
    id: 'd4m', day: 4, phase: 0, scene: 'field', time: '04:45',
    title: '04:45',
    text: s => `Fog lies in the hollows. At 04:45 the artillery opens up behind you, and the world becomes noise. Somewhere far to the north, the old battleship Schleswig-Holstein is firing on the Polish depot at the Westerplatte; you will read about it later.

Your company advances across a stubble field toward a railway embankment. The border barrier is already smashed. Then, from the embankment, a Polish machine gun starts firing. Men go down. ${s.flags.knowsTerrain ? 'You remember the map: a drainage ditch runs along the left side of the field.' : ''}

Brandt is shouting. Everyone is shouting.`,
    choices: [
      { text: 'Advance in short rushes, using cover as you were trained.',
        effects: { merit: 1 }, assault: true,
        risk: { chance: s => s.flags.knowsTerrain ? 0.08 : 0.16, dmg: [10, 28], cause: 'Killed in the first hour of the war, in a stubble field near the border.',
          hit: 'Something hits your arm like a hammer. You look down and see the blood soaking your sleeve before you feel it.',
          miss: 'Up, run, down. Up, run, down. Dirt kicks up next to your face. Then you are in the lee of the embankment, alive, gasping.' } },
      { text: 'Charge ahead of the others.',
        effects: { merit: 3, officers: 6 }, assault: true,
        set: { charged: true },
        risk: { chance: 0.35, dmg: [15, 45], cause: 'Killed charging a Polish machine-gun post on the first morning of the war.',
          hit: 'You are halfway there when the bullet finds you. You are on the ground and do not remember falling.',
          miss: 'You run straight at the gun, screaming something. You reach the embankment first and throw a grenade over it. When the smoke clears, the gun is silent. Leutnant von Albrecht saw it.' },
        log: 'Charged the machine gun at the border. I don\'t know why.' },
      { text: 'Hang back and let the others go first.',
        effects: { officers: -6, comrades: -4, morale: -3 },
        risk: { chance: 0.07, dmg: [8, 20], cause: 'Killed by a stray shell behind the lines, on the first morning of the war.',
          hit: 'A shell lands behind you, where it should be safe. Splinters tear through your trouser leg.',
          miss: 'You arrive at the embankment last. Brandt sees it. Brandt sees everything.' } },
      { text: 'Stay next to Vogel, as you promised.',
        show: s => s.flags.vogelPromise,
        effects: { comrades: 6, conscience: 3 },
        risk: { chance: 0.18, dmg: [10, 30], cause: 'Killed keeping a promise, in a stubble field near the border.',
          hit: 'Vogel freezes. You drag him down into the ditch, and something tears across your back as you do.',
          miss: 'Vogel freezes. You drag him into the ditch and hold his collar until he can move again. "I\'ve got you, Ernst." Together you reach the embankment.' },
        outcome: (s, x) => { s.flags.vogelSaved = true; },
        log: 'Kept my promise to Vogel at the border.' }
    ]
  },
  {
    id: 'd4a', day: 4, phase: 1, scene: 'village',
    title: 'The Wounded Pole',
    text: `By afternoon the Polish rearguard has pulled back toward Konitz. Your section clears a farmyard. Chickens, a dead horse, a well.

Behind the barn lies a Polish soldier, no older than you, with a bloody thigh. When he sees you his hand moves toward his tunic.

Lenz has his rifle up in an instant. "He's going for a grenade!"

The boy's hand stops. Half out of his pocket is something white. It might be paper.`,
    choices: [
      { text: 'Knock Lenz\'s rifle aside. "Wait!"',
        effects: { conscience: 10 },
        set: { savedPole: true, lenzRival: true },
        outcome: (s, x) => {
          x.say('Lenz\'s shot goes into the barn wall. The boy pulls out a photograph: a woman in a headscarf, standing in front of a house just like this one. "Mama," he says. "Mama."');
          x.say('His name is Tadeusz. You bandage his leg and hand him over to the prisoners\' column. Lenz says, through his teeth, "You\'ll get one of us killed with that soft heart."');
          if (s.stats.officers >= 50) { x.apply({ officers: 3 }); x.say('Leutnant von Albrecht, passing, says only, "Correctly done." He is a man who believes in the rules of war.'); }
          x.log('Stopped Lenz from shooting a wounded Polish boy. His name was Tadeusz.');
        } },
      { text: 'Shout at the Pole to show his hands.',
        outcome: (s, x) => {
          if (x.roll(0.5)) {
            s.flags.savedPole = true;
            x.apply({ conscience: 5 });
            x.say('"Hände hoch! Hands!" He doesn\'t understand the words but he understands the tone, and freezes. A photograph falls into the dust. Lenz lowers his rifle, disappointed. The boy goes to the prisoners\' column.');
          } else {
            x.apply({ conscience: -6, morale: -6 });
            x.say('"Hände hoch!" He doesn\'t understand. His hand keeps moving. Lenz fires. The thing in his hand is a photograph of a woman in a headscarf.');
            x.log('A Polish boy was shot reaching for a photograph. I shouted at him in a language he didn\'t speak.');
          }
        } },
      { text: 'Let Lenz handle it.',
        effects: { conscience: -12, morale: -6 },
        set: { lenzKilled: true },
        result: 'You look away. The shot is very loud in the farmyard. Afterwards Lenz turns the body over with his boot. The white thing was a photograph of a woman in a headscarf. "Could have been a grenade," Lenz says, and walks off.',
        log: 'Looked away while Lenz shot a wounded prisoner.' },
      { text: 'Shoot first.',
        effects: { conscience: -22, morale: -10 },
        set: { shotPole: true, lenzAlly: true },
        result: 'Your rifle bucks. The boy goes still. Lenz grins at you: "Quick." When you turn the body over, the white thing in his hand is a photograph of a woman in a headscarf. You will see it again. Not here. Later. Many times.',
        log: 'I shot a wounded Polish soldier. He was holding a photograph.' }
    ]
  },

  // ───────────────────────── DAY 5 · Saturday 2 September ─────────────────────────
  {
    id: 'd5m', day: 5, phase: 0, scene: 'forest', time: '09:15',
    title: 'Ambush on the Forest Road',
    text: s => `The Tuchel Heath: endless pine forest on sandy soil, the road a white scar through it. The company marches in column. You are tired to the bone.

The Polish machine gun opens fire from the trees at forty metres. The column breaks apart. Men dive into the ditches. In the road, Unteroffizier Brandt is down, clutching his leg, bullets kicking up sand around him.

${s.flags.trainedDig ? 'Your hands, still raw from digging, are already scraping at the sand.' : ''}`,
    choices: [
      { text: 'Flank the gun through the trees with Hartmann.',
        effects: { merit: 3, officers: 8 }, assault: true,
        set: { flanked: true },
        risk: { chance: s => s.flags.knowsTerrain ? 0.3 : 0.4, dmg: [18, 50], cause: 'Killed in the Tuchel Heath while attacking a Polish machine-gun nest.',
          hit: 'You are ten metres from the gun when a Polish rifleman you never saw fires. The impact spins you around. Hartmann throws the grenade.',
          miss: 'Through the ferns, crawling, Hartmann behind you. Ten metres. Five. Two grenades. Then silence, and the smell of cordite and pine resin. Two young Poles lie by the gun. A third is running into the trees. You let him go.' },
        log: 'Took out a machine gun in the Tuchel Heath with Hartmann.' },
      { text: 'Drag Brandt out of the road.',
        effects: { comrades: 10, merit: 2, officers: 4 },
        set: { savedBrandt: true },
        risk: { chance: 0.3, dmg: [15, 40], cause: 'Killed in the Tuchel Heath while pulling a wounded NCO out of the line of fire.',
          hit: 'You have him by the collar and are pulling when the burst catches you. You both fall into the ditch together.',
          miss: 'You run out, grab his harness and haul. He is heavy and he swears at you the whole way. In the ditch he grips your wrist. "Not bad," he says, white-faced. "Not bad, boy."' },
        log: 'Dragged Brandt out of the road under fire.' },
      { text: 'Stay down and fire at the muzzle flashes.',
        effects: { merit: 1 },
        risk: { chance: 0.13, dmg: [10, 30], cause: 'Killed in the Tuchel Heath in a firefight with the Polish rearguard.',
          hit: 'A bullet strikes the road in front of you and sprays you with sand and metal.',
          miss: 'You fire clip after clip into the trees. Eventually other men work round the flank and the gun falls silent. You have no idea if you hit anything.' } },
      { text: 'Freeze. Press your face into the sand.',
        effects: { morale: -8, officers: -5 },
        risk: { chance: 0.18, dmg: [10, 30], cause: 'Killed in the Tuchel Heath, face down in a ditch.',
          hit: 'Something hits you while you lie there. You don\'t even know from where.',
          miss: 'You don\'t move until it is over. Nobody says anything. That is worse.' } }
    ]
  },
  {
    id: 'd5a', day: 5, phase: 1, scene: 'village', time: '16:00',
    title: 'Freischärler',
    text: s => `The battalion reaches a village of wooden houses at the edge of the forest. Shots ring out, perhaps from Polish stragglers, perhaps from a nervous German sentry. Within minutes the word is everywhere: "Freischärler! Civilians are shooting at us!"

You saw the shots. They came from the treeline, not the houses. But the company is already dragging men out of their homes. Hauptmann Steiner, pale and furious, orders that five of them are to be shot as an example.

${s.flags.savedBrandt ? 'Brandt is in a field ambulance. Lenz, eager, has been given the detail.' : 'Brandt is told to provide the firing detail.'} Your section is chosen. Five farmers stand against a barn wall: an old man in a cap, two middle-aged men, a boy of perhaps sixteen, and a man still holding his hat.`,
    choices: [
      { text: 'Obey the order.',
        effects: { conscience: -30, morale: -15, officers: 5 },
        set: { firingSquad: true },
        result: 'You raise your rifle when you are told to. You fire when you are told to. Afterwards you cannot remember the faces, only the hat, which rolls a little way in the dust and stops.',
        log: 'I was on the firing detail at the village by the forest.' },
      { text: 'Aim high, over their heads.',
        effects: { conscience: -10, morale: -10 },
        set: { firedHigh: true },
        outcome: (s, x) => {
          x.say('You aim at the wall above the old man\'s cap and squeeze. It makes no difference. There are seven other rifles.');
          if (x.roll(0.35)) { x.apply({ suspicion: 20, officers: -10 }); x.say('Afterwards Lenz looks at the bullet holes in the planks above the bodies, and then at you. He goes to find the captain.'); }
          x.log('Fired over their heads at the village. It changed nothing.');
        } },
      { text: 'Lower your rifle. "These are farmers. I won\'t do it."',
        effects: { conscience: 18, suspicion: 25, officers: -18, merit: -3, morale: -5 },
        set: { refusedOrder: true },
        outcome: (s, x) => {
          x.say('The words come out before you can stop them. For a moment there is complete silence. Then Hauptmann Steiner is in front of you, screaming, his face a centimetre from yours: cowardice, insubordination, court-martial.');
          x.say('But he does not shoot you. He has you taken off the detail and marched away under guard. Lenz takes your place. You hear the volley from behind the barn.');
          x.say('Later, Leutnant von Albrecht comes to where you are held. He doesn\'t say whether you were right. He says, "I have written a report on what happened at this village. Not on you." Then he leaves.');
          x.log('Refused to shoot civilians. Placed under guard.');
        } },
      { text: 'Run to Leutnant von Albrecht and tell him what you saw.',
        outcome: (s, x) => {
          const p = 0.2 + s.stats.officers / 140 + (s.flags.savedPole ? 0.1 : 0) + (s.flags.charged || s.flags.flanked ? 0.1 : 0);
          if (x.roll(p)) {
            s.flags.stoppedReprisal = true;
            x.apply({ conscience: 15, officers: 2, suspicion: 5 });
            x.say('Albrecht listens, white around the mouth. "From the treeline. You\'re certain." You are. He walks to the captain, and they talk for a long time with their backs to the men.');
            x.say('In the end the five farmers are marched to the prisoners\' collection point instead. As they pass, the old man in the cap looks at you. You don\'t know if he knows. It doesn\'t matter.');
            x.log('Told Albrecht the truth. The five farmers were not shot.');
          } else {
            s.flags.triedToStop = true;
            x.apply({ conscience: 8, suspicion: 10, officers: -4, morale: -10 });
            x.say('Albrecht listens. He believes you; you can see it. Then he says, very quietly, "It is not my decision," and looks away.');
            x.say('Brandt sends someone else in your place. You hear the volley from the road.');
            x.log('Tried to stop the shooting at the village. It happened anyway.');
          }
        } }
    ]
  },

  // ───────────────────────── DAY 6 · Sunday 3 September ─────────────────────────
  {
    id: 'd6m', day: 6, phase: 0, scene: 'road',
    title: 'Refugees on the Road',
    text: `The road to the Vistula is choked with Polish civilians fleeing east: handcarts, prams, a cart pulled by a cow. They stand aside for the column with their eyes on the ground.

Some of the men are going through their bundles. A wristwatch. A chicken. A pair of good boots. Lenz holds up a silver candlestick and laughs.

A little girl in a too-big coat is staring at the bread sticking out of your bread bag.`,
    choices: [
      { text: 'Take what you can. Everyone else is.',
        effects: { marks: 8, food: 15, conscience: -8, comrades: 2 },
        set: { looted: true },
        items: { pocketwatch: 1 },
        result: 'A pocket watch, some zloty coins, a sausage. The man you take it from doesn\'t resist. He just watches your hands.',
        log: 'Took things from refugees on the road.' },
      { text: 'Give the girl your bread.',
        effects: { food: -15, conscience: 7, morale: 4 },
        set: { gaveBread: true },
        result: 'Her mother pulls her back, frightened, then sees what it is. The girl breaks it in half and gives one piece to her mother. You will be hungry tonight. It is a good kind of hungry.',
        log: 'Gave my bread to a Polish girl on the road.' },
      { text: 'Stop the looting. "Looting is forbidden. You\'ve heard the orders."',
        outcome: (s, x) => {
          if (s.stats.comrades >= 55 || s.flags.savedBrandt) {
            x.apply({ conscience: 6, officers: 4, comrades: -2 });
            x.say('It is true: the regulations forbid it. A few men hand things back, sheepish. Lenz keeps the candlestick, but he puts it away.');
          } else {
            x.apply({ conscience: 5, comrades: -8, suspicion: 4 });
            x.say('Lenz laughs in your face. "Orders? Like the orders at the village?" The others go on. All you have done is make yourself unpopular.');
          }
        } },
      { text: 'Look straight ahead and keep marching.',
        effects: { conscience: -2, morale: -2 },
        result: 'You count your steps. Four hundred. Five hundred. When you look back, the girl is gone.' }
    ]
  },
  {
    id: 'd6a', day: 6, phase: 1, scene: 'road', time: '13:00',
    title: 'Sunday Broadcast',
    text: s => `At a halt by the roadside, the signals section has a radio going. At noon the announcer says it in a flat voice: Great Britain has declared war on Germany. France will follow by evening.

The older reservists, the ones who were boys in 1914, go very quiet. One of them takes off his helmet and sits down in the ditch.

Hartmann lights a cigarette. "Well," he says ${s.flags.betrayedHartmann ? 'to nobody in particular' : 'to you'}, "that's not a week any more. That's years."`,
    choices: [
      { text: '"It\'ll be over by Christmas. Poland\'s already beaten."',
        effects: { morale: 5 },
        result: 'You say it firmly. Some of the younger men nod. The reservist in the ditch laughs, a horrible little laugh. "That\'s what we said in 1914," he says.' },
      { text: 'Think of the war memorial in your home town.',
        effects: { morale: -5, conscience: 3 },
        outcome: (s, x) => x.say(`There is one in ${SIM.townName(s.char.hometown)}, like everywhere: a bronze soldier and three columns of names. You used to read them as a boy without thinking. Now you wonder how many columns this one will need.`) },
      { text: 'Sit with the squad and share a cigarette.',
        effects: { comrades: 5, morale: 2 },
        result: 'Hartmann, Lenz and the others sit in a row in the ditch and pass one cigarette from hand to hand. Nobody talks. For once, nobody needs to.' }
    ]
  },
  {
    id: 'd6n', day: 6, phase: 2, scene: 'camp', time: '21:00',
    title: 'Taking Stock',
    text: s => {
      let t = `Night on the bank of the Vistula. The river is wide and black, and on the other side the Polish army is digging in. The first week is over.\n\nLeutnant von Albrecht goes from man to man with a notebook, taking names for the company war diary: who was wounded, who was killed, who distinguished himself.`;
      if (s.flags.refusedOrder) t += '\n\nYou are still under guard. Your name is in a different notebook.';
      return t;
    },
    choices: [
      { text: 'Wait for your name to be called.',
        result: 'You sit by the dark water and wait.' }
    ]
  }
];
