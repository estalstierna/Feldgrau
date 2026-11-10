// Chapter VIII, front track: the men who got out of Stalingrad.
// The hospital, Major Kessler's investigation (statements on record), Kharkov, and Kursk.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, men, say, score } = SIM.ch8;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 7, track: 'front' }, o));
  const how = s => s.flags.flown || (s.flags.brokeOut ? 'breakout' : 'wounded');
  const unit = s => ss(s) ? 'section' : 'squad';
  // What Kessler can check, and how likely a lie is to come apart when he does.
  const truthOut = s => ({ starck: 'starck', wounded: 'wounded', forged: 'forged', breakout: 'breakout' }[how(s)]);

  // ───────────────────────── Day 0 · 4 February: the hospital ─────────────────────────
  ev({ id: 'c8f_0m', day: 0, phase: 0, scene: 'hospital', time: '08:00',
    title: 'Clean Sheets',
    text: s => `A reserve hospital in Dnepropetrovsk, in a former school. Clean sheets. A nurse from Bremen who calls everyone "Jung". Soup with meat in it.

The man in the next bed was flown out of Pitomnik in December with both legs gone. He asks you, every morning, whether you have heard anything from the Sixth Army. Every morning you tell him no.${s.flags.gaveSeat ? `\n\nYou gave your seat on the plane to ${s.flags.gaveSeat}. You got out anyway, later. You do not know where he is.` : ''}`,
    choices: [
      { text: 'Tell him the truth: the army is gone.', effects: { conscience: 3, morale: -4 }, result: 'He turns his face to the wall. In the afternoon he asks you to write a letter for him, to the parents of a man in his platoon.' },
      { text: 'Tell him they are still fighting.', effects: { morale: 2 }, result: 'He smiles. "I knew it," he says. "I knew they would hold." The nurse looks at you over his head.' },
      { text: 'Sleep. Eat. Do not think.', effects: { health: 10, food: 15 }, result: 'For three days you only sleep and eat. On the fourth, you dream about the cellar, and the nurse holds your hand until you stop.' }
    ] });

  ev({ id: 'c8f_0a', day: 0, phase: 1, scene: 'office', time: '15:00',
    title: 'Major Kessler',
    text: s => `A visitor: Major Ludwig Kessler of the Secret Field Police, a neat grey man with a briefcase and a fountain pen. "A formality," he says. "Every man who came out of Stalingrad is asked the same questions. Some came out honourably. Some did not."

He uncaps the pen. "How did you leave the pocket?"`,
    choices: [
      { text: s => ({ starck: '"An SS officer arranged a seat for me."', wounded: '"I was wounded. A doctor put me on a plane."', forged: '"I was wounded. A doctor put me on a plane."', breakout: '"I broke out on foot, after the surrender."' })[how(s)] + ' (the truth)', show: s => how(s) !== 'forged',
        set: { metKessler: true }, state: { key: 'howOut', v: 'truth', t: 'To Kessler: how you left the pocket, the truth.' }, rel: { kessler: 4 },
        outcome: (s, x) => { s.statements.howOut.v = truthOut(s); x.say('He writes in small, neat script. "Thank you." He does not look up.'); } },
      { text: '"A man gave me his wound tag. He was dead." (the truth)', show: s => how(s) === 'forged', set: { metKessler: true, confessed: true }, state: { key: 'howOut', v: 'forged', t: 'To Kessler: you used a dead man\'s wound tag at Gumrak.' }, rel: { kessler: 10 }, effects: { suspicion: 25, conscience: 6 },
        result: 'His pen stops. "That," he says, "is desertion in the face of the enemy." He looks at you for a long time. "And you are the first man who has told me so. I will have to think about what that is worth."' },
      { text: '"I was wounded. A doctor put me on a plane." (a lie)', show: s => how(s) !== 'wounded', set: { metKessler: true }, state: { key: 'howOut', v: 'wounded', t: 'To Kessler: you were wounded and put on a plane by a doctor.' }, rel: { kessler: -2 },
        result: '"Which doctor?" You make up a name. He writes it down, and underlines it once.' },
      { text: '"I was sent out as a courier, with dispatches." (a lie)', set: { metKessler: true }, state: { key: 'howOut', v: 'courier', t: 'To Kessler: you were sent out of the pocket as a courier.' }, rel: { kessler: -4 },
        result: '"Dispatches for whom?" You name a general. Kessler writes it down without expression. You realise that he can check.' }
    ] });

  ev({ id: 'c8f_0n', day: 0, phase: 2, scene: 'office', time: '19:00',
    title: 'The Second Question',
    text: 'Kessler again, after supper. "One more thing. Did you see German soldiers surrender? Officers? Did you see men give up before the order?"',
    choices: [
      { text: '"Yes. We were starving. Men surrendered every day."', state: { key: 'surrender', v: 'truth', t: 'To Kessler: men surrendered every day in the pocket, starving.' }, effects: { suspicion: 8, conscience: 3 }, rel: { kessler: 4 },
        result: '"Defeatism," he says mildly, writing. "Or accuracy. They often look alike." He thanks you and goes.' },
      { text: '"No. The army fought to the last man."', state: { key: 'surrender', v: 'propaganda', t: 'To Kessler: the army fought to the last man.' }, effects: { suspicion: -4, conscience: -3 },
        result: '"The last man," he repeats. "And yet here you are." He smiles slightly and writes it down.' },
      { text: 'Name a man you saw desert.', effects: { suspicion: -10, conscience: -8 }, state: { key: 'surrender', v: 'informed', t: 'To Kessler: you named a man you saw desert.' }, rel: { kessler: 8 },
        result: 'A Feldwebel from another company, who went over to the Russians in January. He is in a Soviet camp, or dead. Your words cannot hurt him now. His family, in Kassel, is another matter.' }
    ] });

  // ───────────────────────── Day 1 · 18 February: total war ─────────────────────────
  ev({ id: 'c8f_1m', day: 1, phase: 0, scene: 'hospital', time: '20:00',
    title: 'Total War',
    text: 'The radio in the ward: Goebbels at the Berlin Sportpalast. "I ask you: do you want total war? If necessary, more total and more radical than anything we can even imagine today?" The crowd roars "Ja!" for a long time. The nurses stand in the doorway listening.',
    choices: [
      { text: 'Listen in silence.', effects: { morale: -2 }, result: 'The man with no legs listens with his eyes shut. When it is over he says, "They were not there." Nobody answers.' },
      { text: 'Switch it off.', effects: { suspicion: 6, conscience: 2, morale: 2 }, result: 'You reach up and turn the knob. The ward is silent. A staff doctor in the doorway looks at you, and walks away.' },
      { text: 'Applaud with the radio.', effects: { suspicion: -4, conscience: -2 }, result: 'You clap, alone, in a ward of wounded men. A few of them clap too, after a while.' }
    ] });

  ev({ id: 'c8f_1a', day: 1, phase: 1, scene: 'letter',
    title: 'The Letter',
    text: s => `Your first letter home since December. ${s.flags.married ? 'Liesel thinks you are dead, or a prisoner. The baby is due in three weeks.' : 'Your mother thinks you are dead.'} The censor will read every word.`,
    choices: [
      { text: '"I am alive. That is all I can say."', effects: { morale: 8 }, rel: { mother: 6 }, outcome: (s, x) => { if (s.flags.married) x.rel('liesel', 8); x.say('Six words. They will be read aloud in a kitchen, over and over, by people who have been wearing black for a week.'); } },
      { text: 'Write about the men who did not get out.', effects: { conscience: 4, suspicion: 5, morale: 2 }, rel: { mother: 4 }, result: 'You write their names. The censor blacks out half of them. The letter arrives looking like a ransom note.' }
    ] });

  // ───────────────────────── Day 2 · 10 March: Poltava ─────────────────────────
  ev({ id: 'c8f_2m', day: 2, phase: 0, scene: 'letter', time: '09:00',
    title: 'A Telegram',
    text: s => s.flags.married
      ? 'A telegram, forwarded through three field post offices: a daughter, born on the fourth of March. Mother and child well. Liesel asks what she should be called.'
      : 'A letter from your mother. The neighbours\' son, who was in the Sixth Army, is missing. They ask whether you knew him, whether you saw him. Your mother asks you not to tell them anything that would take away their hope.',
    choices: [
      { text: s => s.flags.married ? '"Call her Hanna."' : 'Write to the neighbours: you did not see him.', effects: { morale: 10 },
        outcome: (s, x) => { if (s.flags.married) { s.flags.daughter = 'Hanna'; x.rel('liesel', 10); x.say('Hanna. You say it out loud in the barrack, and the men pass round the telegram as if it were a photograph.'); } else { x.rel('mother', 4); x.say('A small lie, kindly meant. They will wait for him for twelve years.'); } } },
      { text: s => s.flags.married ? '"Call her Hoffnung, Hope. No: call her whatever you like."' : 'Write to them about the camps, and the radio.', effects: { morale: 6, conscience: 2 },
        outcome: (s, x) => { if (s.flags.married) { s.flags.daughter = 'Liese'; x.rel('liesel', 8); x.say('She calls her Liese, after herself, and writes that the baby has your ears. You sit with that letter for an hour.'); } else { x.apply({ suspicion: 4 }); x.say('You write that many men were taken prisoner, that he may be alive. Your mother writes back that they went to church and lit a candle.'); } } }
    ] });

  ev({ id: 'c8f_2a', day: 2, phase: 1, scene: 'camp', time: '14:00',
    title: 'Replacements',
    text: s => `Discharged, fit for front-line service. The ${ss(s) ? 'division' : 'company'} is being rebuilt from nothing. You are given a ${unit(s)} of replacements: ${men(s).map(m => `${m.name} (${m.age})`).join(', ')}.

They look at you the way you once looked at Brandt. Somebody has told them you were at Stalingrad.`,
    choices: [
      { text: 'Tell them what Stalingrad was.', effects: { conscience: 3 }, squad: { all: { loyalty: 6, morale: -4 } }, train: { leadership: 1 },
        result: 'You tell them about the cellars, the cold, the bread. Rehm looks as if he does not believe a word of it. Kraus writes it all down for his mother, and then tears the page up.' },
      { text: 'Say nothing about it. Train them hard.', effects: { officers: 4, merit: 1 }, squad: { all: { loyalty: 2 } }, train: { leadership: 1 },
        result: 'Grenades, digging, digging, grenades. Lorenz complains that the Luftwaffe never made him dig. You make him dig twice as much.' },
      { text: 'Pick a deputy.', assign: true, assignPrompt: 'Who will be your deputy?',
        outcome: (s, x) => { s.flags.deputy = x.man.id; x.squadMod(x.man.id, { loyalty: 10, morale: 6 }); x.say(`${x.man.name} it is. ${SIM.hasTrait(x.man, 'schemer') ? 'Fink grins. "You won\'t regret it." You think you might.' : SIM.hasTrait(x.man, 'green') ? 'Rehm goes red with pride.' : 'He nods, as if he expected nothing else.'}`); } }
    ] });

  // ───────────────────────── Day 3 · 16 March: Kharkov ─────────────────────────
  ev({ id: 'c8f_3m', day: 3, phase: 0, scene: 'city', time: '10:00',
    title: 'Kharkov',
    text: s => `Kharkov, retaken yesterday by the SS Panzer Corps after three days of street fighting. ${ss(s) ? 'Your division did it. The men are drunk on it.' : 'Your company arrives as the fighting ends.'} The main square has already been renamed in the corps' honour.

From the balconies of a building on the square, bodies hang: "partisans", says a sign. One of them is a woman.`,
    choices: [
      { text: 'Look away and march on.', effects: { morale: -3 }, result: 'Rehm stares at them until Tamás pulls him along by the sleeve.' },
      { text: 'Ask an officer who they were.', effects: { conscience: 3, suspicion: 3 }, result: '"Who cares?" he says. "Russians." Behind him, a soldier is taking a photograph.' },
      { text: '"This is what we are here for," you tell your men.', effects: { conscience: -6, officers: 3 }, squad: { rehm: { loyalty: 6 }, tamas: { loyalty: -6 } }, result: 'Rehm nods hard. Tamás crosses himself and says nothing.' }
    ] });

  ev({ id: 'c8f_3a', day: 3, phase: 1, scene: 'office', time: '16:00',
    title: 'Kessler Returns',
    text: s => `Major Kessler is waiting for you at battalion. "I am following up," he says, opening his briefcase. "Please tell me again, in your own words. How did you leave the pocket?"

${s.statements && s.statements.howOut ? 'On the table between you is the page on which he wrote down what you said in February.' : ''}`,
    choices: [
      { text: 'Tell it exactly as you told it before.', show: s => !!(s.statements && s.statements.howOut),
        outcome: (s, x) => { const said = s.statements.howOut.v; x.state('howOut', said, s.statements.howOut.t);
          if (said === truthOut(s)) { x.rel('kessler', 6); x.say('He compares it, line by line, with his notes. "Consistent," he says. "Thank you." For a moment he looks almost human.'); }
          else { const caught = x.roll(said === 'courier' ? 0.6 : 0.35); if (caught) { s.flags.kesslerCaught = true; x.apply({ suspicion: 22, officers: -8 }); x.rel('kessler', -10); x.say(said === 'courier' ? '"The general you named," Kessler says gently, "has no record of you. He is in a Soviet camp, but his staff officer got out." He closes the file. "I will come back."' : '"I have a report from the Feldgendarmerie at Gumrak," Kessler says, "and the doctor you named does not exist." He closes the file. "I will come back."'); }
            else { x.apply({ suspicion: 4 }); x.say('He reads it through twice, and asks three small questions about times and places. You get them right. "Thank you," he says. You do not breathe until he has gone.'); } } } },
      { text: 'Tell him the truth now.', show: s => !!(s.statements && s.statements.howOut) && s.statements.howOut.v !== truthOut(s),
        outcome: (s, x) => { x.state('howOut', truthOut(s), 'To Kessler, in March: the truth about how you left the pocket.'); x.rel('kessler', 8); x.apply({ suspicion: truthOut(s) === 'forged' ? 25 : 10, conscience: 5 }); s.flags.confessed = truthOut(s) === 'forged'; x.say('"So," he says. "You lied to me in February." He writes for a long time. "A man who corrects himself is not the same as a man who is caught. I will put that in the file."'); } },
      { text: 'Tell a new story.', show: s => !!(s.statements && s.statements.howOut),
        outcome: (s, x) => { x.state('howOut', 'courier', 'To Kessler, in March: you were sent out as a courier.'); x.apply({ suspicion: 18, officers: -6 }); x.rel('kessler', -12); s.flags.kesslerCaught = true; x.say('He listens to the whole thing without interrupting. Then he turns his notebook round so you can read what you told him in February. "Which one," he asks, "is true?"'); } }
    ] });

  // ───────────────────────── Day 4 · 10 April: mud ─────────────────────────
  ev({ id: 'c8f_4m', day: 4, phase: 0, scene: 'village', time: '08:00',
    title: 'Rasputitsa',
    text: 'The spring mud again: roads like porridge, no movement for weeks. The front north of Belgorod is quiet. Rumours: the Führer is planning something big for the summer, against the bulge in the Soviet line around Kursk.',
    choices: [
      { text: 'Train the replacements every day.', effects: { officers: 3, merit: 1 }, squad: { all: { loyalty: 3 } }, train: { leadership: 1 }, set: { trained8: true },
        result: 'Live grenades, fire and movement, digging in under time. By the end of April Rehm can throw a grenade forty metres, and Kraus has stopped flinching.' },
      { text: 'Let Fink organise things.', show: s => has(s, 'fink'), supply: { rations: 2, ammo: 1 }, effects: { suspicion: 3 }, squad: { fink: { loyalty: 8 } },
        result: 'You do not ask. Fink comes back with a crate of tinned sausage, a box of grenades and a bottle of Hennessy. "From the Luftwaffe," he says, "with their compliments."' },
      { text: 'Rest. They will need it.', effects: { health: 8 }, squad: { all: { morale: 8 } },
        result: 'Card games, sleep, a football. Lorenz turns out to be a goalkeeper of genius.' }
    ] });

  ev({ id: 'c8f_4a', day: 4, phase: 1, scene: 'tanks', time: '14:00',
    title: 'The Tigers',
    text: 'A company of the new Tiger tanks arrives: enormous, square, sixty tonnes, an 88 mm gun. The infantry gathers round them as if they were cathedrals. Their commander, a sunburnt Oberleutnant, offers to show your squad how infantry and tanks fight together.',
    choices: [
      { text: 'Train with the Tigers.', set: { tigerDrill: true }, train: { leadership: 1 }, effects: { officers: 2 },
        result: 'Stay behind, never in front. Watch the flanks for the Russian tank-hunters. Do not stand where the tank will reverse. Three days of it, and the men begin to believe in the Tigers.' },
      { text: 'Ask the crew what they think of the new Panthers.', effects: { morale: -2 }, result: '"Broken," says the gunner. "Gearboxes, engines, fires. That\'s why we are waiting." The offensive is postponed again, for the Panthers.' }
    ] });

  // ───────────────────────── Day 5 · 20 April: a village ─────────────────────────
  ev({ id: 'c8f_5m', day: 5, phase: 0, scene: 'village', time: '05:00',
    title: 'The Sweep',
    text: 'An order: an "anti-bandit operation" in the forests behind the line. Partisans have mined the railway. Your company is to search three villages, take every man of military age, and burn any house where weapons are found.\n\nIn the second village, in a barn, Rehm finds a rifle under the hay.',
    choices: [
      { text: 'Burn the house, as ordered.', effects: { conscience: -8, officers: 4 },
        result: 'The family stands in the road and watches. The grandmother does not cry. Rehm holds the torch. His hands are shaking.' },
      { text: 'Report the rifle, but not where you found it.', effects: { conscience: 4, suspicion: 4 }, train: { scrounging: 1 },
        result: '"Found in the woods," you write. The barn stays standing. Rehm looks at you as if you had done something wrong, and then as if you had done something right.' },
      { text: 'Tell Rehm to put it back and forget it.', effects: { conscience: 6, suspicion: 6 }, squad: { rehm: { loyalty: -4 }, tamas: { loyalty: 8 } },
        result: 'Rehm puts it back. That evening he asks you why. You tell him about Białystok. He does not ask again.' }
    ] });

  ev({ id: 'c8f_5a', day: 5, phase: 1, scene: 'camp',
    title: 'The Führer\'s Birthday',
    text: 'The Führer\'s birthday. A parade on a muddy field, a speech by the battalion commander, an extra ration of schnapps and cigarettes. Fink has already sold half of the battalion\'s schnapps to an artillery unit.',
    choices: [
      { text: 'Turn a blind eye and take your share.', items: { schnapps: 1 }, squad: { fink: { loyalty: 6 } }, effects: { suspicion: 2 }, result: 'A bottle appears in your pack. You do not ask how.' },
      { text: 'Make Fink give it back.', effects: { officers: 3 }, squad: { fink: { loyalty: -8 }, all: { morale: -2 } }, result: 'He gives it back, minus "handling costs". He does not forgive you for a week.' }
    ] });

  // ───────────────────────── Day 6 · 15 May: the informer ─────────────────────────
  ev({ id: 'c8f_6m', day: 6, phase: 0, scene: 'office', time: '11:00',
    title: 'An Offer',
    text: s => `Kessler again, in a borrowed farmhouse office. He does not ask about Stalingrad this time. "Your man Fink is selling army property," he says. "I could arrest him. Or you could tell me, now and then, what your men say. About the war, about the Führer. Men who help me are men I do not need to investigate."

${s.flags.kesslerCaught ? 'He taps the file with your February statement in it.' : ''}`,
    choices: [
      { text: 'Accept.', set: { kesslerInformer: true }, rel: { kessler: 15 }, effects: { suspicion: -25, conscience: -10, comrades: -4 },
        result: '"Good," he says. "Nothing dramatic. Just conversation." He closes the file. You walk back to your squad and cannot look at any of them.' },
      { text: 'Refuse.', rel: { kessler: -6 }, effects: { suspicion: 6, conscience: 4 },
        result: '"As you wish," he says, without any change of expression. "I will see you again, I think."' },
      { text: 'Give him Fink, and nothing else.', show: s => has(s, 'fink'), rel: { kessler: 6 }, effects: { suspicion: -12, conscience: -5 },
        outcome: (s, x) => { x.lose('fink', 'gone', 'arrested by the Secret Field Police for black-marketeering'); x.squadMod('all', { loyalty: -10 }); x.say('They arrest Fink the next morning. The men know who talked. Nobody says it.'); } }
    ] });

  ev({ id: 'c8f_6a', day: 6, phase: 1, scene: 'field', time: '15:00',
    title: 'Delay',
    text: 'The offensive is postponed again: June, then July. Through binoculars you can see the Soviets digging, every day, line after line, minefields, anti-tank ditches. A deserter brought in by the patrol says the whole Red Army knows the Germans will attack at Kursk.',
    choices: [
      { text: 'Report what you see, in writing, up the chain.', effects: { officers: -2, conscience: 2, suspicion: 3 }, result: 'Your report goes to battalion. Battalion sends it back with a note: "Pessimism is not reconnaissance."' },
      { text: 'Use the time: dig, train, rest.', effects: { health: 6 }, set: { dugIn: true }, squad: { all: { morale: 4 } }, result: 'The squad digs a position they will never use. It is still the best one in the company.' }
    ] });

  // ───────────────────────── Day 7 · 1 June: mines ─────────────────────────
  ev({ id: 'c8f_7m', day: 7, phase: 0, scene: 'field', time: '01:00',
    title: 'The Minefield',
    text: 'A night patrol into no man\'s land, to map the Soviet minefields. Starlight, long grass, the smell of thyme. Somewhere ahead, under the grass, wooden box mines that a mine detector cannot find.',
    choices: [
      { text: 'Lead the patrol yourself.', effects: { merit: 3, officers: 4 },
        risk: { chance: 0.12, dmg: [12, 40], fatal: 0.3, cause: 'Killed by a mine on patrol before Kursk, June 1943.', hit: 'A click under your knee.', miss: 'Four hours on your belly, probing with a bayonet. Eleven mines marked. You come back soaked with dew and sweat.' } },
      { text: 'Send your best man.', assign: true, assignPrompt: 'Who leads the patrol?',
        outcome: (s, x) => { const m = x.man; if (x.roll(0.75 + (SIM.hasTrait(m, 'steady') ? 0.1 : 0) - (SIM.hasTrait(m, 'green') || SIM.hasTrait(m, 'nervous') ? 0.15 : 0))) { x.apply({ merit: 1 }); x.squadMod(m.id, { morale: 6, loyalty: 4 }); x.say(`${m.name} comes back at dawn with a map of eleven mines.`); } else { x.lose(m.id, x.roll(0.5) ? 'killed' : 'wounded', 'by a mine on patrol'); x.apply({ morale: -6 }); x.say(`A flash in the grass, a bang. ${m.name} does not come back on his own.`); } } }
    ] });

  ev({ id: 'c8f_7a', day: 7, phase: 1, scene: 'letter',
    title: 'Post',
    text: s => `Post. ${s.flags.daughter ? `A photograph of ${s.flags.daughter}: a round, frowning face in a white bonnet.` : 'A parcel from your mother: socks, a cake, a tin of fat.'} And news: the British bombed the Ruhr dams; the floods drowned hundreds. Tamás\'s family in the Banat writes that the Romanians want their sons too.`,
    choices: [
      { text: 'Share the parcel with the squad.', effects: { morale: 6, food: 8 }, squad: { all: { morale: 6, loyalty: 4 } }, result: 'Cake for seven. A small piece each. Kraus says it tastes like his mother\'s, which it does not.' },
      { text: 'Keep it for yourself, and look at it for a long time.', effects: { morale: 10, food: 12 }, result: 'You keep the photograph in your paybook, behind the page with your blood group.' }
    ] });

  // ───────────────────────── Day 8 · 20 June: the verdict ─────────────────────────
  ev({ id: 'c8f_8m', day: 8, phase: 0, scene: 'field', time: '16:00',
    title: 'The Donets',
    text: 'A hot Sunday. The battalion is allowed to swim in the Donets. Two hundred white bodies in brown water, shouting. On the far bank, Ukrainian girls pretend not to look.',
    choices: [
      { text: 'Swim.', effects: { health: 6, morale: 8 }, squad: { all: { morale: 6 } }, result: 'You float on your back and look at the sky. Lorenz does a perfect dive, to everyone\'s astonishment, and loses his trunks.' },
      { text: 'Write letters on the bank, for the men who cannot.', effects: { conscience: 3 }, squad: { all: { loyalty: 6 } }, result: 'Kraus can write, but he asks you to write one for Rehm, who wants to tell a girl in Essen he loves her and does not know how to spell it.' }
    ] });

  ev({ id: 'c8f_8a', day: 8, phase: 1, scene: 'office', time: '18:00',
    title: 'The File',
    text: s => `Kessler, for the last time. "The investigation is concluded," he says. "I have spoken to forty men who were at Gumrak, and to your company clerk, and to the Feldgendarmerie." He opens the file.`,
    choices: [
      { text: 'Wait for the verdict.',
        outcome: (s, x) => {
          const st = s.statements || {}, said = (st.howOut || {}).v, truth = truthOut(s);
          const lied = said && said !== truth;
          if (s.flags.kesslerInformer) { x.say('"In view of your cooperation," Kessler says, "the file is closed." He does not need to say what that means.'); return; }
          if (s.flags.confessed) { s.flags.penal = true; x.apply({ officers: -10 }); x.say('"You told me the truth twice," he says. "So I will tell you mine. The court-martial will sentence you to a probation unit. You go to the front with the next attack. If you survive with honour, the sentence is struck out." He stands. "That is the most I could do. I hope it is enough."'); return; }
          if (s.flags.kesslerCaught || (lied && x.roll(0.25 + (s.flags.changedStory || 0) * 0.2))) { s.flags.penal = true; x.apply({ suspicion: 15, officers: -12 }); x.say('"You lied to me," he says, "and I caught you." The court-martial sits the next week: ten minutes. Probation unit, to be thrown in at the worst point of the attack.'); return; }
          x.apply({ suspicion: -10 }); x.say(lied ? '"No further action," he says. He does not quite believe you, you think, and he does not quite care. He shakes your hand and leaves for Kharkov.' : '"No further action," he says. "You told me the same story four months apart, and it was true. Do you know how rare that is?" He shakes your hand.');
        } }
    ] });

  // ───────────────────────── Day 9 · 4 July: the eve ─────────────────────────
  ev({ id: 'c8f_9m', day: 9, phase: 0, scene: 'field', time: '15:00',
    title: 'The Order of the Day',
    text: s => `The Führer's order of the day, read aloud in every company: "Soldiers! Today you begin a great offensive whose outcome may be decisive for the war. The victory at Kursk must be a beacon to the whole world."${s.flags.penal ? '\n\nYou hear it from the ranks of the probation company, without your rank badges.' : ''}

In the evening, a thunderstorm. The rain turns the start line to mud again.`,
    choices: [
      { text: 'Check every man\'s kit yourself.', set: { kitChecked: true }, supply: { ammo: 1 }, squad: { all: { loyalty: 3 } }, result: 'Water, grenades, field dressings, entrenching tools. Kraus has packed a photograph of his mother in his gas mask tin, in place of the filter. You let him keep it.' },
      { text: 'Talk to Rehm. He is afraid now.', show: s => has(s, 'rehm'), squad: { rehm: { loyalty: 10, morale: 10 } }, result: '"Stay behind me," you tell him. "Do what I do." He nods. He is seventeen years and four months old.' },
      { text: 'Sleep while you can.', effects: { health: 6 }, result: 'You sleep in the rain under a groundsheet. You were at Stalingrad. You can sleep anywhere.' }
    ] });

  // ───────────────────────── Day 10 · 5 July: Citadel ─────────────────────────
  ev({ id: 'c8f_10m', day: 10, phase: 0, scene: 'tanks', time: '04:30',
    title: 'Citadel',
    text: s => `The barrage, then the tanks, and the infantry behind them, into the Soviet minefields. The Soviet guns answer at once: they knew the hour. Smoke, dust, burning tanks, the scream of Stukas overhead.${s.flags.penal ? ' The probation company goes first.' : ''}`,
    choices: [
      { text: 'Go forward behind the Tigers.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: s => (s.flags.penal ? 0.28 : 0.2) - (s.flags.tigerDrill ? 0.05 : 0), dmg: [12, 38], cause: 'Killed on the first day of Operation Citadel, 5 July 1943.', hit: 'A Soviet anti-tank gun fires at the Tiger beside you, and misses it.', miss: 'Behind the steel, through the minefield, into the first trench line. By noon you are two kilometres in.' },
        outcome: (s, x) => { const m = x.casualty(s.flags.tigerDrill ? 0.16 : 0.24, 'on the first day of Citadel'); say(x, m, m => `${m.name} is killed in the minefield.`, m => `${m.name} is wounded in the minefield and crawls back.`); } },
      { text: 'Clear the trenches beside the tanks with grenades.', effects: { merit: 4 }, assault: true, supply: { ammo: -3 },
        risk: { chance: s => s.flags.penal ? 0.3 : 0.22, dmg: [12, 40], cause: 'Killed in the Soviet trenches on the first day of Citadel, July 1943.', hit: 'A Russian comes round the corner of the trench with a spade.', miss: 'Trench by trench, grenade by grenade. The Soviets fight for every metre. You take forty prisoners and lose count of the dead.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'in the Soviet trenches'); say(x, m, m => `${m.name} is killed in the trench.`, m => `${m.name} is wounded in the trench.`); } }
    ] });

  ev({ id: 'c8f_10a', day: 10, phase: 1, scene: 'tanks', time: '15:00',
    title: 'T-34',
    text: 'A Soviet counterattack: T-34s out of the dust, fast, rocking on the uneven ground. One of them crosses your trench line and turns, crushing the trench walls under its tracks. It is ten metres away. You have a magnetic hollow-charge mine.',
    choices: [
      { text: 'Run at it and fix the mine.', effects: { merit: 5, officers: 5 }, assault: true,
        risk: { chance: 0.25, dmg: [15, 45], fatal: 0.25, cause: 'Killed attacking a Soviet tank with a mine at Kursk, July 1943.', hit: 'The hull machine gun swings round.', miss: 'Up out of the trench, three steps, the mine against the hull under the turret, pull the cord, down. A dull, enormous thud. Smoke pours out of the hatches.' },
        outcome: (s, x) => { if (!x.wasHit || s.stats.health > 0) s.flags.tankKill = !x.wasHit || x.roll(0.5); } },
      { text: 'Get your men down and let it pass.', effects: { morale: -3 },
        outcome: (s, x) => { const m = x.casualty(0.2, 'when the T-34 crushed the trench'); say(x, m, m => `${m.name} is crushed when the trench collapses.`, m => `${m.name} is dug out with broken ribs.`); if (!m) x.say('It grinds over the trench and away. A Tiger kills it two hundred metres further on.'); } }
    ] });

  // ───────────────────────── Day 11 · 7 July: the second line ─────────────────────────
  ev({ id: 'c8f_11m', day: 11, phase: 0, scene: 'tanks', time: '06:00',
    title: 'The Pakfront',
    text: 'The second Soviet line, and the third behind it. "Pakfronts": ten, twenty anti-tank guns firing together at one German tank at a time. The new Panthers break down or burn. Heat, thirty degrees, no water, and the dead lying in the corn.',
    choices: [
      { text: 'Lead an attack on the gun line from the flank.', effects: { merit: 4, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.22, dmg: [14, 42], cause: 'Killed attacking a Soviet anti-tank line on the road to Oboyan, July 1943.', hit: 'Machine-gun fire from the covering trench.', miss: 'Through a balka, round the flank, grenades into the gun pits. Three guns silenced. The tanks move on.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'attacking the gun line'); say(x, m, m => `${m.name} is killed at the gun pits.`, m => `${m.name} is wounded at the gun pits.`); } },
      { text: 'Hold where you are and wait for the artillery.', supply: { ammo: -1 },
        outcome: (s, x) => { const m = x.casualty(0.1, 'by shellfire'); say(x, m, m => `${m.name} is killed by a shell while you wait.`, m => `${m.name} is wounded by shell splinters.`); if (!m) x.say('The artillery comes after two hours. Most of the gun line is gone when you go forward. Most.'); } }
    ] });

  ev({ id: 'c8f_11a', day: 11, phase: 1, scene: 'field',
    title: 'The Wounded',
    text: 'The wounded lie in the corn between the lines, German and Soviet, calling for water. The ambulances cannot get through. Your squad has some medical kit.',
    choices: [
      { text: 'Bring them in, under fire.', effects: { conscience: 6, merit: 2 }, supply: { med: -2 }, set: { carriedWounded8: true },
        risk: { chance: 0.12, dmg: [10, 30], cause: 'Killed bringing in the wounded at Kursk, July 1943.', hit: 'A sniper, from the edge of the corn.', miss: 'Four trips. Five men. One of them is a Russian boy with a stomach wound who calls you "mama" until he dies in your trench.' } },
      { text: 'Water only. Crawl out with canteens.', effects: { conscience: 4 }, supply: { rations: -1 },
        result: 'Canteens on a string, crawling. The men drink as if they had never drunk before.' },
      { text: 'Save the kit for your own squad.', effects: { conscience: -4 }, result: 'You listen to them all afternoon. By evening, the calling stops.' }
    ] });

  // ───────────────────────── Day 12 · 12 July: Prokhorovka ─────────────────────────
  ev({ id: 'c8f_12m', day: 12, phase: 0, scene: 'tanks', time: '08:30',
    title: 'Prokhorovka',
    text: s => `Near the railway station of Prokhorovka, the Soviet Fifth Guards Tank Army attacks ${ss(s) ? 'your corps' : 'the SS Panzer Corps on your right'} head-on: hundreds of tanks, at full speed, into the German guns. By noon the field is a lake of burning steel, black smoke to the sky, tank against tank at point-blank range.${ss(s) ? '' : '\n\nYour company holds the flank, and watches.'}`,
    choices: [
      { text: 'Hold your position and fire at the Soviet infantry riding on the tanks.', effects: { merit: 3, officers: 3 }, supply: { ammo: -3 }, assault: true,
        risk: { chance: 0.2, dmg: [14, 42], cause: 'Killed at Prokhorovka, 12 July 1943.', hit: 'A T-34 turns towards your trench.', miss: 'You fire until the barrel smokes. The Soviet infantry falls off the tanks like ripe fruit. The tanks come on without them.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'at Prokhorovka'); say(x, m, m => `${m.name} is killed at Prokhorovka.`, m => `${m.name} is wounded at Prokhorovka.`); } },
      { text: 'Pull your men back into the balka and survive.', effects: { officers: -3 }, squad: { all: { loyalty: 4 } },
        outcome: (s, x) => { const m = x.casualty(0.08, 'at Prokhorovka'); say(x, m, m => `${m.name} is killed by a stray shell in the balka.`, m => `${m.name} is wounded by a stray shell.`); if (!m) x.say('Down into the ravine, heads down, while the world burns above you. Nobody asks you about it afterwards. Nobody is asking anything.'); } }
    ] });

  ev({ id: 'c8f_12a', day: 12, phase: 1, scene: 'tanks', time: '19:00',
    title: 'The Burning Field',
    text: 'Evening over the battlefield. Hundreds of wrecks, many still burning. A Soviet tank crewman crawls out of a burning T-34 thirty metres from your trench, his overalls on fire, and rolls in the dust. He is screaming.',
    choices: [
      { text: 'Go out and put out the flames.', effects: { conscience: 8, health: -4 },
        result: 'You beat at him with your jacket until the flames are out. He looks at you. He is no older than Rehm. You give him water, and later the medics take him back as a prisoner.' },
      { text: 'Shoot him. It is a mercy.', effects: { conscience: -3, morale: -4 },
        result: 'One shot. The screaming stops. Rehm looks at you, and then at the field, and is sick.' },
      { text: 'Do nothing.', effects: { conscience: -5, morale: -6 },
        result: 'He screams for a long time. Then he stops.' }
    ] });

  // ───────────────────────── Day 13 · 17 July: called off ─────────────────────────
  ev({ id: 'c8f_13m', day: 13, phase: 0, scene: 'tanks', time: '06:00',
    title: 'Called Off',
    text: s => `The Allies have landed in Sicily. The Soviets have attacked at Orel, in the north. Citadel is called off. ${ss(s) ? 'The SS divisions are pulled out to be sent to Italy.' : 'The divisions that went forward are ordered back to their start lines.'} Everything you took, you give back.

Your ${unit(s)}: ${men(s).length ? men(s).map(m => m.name.split(' ')[0]).join(', ') : 'nobody left'}. The rearguard needs a squad.`,
    choices: [
      { text: 'Volunteer for the rearguard.', effects: { merit: 3, officers: 5 }, assault: true,
        risk: { chance: s => s.flags.penal ? 0.24 : 0.18, dmg: [12, 40], cause: 'Killed in the rearguard as the Germans fell back from Kursk, July 1943.', hit: 'The Soviets come faster than anyone expected.', miss: 'Twelve hours in a village on a hill, while the battalion pulls back through you. Then you run.' },
        outcome: (s, x) => { if (s.flags.penal) { s.flags.penalCleared = true; x.say('The probation company commander writes your name on a short list: sentence served with honour.'); } } },
      { text: 'Get your men back in one piece.', squad: { all: { loyalty: 6 } },
        outcome: (s, x) => { const m = x.casualty(0.08, 'in the retreat from Kursk'); say(x, m, m => `${m.name} is killed in the retreat.`, m => `${m.name} is wounded in the retreat.`); if (!m) x.say('Back through the corn, over the ground you took a week ago, past the wrecks. Everyone you brought out is alive.'); } }
    ] });

  SIM.EVENTS.push(...E);
})();
