// Chapter VII, part 2: the pocket (days 7–12), random events and endings.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, unit, say } = SIM.ch7;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 6 }, o));
  const men = s => SIM.squadMen(s).length;
  const starckSeat = s => (s.rel && s.rel.starck || 0) >= (ss(s) ? 20 : 35);

  // ───────────────────────── Day 7 · Monday 23 November ─────────────────────────
  ev({ id: 'c7_7m', day: 7, phase: 0, scene: 'ruins', time: '09:00',
    title: 'The Ring Closes',
    text: 'At four in the afternoon yesterday, the two Soviet spearheads met at Kalach, on the Don. The Sixth Army is surrounded: twenty divisions, three hundred thousand men, in a pocket fifty kilometres wide.\n\nThe order comes down from the Führer himself: the Sixth Army will hold its positions. It is now "Fortress Stalingrad". It will be supplied from the air. Göring has promised it.',
    choices: [
      { text: '"The Führer will get us out. He has never abandoned an army."', effects: { morale: 8 }, rel: { starck: 2 }, shelter: 1,
        result: 'Most of the men believe it. You need them to believe it. Perhaps you need to believe it yourself.' },
      { text: '"We should break out now, while we still have fuel and strength."', effects: { conscience: 3, suspicion: 4, officers: 2 }, shelter: 1,
        result: 'Half the generals in the pocket are saying the same, you will learn later. Paulus asks for permission. It is refused.' },
      { text: 'Take stock: every cartridge, every crust. Then ration it.', train: { leadership: 1 }, supply: { rations: 1 }, set: { rationed: true }, shelter: 1,
        result: 'You count it all on a groundsheet in the cellar. Then you divide the bread with a ruler. Nobody laughs. They watch the ruler.' }
    ] });

  ev({ id: 'c7_7a', day: 7, phase: 1, scene: 'field',
    title: 'The Horses',
    text: 'The division\'s horses are being slaughtered: there is no fodder in the pocket, and there will be no fodder again. Tens of thousands of them. The snow behind the artillery lines is red and steaming.\n\nAt first only the veterinary companies are allowed to take meat. By evening it is every man for himself.',
    choices: [
      { text: 'Get horsemeat for the squad. As much as you can carry.', supply: { rations: 3 }, effects: { health: -3 }, train: { scrounging: 1 },
        result: 'You come back at dusk with a haunch on a sledge, frozen hard as wood. Boiled with salt, it is the best thing anyone has eaten in a week.' },
      { text: 'Take only your share, and give the rest to the field hospital.', supply: { rations: 1 }, effects: { conscience: 5 },
        result: 'The cook at the dressing station makes soup for two hundred wounded men out of what you bring. It is very thin soup.' },
      { text: 'Let Grischa handle it.', show: s => has(s, 'grischa'), supply: { rations: 4 }, squad: { grischa: { loyalty: 6, morale: 6 } },
        result: 'Grischa grew up on a kolkhoz. He uses everything: blood sausage, liver, bones for broth, fat for the boots. "In Ukraine in 1933," he says, "we would have killed for one horse." He does not explain, and nobody asks.' }
    ] });

  // ───────────────────────── Day 8 · Saturday 12 December ─────────────────────────
  ev({ id: 'c7_8m', day: 8, phase: 0, scene: 'field', time: '06:00',
    title: 'Winter Storm',
    text: 'News flies through the pocket like a fever: Manstein\'s panzers are attacking from the south to break through to the Sixth Army. Operation Winter Storm. On clear nights, men swear they can hear the guns, sixty kilometres away.\n\n"Hold on," says the leaflet from army headquarters. "Manstein is coming."',
    choices: [
      { text: 'Tell the men help is coming.', squad: { all: { morale: 10 } }, effects: { morale: 5 },
        result: 'For a week the squad lives on it. They talk about Christmas in Germany. Some of them pack their kit.' },
      { text: 'Prepare to break out towards him: hoard fuel, ammunition, food.', supply: { ammo: 1, rations: 1 }, set: { readyBreak: true }, train: { scrounging: 1 },
        result: 'Everything that might matter on a march across sixty kilometres of snow, you hide in the cellar. The order to break out never comes. But you are ready.' },
      { text: 'Keep your hopes to yourself.', effects: { morale: -2, conscience: 1 },
        result: 'You have seen too many maps. Sixty kilometres of snow, and no fuel. You say nothing, and wait.' }
    ] });

  ev({ id: 'c7_8a', day: 8, phase: 1, scene: 'field',
    title: 'The Canister',
    text: 'A Heinkel comes over low in the grey afternoon and drops its supply canisters. One of them drifts on its parachute and lands in no man\'s land, eighty metres out, on the open snow. The Soviets have seen it too.',
    choices: [
      { text: 'Crawl out and get it yourself.', effects: { merit: 2 },
        risk: { chance: 0.14, dmg: [12, 35], cause: 'Killed in no man\'s land at Stalingrad, recovering a supply canister, December 1942.', hit: 'Halfway back, dragging the canister, a burst from the Soviet line.', miss: 'Eighty metres on your belly, eighty back with the canister on a rope. You lie in the trench, shaking, while the others open it.' },
        outcome: (s, x) => { x.supply('rations', 2); x.supply('ammo', 1); x.supply('med', 1); if (x.roll(0.25)) x.say('Inside, between the bread, someone in Germany has packed a crate of condoms and a box of pepper. The men laugh until they cry.'); } },
      { text: 'Send a man.', assign: true, assignPrompt: 'Who goes out for the canister?',
        outcome: (s, x) => { const m = x.man; if (x.roll(0.65 + (SIM.hasTrait(m, 'brave') ? 0.1 : 0) - (SIM.hasTrait(m, 'green') ? 0.15 : 0))) { x.supply('rations', 2); x.supply('ammo', 1); x.supply('med', 1); x.squadMod(m.id, { morale: 6, loyalty: 3 }); x.say(`${m.name} brings it in. Bread, tinned meat, a box of dressings.`); } else { x.lose(m.id, x.roll(0.6) ? 'killed' : 'wounded', 'recovering a supply canister'); x.apply({ morale: -6 }); x.say(`${m.name} is hit on the way back. The canister lies in the snow until the Soviets take it at night.`); } } },
      { text: 'Leave it. It is not worth a man.', effects: { morale: -2 }, squad: { all: { loyalty: 3 } },
        result: 'At night the Soviets take it. In the morning you hear them on the far side, laughing, eating German bread.' }
    ] });

  ev({ id: 'c7_8n', day: 8, phase: 2, scene: 'ruins', time: '21:00',
    title: 'Chained Dogs',
    cond: s => men(s) > 0,
    text: s => `The Feldgendarmerie, the military police with the metal gorgets that the men call "chained dogs", have caught ${SIM.squadMen(s)[0].name} taking bread from a supply dump. In the pocket, looting army stores is punishable by death. Yesterday they hanged a man from a lamp post by the station with a sign round his neck: "I am a plunderer."

The Feldwebel wants ${SIM.squadMen(s)[0].name.split(' ')[0]}. He looks at you.`,
    choices: [
      { text: '"He was on my orders. Take me instead."', effects: { officers: -6, suspicion: 6, conscience: 6 }, squad: { all: { loyalty: 8 } },
        outcome: (s, x) => { x.squadMod(SIM.squadMen(s)[0].id, { loyalty: 15 }); if (x.roll(0.75)) x.say('The Feldwebel looks at you for a long time. Then he writes something in his notebook and lets you both go. "Next time," he says, "I will not ask."'); else { x.apply({ health: -12, morale: -6 }); x.say('They take you to the cellar of their headquarters and beat you with a rifle butt, then let you go at dawn. Your man is free.'); } } },
      { text: 'Bribe them.', req: s => SIM.has(s, 'cigarettes') || s.marks >= 20, reqText: 'You need cigarettes or 20 RM.', effects: { suspicion: 2 },
        outcome: (s, x) => { if (SIM.has(s, 'cigarettes')) x.item('cigarettes', -1); else x.apply({ marks: -20 }); x.squadMod(SIM.squadMen(s)[0].id, { loyalty: 10 }); x.say('In the pocket, even chained dogs are hungry. They take the bribe and go.'); } },
      { text: 'Let them take him.', effects: { conscience: -8, officers: 3 }, squad: { all: { loyalty: -10 } },
        outcome: (s, x) => { const m = SIM.squadMen(s)[0]; x.lose(m.id, 'killed', 'by the Feldgendarmerie, for looting'); x.say(`They take ${m.name} away. In the morning he is hanging from the lamp post by the station. Your men do not look at you.`); } }
    ] });

  // ───────────────────────── Day 9 · Thursday 24 December ─────────────────────────
  ev({ id: 'c7_9m', day: 9, phase: 0, scene: 'letter', time: '10:00',
    title: 'The Last Mail',
    text: s => `Manstein has been stopped, forty-eight kilometres away. Nobody says it, but everyone knows.

A plane will take mail out today. It may be the last. Each man may write one letter. ${s.flags.married ? 'Liesel\'s last letter is in your breast pocket: the baby is due in March.' : 'Your mother\'s last letter is in your breast pocket.'}`,
    choices: [
      { text: 'Write the truth: hunger, cold, and that you may not come home.', effects: { conscience: 4, suspicion: 5, morale: 4 }, rel: { mother: 6 }, set: { truthLetter: true },
        result: 'You write it small and plainly. Later you will learn that army censors opened thousands of the last letters from Stalingrad to measure the army\'s morale. Yours is in a sack somewhere in Berlin.' },
      { text: 'Write that you are well, and that it is Christmas.', effects: { morale: 6 }, rel: { mother: 3 },
        outcome: (s, x) => { if (s.flags.married) x.rel('liesel', 6); x.say('"Dear ones. We have a little tree in the bunker. Don\'t worry about me." You write it in your best handwriting. Then you sit and look at it for a long time.'); } },
      { text: 'Help the men who cannot write.', effects: { conscience: 3 }, squad: { all: { loyalty: 6 } }, train: { leadership: 1 },
        result: s => `You write for the ones whose hands are frostbitten, and for ${has(s, 'grischa') ? 'Grischa, who has no one to write to and asks you to write one line to "anyone in Poltava", which you do, knowing it will never go' : 'the ones who do not know how to say it'}.` }
    ] });

  ev({ id: 'c7_9a', day: 9, phase: 1, scene: 'cellar', time: '17:00',
    title: 'The Madonna',
    text: 'Word goes round the bunkers: a battalion doctor has drawn a Madonna in charcoal on the back of a captured Russian map and hung it in his dugout. Mother and child, wrapped in a great cloak. Around the edge he has written: "Light, Life, Love." Men are walking a kilometre through the snow to see it.',
    choices: [
      { text: 'Go and see it.', effects: { morale: 10, conscience: 3, warmth: -6 },
        result: 'A dugout with a candle. The Madonna is calm and dark and enormous. A Landser beside you, a man with frostbitten ears, is crying without a sound. You stand there until someone needs your place.' },
      { text: 'Hold Christmas in the cellar: a candle, a song, the last of the bread.', supply: { rations: -1 }, squad: { all: { morale: 12, loyalty: 4 } }, effects: { morale: 6 },
        result: s => `A candle stub on an ammunition box, a branch of something that might be pine. "Silent Night", sung very quietly, in case the Russians hear.${has(s, 'grischa') ? ' Grischa does not know the words. He hums. Afterwards he says that Orthodox Christmas is not until the seventh of January. "Maybe," he says, "I will have two this year."' : ''}` },
      { text: 'Stand guard so the others can celebrate.', effects: { officers: 2, warmth: -8 }, squad: { all: { morale: 6, loyalty: 6 } },
        result: 'You stand in the snow and listen to them singing in the cellar. Across no man\'s land, someone is singing too.' }
    ] });

  ev({ id: 'c7_9n', day: 9, phase: 2, scene: 'ruins', time: '23:00',
    title: 'Every Seven Seconds',
    text: 'At midnight the Soviet loudspeakers start up across the ruins: a tango, then a ticking clock. Then a voice in German. "Every seven seconds a German soldier dies in Russia. Stalingrad is a mass grave." Tick. Tick. Tick. "Come over. You will be well treated. You will be fed."\n\nIn the morning, one of the men has a Soviet leaflet in his pocket: a safe-conduct pass.',
    choices: [
      { text: 'Tell him to keep it. You may all need one.', effects: { conscience: 2, suspicion: 4 }, set: { keptPass: true },
        result: 'He folds it small and puts it inside his boot. Nobody says anything. Later, three other men have one too.' },
      { text: 'Burn it, and the others.', effects: { officers: 2, morale: -2 }, rel: { starck: 2 },
        result: 'You burn it in the stove. It gives a little heat, for a moment.' }
    ] });

  // ───────────────────────── Day 10 · Sunday 17 January ─────────────────────────
  ev({ id: 'c7_10m', day: 10, phase: 0, scene: 'field', time: '05:00',
    title: 'Operation Ring',
    text: 'The Soviets attacked a week ago, from the west, with everything. The pocket is collapsing like a sack. Pitomnik airfield fell yesterday. The army is falling back across the open steppe towards Gumrak and the city: men pulling sledges of wounded through the snow, abandoned guns, frozen bodies along the road like milestones.\n\nYour company is the rearguard.',
    choices: [
      { text: 'Hold the rearguard until the column is through.', shelter: 0, effects: { merit: 3, officers: 5 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.2, dmg: [12, 38], cause: 'Killed in the rearguard on the steppe near Pitomnik, January 1943.', hit: 'The T-34s come out of the snow haze.', miss: 'You hold the balka for six hours. When you pull out the steppe behind you is black with Soviet infantry.' },
        outcome: (s, x) => { const m = x.casualty(0.26, 'in the rearguard near Pitomnik'); say(x, m, m => `${m.name} is left behind in the balka.`, m => `${m.name} is wounded and goes on the sledge with the others.`); } },
      { text: 'Pull the wounded on sledges yourself.', shelter: 0, effects: { health: -10, conscience: 6, warmth: -8 }, set: { carriedWounded7: true },
        risk: { chance: 0.08, dmg: [10, 25], cause: 'Killed by Soviet aircraft on the road to Gumrak, January 1943.', hit: 'A Soviet fighter strafes the column.', miss: 'Twenty kilometres with a sledge rope over your shoulder. Two men on the sledge. One of them is alive when you reach Gumrak.' } },
      { text: 'Retreat as fast as you can. Save your own men.', shelter: 0, effects: { conscience: -4 }, squad: { all: { morale: 4 } },
        outcome: (s, x) => { const m = x.casualty(0.1, 'on the road to Gumrak'); say(x, m, m => `${m.name} falls in the snow and does not get up.`, m => `${m.name} collapses from exhaustion and is put on a sledge.`); if (!m) x.say('You leave the road and go straight across the snow. You reach Gumrak before the column. Nobody asks how.'); } }
    ] });

  ev({ id: 'c7_10a', day: 10, phase: 1, scene: 'cellar',
    title: 'Two Hundred Grams',
    text: 'An order from army headquarters: the daily ration for fighting troops is now two hundred grams of bread. The wounded and the sick are no longer to be fed. Bread is for those who can still hold a rifle.',
    choices: [
      { text: 'Keep feeding your own wounded and sick. Every man gets an equal share.', supply: { rations: -2 }, effects: { conscience: 8, health: -4 }, squad: { all: { loyalty: 8 } },
        result: 'You divide it with the ruler, the same for every man, standing or lying. The order says otherwise. You do not care what the order says.' },
      { text: 'Follow the order.', effects: { conscience: -5, officers: 2 },
        result: 'The wounded in the cellar watch the bread go past them. Nobody complains. They are too weak to complain.' },
      { text: 'Give your own bread to the weakest man.', effects: { food: -15, conscience: 6, health: -5 }, squad: { all: { morale: 6, loyalty: 10 } },
        result: 'You give it to the youngest, who has stopped talking. He eats it slowly, and looks at you as if you were mad.' }
    ] });

  ev({ id: 'c7_10n', day: 10, phase: 2, scene: 'cellar', time: '22:00',
    title: 'Starck',
    text: s => `Starck finds you in the night, gaunt, his fur collar matted, but shaved. Always shaved.

"Gumrak is the last airfield," he says. "In a few days it will be gone. The planes take wounded, and specialists, and men with the right papers." He looks at you. ${starckSeat(s) ? '"I have a seat for you. You are worth more to Germany alive. Be at the airfield in the morning."' : '"I can do nothing for you. You understand. I have my orders, you have yours."'}`,
    choices: [
      { text: s => starckSeat(s) ? '"Thank you, Herr Hauptsturmführer."' : '"I understand."', set: { starckOffer: true },
        outcome: (s, x) => { if (!starckSeat(s)) s.flags.starckOffer = false; x.say(starckSeat(s) ? 'He nods once and goes out into the snow.' : 'He nods once and goes out into the snow. You realise he has not offered you his hand.'); } },
      { text: '"And you? Are you going?"', rel: { starck: 2 },
        outcome: (s, x) => { s.flags.starckOffer = starckSeat(s); x.say('"I am staying," he says, as if it were obvious. "Someone has to show them how a German dies." You believe him. That is the worst of it.'); } }
    ] });

  // ───────────────────────── Day 11 · Friday 22 January ─────────────────────────
  ev({ id: 'c7_11m', day: 11, phase: 0, scene: 'airfield', time: '07:00',
    title: 'The Last Planes',
    text: s => `Gumrak airfield: a strip of trampled snow among wrecked aircraft, under Soviet artillery fire. Thousands of wounded men lie around it in the open, waiting. When a Junkers lands, they rush it. The Feldgendarmerie fire over their heads, and sometimes not over their heads.

Today, perhaps, the last planes will leave.${s.stats.health < 40 ? '\n\nYou are wounded yourself. You have a right to a place in the line.' : ''}`,
    choices: [
      { text: 'Take the seat Starck arranged for you.', show: s => !!s.flags.starckOffer, effects: { conscience: -4 },
        outcome: (s, x) => { s.flags.flown = 'starck'; if (x.roll(0.07)) { x.apply({ health: -300 }); s.deathCause = 'Killed when your transport plane was shot down leaving the Stalingrad pocket, January 1943.'; return; } x.say('The Junkers bounces down the strip and lifts. Through the little window, the pocket: a white plain, smoke, black dots. Then cloud.'); x.end('st_flown'); } },
      { text: 'Give Starck\'s seat to one of your wounded men.', show: s => !!s.flags.starckOffer && men(s) > 0, effects: { conscience: 10, morale: 6 }, squad: { all: { loyalty: 12 } },
        outcome: (s, x) => { const m = SIM.squadMen(s).slice().sort((a, b) => a.morale - b.morale)[0]; x.lose(m.id, 'evacuated', 'on the last plane from Gumrak'); x.rel('starck', -10); s.flags.gaveSeat = m.name; x.say(`You put ${m.name} on the plane with Starck's pass. He does not understand at first. Then he does. The plane lifts into the cloud. Starck, when he hears, will not speak to you again.`); } },
      { text: 'Get in the line of wounded.', show: s => s.stats.health < 40,
        outcome: (s, x) => { if (x.roll(0.35)) { s.flags.flown = 'wounded'; x.say('A doctor looks at your wound, writes on your tag, and points. You are carried up the ramp into a Junkers full of moaning men. You do not remember the take-off.'); x.end('st_flown'); } else x.say('Eight hours in the snow. Two planes land; neither has room. At dusk the shelling starts, and the line breaks up.'); } },
      { text: 'Forge a wound tag and get on a plane.', show: s => SIM.skill(s, 'scrounging') >= 2, effects: { conscience: -8 },
        outcome: (s, x) => { if (x.roll(0.12)) { x.apply({ health: -300 }); s.deathCause = 'Shot by the Feldgendarmerie at Gumrak airfield for trying to board a plane with a forged wound tag, January 1943.'; return; } if (x.roll(0.4)) { s.flags.flown = 'forged'; s.flags.forgedTag = true; x.say('A wound tag from a dead man, your bandaged arm, a confident stare. The Feldgendarm waves you through. On the plane, a man with no legs looks at your arm and turns his face to the wall.'); x.end('st_flown'); } else x.say('The Feldgendarm reads your tag, looks at your arm, and tears it off. "Back to your unit." He does not shoot you. You will never know why.'); } },
      { text: 'Carry wounded men to the planes. Then go back to your unit.', effects: { conscience: 6, health: -6, merit: 2 }, set: { carriedWounded7: true },
        risk: { chance: 0.12, dmg: [12, 32], cause: 'Killed by shellfire at Gumrak airfield, January 1943.', hit: 'A shell lands among the stretchers.', miss: 'Six trips across the airfield under shellfire, two men to a stretcher. Six men flown out. You go back to your squad.' } }
    ] });

  ev({ id: 'c7_11a', day: 11, phase: 1, scene: 'ruins',
    title: 'Grischa',
    cond: s => has(s, 'grischa'),
    text: s => `Grischa comes to you in the evening. The rumour is everywhere: when the Soviets take the city, they will take the Hiwis, the tens of thousands of Russians and Ukrainians who worked for the Germans, and shoot them.

"I know what I am to them," he says quietly. "A traitor." He looks at you. "What do I do, ${ss(s) ? 'Unterscharführer' : 'Unteroffizier'}?"`,
    choices: [
      { text: 'Give him a dead German\'s uniform and paybook.', effects: { conscience: 6, suspicion: 4 }, set: { grischaPapers: true }, squad: { grischa: { loyalty: 20 } },
        result: 'Gefreiter Johann Weber, from Danzig, killed at Pitomnik. Grischa learns the name and the birthday by heart, in the dark. "Danzig," he says. "Where is Danzig?"' },
      { text: 'Tell him to go. Disappear among the civilians in the ruins.', effects: { conscience: 4 },
        outcome: (s, x) => { x.lose('grischa', 'gone', 'into the ruins of Stalingrad'); s.flags.grischaGone = true; x.say('He takes off the German tunic and puts on a civilian coat from a dead man. He shakes your hand. "Maybe after the war," he says, in Russian, and is gone into the snow.'); } },
      { text: '"Stay with us. We will say you are one of ours."', squad: { grischa: { loyalty: 10 } }, set: { grischaStays: true },
        result: '"One of yours," he says, and smiles for the first time in weeks. You both know it will not work. Neither of you says it.' }
    ] });
  ev({ id: 'c7_11a_alt', day: 11, phase: 1, scene: 'ruins',
    title: 'The Hospital',
    text: 'The field hospital at Gumrak: a ruined barracks, packed to the walls with wounded, and when there is no more room inside, they lie in the snow outside, under blankets that are white with frost. A medical orderly is going along the rows checking who is still breathing.',
    choices: [
      { text: 'Give the orderly your medical kit.', supply: { med: -2 }, effects: { conscience: 6 }, result: 'He takes it without a word and goes back to work.' },
      { text: 'Walk on.', effects: { morale: -4 }, result: 'You walk on. There is nothing you could do here that would make any difference. You tell yourself that all evening.' }
    ] });

  ev({ id: 'c7_11n', day: 11, phase: 2, scene: 'ruins', time: '22:00',
    title: 'Into the City',
    text: 'Gumrak falls in the night. The last plane, it is said, left in the dark with the wounded hanging on to its tail. What is left of the Sixth Army withdraws into the ruins of the city: a hundred thousand starving men in the cellars of Stalingrad, without heat, without food, waiting.',
    choices: [
      { text: 'Lead your men into the city.', squad: { all: { loyalty: 4 } }, shelter: 1,
        result: 'A cellar near the Red Square, under the ruins of the Univermag department store. It has a stove. There are already forty men in it.' },
      { text: 'Burn your papers and photographs.', effects: { morale: -4, conscience: 2 }, set: { burnedPapers: true },
        result: s => `You burn the letters one by one${s.flags.married ? ', Liesel\'s last' : ''}. If you are taken, you do not want the Russians to read them. You keep one photograph.` }
    ] });

  // ───────────────────────── Day 12 · Sunday 31 January ─────────────────────────
  ev({ id: 'c7_12m', day: 12, phase: 0, scene: 'cellar', time: '06:00',
    title: 'Field Marshal',
    text: 'Last night, the radio: the Führer has promoted General Paulus to field marshal. No German field marshal has ever surrendered. Everyone in the cellar understands what the promotion means. It means: shoot yourself.\n\nAt dawn, Soviet tanks are in the Red Square above your cellar.',
    choices: [
      { text: 'Hold the entrance to the end of the ammunition.', show: s => s.supplies.ammo > 0, assault: true, effects: { merit: 2 }, supply: { ammo: -3 },
        risk: { chance: 0.2, dmg: [14, 40], cause: 'Killed in the last hours of the Battle of Stalingrad, 31 January 1943.', hit: 'A grenade bounces down the cellar stairs.', miss: 'You hold the stairs until the last belt is gone. Then there is silence.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'in the last hours of the battle'); say(x, m, m => `${m.name} is killed on the cellar stairs, the last of your men to die in the battle.`, m => `${m.name} is wounded on the stairs.`); } },
      { text: 'Destroy the weapons. It is over.', effects: { conscience: 3, officers: -2 },
        result: 'You take the bolts out of the rifles and throw them into the latrine. The machine gun you smash with a brick. It takes a long time. Your hands are very weak.' },
      { text: 'Share out the very last of the food.', show: s => s.supplies.rations > 0, effects: { food: 15, morale: 4 }, squad: { all: { morale: 8 } },
        outcome: (s, x) => { x.supply('rations', -s.supplies.rations); x.say('A tin of meat, half a loaf, a handful of horse fat. Everything. Each man gets two mouthfuls.'); } }
    ] });

  ev({ id: 'c7_12a', day: 12, phase: 1, scene: 'cellar', time: '09:00',
    title: 'The White Flag',
    text: s => `A Soviet officer appears at the top of the stairs with a white flag and a megaphone. "Germans! It is finished. Paulus has surrendered. Come out with your hands up." Above you, you hear the first men going up.

${ss(s) ? 'You have black collar patches. The Soviets shoot SS men. Everyone knows it. ' : ''}${s.flags.starckOffer === false || s.flags.gaveSeat ? 'Starck is somewhere in the ruins with a pistol and one round. ' : ''}What is left of your ${unit(s)} looks at you: ${SIM.squadMen(s).length ? SIM.squadMen(s).map(m => m.name.split(' ')[0]).join(', ') : 'nobody. You are alone with strangers'}.`,
    choices: [
      { text: 'Go up together, with your hands raised.', set: { captive: true },
        outcome: (s, x) => {
          if (ss(s) && !s.flags.burnedPapers && x.roll(0.2)) { x.apply({ health: -300 }); s.deathCause = 'Shot by Soviet soldiers at Stalingrad after surrendering, 31 January 1943. They saw the SS runes in your paybook.'; return; }
          if (x.roll(0.03)) { x.apply({ health: -300 }); s.deathCause = 'Shot at the top of the cellar stairs while surrendering at Stalingrad, 31 January 1943.'; return; }
          x.say('Up into the light. A Soviet soldier no older than you takes your watch and your gloves. Then he gives you a cigarette. It is over.');
        } },
      { text: 'Break out to the west. Alone, at night, across two hundred kilometres of snow.',
        outcome: (s, x) => {
          const p = 0.15 + (s.flags.readyBreak ? 0.08 : 0) + (s.stats.health > 50 ? 0.05 : 0) + (SIM.has(s, 'valenki') ? 0.04 : 0);
          const r = Math.random();
          if (r < p) { s.flags.brokeOut = true; x.say('You go up through a shell hole at dusk and walk west. You walk for nineteen nights.'); return; }
          if (r < p + 0.3) { x.apply({ health: -300 }); s.deathCause = 'Died trying to break out of the Stalingrad pocket, February 1943. Nobody found your body.'; return; }
          s.flags.captive = true; x.say('On the third night, a Soviet patrol finds you asleep in a haystack. You are too weak to resist, and they are too tired to shoot you.');
        } },
      { text: 'Fight. You will not surrender.', effects: { merit: 2 },
        outcome: (s, x) => {
          if (x.roll(0.4)) { x.apply({ health: -300 }); s.deathCause = 'Killed fighting to the last in the ruins of Stalingrad, 31 January 1943.'; return; }
          s.flags.captive = true; x.apply({ health: -20 }); x.say('You fire until the magazine is empty. Then a rifle butt, and darkness. You wake up on the snow, in a column of prisoners, with your head bleeding.');
        } }
    ] });

  SIM.EVENTS.push(...E);

  // ───────────────────────── Random events (nights) ─────────────────────────
  const pocket = s => s.chapter === 6 && !!SIM.today(s).pocket;
  const before = s => s.chapter === 6 && !SIM.today(s).pocket;
  SIM.POOL.push(
    { id: 'st_katyusha', chapters: [6], phases: [2], cond: before, scene: 'steppe',
      title: 'Stalin\'s Organ',
      text: 'A sound like tearing canvas, and the night sky fills with streaks of fire: Katyusha rockets, sixteen at a time, from the far side of the Volga.',
      choices: [
        { text: 'Dig deeper.', effects: { health: -2 }, set: { dugIn: true }, result: 'You dig until your hands bleed. When the next salvo comes, you are a metre down.' },
        { text: 'Sleep through it. You are too tired to care.', effects: { health: 4 },
          risk: { chance: 0.06, dmg: [10, 28], cause: 'Killed by a Katyusha salvo at Stalingrad, 1942.', hit: 'You wake up in the air.', miss: 'You sleep. In the morning there is a crater twenty metres from where you lay.' } }
      ] },
    { id: 'st_dust', chapters: [6], phases: [2], cond: s => before(s) && SIM.today(s).temp > 20, scene: 'steppe',
      title: 'Dust',
      text: 'The steppe at night: hot wind, dust in your teeth, the smell of burning wheat. Somewhere, a man is singing in Russian.',
      choices: [
        { text: 'Listen.', effects: { morale: 4 }, result: 'It is a slow song, very sad. Grischa, if he is there, mouths the words.' },
        { text: 'Clean your rifle. Dust gets into everything.', supply: { ammo: 1 }, effects: { officers: 1 }, result: 'An hour with an oily rag. In the morning it fires.' }
      ] },
    { id: 'st_lice', chapters: [6], phases: [2], cond: pocket, scene: 'cellar',
      title: 'Lice',
      text: 'The lice. In the cold they stay close to the body; in the warm cellar they wake up and crawl. Men scratch until they bleed. Typhus comes with lice.',
      choices: [
        { text: 'Strip and burn them out over the stove.', effects: { health: 4, warmth: -6 }, result: 'Naked in a cellar in January, holding your shirt seams over a candle. The lice pop. It helps, for a day.' },
        { text: 'Ignore them.', effects: { health: -4, morale: -2 }, result: 'You stop noticing. That is a bad sign.' }
      ] },
    { id: 'st_leaflet', chapters: [6], phases: [2], cond: pocket, scene: 'field',
      title: 'The Leaflet',
      text: 'Soviet leaflets drift down on the pocket like snow. "German soldiers! Your situation is hopeless. Surrender and you will receive food, warmth, medical care, and return home after the war."',
      choices: [
        { text: 'Keep one, folded small.', effects: { suspicion: 4 }, set: { keptPass: true }, result: 'You fold it into your boot. Nobody saw. You think.' },
        { text: 'Use it to light the stove.', effects: { warmth: 3 }, result: 'It burns well. Soviet paper is good paper.' }
      ] },
    { id: 'st_dead', chapters: [6], phases: [2], cond: pocket, scene: 'field',
      title: 'The Wall',
      text: 'The ground is frozen too hard to dig. The dead are stacked at the edge of the position, frozen stiff. Somebody has used them to build up the parapet.',
      choices: [
        { text: 'Take their coats and boots. They need them less.', winter: 1, effects: { conscience: -3, warmth: 8 }, result: 'Felt boots off a frozen man. You have to cut them.' },
        { text: 'Take their identity discs, for the records.', effects: { conscience: 4, morale: -4 }, result: 'Twenty halves of twenty discs in your pocket. You will carry them a long way.' }
      ] },
    { id: 'st_rumour', chapters: [6], phases: [2], cond: pocket, scene: 'cellar',
      title: 'Rumours',
      text: 'A new rumour every night: an SS panzer corps is coming from Kharkov. The Führer will fly in personally. The Russians have run out of ammunition. Göring has promised five hundred planes a day.',
      choices: [
        { text: 'Believe it, tonight.', effects: { morale: 5 }, result: 'You fall asleep imagining the sound of German panzers.' },
        { text: 'Make the men stop talking about it.', squad: { all: { morale: -3, loyalty: 3 } }, effects: { officers: 1 }, result: 'The silence is worse. But hope, in the pocket, is also a way to die.' }
      ] }
  );

  // ───────────────────────── Endings ─────────────────────────
  SIM.ch7Ending = function (s) {
    if (s.flags.flown) return 'st_flown';
    if (s.flags.brokeOut) return 'st_breakout';
    return men(s) >= 2 ? 'st_captive_squad' : 'st_captive';
  };
  const grischa = s => {
    if (s.flags.grischaGone) return '\n\nYou never learn what happened to Grischa. You hope he found a cellar, and a family, and a new name.';
    const g = SIM.man(s, 'grischa');
    if (!g || g.status !== 'ok') return '';
    if (s.flags.grischaPapers) return '\n\nIn the column of prisoners, "Gefreiter Johann Weber of Danzig" walks beside you. When a Soviet officer asks him a question, he answers in bad German, and the officer moves on.';
    return '\n\nOn the first day of the march, Soviet NKVD men walk along the column looking at faces. They take Grischa out of the line. He looks back at you once. You hear the shots a few minutes later.';
  };
  const camp = 'Of the roughly 91,000 men taken prisoner at Stalingrad, most died within months: of typhus, starvation and cold, on the marches and in the camps at Beketovka and beyond. About 5,000 came home, the last of them in 1956.';
  Object.assign(SIM.ENDINGS, {
    st_flown: { title: 'The Last Plane', text: s => `${s.flags.flown === 'starck' ? 'Starck\'s pass got you out.' : s.flags.flown === 'forged' ? 'A dead man\'s wound tag got you out. You will carry that for the rest of your life.' : 'Your wound got you out.'} The Junkers lands at Novocherkassk; from there a hospital train to Germany.

Behind you, on 2 February 1943, the last German troops in Stalingrad surrender. Your ${unit(s)} is among them. ${SIM.squadMen(s).length ? 'You will spend years trying to find out what happened to ' + SIM.squadMen(s).map(m => m.name.split(' ')[0]).join(', ') + '.' : ''}

In Germany, the radio plays Bruckner and announces three days of national mourning. You are one of the twenty-five thousand who were flown out. People look at you as if you had come back from the dead.` },
    st_captive: { title: 'Into Captivity', text: s => `You come up out of the cellar into the light, into a city of white ruins and silence. A Soviet soldier takes your watch. The column of prisoners stretches as far as you can see, grey men in rags, walking east across the Volga ice.${grischa(s)}

${camp}

Your war is over. Your captivity has just begun.` },
    st_captive_squad: { title: 'Together', text: s => `You go up the stairs together: ${SIM.squadMen(s).map(m => m.name.split(' ')[0]).join(', ')} and you. In the column of prisoners you hold each other up. A man who falls in the snow is shot by the guards, so nobody falls. ${grischa(s)}

${camp}

Your war is over. You are still a squad. In the camps, that may be the only thing that keeps any of you alive.` },
    st_breakout: { title: 'Nineteen Nights', text: s => `You walk west at night and hide in balkas by day. You eat frozen beets, a dead horse, a cat. Twice Russian peasants hide you; once a Russian peasant betrays you, and you run. On the nineteenth night you crawl into a German outpost on the Donets, two hundred kilometres west, weighing forty-five kilograms.

A handful of men broke out of Stalingrad. You are one of them. The Gestapo questions you for a week: how, exactly, did you get out, when the army died to the last man? Then the newspapers want to photograph you, and the Propaganda Ministry decides they do not.` }
  });
})();
