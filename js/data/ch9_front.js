// Chapter IX, front track days 4–13: a company (or platoon) in the retreat from the Dnieper to the
// Cherkassy pocket. Orders from above can be obeyed, bent or refused; refuse too often and you are relieved.
window.SIM = window.SIM || {};

(function () {
  const { ss, has, men, say, course, officer, lt, score } = SIM.ch9;
  const E = [];
  const ev = o => E.push(Object.assign({ chapter: 8, track: 'front' }, o));
  const unit = s => s.platoon && s.platoon.active ? SIM.unitName(s) : (ss(s) ? 'section' : 'squad');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ── Command: a company for an officer, a platoon for a senior NCO ──
  SIM.makeCompany = s => {
    if (!s.platoon) SIM.makePlatoon(s);
    const p = s.platoon;
    p.active = true; p.company = true; p.recs = 0; p.recd = [];
    ['dorn', 'saal'].forEach(id => Object.assign(p.squads[id], { strength: 26, full: 30, morale: 60, ammo: 8 }));
    s.flags.hadPlatoon = true;
  };

  // ── Orders from above: obey, bend or refuse ──
  SIM.order9 = function (s, x, how) {
    s.orders9 = s.orders9 || { obeyed: 0, bent: 0, refused: 0 };
    s.orders9[how === 'obey' ? 'obeyed' : how === 'bend' ? 'bent' : 'refused']++;
    x.log(`${how === 'obey' ? 'Obeyed' : how === 'bend' ? 'Bent' : 'Refused'} an order: ${SIM.today(s).short}.`);
    if (how === 'refuse' && !s.flags.relieved9 && (s.orders9.refused >= 4 || (s.orders9.refused >= 3 && s.stats.officers < 50) || (s.orders9.refused >= 2 && s.stats.officers < 30))) {
      s.flags.relieved9 = true;
      if (s.platoon) s.platoon.active = false;
      x.apply({ suspicion: 12, officers: -10 });
      x.say(`The battalion commander sends for you. "That is enough," he says. "I cannot use an officer who decides for himself which orders to carry out." You are relieved of your ${s.platoon && s.platoon.company ? 'company' : 'command'} and attached to battalion staff, to wait for a court of inquiry that the war may never give time for.`);
      x.log('Relieved of command for refusing orders.');
    }
  };
  // Three choices for an order. Each of obey/bend/refuse: { text, effects, result }.
  const orders = o => ['obey', 'bend', 'refuse'].map(how => Object.assign({}, o[how], {
    outcome: (s, x) => { if (o[how].then) o[how].then(s, x); SIM.order9(s, x, how); }
  }));

  // ───────────────────────── Day 4 · 24 October: command ─────────────────────────
  ev({ id: 'c9f_4m', day: 4, phase: 0, scene: 'river', time: '09:00',
    title: 'Command',
    text: s => officer(s)
      ? `The Dnieper line south of Kiev. The battalion commander, a tired Major with a Knight's Cross, shakes your hand. "${lt(s)} ${s.char.last}. You have the 2nd Company. Your predecessor was killed on Tuesday." Three platoons, ninety men on paper, seventy in the holes.\n\n${s.flags.sameDivision9 ? 'One of your platoon leaders is Heinz Dorn, a Feldwebel now. Another is Wilhelm Saal. When they see your shoulder straps, they salute, very correctly, and then Dorn grins.' : 'Your platoon leaders: Feldwebel Heinz Dorn and Feldwebel Wilhelm Saal, both of them old hands. They salute, and look at your ribbons before they look at your face.'}`
      : `The Dnieper line south of Kiev. The "Eastern Wall" the radio talks about is a line of half-dug holes along a river a kilometre wide.${s.platoon && s.platoon.active ? ' You still have your platoon: Dorn, Saal and your own squad.' : s.rank >= 4 ? ' The company is short of everything. The Hauptmann gives you a platoon: three squads, two of them led by Feldwebel Dorn and Feldwebel Saal.' : ''}`,
    choices: [
      { text: s => officer(s) ? 'Walk the whole line, hole by hole, and meet every man.' : 'Check your men and their positions.', effects: { officers: 3 }, train: { leadership: 1 },
        outcome: (s, x) => { if (officer(s)) SIM.makeCompany(s); else if (s.rank >= 4 && !(s.platoon && s.platoon.active)) SIM.makePlatoon(s); x.squadMod('all', { loyalty: 4 }); x.say('It takes until dark. You know their names now, and they know your face. In this war, that is a great deal.'); } },
      { text: s => officer(s) ? 'Set up your command post and let the platoon leaders run their platoons.' : 'Dig. Dig deeper than they think they need.', effects: { health: 4 }, set: { dugIn: true },
        outcome: (s, x) => { if (officer(s)) SIM.makeCompany(s); else if (s.rank >= 4 && !(s.platoon && s.platoon.active)) SIM.makePlatoon(s); x.say('A dugout in the riverbank, a field telephone, a map board. Dorn and Saal run their platoons as they always have. It works, for now.'); } }
    ] });
  ev({ id: 'c9f_4a', day: 4, phase: 1, scene: 'village', time: '15:00',
    title: 'The Village Behind the Line',
    text: 'The village behind your sector has been ordered evacuated: the whole population is to be marched west. An old woman refuses to leave. She is sitting on a bench in front of her house with an icon in her lap.',
    choices: [
      { text: 'Leave her be.', effects: { conscience: 4 }, result: 'You walk on. When the village is burnt a week later, you do not ask whether the bench was empty.' },
      { text: 'Have her carried to the column.', effects: { conscience: -2, officers: 2 }, result: 'Two of your men carry her, bench and all, to a cart. She does not let go of the icon. She does not look at you.' }
    ] });

  // ───────────────────────── Day 5 · 5 November: Kiev ─────────────────────────
  ev({ id: 'c9f_5m', day: 5, phase: 0, scene: 'field', time: '05:00',
    title: 'Kiev',
    text: 'The Soviets have broken out of their bridgehead north of Kiev in the night. By morning, Kiev is lost. Your sector is attacked at dawn by infantry and T-34s coming out of the river fog.',
    choices: [
      { text: 'Hold the line and fire everything.', effects: { merit: 3, officers: 3 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.15, dmg: [12, 36], cause: 'Killed on the Dnieper line near Kiev, November 1943.', hit: 'A shell bursts on the lip of your hole.', miss: 'The first wave breaks in front of your wire. The second gets in. By noon you have thrown it out.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'on the Dnieper line'); say(x, m, m => `${m.name} is killed in the trench.`, m => `${m.name} is wounded in the trench.`); } },
      { text: 'Pull back to the second line before they reach you.', effects: { officers: -3 }, squad: { all: { loyalty: 4 } },
        outcome: (s, x) => { const m = x.casualty(0.08, 'falling back'); if (!m) x.say('You leave the first line to the Soviet artillery. When their infantry arrives, they find it empty, and you are waiting in the second.'); else say(x, m, m => `${m.name} is killed falling back.`, m => `${m.name} is wounded falling back.`); } }
    ] });
  ev({ id: 'c9f_5a', day: 5, phase: 1, scene: 'office', time: '14:00',
    title: 'To the Last Man',
    text: s => `A telephone message from regiment: "The ${unit(s)} will hold the river crossing at its present position to the last man and the last round. Withdrawal is forbidden." On your map, the Soviets are already two kilometres behind you on both sides.`,
    choices: orders({
      obey: { text: 'Hold. Those are the orders.', effects: { officers: 5, merit: 2 },
        then: (s, x) => { const m = x.casualty(0.35, 'holding the crossing'); say(x, m, m => `${m.name} is killed holding the crossing.`, m => `${m.name} is wounded holding the crossing.`); x.apply({ health: x.roll(0.2) ? -18 : 0 }); x.say('You hold until the next night. Then a runner arrives with a new order: withdraw. Half of the men who could have walked out yesterday are carried out instead.'); } },
      bend: { text: 'Hold until dark, then fall back and report that you were outflanked.', effects: { officers: -1, conscience: 2 }, train: { leadership: 1 },
        then: (s, x) => { const m = x.casualty(0.12, 'falling back at night'); say(x, m, m => `${m.name} is killed in the dark.`, m => `${m.name} is wounded in the dark.`); x.say(s.flags.testBend9 ? 'Exactly as you wrote it in Dresden. The battalion commander reads your report, looks at you, and initials it.' : 'The battalion commander reads your report and initials it without a word.'); } },
      refuse: { text: 'Withdraw now, and tell regiment why.', effects: { officers: -8, suspicion: 6, conscience: 3 }, squad: { all: { loyalty: 8 } },
        then: (s, x) => { x.say('You take your men out while there is still a way out. On the telephone, a colonel you have never met tells you that you will answer for this.'); } }
    }) });

  // ───────────────────────── Day 6 · 20 November: Zhitomir ─────────────────────────
  ev({ id: 'c9f_6m', day: 6, phase: 0, scene: 'tanks', time: '07:00',
    title: 'Zhitomir',
    text: 'A German counterattack west of Kiev: panzer divisions brought from Italy, the last reserves. For a week it goes forward. Your battalion attacks behind the tanks into the first snow.',
    choices: [
      { text: 'Go forward behind the tanks.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.16, dmg: [12, 36], cause: 'Killed in the counterattack at Zhitomir, November 1943.', hit: 'An anti-tank gun fires at the Panther beside you.', miss: 'Twelve kilometres in two days. Zhitomir is retaken. Everyone knows it will not last.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'at Zhitomir'); say(x, m, m => `${m.name} is killed at Zhitomir.`, m => `${m.name} is wounded at Zhitomir.`); } },
      { text: 'Guard the flank.', supply: { ammo: -1 }, outcome: (s, x) => { const m = x.casualty(0.08, 'on the flank'); if (!m) x.say('You watch the flank for two days. Nothing comes.'); else say(x, m, m => `${m.name} is killed on the flank.`, m => `${m.name} is wounded on the flank.`); } }
    ] });
  ev({ id: 'c9f_6a', day: 6, phase: 1, scene: 'village', time: '16:00',
    title: 'Hostages',
    text: s => `Two of your men were killed last night by partisans on the road. An order arrives from division: "For each German soldier murdered, ten men from the nearest village will be shot." The nearest village is three hundred metres away. A Feldgendarmerie officer is waiting for your ${unit(s)} to carry it out.`,
    choices: orders({
      obey: { text: 'Carry out the order.', effects: { conscience: -20, officers: 4, morale: -10 },
        then: (s, x) => { s.flags.hostages9 = true; x.squadMod('all', { morale: -12 }); x.say('Twenty men against a barn wall. Some of your soldiers are sick afterwards. One of them asks to be transferred. You will see the barn wall for the rest of your life.'); x.log('Carried out a reprisal order: twenty hostages shot.'); } },
      bend: { text: 'Report that the men of the village have fled. Search it, and find nobody.', effects: { conscience: 4, suspicion: 6 }, train: { scrounging: 1 },
        then: (s, x) => { x.say('You march your men slowly through the village, shouting, giving everyone time. By the time you reach the far end, it is empty of men. The Feldgendarm writes a report about you.'); } },
      refuse: { text: '"My men are soldiers, not executioners."', effects: { conscience: 8, officers: -6, suspicion: 10 }, squad: { all: { loyalty: 10 } },
        then: (s, x) => { x.say('The Feldgendarm stares at you. "You will regret this." He takes his own men to the village. You hear it from your position: two minutes of rifle fire. You did not stop it. You did not do it.'); } }
    }) });

  // ───────────────────────── Day 7 · 24 December: Christmas offensive ─────────────────────────
  ev({ id: 'c9f_7m', day: 7, phase: 0, scene: 'field', time: '06:00',
    title: 'Christmas Eve',
    text: 'The Soviet winter offensive opens on Christmas Eve, with a barrage that lasts two hours. The front west of Kiev collapses. Your battalion is ordered to plug a gap on the road to Berdichev.',
    choices: [
      { text: 'Fight for the road.', effects: { merit: 3, officers: 3 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.16, dmg: [12, 38], cause: 'Killed on the road to Berdichev, Christmas Eve 1943.', hit: 'Machine-gun fire across the snow.', miss: 'You hold the road until dark. Then the order comes to give it up.' },
        outcome: (s, x) => { const m = x.casualty(0.2, 'on the Berdichev road'); say(x, m, m => `${m.name} is killed on the road.`, m => `${m.name} is wounded on the road.`); } },
      { text: 'Hold the village behind it.', winter: 1, shelter: 1, supply: { ammo: -1 }, outcome: (s, x) => { const m = x.casualty(0.1, 'in the village'); if (!m) x.say('Houses, stoves, cellars. You hold the village, and the cold does not get your men tonight.'); else say(x, m, m => `${m.name} is killed in the village.`, m => `${m.name} is wounded in the village.`); } }
    ] });
  ev({ id: 'c9f_7a', day: 7, phase: 1, scene: 'office', time: '20:00',
    title: 'The Night Counterattack',
    text: s => `Battalion orders a night counterattack across two kilometres of open snow, without artillery, to retake a hill lost in the afternoon. "The Führer's order: no ground is to be given up." Your ${unit(s)} has had no sleep for two days.`,
    choices: orders({
      obey: { text: 'Attack as ordered.', effects: { officers: 5, merit: 3 },
        then: (s, x) => { SIM.markAssault(s); const m = x.casualty(0.35, 'in the night attack'); say(x, m, m => `${m.name} is killed in the snow.`, m => `${m.name} is wounded in the snow.`); if (x.roll(0.25)) { x.apply({ health: -20 }); SIM.woundBadge(s); s.deathCause = 'Killed in a night counterattack across the snow, Christmas 1943.'; } x.say('You take the hill at three in the morning and lose it again at seven.'); } },
      bend: { text: 'Send a strong patrol instead, and report the hill strongly held.', effects: { officers: -1, conscience: 2 },
        then: (s, x) => { const m = x.casualty(0.08, 'on patrol'); say(x, m, m => `${m.name} is killed on the patrol.`, m => `${m.name} is wounded on the patrol.`); x.say('The patrol comes back with three prisoners and a report that would stop anyone with sense. Battalion has sense, tonight.'); } },
      refuse: { text: 'Tell battalion the attack is impossible.', effects: { officers: -6, suspicion: 5 }, squad: { all: { loyalty: 8 } },
        then: (s, x) => { x.say('A long silence on the line. "Noted," says the Major at last, and puts the telephone down. Another company makes the attack. It does not come back.'); } }
    }) });
  ev({ id: 'c9f_7n', day: 7, phase: 2, scene: 'cellar', time: '23:00',
    title: 'Silent Night',
    text: 'Christmas night in a cellar. Somebody has found a candle and a branch of pine. Your men look at you.',
    choices: [
      { text: 'Read them the Christmas story.', effects: { morale: 8, conscience: 2 }, squad: { all: { morale: 8, loyalty: 4 } }, result: 'From a soldier\'s pocket Bible, by candlelight. Nobody interrupts. Kraus is crying, quietly.' },
      { text: 'Share out the schnapps.', show: s => SIM.has(s, 'schnapps') || SIM.has(s, 'vodka'), squad: { all: { morale: 12 } }, effects: { morale: 6, warmth: 8 },
        outcome: (s, x) => { x.item(SIM.has(s, 'schnapps') ? 'schnapps' : 'vodka', -1); x.say('One mouthful each, passed hand to hand. Someone starts to sing, and the others join in.'); } }
    ] });

  // ───────────────────────── Day 8 · 1 January 1944 ─────────────────────────
  ev({ id: 'c9f_8m', day: 8, phase: 0, scene: 'letter', time: '10:00',
    title: 'Post from Home',
    text: s => `New Year's Day, and post. ${s.char.hometown === 'hamburg' ? 'Your mother writes that the house in Hamburg burned in July, in the great raid. They are living with relatives.' : 'Your mother writes that the air raids have come to the town. The cellar holds.'} ${s.flags.married ? `Liesel sends a photograph of ${s.flags.daughter || 'the baby'}, walking.` : ''}`,
    choices: [
      { text: 'Write home at once.', effects: { morale: 6 }, rel: { mother: 4 }, result: 'Two pages. You do not write about the barn wall, or the hill, or the cold. You write about the stars over the steppe.' },
      { text: 'Read it again, and put it away.', effects: { morale: 3 }, result: 'You fold it into your paybook. You will read it eleven times before the next one comes.' }
    ] });
  ev({ id: 'c9f_8a', day: 8, phase: 1, scene: 'village', time: '14:00',
    title: 'Replacements',
    text: s => `Replacements: twenty men for your ${unit(s)}. Seventeen-year-olds from the labour service, two Luftwaffe ground crew, and a Volksdeutscher from the Banat who speaks almost no German.`,
    choices: [
      { text: 'Put each new man with an old hand.', effects: { officers: 2 }, train: { leadership: 1 },
        outcome: (s, x) => { if (s.platoon && s.platoon.active) ['dorn', 'saal'].forEach(id => { const q = s.platoon.squads[id]; q.strength = Math.min(q.full || 10, q.strength + Math.round((q.full || 10) * 0.25)); }); x.say('One boy to each veteran. The veterans grumble. The boys live longer.'); } },
      { text: 'Train them hard for three days.', effects: { officers: 3 },
        outcome: (s, x) => { if (s.platoon && s.platoon.active) ['dorn', 'saal'].forEach(id => { const q = s.platoon.squads[id]; q.strength = Math.min(q.full || 10, q.strength + Math.round((q.full || 10) * 0.2)); q.morale = clamp(q.morale + 4, 0, 100); }); x.say('Digging, grenades, digging. At the end of three days they can do two things well, which is two more than yesterday.'); } }
    ] });

  // ───────────────────────── Day 9 · 24 January: the pincers ─────────────────────────
  ev({ id: 'c9f_9m', day: 9, phase: 0, scene: 'field', time: '08:00',
    title: 'The Salient',
    text: 'Your corps is holding a salient that juts out towards the Dnieper at Korsun and Cherkassy, the last German position on the river. Today the Soviets attack its base from both sides at once. Everyone who can read a map can see what they are doing.',
    choices: [
      { text: '"Ask for permission to withdraw while we still can."', effects: { conscience: 2, officers: 1 }, result: 'Corps has asked already, you learn. Army has asked. The answer from the Führer\'s headquarters is no.' },
      { text: 'Prepare your men for encirclement: food, ammunition, felt boots.', supply: { ammo: 2, rations: 2 }, winter: 1, train: { scrounging: 1 }, set: { readyPocket9: true }, result: 'You strip the divisional depot before it is ordered destroyed. A quartermaster protests. In two weeks he will be eating your bread.' }
    ] });
  ev({ id: 'c9f_9a', day: 9, phase: 1, scene: 'tanks', time: '15:00',
    title: 'Hold the Base',
    text: 'Your battalion is sent to the southern side of the salient to hold a village against the Soviet tank spearhead.',
    choices: [
      { text: 'Hold the village.', effects: { merit: 3, officers: 3 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.17, dmg: [12, 38], cause: 'Killed holding the base of the Korsun salient, January 1944.', hit: 'A T-34 in the street.', miss: 'Two tanks burning in the street. The rest go round you, which is worse.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'in the village'); say(x, m, m => `${m.name} is killed in the village.`, m => `${m.name} is wounded in the village.`); } },
      { text: 'Withdraw into the salient before the ring closes.', effects: { officers: -2 }, outcome: (s, x) => { const m = x.casualty(0.08, 'withdrawing'); if (!m) x.say('You get your men back inside before the ring closes. Whether inside is better than outside, you will find out.'); else say(x, m, m => `${m.name} is killed on the way.`, m => `${m.name} is wounded on the way.`); } }
    ] });

  // ───────────────────────── Day 10 · 28 January: the pocket ─────────────────────────
  ev({ id: 'c9f_10m', day: 10, phase: 0, scene: 'field', time: '10:00',
    title: 'Another Pocket',
    text: s => `The ring closes at Zvenigorodka. Two corps, fifty-six thousand men${ss(s) ? ', your SS division and a brigade of Belgian volunteers among them,' : ''} are inside. The radio says: "Hold on. Help is coming. You will be supplied from the air."

${s.flags.flown || s.flags.brokeOut ? 'You were at Stalingrad. You know what those words mean.' : 'The old hands from Stalingrad say nothing at all.'}`,
    choices: [
      { text: 'Tell your men the truth: this time, the army will try to break out.', effects: { conscience: 2 }, squad: { all: { morale: 4, loyalty: 6 } }, result: 'You do not know it is true. It turns out to be.' },
      { text: '"This is not Stalingrad."', effects: { morale: 4 }, squad: { all: { morale: 6 } }, result: 'You say it every day. On some days you believe it.' }
    ] });
  ev({ id: 'c9f_10a', day: 10, phase: 1, scene: 'airfield', time: '13:00',
    title: 'Korsun Airfield',
    text: 'The airfield at Korsun: Ju 52s landing on frozen mud, taking out the wounded. A doctor asks for men to carry stretchers.',
    choices: [
      { text: 'Send your best men, and go yourself.', effects: { conscience: 5, health: -4 }, set: { carriedWounded9: true }, result: 'Four hours of stretchers. Two hundred wounded flown out. One of them is a boy from your own company, who grips your sleeve as they load him and will not let go.' },
      { text: 'Your men are needed in the line.', effects: { officers: 2 }, result: 'You go back to the line. The planes take out the wounded without you.' }
    ] });

  // ───────────────────────── Day 11 · 5 February: mud ─────────────────────────
  ev({ id: 'c9f_11m', day: 11, phase: 0, scene: 'village', time: '07:00',
    title: 'Rasputitsa',
    text: 'A thaw in February: the roads in the pocket turn to brown mud a metre deep. Trucks sink to their axles; horses drown in it. The Soviets attack the shrinking pocket from all sides.',
    choices: [
      { text: 'Counterattack to retake the lost village.', effects: { merit: 3, officers: 4 }, assault: true, supply: { ammo: -2 },
        risk: { chance: 0.17, dmg: [12, 36], cause: 'Killed in the mud of the Cherkassy pocket, February 1944.', hit: 'You cannot run in the mud, and neither can anyone else.', miss: 'Knee-deep in mud, house to house. By evening the village is yours, and it is half a kilometre less of the pocket lost.' },
        outcome: (s, x) => { const m = x.casualty(0.22, 'in the mud'); say(x, m, m => `${m.name} is killed in the mud.`, m => `${m.name} is wounded in the mud.`); } },
      { text: 'Hold where you are.', supply: { ammo: -1 }, outcome: (s, x) => { const m = x.casualty(0.1, 'in the pocket'); if (!m) x.say('You hold. The Soviets attack somewhere else today.'); else say(x, m, m => `${m.name} is killed holding the line.`, m => `${m.name} is wounded holding the line.`); } }
    ] });
  ev({ id: 'c9f_11a', day: 11, phase: 1, scene: 'office', time: '18:00',
    title: 'The Supply Drop',
    text: s => `Supply canisters fall short, into a village held by neither side. Battalion orders your ${unit(s)} to recover them tonight, whatever the cost: "Ammunition is life."`,
    choices: orders({
      obey: { text: 'Go and get them.', effects: { officers: 4, merit: 2 },
        then: (s, x) => { x.supply('ammo', 3); x.supply('rations', 2); const m = x.casualty(0.25, 'recovering canisters'); say(x, m, m => `${m.name} is killed in the dark village.`, m => `${m.name} is wounded in the dark village.`); x.say('Eight canisters, dragged through the mud by hand.'); } },
      bend: { text: 'Send a small party for what they can reach.', effects: { officers: 1 },
        then: (s, x) => { x.supply('ammo', 1); x.supply('rations', 1); x.say('Three canisters from the edge of the village. You report "recovered what was possible". It is true.'); } },
      refuse: { text: '"Not for tins of bread."', effects: { officers: -5 }, squad: { all: { loyalty: 6 } },
        then: (s, x) => { x.say('The Major is too tired to argue. "Then go hungry," he says.'); x.supply('rations', -1); } }
    }) });

  // ───────────────────────── Day 12 · 14 February: Shenderovka ─────────────────────────
  ev({ id: 'c9f_12m', day: 12, phase: 0, scene: 'village', time: '09:00',
    title: 'The Wounded',
    text: s => `The breakout will be in two nights, towards the relieving panzers at Lysianka, eight kilometres away. The order comes down: there are not enough horses and sledges. The wounded who cannot walk will be left at Shenderovka with volunteer doctors, to be taken by the Soviets.

In your ${unit(s)} there are fourteen men who cannot walk.`,
    choices: orders({
      obey: { text: 'Leave them with the doctors, as ordered.', effects: { conscience: -8, officers: 3 },
        then: (s, x) => { x.say('You go from man to man and tell them. Some argue. Most just nod. A doctor with a white armband stays behind with them. You will never learn what happened to any of them.'); } },
      bend: { text: 'Take the ones who can sit on a horse, and leave the rest.', effects: { conscience: -2 }, set: { carriedWounded9: true },
        then: (s, x) => { x.say('Six on horses, eight left behind. You choose which, yourself. Nobody else should have to.'); } },
      refuse: { text: 'Every man comes. Carry them.', effects: { conscience: 8, officers: -4, health: -6 }, set: { carriedWounded9: true, carryAll9: true }, squad: { all: { loyalty: 12 } },
        then: (s, x) => { x.say('Doors torn off houses for stretchers, four men to each. It will slow you down in the breakout. Your men know it, and they carry them anyway.'); } }
    }) });
  ev({ id: 'c9f_12a', day: 12, phase: 1, scene: 'field', time: '17:00',
    title: 'Before the Breakout',
    text: 'The order for the breakout: no vehicles, no artillery, no talking. Bayonets fixed. First wave with unloaded rifles, so that nobody fires and gives the column away. Everything that cannot be carried is to be destroyed.',
    choices: [
      { text: 'Destroy the trucks and the guns.', effects: { morale: -4 }, supply: { ammo: 2 }, result: 'Hand grenades in the engines, sand in the fuel tanks. You keep every round you can carry.' },
      { text: 'Choose your route: through the valley, away from Hill 239.', set: { valley9: true }, train: { leadership: 1 }, result: 'Everyone else is ordered towards the hill. You study the map and choose the valley of the little river, the Gniloy Tikich, instead. Fewer Soviets, maybe. Deep water, certainly.' }
    ] });

  // ───────────────────────── Day 13 · 16 February: the breakout ─────────────────────────
  ev({ id: 'c9f_13m', day: 13, phase: 0, scene: 'field', time: '23:00',
    title: 'Lysianka',
    text: s => `Eleven at night, in a snowstorm. The pocket breaks out: tens of thousands of men in long columns walking west into the dark, bayonets fixed, nobody speaking. Eight kilometres to the German panzers at Lysianka.

At dawn, the Soviet tanks find the columns in the open. Then there is the river: the Gniloy Tikich, fifteen metres of fast, freezing water with no bridge.${s.flags.carryAll9 ? '\n\nYour men are carrying fourteen wounded on doors.' : ''}`,
    choices: [
      { text: s => s.platoon && s.platoon.active ? 'Keep your men together and lead them through.' : 'Stay with your men and go through.', effects: { merit: 4 },
        outcome: (s, x) => {
          SIM.markAssault(s);
          const p = 0.68 + (s.flags.valley9 ? 0.08 : 0) + (s.flags.readyPocket9 ? 0.05 : 0) - (s.flags.carryAll9 ? 0.1 : 0) + SIM.skill(s, 'leadership') * 0.03;
          const m = x.casualty(0.3, 'in the breakout'); say(x, m, m => `${m.name} is killed in the breakout.`, m => `${m.name} is wounded and carried across the river.`);
          if (x.roll(0.07)) { x.apply({ health: -300 }); s.deathCause = 'Killed in the breakout from the Cherkassy pocket, 17 February 1944.'; return; }
          if (x.roll(p)) { s.flags.out9 = 'through'; x.say('Through the snow, past the burning columns, down to the river. You swim it holding on to a horse\'s tail. On the far bank, a German tank crew pulls you out of the water.'); }
          else { s.flags.out9 = 'captured'; x.say('The tanks come out of the snow and cut the column in two. You end up in a gully with forty men and no ammunition. At noon, a Soviet officer calls on you to come out.'); }
        } },
      { text: 'Carry the wounded across the river, whatever it costs.', show: s => !!s.flags.carriedWounded9, effects: { conscience: 8 },
        outcome: (s, x) => {
          if (x.roll(0.1)) { x.apply({ health: -300 }); s.deathCause = 'Drowned in the Gniloy Tikich carrying the wounded out of the Cherkassy pocket, February 1944.'; return; }
          if (x.roll(0.62)) { s.flags.out9 = 'through'; s.flags.carriedWounded9 = true; x.say('A chain of men in the icy water, passing the wounded from hand to hand. You get nine of them across. You will never be warm again in your life, you think, and then a tank crew gives you a blanket and you are.'); }
          else { s.flags.out9 = 'captured'; x.say('You stay on the eastern bank with the wounded who cannot be carried across. When the Soviets come, you stand up with your hands raised, among them.'); }
        } },
      { text: 'Wait in the gully for the tanks to pass, and go at night.', effects: { conscience: -1 },
        outcome: (s, x) => {
          if (x.roll(0.05)) { x.apply({ health: -300 }); s.deathCause = 'Killed by Soviet tanks in a gully near Lysianka, February 1944.'; return; }
          if (x.roll(0.45)) { s.flags.out9 = 'through'; x.say('You lie in the gully all day in the snow. At night you creep west, and at dawn you reach the German line, frozen, alone with four of your men.'); }
          else { s.flags.out9 = 'captured'; x.say('In the afternoon Soviet infantry search the gullies. They find you.'); }
        } }
    ] });

  SIM.EVENTS.push(...E);

  // The big battles can be fought with orders to the platoons or the company.
  const W = SIM.withUnitOrders;
  if (W) {
    W('c9f_5m', 'on the Dnieper line', 'Killed on the Dnieper line near Kiev, November 1943.', 0.16,
      (a, b) => `The first Soviet wave breaks on ${a}${b ? `, with ${b} firing into its flank` : ''}. By noon the line holds.`,
      a => `${a[0].toUpperCase() + a.slice(1)} is overrun in the fog and falls back to the second line, carrying its wounded.`);
    W('c9f_6m', 'at Zhitomir', 'Killed leading your men at Zhitomir, November 1943.', 0.16,
      (a, b) => `${a[0].toUpperCase() + a.slice(1)} goes in behind the Panthers${b ? `, ${b} covering the flank` : ''}. Twelve kilometres in two days.`,
      a => `${a[0].toUpperCase() + a.slice(1)} is stopped at a gun line in a wood and digs in under fire.`);
    W('c9f_9a', 'at the base of the salient', 'Killed holding the base of the Korsun salient, January 1944.', 0.18,
      (a, b) => `${a[0].toUpperCase() + a.slice(1)} holds the village${b ? ` while ${b} burns two tanks in the street` : ''}. The Soviets go round it.`,
      a => `${a[0].toUpperCase() + a.slice(1)} is driven out of the village by tanks.`);
    W('c9f_11m', 'in the mud of the pocket', 'Killed in the mud of the Cherkassy pocket, February 1944.', 0.18,
      (a, b) => `Knee-deep in mud, ${a} retakes the village house by house${b ? `, ${b} covering the open ground` : ''}.`,
      a => `${a[0].toUpperCase() + a.slice(1)} cannot get through the mud under fire and falls back.`);
  }
})();
