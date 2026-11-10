// Chapter VIII: random events for both tracks, and the endings.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, men, camp, weber } = SIM.ch8;
  const c8 = s => s.chapter === 7;

  SIM.POOL.push(
    // ── Camp nights ──
    { id: 'pc_lice', chapters: [7], track: 'camp', phases: [2], scene: 'barracks',
      title: 'Lice',
      text: 'The lice come out at night, when the barrack warms up with bodies. Men sit up in the dark crushing them between their thumbnails, a small steady crackle all round the room.',
      choices: [
        { text: 'Go through every seam of your clothes.', effects: { health: 3, hope: 1 }, result: 'An hour by the light of a burning rag. You kill three hundred. Tomorrow there will be three hundred more.' },
        { text: 'Sleep. You are past caring.', effects: { health: -3, hope: -2 }, result: 'You sleep, and they feed.' }
      ] },
    { id: 'pc_food', chapters: [7], track: 'camp', phases: [2], scene: 'barracks',
      title: 'Recipes',
      text: 'In the dark, men talk about food. Only food. A man from Swabia describes his mother\'s Maultaschen for half an hour, the filling, the broth, the onions browned in butter. Nobody interrupts.',
      choices: [
        { text: 'Describe your mother\'s Sunday roast.', effects: { hope: 5, food: -2 }, result: 'You describe it so well that a man three bunks away starts to cry. Then everyone laughs, and then they want to hear it again.' },
        { text: 'Ask them to stop. It makes it worse.', effects: { hope: -1 }, result: 'They stop. The silence is worse.' }
      ] },
    { id: 'pc_bread', chapters: [7], track: 'camp', phases: [2], weight: 2, scene: 'barracks',
      title: 'Bread',
      text: 'A man in the next bunk has saved half his bread ration under his shirt, for the morning. He is asleep. It is right there.',
      choices: [
        { text: 'Take it.', effects: { food: 14, conscience: -8, hope: -2 },
          outcome: (s, x) => { if (x.roll(0.25)) { x.apply({ health: -12, comrades: -10 }); x.say('He wakes. The whole barrack wakes. They beat you, as bread thieves are beaten in every camp, and nobody stops them.'); } else x.say('You eat it in the dark in four bites. In the morning he searches his shirt, then looks at every man in the barrack, one after another.'); } },
        { text: 'Leave it.', effects: { conscience: 3, hope: 2 }, result: 'You turn your face to the wall. In the morning he gives a corner of it to the boy who sleeps by the door.' }
      ] },
    { id: 'pc_stars', chapters: [7], track: 'camp', phases: [2], scene: 'powcamp',
      title: 'The Same Stars',
      text: 'You go out to the latrine and stop. The sky is enormous and clear. The same stars are over Germany.',
      choices: [
        { text: 'Look for the Plough.', effects: { hope: 5 }, result: s => `There. Your ${s.flags.married ? 'wife' : 'mother'} is looking at the same stars, perhaps. You stand there until a guard shouts at you.` },
        { text: 'Go back in. It is cold.', effects: { warmth: 2 }, result: 'You go back in and lie down among the others.' }
      ] },
    { id: 'pc_rumour', chapters: [7], track: 'camp', phases: [2], scene: 'barracks',
      title: '"Skoro domoi"',
      text: '"Skoro domoi," the guards say: soon home. They say it to every prisoner, every week. A rumour goes round that the first transport home will leave in the autumn.',
      choices: [
        { text: 'Believe it.', effects: { hope: 7 }, result: 'You lie awake planning the journey: the train, the station, the street, the door.' },
        { text: 'Do not.', effects: { hope: -2, morale: 2 }, result: '"Skoro" is Russian for "never", says an old prisoner. You laugh. It is not funny.' }
      ] },
    { id: 'pc_dream', chapters: [7], track: 'camp', phases: [2], scene: 'barracks',
      title: 'The Cellar',
      text: 'You dream you are back in the cellar under the Univermag, and the stairs go up and up and never reach the light.',
      choices: [
        { text: 'Wake and talk to the man beside you.', effects: { hope: 3, morale: 2 }, result: 'He was in the same cellar, it turns out, or one just like it. You talk until the morning count.' },
        { text: 'Lie still until it passes.', effects: { morale: -3 }, result: 'It passes. It always does, by morning.' }
      ] },
    { id: 'pc_typhus', chapters: [7], track: 'camp', phases: [2], weight: 2, cond: s => s.day >= 1 && s.day <= 6, scene: 'barracks',
      title: 'The Fever',
      text: 'You wake with a headache like a nail driven through your skull. By noon you are burning. Typhus: you have seen enough of it to know.',
      choices: [
        { text: 'Fight it. Drink, eat everything you can, keep moving.', effects: { hope: 2 },
          outcome: (s, x) => { s.flags.typhus = true; x.apply({ health: -10 - Math.round(Math.random() * 12), food: -8 }); if (s.stats.health <= 0) s.deathCause = 'Died of typhus in the prisoner-of-war camp at Beketovka, spring 1943.'; else x.say('Ten days of fever. You talk to people who are not there. Then, one morning, it is gone, and you are still alive, and so weak you cannot lift the soup tin.'); } },
        { text: s => s.flags.metVera ? 'Go to Dr. Lipatova.' : 'Go to the hospital barrack.', rel: { vera: 3 },
          outcome: (s, x) => { s.flags.typhus = true; x.apply({ health: -6 - Math.round(Math.random() * 10), hope: -3 }); if (s.stats.health <= 0) s.deathCause = 'Died of typhus in the hospital barrack at Beketovka, spring 1943.'; else x.say('A plank bed, water, and a small woman in a white coat who checks on you twice a night. You live.'); } }
      ] },
    // ── Front nights ──
    { id: 'pf_shelling', chapters: [7], track: 'front', phases: [2], weight: 2, cond: s => s.day >= 9, scene: 'field',
      title: 'Night Fire',
      text: 'Soviet artillery all night, searching the German rear: a battery somewhere beyond the hills, firing at random, a shell every few minutes.',
      choices: [
        { text: 'Get everyone into the slit trenches.', effects: { health: -2 }, outcome: (s, x) => { const m = x.casualty(0.1, 'by night shelling'); if (m) x.say(m.status === 'killed' ? `A shell lands on ${m.name}'s slit trench.` : `${m.name} is hit by a splinter in the night.`); else x.say('A long night in the dirt. Nobody is hit.'); } },
        { text: 'Sleep where you are. It is random.', effects: { health: 4 },
          risk: { chance: 0.07, dmg: [10, 30], cause: 'Killed by Soviet shellfire at night near Kursk, July 1943.', hit: 'You wake in the air.', miss: 'You sleep. In the morning there is a crater twenty metres away.' } }
      ] },
    { id: 'pf_stalingrad', chapters: [7], track: 'front', phases: [2], scene: 'camp',
      title: 'Stalingraders',
      text: 'The men want to hear about Stalingrad. Rehm especially. "Is it true that men ate rats?"',
      choices: [
        { text: 'Tell them.', effects: { conscience: 2, morale: -3 }, squad: { all: { loyalty: 3 } }, result: 'You tell them about the horses, and the cellar, and the two hundred grams. After a while nobody asks any more questions.' },
        { text: '"Go to sleep."', effects: { morale: 1 }, result: 'They go to sleep. You do not.' }
      ] },
    { id: 'pf_nightmare', chapters: [7], track: 'front', phases: [2], weight: 2, scene: 'camp',
      title: 'The Pocket',
      text: 'You wake with your hands round your rifle and do not know where you are. For a moment the dugout is a cellar in Stalingrad, and you are listening for the Russians on the floor above.',
      choices: [
        { text: 'Go out and walk it off.', effects: { morale: 2, health: -1 }, result: 'Out in the warm night, the smell of corn and cut grass. It is summer. It is summer.' },
        { text: 'Take something for it.', show: s => SIM.has(s, 'schnapps') || SIM.has(s, 'vodka'), effects: { morale: 5, health: -2 },
          outcome: (s, x) => { x.item(SIM.has(s, 'schnapps') ? 'schnapps' : 'vodka', -1); x.say('Three swallows. Sleep comes, eventually, black and dreamless.'); } },
        { text: 'Lie still and count your men by their breathing.', effects: { morale: 3 }, result: 'Five, six. All of them. You fall asleep before you finish the second count.' }
      ] },
    { id: 'pf_letter', chapters: [7], track: 'front', phases: [2], scene: 'letter',
      title: 'Kraus Writes',
      cond: s => has(s, 'kraus'),
      text: 'Kraus writes to his mother by the light of a cartridge-case lamp. He has written every day since January. He asks you how to spell "Kursk".',
      choices: [
        { text: '"Don\'t write the name of the place. The censor will cut it."', effects: { officers: 1 }, squad: { kraus: { loyalty: 4 } }, result: '"Somewhere in Russia," he writes, carefully. "It is very beautiful here."' },
        { text: 'Help him write a good letter.', effects: { morale: 3 }, squad: { kraus: { loyalty: 8, morale: 6 } }, result: 'Two pages about the sunflowers and the swimming. Nothing about the war. His mother will keep it in a drawer for forty years.' }
      ] },
    { id: 'pf_fink', chapters: [7], track: 'front', phases: [2], scene: 'camp',
      title: 'Fink\'s Market',
      cond: s => has(s, 'fink'),
      text: 'Fink is running a market behind the field kitchen: Russian sunflower oil, Hungarian salami, Luftwaffe chocolate. "For you, Unteroffizier, a special price."',
      choices: [
        { text: 'Buy food for the squad (8 RM).', req: s => s.marks >= 8, reqText: 'You need 8 RM.', effects: { marks: -8 }, supply: { rations: 2 }, squad: { all: { morale: 4 } }, result: 'Salami and chocolate. The squad eats like officers for two days.' },
        { text: 'Shut it down.', effects: { officers: 2 }, squad: { fink: { loyalty: -6 } }, result: 'Fink shrugs and moves it two hundred metres further along.' }
      ] },
    { id: 'pf_flares', chapters: [7], track: 'front', phases: [2], cond: s => SIM.today(s).war, scene: 'field',
      title: 'Flares',
      text: 'All night, flares over no man\'s land, white and green. Soviet loudspeakers play German songs and then a voice: "Soldiers of the Sixth Army are alive in our camps. Come over and see them."',
      choices: [
        { text: 'Listen for names.', effects: { conscience: 2, suspicion: 2, morale: -2 }, result: 'They read names, sometimes. You listen for anyone you know. Tonight, nobody.' },
        { text: 'Fire a flare back at them.', effects: { morale: 2 }, result: 'Childish. It helps.' }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  SIM.ch8Ending = function (s) {
    if (camp(s)) return s.flags.signedNKFD ? 'tr_free' : 'tr_oath';
    if (s.flags.penal && !s.flags.penalCleared) return 'tr_probation';
    return 'tr_citadel';
  };
  const campCast = s => {
    const out = [];
    if (s.flags.starckFarewell || s.flags.starckTaken || s.flags.starckReported || s.flags.starckSecret) out.push(s.flags.starckReported ? 'Starck was taken away by the NKVD because of you. You do not know what happened to him. You do not know whether you want to know.' : 'Starck was taken away in July. Years later you will hear that a man called Brandau, or Starck, died in a camp at Vorkuta in 1947, still refusing to sign anything.');
    const g = SIM.man(s, 'grischa');
    if (s.flags.weberSaved) out.push('Grischa is still in the hospital barrack at Beketovka, under Dr. Lipatova\'s protection, as Johann Weber. She sends word, once, through a transport: he is alive.');
    else if (s.flags.grischaLives) out.push('Grischa has ten years in a labour camp. It is a life.');
    else if (g && g.status === 'killed') out.push('Grischa is dead. You think of him every time you hear Russian spoken kindly.');
    if (s.flags.nameOnRadio) out.push(`Somewhere in ${SIM.townName(s.char.hometown)}, perhaps, someone heard your name on Radio Moscow.`);
    if (men(s).length) out.push(`${men(s).map(m => m.name.split(' ')[0]).join(', ')}: still with you.`);
    return out.join(' ');
  };
  Object.assign(SIM.ENDINGS, {
    tr_free: { title: 'Free Germany', text: s => `You signed. In Germany, a Gestapo officer adds your name to a list of traitors, and a polite man in a grey suit visits your family. In the camp, you eat a little better, and some of the officers will not speak to you.\n\n${campCast(s)}\n\nThe war goes on without you. You are alive. You are a prisoner. You are, according to the radio in Moscow, the future of Germany.` },
    tr_oath: { title: 'The Oath', text: s => `You did not sign. Some of the men respect you for it; some think you a fool. The Soviets put your name on a different list. The oath you swore in 1938 is the one thing you still own.\n\n${campCast(s)}\n\nThe war goes on without you. You are alive. You are a prisoner. ${s.stats.hope >= 50 ? 'You still believe you will see home.' : 'Some nights you are no longer sure you will see home.'}` },
    tr_probation: { title: 'Probation', text: s => `Kessler's court sentenced you to a probation unit. Your rank badges are gone; the men who are left of your squad salute you anyway, when no officer is looking.\n\nCitadel is over. The German army will never attack in the East again. From now on there is only the long road back west, and you will walk it in front of everyone else.` },
    tr_citadel: { title: 'Citadel', text: s => `Operation Citadel is over. Seven days of attack, and then everything given back. The Soviets do not stop: in August they take Orel and Belgorod and Kharkov, for the last time.\n\n${s.flags.penalCleared ? 'Your probation sentence has been struck out. Your rank is restored. Kessler sends a short note: "As promised."' : s.flags.kesslerInformer ? 'Kessler sends you a postcard from Kharkov. It says nothing. It does not need to.' : 'Kessler\'s file on you is closed.'} ${s.flags.daughter ? `In your paybook is a photograph of ${s.flags.daughter}, four months old.` : ''}\n\nYou were at Stalingrad and at Kursk, and you are alive. Your ${ss(s) ? 'section' : 'squad'}: ${men(s).length ? men(s).map(m => m.name.split(' ')[0]).join(', ') : 'gone'}.` }
  });
})();
